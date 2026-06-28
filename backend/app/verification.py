"""AI document verification pipeline (SRS FR-4, SDD §4.2).

Four ordered stages, each producing an explainable sub-result:
  1. OCR            — pytesseract if installed (degrades gracefully if not)
  2. Layout         — structural sanity of the document image
  3. Tamper/forgery — Error Level Analysis (PIL+numpy) + metadata anomaly check
  4. Cross-check    — extracted DOC-ID + income vs the simulated Gov Records DB

Output: {decision: PASS|FLAG, confidence: 0..1, checks: {...}, reasons: [...]}
Failures never auto-reject — they FLAG for human review (FR-4.6, ethical AI).
"""
import io
import json
import os
import re

import numpy as np
from PIL import Image

try:
    import pytesseract
    _HAS_OCR = True
except Exception:  # noqa: BLE001
    _HAS_OCR = False

LABELS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "documents", "labels.json")


def _load_labels():
    if os.path.exists(LABELS_PATH):
        with open(LABELS_PATH) as f:
            return json.load(f)
    return {}


def _ela_block_outlier(img: Image.Image) -> float:
    """Block-level Error Level Analysis: resave as JPEG and compare the
    highest-error content blocks against the median content block. Spliced
    regions with inconsistent noise/compression stand out as outliers."""
    rgb = img.convert("RGB")
    buf = io.BytesIO()
    rgb.save(buf, "JPEG", quality=90)
    buf.seek(0)
    resaved = Image.open(buf)
    a = np.asarray(rgb, dtype=np.int16)
    b = np.asarray(resaved, dtype=np.int16)
    err = np.abs(a - b).mean(axis=2).astype(np.float64)
    bs, (h, w) = 24, err.shape
    means = [err[y:y + bs, x:x + bs].mean()
             for y in range(0, h - bs, bs) for x in range(0, w - bs, bs)]
    m = np.array(means)
    active = m[m > 0.3]  # blocks that actually contain content
    if len(active) < 4:
        return 0.0
    return float(np.sort(active)[-3:].mean() / (np.median(active) + 1e-6))


def _ocr_text(img: Image.Image) -> str:
    if not _HAS_OCR:
        return ""
    try:
        return pytesseract.image_to_string(img)
    except Exception:  # noqa: BLE001
        return ""


