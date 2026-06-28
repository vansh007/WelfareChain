"""Seed the WelfareChain database.
1) Loads the simulated Government Records (from data/documents/gov_records.json)
   used by Tier-2 cross-verification.
2) Adds a few demo users/disbursements so the admin dashboard has life on first run.
Run from backend/:  python seed.py
"""
import json
import os
import secrets
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db import (Alert, Application, GovRecord, LedgerEvent, SessionLocal,
                    User, Wallet, init_db)

GOV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "documents", "gov_records.json")

DEMO = [
    ("Sunita Devi", "Lucknow", "oap", 12000, 0.97),
    ("Ramesh Kumar", "Bahraich", "kis", 6000, 0.95),
    ("Geeta Verma", "Varanasi", "nfsa", 6000, 0.96),
    ("Kamla Devi", "Gorakhpur", "wid", 6000, 0.98),
    ("Suresh Yadav", "Kanpur", "nfsa", 6000, 0.94),
]


def main():
    init_db()
    db = SessionLocal()
    try:
        # ---- gov records ----
        if os.path.exists(GOV_PATH):
            with open(GOV_PATH) as f:
                gov = json.load(f)
            added = 0
            for uidx, rec in gov.items():
                if not db.get(GovRecord, uidx):
                    db.add(GovRecord(doc_uid=uidx, holder_name=rec["holder_name"],
                                     doc_type=rec["doc_type"],
                                     declared_income=rec.get("declared_income") or 0,
                                     valid=rec["valid"]))
                    added += 1
            print(f"Gov records: {added} added ({len(gov)} total in file)")
        else:
            print("WARN: gov_records.json missing — run scripts/generate_documents.py first")

        # ---- demo data (only once) ----
        if db.query(Application).count() == 0:
            for name, district, scheme, amount, conf in DEMO:
                u = User(name=name, district=district, age=62, annual_income=60000)
                db.add(u)
                db.flush()
                db.add(Wallet(user_id=u.id, address="0x" + secrets.token_hex(20),
                              fiat_balance=amount))
                a = Application(user_id=u.id, scheme_key=scheme, amount=amount,
                                district=district, status="Disbursed", confidence=conf)
                db.add(a)
                db.flush()
                for action, meta in [
                    ("ApplicationRecorded", {"scheme": scheme, "conf": f"{conf*100:.1f}%"}),
                    ("ApplicationApproved", {"amount": f"₹{amount:,}"}),
                    ("TokenMinted", {"amount": f"{amount} WLFR"}),
                    ("TokenConverted", {"amount": f"{amount} WLFR → ₹{amount:,}"}),
                    ("Disbursed", {"amount": f"₹{amount:,}", "scheme": scheme}),
                ]:
                    db.add(LedgerEvent(app_id=a.id, action=action,
                                       meta_json=json.dumps(meta),
                                       tx_hash="0x" + secrets.token_hex(32),
                                       block_number=0, onchain=False))
            print(f"Demo data: {len(DEMO)} disbursed applications seeded")
        else:
            print("Demo data: already present, skipping")
        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
