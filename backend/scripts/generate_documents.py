"""Generate synthetic multi-type document set (SRS FR-9.2).
Types: aadhaar, income, caste, residence, disability, ration (+ valid & tampered).
Outputs: data/documents/*.jpg + labels.json + gov_records.json
ALL DATA IS FICTITIOUS — simulation only.

Run from backend/:  python scripts/generate_documents.py
"""
import io
import json
import os
import random

import numpy as np
from PIL import Image, ImageDraw

random.seed(42)
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, "..", "..", "data", "documents"))
os.makedirs(OUT, exist_ok=True)

NAMES = ["Sunita Devi", "Ramesh Kumar", "Geeta Verma", "Mohd. Salim", "Kamla Devi",
         "Suresh Yadav", "Anita Singh", "Raju Prasad", "Shanti Devi", "Dinesh Pal",
         "Phoolmati", "Vikram Nishad", "Meera Bano", "Hari Om", "Savitri Devi", "Iqbal Ahmed"]
DISTRICTS = ["Lucknow", "Varanasi", "Kanpur", "Ghaziabad", "Ayodhya", "Prayagraj", "Gorakhpur", "Bahraich"]
W, H = 900, 560
INK, GOLD, PAPER = (27, 36, 64), (232, 160, 25), (246, 243, 235)


def _header(d, title_en, title_hi):
    d.rectangle([10, 10, W - 10, H - 10], outline=INK, width=4)
    d.rectangle([10, 10, W - 10, 92], fill=INK)
    d.text((30, 26), "GOVERNMENT OF UTTAR PRADESH (SIMULATED)", fill=GOLD)
    d.text((30, 52), f"{title_en}  |  {title_hi}  —  SPECIMEN / NOT REAL", fill=(255, 255, 255))


def _seal(d):
    d.ellipse([W - 220, H - 160, W - 90, H - 60], outline=(192, 57, 43), width=3)
    d.text((W - 198, H - 120), "SPECIMEN", fill=(192, 57, 43))


def _rows(d, rows, y0=130):
    y = y0
    for k, v in rows:
        d.text((40, y), k, fill=INK)
        d.text((330, y), str(v), fill=INK)
        y += 52 if len(rows) > 4 else 58
    d.line([40, H - 90, 280, H - 90], fill=INK, width=2)
    d.text((40, H - 80), "Issuing authority (simulated)", fill=(90, 98, 128))
    _seal(d)


def render_aadhaar(name, district, uid):
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    _header(d, "AADHAAR ID", "आधार पहचान")
    _rows(d, [
        ("DOC-ID:", uid), ("Name / नाम:", name), ("District:", district),
        ("DOB:", "01/01/1960"), ("Gender:", "Female"), ("Aadhaar (mock):", "XXXX-XXXX-1234"),
    ])
    return img


def render_income(name, district, income, uid):
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    _header(d, "INCOME CERTIFICATE", "आय प्रमाण पत्र")
    _rows(d, [
        ("DOC-ID:", uid), ("Name / नाम:", name), ("District / ज़िला:", district),
        ("Annual INCOME / वार्षिक आय:", f"Rs. {income:,}"),
    ])
    return img


def render_caste(name, district, category, uid):
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    _header(d, "CASTE CERTIFICATE", "जाति प्रमाण पत्र")
    _rows(d, [
        ("DOC-ID:", uid), ("Name:", name), ("District:", district),
        ("Category:", category), ("Sub-caste:", "Simulated"),
    ])
    return img


def render_residence(name, district, uid):
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    _header(d, "RESIDENCE CERTIFICATE", "निवास प्रमाण")
    _rows(d, [
        ("DOC-ID:", uid), ("Name:", name), ("District:", district),
        ("Address:", f"Village/Ward, {district}, UP"), ("Since:", "2010"),
    ])
    return img


def render_disability(name, district, pct, uid):
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    _header(d, "DISABILITY CERTIFICATE", "दिव्यांग प्रमाण")
    _rows(d, [
        ("DOC-ID:", uid), ("Name:", name), ("District:", district),
        ("Disability %:", f"{pct}%"), ("Type:", "Locomotor (simulated)"),
        ("UDID (mock):", "UP-DIS-XXXX"),
    ], y0=120)
    return img


def render_ration(name, district, category, uid):
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    _header(d, "RATION CARD (NFSA)", "राशन कार्ड")
    _rows(d, [
        ("DOC-ID:", uid), ("Head:", name), ("District:", district),
        ("Category:", category), ("Members:", "4"), ("FPS ID:", "UP-FPS-999"),
    ])
    return img


def tamper_patch(img, text, y=240):
    patch = Image.new("RGB", (370, 50), (250, 247, 240))
    pd = ImageDraw.Draw(patch)
    pd.text((4, 12), text, fill=(20, 28, 52))
    buf = io.BytesIO()
    patch.save(buf, "JPEG", quality=50)
    buf.seek(0)
    arr = np.asarray(Image.open(buf), dtype=np.float64)
    arr += np.random.default_rng(hash(text) % 9999).normal(0, 5, arr.shape)
    img.paste(Image.fromarray(np.clip(arr, 0, 255).astype("uint8")), (330, y))
    return img


