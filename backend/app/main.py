"""WelfareChain backend — FastAPI BFF (SDD §6).
Run:  uvicorn app.main:app --reload --port 8000
"""
import json
import os
import shutil

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from .blockchain import bridge
from .chatbot import chat as chat_llm
from .db import (Alert, Application, Document, GovRecord, LedgerEvent,
                 SessionLocal, SmsLog, User, Verification, Wallet, init_db)
from .schemes import SCHEMES, SCHEME_BY_KEY, evaluate
from .verification import verify_document

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(BASE, "..", "data", "documents")
UPLOAD_DIR = os.path.join(BASE, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="WelfareChain API", version="1.0",
              description="Simulation prototype — synthetic data only, UP scope.")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

if os.path.isdir(DOCS_DIR):
    app.mount("/samples", StaticFiles(directory=DOCS_DIR), name="samples")

init_db()


# ---------------- helpers ----------------
def _ledger(db, app_id, events):
    for action, meta, txh, blk, onchain in events:
        db.add(LedgerEvent(app_id=app_id or "", action=action, meta_json=json.dumps(meta),
                           tx_hash=txh, block_number=blk, onchain=onchain))


def _profile(u: User) -> dict:
    return {"name": u.name, "age": u.age, "gender": u.gender,
            "annual_income": u.annual_income, "occupation": u.occupation,
            "district": u.district, "area": u.area, "is_widow": u.is_widow,
            "is_disabled": u.is_disabled, "has_girl_child": u.has_girl_child,
            "house_type": u.house_type}


def _sms(db, user_id, text):
    db.add(SmsLog(user_id=user_id, text=text))


# ---------------- models ----------------
class UserIn(BaseModel):
    name: str = ""
    aadhaar_mock: str = ""
    age: int = 0
    gender: str = "female"
    annual_income: int = 0
    occupation: str = "other"
    district: str = "Lucknow"
    area: str = "rural"
    is_widow: bool = False
    is_disabled: bool = False
    has_girl_child: bool = False
    house_type: str = "pucca"
    assisted: bool = False


class ChatIn(BaseModel):
    user_id: str
    message: str
    locale: str = "hi"


class ApplyIn(BaseModel):
    user_id: str
    scheme_key: str


class ReviewIn(BaseModel):
    approve: bool
    reason: str = ""


# ---------------- meta ----------------
@app.get("/api/health")
def health():
    return {"ok": True, "chain": "live" if bridge.live else "simulated",
            "note": "Simulation prototype — synthetic data only."}


@app.get("/api/schemes")
def get_schemes():
    return SCHEMES


@app.get("/api/documents/samples")
def samples():
    labels_path = os.path.join(DOCS_DIR, "labels.json")
    if not os.path.exists(labels_path):
        return []
    with open(labels_path) as f:
        labels = json.load(f)
    out = []
    for fname, lab in labels.items():
        out.append({"sample_id": fname, "url": f"/samples/{fname}",
                    "title": lab.get("title", fname),
                    "title_hi": lab.get("title_hi", fname),
                    "doc_type": lab.get("doc_type", "income"),
                    "tampered": bool(lab.get("tampered", False)),
                    "hint": lab.get("hint", "")})
    return sorted(out, key=lambda x: (x["doc_type"], x["tampered"], x["sample_id"]))


# ---------------- citizen ----------------
@app.post("/api/users")
def create_user(body: UserIn):
    db = SessionLocal()
    try:
        u = User(**body.model_dump())
        db.add(u)
        db.flush()
        wallet_addr, commitment, events = bridge.register_user(u.id, u.aadhaar_mock or u.id)
        u.id_commitment = commitment
        db.add(Wallet(user_id=u.id, address=wallet_addr, fiat_balance=0))
        _ledger(db, "", events)
        db.commit()
        return {"user_id": u.id, "wallet": wallet_addr,
                "eligibility": evaluate(_profile(u))}
    finally:
        db.close()