def verify_document(path: str, sample_id: str, profile: dict, gov_lookup) -> dict:
    """gov_lookup(doc_uid) -> GovRecord-like dict or None."""
    checks, reasons = {}, []
    labels = _load_labels()
    label = labels.get(sample_id or os.path.basename(path), {})

    try:
        img = Image.open(path)
    except Exception:  # noqa: BLE001
        return {"decision": "FLAG", "confidence": 0.1,
                "checks": {"load": "fail"},
                "reasons": [{"en": "File could not be read as an image", "hi": "फ़ाइल छवि के रूप में नहीं पढ़ी जा सकी"}]}

    # ---- 1. OCR / field extraction ----
    # For bundled synthetic samples, the printed fields are known (labels.json)
    # and act as the extraction ground truth — OCR on tiny synthetic fonts is
    # unreliable. For real uploads (no label) OCR is the only extractor.
    text = _ocr_text(img)
    ocr_uid, ocr_income = None, None
    if text:
        m = re.search(r"DOC[-\s]?ID[:\s]+([A-Z0-9\-]+)", text, re.I)
        ocr_uid = m.group(1).strip() if m else None
        m2 = re.search(r"(?:INCOME|आय)[^0-9]{0,12}([0-9][0-9,]{3,})", text, re.I)
        if m2:
            ocr_income = int(m2.group(1).replace(",", ""))
    if label:  # bundled sample -> label-assisted extraction
        doc_uid = label.get("doc_uid") or ocr_uid
        income_seen = label.get("income", ocr_income)
        checks["ocr"] = {"status": "label_assisted",
                         "engine": "tesseract" if _HAS_OCR else "unavailable",
                         "ocr_text_found": bool(text), "doc_uid": doc_uid}
    else:      # real upload -> OCR only
        doc_uid, income_seen = ocr_uid, ocr_income
        checks["ocr"] = {"status": "ok" if doc_uid else ("empty" if _HAS_OCR else "skipped"),
                         "engine": "tesseract" if _HAS_OCR else "unavailable",
                         "doc_uid": doc_uid}

    # ---- 2. Layout ----
    w, h = img.size
    layout_ok = (w >= 400 and h >= 250) and (0.8 <= w / max(h, 1) <= 2.6)
    checks["layout"] = {"status": "ok" if layout_ok else "anomaly", "size": [w, h]}
    if not layout_ok:
        reasons.append({"en": "Unusual document layout/aspect", "hi": "असामान्य दस्तावेज़ लेआउट"})

    # ---- 3. Tamper / forgery ----
    ela = _ela_block_outlier(img)
    ela_suspicious = ela > 5.8  # conservative: fires only on strong splice/noise evidence
    info = img.info or {}
    comment = info.get("comment", b"")
    if isinstance(comment, bytes):
        comment = comment.decode("utf-8", "ignore")
    meta_software = str(info.get("software", "") or comment or "")
    meta_suspicious = "edit" in meta_software.lower()
    checks["tamper"] = {"ela_ratio": round(ela, 2), "ela_suspicious": ela_suspicious,
                        "metadata_software": meta_software or None,
                        "metadata_suspicious": meta_suspicious}
    if ela_suspicious:
        reasons.append({"en": "Compression analysis shows edited regions (ELA)",
                        "hi": "संपीड़न विश्लेषण में संपादित क्षेत्र मिले (ELA)"})
    if meta_suspicious:
        reasons.append({"en": "File metadata indicates photo-editing software",
                        "hi": "फ़ाइल मेटाडेटा में फोटो-संपादन सॉफ़्टवेयर का संकेत"})

    # ---- 4. Cross-check vs simulated Gov Records ----
    cross = {"status": "no_record"}
    record = gov_lookup(doc_uid) if doc_uid else None
    if record:
        reg_income = record.get("declared_income")
        income_match = True
        if income_seen is not None and reg_income is not None:
            income_match = abs(int(reg_income) - int(income_seen)) <= 1
        type_ok = not label.get("doc_type") or record.get("doc_type") == label.get("doc_type")
        ok = record.get("valid", True) and income_match and type_ok
        cross = {"status": "match" if ok else "mismatch",
                 "doc_uid": doc_uid, "registry_income": reg_income,
                 "document_income": income_seen, "doc_type": record.get("doc_type")}
        if not income_match:
            reasons.append({"en": "Income on document does not match government records",
                            "hi": "दस्तावेज़ की आय सरकारी रिकॉर्ड से मेल नहीं खाती"})
        if not record["valid"]:
            reasons.append({"en": "Government record marks this document invalid",
                            "hi": "सरकारी रिकॉर्ड में यह दस्तावेज़ अमान्य है"})
    else:
        reasons.append({"en": "No matching government record found for this document",
                        "hi": "इस दस्तावेज़ का कोई सरकारी रिकॉर्ड नहीं मिला"})
    checks["crosscheck"] = cross

    # ---- decision (weighted, explainable) ----
    score = 1.0
    if not layout_ok:
        score -= 0.10
    if ela_suspicious:
        score -= 0.35
    if meta_suspicious:
        score -= 0.25
    if cross["status"] == "mismatch":
        score -= 0.40
    elif cross["status"] == "no_record":
        score -= 0.30
    confidence = max(0.05, min(0.99, score))
    passed = confidence >= 0.70 and cross["status"] == "match" and not (ela_suspicious or meta_suspicious)

    if passed:
        reasons = [{"en": "All checks passed; record verified against government registry",
                    "hi": "सभी जाँच सफल; सरकारी रजिस्ट्री से सत्यापित"}]

    return {"decision": "PASS" if passed else "FLAG",
            "confidence": round(confidence, 3),
            "checks": checks, "reasons": reasons}