RENDERERS = {
    "aadhaar": lambda n, dist, uid, extra: render_aadhaar(n, dist, uid),
    "income": lambda n, dist, uid, extra: render_income(n, dist, extra["income"], uid),
    "caste": lambda n, dist, uid, extra: render_caste(n, dist, extra.get("category", "OBC"), uid),
    "residence": lambda n, dist, uid, extra: render_residence(n, dist, uid),
    "disability": lambda n, dist, uid, extra: render_disability(n, dist, extra.get("pct", 60), uid),
    "ration": lambda n, dist, uid, extra: render_ration(n, dist, extra.get("category", "BPL"), uid),
}

TITLES = {
    "aadhaar": ("Aadhaar (simulated)", "आधार (नकली नमूना)"),
    "income": ("Income certificate", "आय प्रमाण पत्र"),
    "caste": ("Caste certificate", "जाति प्रमाण पत्र"),
    "residence": ("Residence proof", "निवास प्रमाण"),
    "disability": ("Disability certificate", "दिव्यांग प्रमाण"),
    "ration": ("Ration card", "राशन कार्ड"),
}

PLAN = [
    ("income", 12, 6),
    ("aadhaar", 4, 2),
    ("caste", 3, 2),
    ("residence", 3, 2),
    ("disability", 3, 2),
    ("ration", 3, 2),
]


def main():
    labels, gov = {}, {}
    seq = 1000

    for doc_type, n_valid, n_tampered in PLAN:
        prefix = {"aadhaar": "AAD", "income": "INC", "caste": "CST",
                  "residence": "RES", "disability": "DIS", "ration": "RAT"}[doc_type]

        for i in range(n_valid):
            seq += 1
            name = NAMES[(seq + i) % len(NAMES)]
            district = random.choice(DISTRICTS)
            uid = f"UP-{prefix}-{seq}"
            extra = {"income": random.choice([48000, 60000, 90000]),
                     "category": random.choice(["SC", "OBC", "General"]),
                     "pct": random.choice([40, 60, 80])}
            fname = f"{doc_type}_valid_{i + 1:02d}.jpg"
            img = RENDERERS[doc_type](name, district, uid, extra)
            img.save(os.path.join(OUT, fname), "JPEG", quality=92)
            te, th = TITLES[doc_type]
            labels[fname] = {
                "tampered": False, "doc_uid": uid, "doc_type": doc_type,
                "title": f"{te} — {name}", "title_hi": f"{th} — {name}",
                "hint": "valid · certified sample", "income": extra.get("income"),
            }
            rec = {"holder_name": name, "doc_type": doc_type, "valid": True}
            if doc_type == "income":
                rec["declared_income"] = extra["income"]
            gov[uid] = rec

        for i in range(n_tampered):
            seq += 1
            name = NAMES[(seq + 3) % len(NAMES)]
            district = random.choice(DISTRICTS)
            uid = f"UP-{prefix}-{seq}"
            true_income = 180000
            fake_income = 55000
            extra = {"income": true_income, "category": "BPL", "pct": 40}
            fname = f"{doc_type}_tampered_{i + 1:02d}.jpg"
            img = RENDERERS[doc_type](name, district, uid, extra)
            if doc_type == "income":
                img = tamper_patch(img, f"Rs. {fake_income:,}", 240)
            elif doc_type == "disability":
                img = tamper_patch(img, "85%", 240)
            elif doc_type == "ration":
                img = tamper_patch(img, "APL", 240)
            else:
                img = tamper_patch(img, "EDITED", 240)
            img.save(os.path.join(OUT, fname), "JPEG", quality=92,
                     comment=b"software=PhotoEditPro 3.1 (edited)")
            te, th = TITLES[doc_type]
            labels[fname] = {
                "tampered": True, "doc_uid": uid, "doc_type": doc_type,
                "title": f"{te} — {name} (edited)", "title_hi": f"{th} — {name} (बदला हुआ)",
                "hint": "tampered · AI should flag", "income": fake_income if doc_type == "income" else None,
                "meta_software": "PhotoEditPro 3.1 (edited)",
            }
            rec = {"holder_name": name, "doc_type": doc_type, "valid": True}
            if doc_type == "income":
                rec["declared_income"] = true_income
            gov[uid] = rec

    with open(os.path.join(OUT, "labels.json"), "w") as f:
        json.dump(labels, f, indent=2, ensure_ascii=False)
    with open(os.path.join(OUT, "gov_records.json"), "w") as f:
        json.dump(gov, f, indent=2, ensure_ascii=False)
    print(f"Generated {len(labels)} documents ({sum(1 for v in labels.values() if v['tampered'])} tampered) in {OUT}")


if __name__ == "__main__":
    main()