@app.get("/api/users/{user_id}")
def get_user(user_id: str):
    db = SessionLocal()
    try:
        u = db.get(User, user_id)
        if not u:
            raise HTTPException(404, "user not found")
        w = db.get(Wallet, user_id)
        sms = [s.text for s in db.query(SmsLog).filter_by(user_id=user_id)
               .order_by(SmsLog.created_at.desc()).limit(5)]
        return {"user_id": u.id, "profile": _profile(u),
                "wallet": {"address": w.address, "fiat_balance": w.fiat_balance},
                "eligibility": evaluate(_profile(u)), "sms": sms}
    finally:
        db.close()


@app.post("/api/chat")
def chat(body: ChatIn):
    db = SessionLocal()
    try:
        u = db.get(User, body.user_id)
        profile = _profile(u) if u else {}
        return chat_llm(profile, body.message, body.locale)
    finally:
        db.close()


@app.post("/api/applications")
def create_application(body: ApplyIn):
    db = SessionLocal()
    try:
        u = db.get(User, body.user_id)
        s = SCHEME_BY_KEY.get(body.scheme_key)
        if not u or not s:
            raise HTTPException(404, "user or scheme not found")
        a = Application(user_id=u.id, scheme_key=s["key"], amount=s["amount"],
                        district=u.district, status="Draft")
        db.add(a)
        db.commit()
        return {"app_id": a.id, "status": a.status, "amount": a.amount}
    finally:
        db.close()


@app.post("/api/applications/{app_id}/documents")
async def upload_document(app_id: str, doc_type: str = Form("income"),
                          sample_id: str = Form(""), file: UploadFile = File(None)):
    db = SessionLocal()
    try:
        a = db.get(Application, app_id)
        if not a:
            raise HTTPException(404, "application not found")
        if sample_id:  # bundled synthetic sample
            src = os.path.join(DOCS_DIR, sample_id)
            if not os.path.exists(src):
                raise HTTPException(404, "sample not found")
            path = src
            fname = sample_id
        elif file is not None:
            fname = f"{app_id}_{file.filename}"
            path = os.path.join(UPLOAD_DIR, fname)
            with open(path, "wb") as f:
                shutil.copyfileobj(file.file, f)
        else:
            raise HTTPException(400, "provide a file or a sample_id")
        d = Document(app_id=app_id, doc_type=doc_type, filename=fname,
                     path=path, sample_id=sample_id)
        db.add(d)
        db.commit()
        return {"doc_id": d.id, "filename": fname}
    finally:
        db.close()


@app.post("/api/applications/{app_id}/verify")
def verify(app_id: str):
    db = SessionLocal()
    try:
        a = db.get(Application, app_id)
        if not a:
            raise HTTPException(404, "application not found")
        doc = (db.query(Document).filter_by(app_id=app_id)
               .order_by(Document.created_at.desc()).first())
        if not doc:
            raise HTTPException(400, "no document uploaded")
        u = db.get(User, a.user_id)
        w = db.get(Wallet, a.user_id)

        def gov_lookup(doc_uid):
            if not doc_uid:
                return None
            r = db.get(GovRecord, doc_uid)
            return None if not r else {"declared_income": r.declared_income, "valid": r.valid}

        a.status = "Verifying"
        result = verify_document(doc.path, doc.sample_id, _profile(u), gov_lookup)
        passed = result["decision"] == "PASS"
        a.confidence = result["confidence"]

        db.add(Verification(app_id=app_id, decision=result["decision"],
                            confidence=result["confidence"],
                            checks_json=json.dumps(result["checks"]),
                            reasons_json=json.dumps(result["reasons"])))

        reason = "; ".join(r["en"] for r in result["reasons"])[:120]
        _ledger(db, app_id, bridge.record_verification(
            app_id, w.address, a.scheme_key, result["confidence"], passed, reason))

        if passed:
            _ledger(db, app_id, bridge.approve_and_disburse(app_id, a.scheme_key, a.amount))
            a.status = "Disbursed"
            w.fiat_balance += a.amount
            _sms(db, u.id, f"WelfareChain: ₹{a.amount:,} credited for "
                           f"{SCHEME_BY_KEY[a.scheme_key]['name']['en']}. (simulation)")
        else:
            a.status = "Flagged"
            db.add(Alert(app_id=app_id, district=a.district, scheme_key=a.scheme_key,
                         reason=reason or "verification anomaly"))
        db.commit()
        return {"app_id": app_id, "status": a.status, "result": result,
                "wallet_balance": w.fiat_balance}
    finally:
        db.close()


