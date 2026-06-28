"""WelfareChain DB layer.
SQLite by default; set DATABASE_URL (Supabase Postgres URI) in backend/.env to use Supabase.
The schema mirrors SDD §5.1.
"""
import os
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from sqlalchemy import (Boolean, Column, DateTime, Float, ForeignKey, Integer,
                        String, Text, create_engine)
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DB_URL = os.getenv("DATABASE_URL", "").strip() or "sqlite:///./welfarechain.db"
connect_args = {"check_same_thread": False} if DB_URL.startswith("sqlite") else {}
engine = create_engine(DB_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def uid() -> str:
    return uuid.uuid4().hex[:12]


def now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "wc_users"
    id = Column(String, primary_key=True, default=uid)
    name = Column(String, default="")
    aadhaar_mock = Column(String, default="")          # mock value only (simulation)
    id_commitment = Column(String, default="")         # keccak hash stored on-chain
    age = Column(Integer, default=0)
    gender = Column(String, default="female")
    annual_income = Column(Integer, default=0)
    occupation = Column(String, default="other")
    district = Column(String, default="Lucknow")
    area = Column(String, default="rural")
    is_widow = Column(Boolean, default=False)
    is_disabled = Column(Boolean, default=False)
    has_girl_child = Column(Boolean, default=False)
    house_type = Column(String, default="pucca")
    assisted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=now)


class Wallet(Base):
    __tablename__ = "wc_wallets"
    user_id = Column(String, ForeignKey("wc_users.id"), primary_key=True)
    address = Column(String, default="")
    fiat_balance = Column(Integer, default=0)          # rupees (simulation)


class Application(Base):
    __tablename__ = "wc_applications"
    id = Column(String, primary_key=True, default=uid)
    user_id = Column(String, ForeignKey("wc_users.id"))
    scheme_key = Column(String)
    amount = Column(Integer, default=0)
    district = Column(String, default="")
    status = Column(String, default="Draft")  # Draft|Verifying|Flagged|Approved|Disbursed|Rejected
    confidence = Column(Float, default=0.0)
    created_at = Column(DateTime, default=now)


class Document(Base):
    __tablename__ = "wc_documents"
    id = Column(String, primary_key=True, default=uid)
    app_id = Column(String, ForeignKey("wc_applications.id"))
    doc_type = Column(String, default="income")
    filename = Column(String, default="")
    path = Column(String, default="")
    sample_id = Column(String, default="")             # set when a bundled sample is used
    created_at = Column(DateTime, default=now)


class Verification(Base):
    __tablename__ = "wc_verifications"
    id = Column(String, primary_key=True, default=uid)
    app_id = Column(String, ForeignKey("wc_applications.id"))
    decision = Column(String, default="")              # PASS | FLAG | REJECT
    confidence = Column(Float, default=0.0)
    checks_json = Column(Text, default="{}")
    reasons_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=now)


class LedgerEvent(Base):
    __tablename__ = "wc_ledger"
    id = Column(String, primary_key=True, default=uid)
    app_id = Column(String, default="")
    action = Column(String)                            # mirrors contract events
    meta_json = Column(Text, default="{}")
    tx_hash = Column(String, default="")
    block_number = Column(Integer, default=0)
    onchain = Column(Boolean, default=False)           # True = real chain tx, False = simulated
    created_at = Column(DateTime, default=now)


class Alert(Base):
    __tablename__ = "wc_alerts"
    id = Column(String, primary_key=True, default=uid)
    app_id = Column(String, default="")
    district = Column(String, default="")
    scheme_key = Column(String, default="")
    reason = Column(String, default="")
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=now)


class SmsLog(Base):
    __tablename__ = "wc_sms"
    id = Column(String, primary_key=True, default=uid)
    user_id = Column(String, default="")
    text = Column(Text, default="")
    created_at = Column(DateTime, default=now)


class GovRecord(Base):
    """Simulated authoritative government records used for Tier-2 cross-verification."""
    __tablename__ = "wc_gov_records"
    doc_uid = Column(String, primary_key=True)         # the DOC-ID printed on the document
    holder_name = Column(String, default="")
    doc_type = Column(String, default="income")
    declared_income = Column(Integer, default=0)
    valid = Column(Boolean, default=True)


def init_db():
    Base.metadata.create_all(bind=engine)
