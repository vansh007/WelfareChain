# WelfareChain — Blockchain + AI Welfare Distribution (Simulation)

**ICSSR research prototype · Uttar Pradesh scope · synthetic data only · no real Aadhaar/beneficiary data.**

One platform that demonstrates the full Direct Benefit Transfer journey:

```
Citizen identity → AI chatbot scheme discovery → application + document upload
→ 4-stage AI verification (OCR · layout · tamper forensics · gov-records cross-check)
→ smart-contract approval → token mint → fiat conversion → wallet credit + SMS
→ admin analytics · fraud alerts · human review · immutable transparency ledger
```

| Layer | Tech | Folder |
|---|---|---|
| Blockchain | Solidity 0.8.24 · Hardhat · OpenZeppelin (4 contracts) | `chain/` |
| Backend (BFF + AI) | FastAPI · SQLAlchemy · PIL/numpy forensics · web3.py | `backend/` |
| Frontend | React 18 · Vite · lucide-react icons · Hindi-first i18n | `frontend/` |
| Synthetic data | 26 labelled mock documents (16 valid, 10 tampered) | `data/documents/` |
| Docs | Feasibility+SRS and System Design Document | `docs/` |

---

## 0. Prerequisites (one-time)

- **Node.js 18+** → https://nodejs.org (check: `node -v`)
- **Python 3.10+** → https://python.org (check: `python --version`)
- (Optional) **Tesseract OCR** for OCR on your own uploads — bundled samples work without it.
  - Windows: https://github.com/UB-Mannheim/tesseract/wiki · macOS: `brew install tesseract` · Ubuntu: `sudo apt install tesseract-ocr`

> **Windows note:** run the commands below in two/three/four separate terminals (PowerShell is fine). Replace `python` with `py` if needed.

---

## 1. Run the platform (4 terminals)

### Terminal 1 — blockchain node
```bash
cd chain
npm install
npx hardhat node
```
Leave this running. It starts a local Ethereum chain at `http://127.0.0.1:8545`.

### Terminal 2 — deploy the smart contracts
```bash
cd chain
npm run deploy
```
Deploys **UserRegistry, SchemeRegistry, WelfareToken, DisbursementController**, seeds the 7 UP schemes on-chain, and writes `backend/chain_artifacts.json` so the backend auto-connects. Re-run this any time you restart Terminal 1.

*(Optional but recommended once: `npm test` — runs the contract test suite.)*

### Terminal 3 — backend (API + AI)
```bash
cd backend
pip install -r requirements.txt
python scripts/generate_documents.py     # creates the 26 synthetic documents
python seed.py                           # loads gov records + demo dashboard data
uvicorn app.main:app --reload --port 8000
```
API docs at http://127.0.0.1:8000/docs

### Terminal 4 — frontend
```bash
cd frontend
npm install
npm run dev
```
**Open http://localhost:5173** — you're in.

> The header shows **“Blockchain: live”** when Terminals 1–2 are up. If the chain isn't running, the platform automatically switches to **simulation mode** and still works end-to-end (ledger entries are tagged `simulated` instead of `on-chain`).

---

## 2. A 3-minute demo script

1. **Citizen** → fill the identity form (defaults are a widowed farmer in Bahraich) → **Create wallet**.
2. Green badges show eligible schemes. Ask **Sahayak** (the chatbot): *“मुझे कौन सी योजनाएँ मिल सकती हैं?”*
3. **Apply** on Old Age Pension → pick a **valid** sample document → **Run verification** → watch the 4 stages pass → ₹12,000 credited + SMS toast + on-chain audit trail.
4. Apply again → pick a **tampered (बदला हुआ)** sample → tamper + cross-check stages fail → **routed to human review** (no auto-rejection).
5. **Administrator** → see totals, district analytics, the fraud alert (Approve/Reject it — that's the human-review fallback), and the live **transparency ledger** with tx hashes.
6. Toggle **हिंदी/EN** anywhere.

---

## 3. Optional configuration (`backend/.env`)

Copy `backend/.env.example` → `backend/.env` and fill what you want. Everything works with an empty file.

| Variable | What it does |
|---|---|
| `DATABASE_URL` | **Use your Supabase**: paste the Postgres URI from *Supabase → Project Settings → Database → Connection string*. Tables (`wc_*`) are created automatically on first run. Leave empty for local SQLite. |
| `GEMINI_API_KEY` | Free key from https://aistudio.google.com/apikey → chatbot answers via Gemini. |
| `GROQ_API_KEY` | Free key from https://console.groq.com/keys → used if Gemini absent. |
| *(none)* | Chatbot still works via the built-in rule-based assistant. |

Restart Terminal 3 after editing `.env`.

**GitHub:** the folder is git-ready — `git init && git add . && git commit -m "WelfareChain v1"` and push to a new repo.

---

## 4. What's inside (requirement coverage)

- **FR-1 Identity/Wallet** — simulated Aadhaar → hashed commitment on `UserRegistry` (privacy by design), wallet per citizen, assisted mode flag.
- **FR-2 Discovery + Chatbot** — 7-scheme UP catalogue with bilingual eligibility reasons; Sahayak (Gemini/Groq/rule-based) guides in Hindi/English.
- **FR-3 Apply/Upload** — sample document grid + your-own-file upload.
- **FR-4 AI Verification + human fallback** — OCR (Tesseract), layout check, **ELA block forensics + metadata anomaly**, gov-records cross-check; confidence + bilingual explainability; failures FLAG to human review, never auto-reject. **Measured on the bundled set: 26/26 correct (10 tampered caught, 0 false positives).**
- **FR-5/6 Smart contracts + token lifecycle** — record → approve → disburse with `APPROVER`/`TREASURY` role separation; token minted → burned as fiat conversion → `Disbursed(fiatRef)`; SMS log.
- **FR-7 Status** — per-application blockchain audit trail in the UI.
- **FR-8 Admin** — live tiles, district analytics, fraud alerts with Approve/Reject, legacy-DBT comparison matrix.
- **FR-9 Audit + synthetic data** — every action in the transparency ledger; labelled synthetic document generator.
- **NFR-3/4** — immutable event ledger; Hindi-first, WCAG-minded UI (focus rings, reduced-motion, large targets).

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| Header says “Blockchain: simulated” | Terminals 1–2 not running — start `npx hardhat node`, then `npm run deploy`. App still works meanwhile. |
| `pip install` fails on `psycopg2-binary` | Only needed for Supabase. Delete that line from `requirements.txt` if using SQLite. |
| No sample documents in Apply step | Run `python scripts/generate_documents.py` in `backend/`, restart uvicorn. |
| Chatbot replies feel templated | That's the offline fallback — add a free `GEMINI_API_KEY` in `backend/.env`. |
| Port already in use | Change ports: `uvicorn ... --port 8001` + update `frontend/vite.config.js` proxy. |

---
*Simulation only. Scheme rules are illustrative placeholders for the design-science study; real public scheme data slots into `backend/app/schemes.py` (the DataSource seam) without redesign.*