@app.get("/api/applications/{app_id}")
def get_application(app_id: str):
    db = SessionLocal()
    try:
        a = db.get(Application, app_id)
        if not a:
            raise HTTPException(404, "application not found")
        v = (db.query(Verification).filter_by(app_id=app_id)
             .order_by(Verification.created_at.desc()).first())
        trail = [{"action": e.action, "meta": json.loads(e.meta_json),
                  "tx_hash": e.tx_hash, "block": e.block_number, "onchain": e.onchain,
                  "ts": e.created_at.isoformat()}
                 for e in db.query(LedgerEvent).filter_by(app_id=app_id)
                 .order_by(LedgerEvent.created_at)]
        return {"app_id": a.id, "scheme_key": a.scheme_key, "status": a.status,
                "amount": a.amount, "confidence": a.confidence,
                "verification": None if not v else {
                    "decision": v.decision, "confidence": v.confidence,
                    "checks": json.loads(v.checks_json),
                    "reasons": json.loads(v.reasons_json)},
                "audit_trail": trail}
    finally:
        db.close()


# ---------------- admin ----------------
@app.get("/api/admin/metrics")
def admin_metrics():
    db = SessionLocal()
    try:
        apps = db.query(Application).all()
        disb = [a for a in apps if a.status == "Disbursed"]
        by_district, by_scheme = {}, {}
        for a in disb:
            by_district[a.district] = by_district.get(a.district, 0) + a.amount
            by_scheme[a.scheme_key] = by_scheme.get(a.scheme_key, 0) + a.amount
        alerts = db.query(Alert).filter_by(resolved=False).order_by(Alert.created_at.desc()).all()
        return {
            "total_disbursed": sum(a.amount for a in disb),
            "applications": len(apps),
            "disbursed_count": len(disb),
            "approval_rate": round(len(disb) / len(apps) * 100) if apps else 0,
            "fraud_flags": len(alerts),
            "by_district": sorted(by_district.items(), key=lambda x: -x[1]),
            "by_scheme": sorted(by_scheme.items(), key=lambda x: -x[1]),
            "chain_mode": "live" if bridge.live else "simulated",
            "alerts": [{"id": al.id, "app_id": al.app_id, "district": al.district,
                        "scheme_key": al.scheme_key, "reason": al.reason,
                        "ts": al.created_at.isoformat()} for al in alerts],
        }
    finally:
        db.close()


@app.get("/api/admin/ledger")
def admin_ledger(limit: int = 40):
    db = SessionLocal()
    try:
        rows = (db.query(LedgerEvent).order_by(LedgerEvent.created_at.desc())
                .limit(limit).all())
        return [{"action": e.action, "meta": json.loads(e.meta_json),
                 "tx_hash": e.tx_hash, "block": e.block_number,
                 "onchain": e.onchain, "ts": e.created_at.isoformat()} for e in rows]
    finally:
        db.close()


@app.post("/api/admin/review/{app_id}")
def review(app_id: str, body: ReviewIn):
    """Human-review resolution for flagged applications (FR-4.6)."""
    db = SessionLocal()
    try:
        a = db.get(Application, app_id)
        if not a or a.status != "Flagged":
            raise HTTPException(400, "application not in review")
        u = db.get(User, a.user_id)
        w = db.get(Wallet, a.user_id)
        _ledger(db, app_id, bridge.resolve_review(app_id, body.approve, body.reason))
        if body.approve:
            _ledger(db, app_id, bridge.approve_and_disburse(app_id, a.scheme_key, a.amount))
            a.status = "Disbursed"
            w.fiat_balance += a.amount
            _sms(db, u.id, f"WelfareChain: after review, ₹{a.amount:,} credited. (simulation)")
        else:
            a.status = "Rejected"
            _sms(db, u.id, "WelfareChain: your application was not approved after review. (simulation)")
        for al in db.query(Alert).filter_by(app_id=app_id):
            al.resolved = True
        db.commit()
        return {"app_id": app_id, "status": a.status}
    finally:
        db.close()
