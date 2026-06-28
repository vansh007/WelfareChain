# WelfareChain — Engineering Foundation Document
### Phase 0 → Phase 1: Project Understanding · Feasibility Study · Requirements Elicitation · Software Requirements Specification (SRS)

> **Document status:** Working draft v1.0
> **Governing scope:** ICSSR-funded research proposal ("WelfareChain") — a *simulation-based design-science study*.
> **Build constraint:** Development with **Claude Code (premium)**; every other tool must be **free / open-source**.
> **Geographic scope (current):** **Uttar Pradesh only** (Bihar and other regions deferred to later phases).
> **Data posture:** Synthetic/mock data now; a controlled path to integrate **real public datasets** later (see §B.6 for the important caveat on *beneficiary* data).

---

## How to read this document

This is the output of the first two software-engineering phases. It does **not** contain code or UI yet — that is the Design & Development phase, which comes after this is approved. The four parts are:

- **Part A — Project Understanding:** a plain, detailed explanation of what WelfareChain is and how it works end-to-end.
- **Part B — Feasibility Study:** can we actually build the funded scope with only Claude Code + free tools? Technical, economic, schedule, operational, legal/ethical feasibility, and a risk register.
- **Part C — Requirements Elicitation:** who the stakeholders are, what they need, and the explicit benefits to *government* and to *people*.
- **Part D — Software Requirements Specification (SRS):** the formal, numbered requirements (functional + non-functional + constraints + interfaces + data).

---

# PART A — Project Understanding

## A.1 What WelfareChain is, in one paragraph

WelfareChain is a proposed digital infrastructure that re-imagines how the Indian government delivers welfare money to citizens under the **Direct Benefit Transfer (DBT)** system. It combines three technologies — a **permissioned blockchain** (for a tamper-proof, auditable record of every welfare transaction), **artificial intelligence** (to verify documents and detect fraud automatically), and a **multilingual AI chatbot** (to help citizens discover schemes they qualify for and apply without needing an agent). Because it is funded as an ICSSR *research* project, the deliverable is **not a live government system** but a **fully simulated, technically-credible prototype** built on mock/synthetic data, validated by experts, and scoped initially to **Uttar Pradesh**.

## A.2 The problem it attacks

India's DBT system improved transparency over older cash-and-middleman systems, but well-documented gaps remain, especially in welfare-heavy states like UP:

1. **Last-mile exclusion** — eligible citizens never receive benefits due to low digital literacy, poor awareness, or documentation problems.
2. **Verification delay & fraud** — manual document checking is slow and error-prone; forged ration cards, income certificates, and duplicate identities slip through.
3. **Fragmentation** — schemes live on separate portals (UMANG and others); there is no single window that tells a citizen *everything* they qualify for.
4. **Opacity & leakage** — money can be diverted or delayed with no real-time, citizen-visible trail.

## A.3 The core idea — three layers working together

**1. Identity & Wallet layer.** A citizen creates a digital wallet linked (in simulation) to an Aadhaar/Jan Dhan identity. This becomes their single verified handle in the system.

**2. Discovery & Assistance layer.** A multilingual AI chatbot (Hindi and regional languages) asks simple questions, figures out which schemes the citizen is eligible for, and walks them through applying. A citizen who already knows what they want can search and apply directly.

**3. Verification, Approval & Disbursement layer.** When a citizen applies and uploads documents:
- An **AI verification pipeline** reads the documents (OCR + layout understanding), checks them for tampering/forgery, and cross-references them against (simulated) government records.
- If they pass, a **smart contract** — a small automated program encoding that scheme's rules — approves the application and triggers funding.
- Funds are issued as **programmable government tokens**, which are **automatically converted to ordinary rupees** in the citizen's wallet. The citizen only ever sees normal money; the token mechanics are invisible to them.
- The citizen gets an **SMS/notification**, and every step is written immutably to the blockchain.

**Running over all three:** an **administrator dashboard** with real-time disbursement analytics, regional heat-maps, and automated fraud/anomaly alerts.

## A.4 The end-to-end journey (the canonical example)

> A citizen in a rural district of **Uttar Pradesh** opens WelfareChain on a basic phone (or at a local kiosk). The chatbot, in Hindi, asks a few questions and lists the schemes they qualify for — say a food subsidy and a pension. The citizen uploads supporting documents. The AI verifies them instantly. A smart contract approves the claim and releases funds as government tokens, which convert to rupees and land in the Jan Dhan account linked to their Aadhaar. An SMS confirms it. Meanwhile, an officer watching the dashboard sees the disbursement appear in the regional totals, with any anomalies flagged automatically.

In the proposal's own efficiency framing, this collapses a roughly **12-step manual process into ~3 steps** and targets a large reduction in disbursement time — claims the simulation is designed to test rather than assert.

## A.5 What is actually being *built* (scope reality check)

This is the single most important thing for the engineering team to internalise, because the paper (`draft1.docx`) and the proposal (`Proposal.docx`) describe two different sizes of the same idea:

| | `draft1.docx` (the paper) | `Proposal.docx` (the funded scope) |
|---|---|---|
| Nature | Full **production vision** | **Simulation / research prototype** |
| Blockchain | Hyperledger Fabric consortium, PBFT, multi-department validator nodes | Modelled blockchain with mock validators; logic demonstrated, not run as a real consortium |
| Data | Real govt databases, real beneficiaries | **Synthetic/mock only**, no live DBs, no real beneficiaries |
| AI | Models trained on millions of documents | Conceptual pipeline tested on **~25–30 synthetic documents** |
| Deployment | Nationwide live system | **No deployment**; wireframes, simulations, expert review |
| Region | All-India | **UP** (this engineering effort), per your instruction |

**Engineering stance:** we treat the paper as the **target architecture** (the thing the simulation is *modelling*) and the proposal as the **governing scope** (the thing we are *contractually obligated to deliver*). Every component we build is a faithful, runnable *simulation* of a production component, not the production component itself. This is normal and correct for design-science research, and it is also what makes the project buildable on free tools.

## A.6 Budget, timeline, and the new constraints you added

- **Grant:** ₹24,50,000 over **24 months**, in six 4-month phases (inception → architecture → UI + AI simulation → stakeholder/policy → comparative evaluation → finalisation).
- **Your build constraint:** all engineering done through **Claude Code (premium)**; every other tool **free or open-source**. The grant's "Software & Tools / IT Infrastructure" lines therefore become *contingency* rather than a dependency — a strong cost-feasibility position (see Part B).
- **UP-only:** several proposal sections still mention Bihar, Chhattisgarh, Delhi, Maharashtra, and the Northeast (an internal inconsistency in the proposal — some sections say "5 regions", others "UP and Bihar"). Per your instruction we **scope to UP** and treat multi-region as a documented future extension.
- **Real data "soon":** flagged and handled carefully in §B.6 — the distinction between *real public datasets* (fine) and *real beneficiary personal data* (a scope and legal change) matters a great deal.

---

# PART B — Feasibility Study

**Question this part answers:** *Given that we can use Claude Code (premium) for development but everything else must be free, can the funded WelfareChain simulation actually be built, on budget, on schedule, and within legal/ethical limits?*

**Headline verdict:** **Yes — feasible, with high confidence**, provided we (a) build the *simulation* scope rather than the production scope, (b) substitute the paper's enterprise stack with free, locally-runnable equivalents, and (c) keep the data posture synthetic until the real-data question in §B.6 is resolved.

## B.1 Technical feasibility — mapping every component to a free tool

The paper's enterprise stack (Hyperledger Fabric, HSMs, IPFS clusters, trained CNN/LayoutLMv3 models) is **not** required for a *simulation*, and most of it is not free to run. The table below is the proposed free substitution. Everything here runs locally or on a free tier, and all of it can be written and orchestrated through Claude Code.

| Capability | Paper's production choice | **Free simulation substitute** | Why it's enough for the funded scope |
|---|---|---|---|
| Smart contracts / token logic | Hyperledger Fabric + Solidity on private EVM | **Hardhat** (local EVM) + **Solidity**; optional deploy to a free public testnet (e.g. Sepolia / Polygon Amoy via faucet test-tokens) | We need to *demonstrate* contract logic and an auditable ledger, not run a national consortium. A local EVM does this perfectly and free. |
| Welfare token (ERC-20) | Custom govt token | **OpenZeppelin ERC-20** contracts on Hardhat | Mint/burn/convert logic is identical to production; only the network is simulated. |
| Document OCR | Enterprise OCR | **Tesseract** (`pytesseract`) | Free, offline, good enough for synthetic Hindi/English documents. |
| Layout / document understanding | LayoutLMv3 trained on millions of docs | **LayoutLMv3 / Donut inference** from Hugging Face on **Google Colab / Kaggle free GPU**; or rule-based layout checks | Proposal only requires a *conceptual* pipeline on ~25–30 docs — inference on free GPU is sufficient; no large-scale training needed. |
| Forgery / tamper detection | Hologram + watermark CV | **OpenCV** (Error-Level Analysis, edge/clone detection) + **PIL/exiftool** metadata checks | Detects the tampering we deliberately inject into synthetic docs; fully free. |
| Multilingual chatbot (runtime) | — | **Free LLM tiers**: Google **Gemini** free tier, **Groq** (free Llama), **OpenRouter** free models, or local **Ollama** (Llama/Mistral). Handles Hindi + reasoning. | Runtime assistance for the demo; pick whichever free tier is live at build time. *(Note: Claude Code premium is for **building**; do not assume it provides a free runtime API for the deployed chatbot — design the chatbot to be model-agnostic.)* |
| Database | Off-chain encrypted store | **SQLite** (zero-config) for the prototype, or **Supabase / Firebase / MongoDB Atlas free tier** if hosted | Stores mock users, scheme rules, application state. |
| Document storage | IPFS cluster | **Local filesystem**, or **Pinata / web3.storage free tier** if we want real IPFS hashes for the audit story | We only handle synthetic documents. |
| Frontend (citizen + admin) | React Native app | **React** (web) + **Tailwind**; mobile-responsive / PWA for offline-first feel | Wireframes-to-working-prototype; a PWA demonstrates "mobile-first, offline" without app-store cost. |
| Hosting / demo | Govt infra | **Vercel / Netlify / GitHub Pages / Render** free tiers | Free public demo URL for expert review. |
| Diagrams / UML / architecture | — | **draw.io / Mermaid / Excalidraw** (free); Figma free tier for hi-fi mockups | Matches proposal's "Draw.io / Lucidchart / Figma" line at ₹0. |
| Load / scalability "test" | Hyperledger Caliper at 1M tx | **Locust** (free) against the API, or a scripted Hardhat tx batch | Demonstrates the *methodology* of scalability testing, which is what a simulation owes. |
| Source control & docs | — | **Git + GitHub (free private repo)** | Matches proposal's GitHub line. |
| Qualitative analysis | NVivo | **Open-source CAQDAS (e.g. Taguette)** or structured spreadsheets | NVivo is paid; free substitutes exist for thematic coding of expert interviews. |

**Conclusion (technical):** every functional and non-functional requirement in the SRS (Part D) maps to a free, Claude-Code-buildable component. The only paid item the team genuinely *has* is Claude Code itself, which is the development environment — exactly where the spend belongs.

## B.2 The pivotal architecture decision

> **Decision D-1:** Replace the production "consortium Hyperledger Fabric" backbone with a **local EVM simulation (Hardhat + Solidity + OpenZeppelin)** for all on-chain logic, and document Hyperledger Fabric as the *production migration target*.

Rationale: a real Fabric consortium needs multiple organisations each running validator infrastructure — impossible to stand up for free and unnecessary for a single-team simulation. A local EVM gives us real smart contracts, a real immutable ledger, real token mint/burn/convert, and a real audit trail, at zero cost, all writable through Claude Code. The *concepts* (permissioned validators, PBFT, role-based nodes) are preserved in the architecture documentation and the comparison matrix the proposal requires.

This single decision is what turns "ambitious but unfundable production system" into "buildable, free, fundable simulation" — and it is fully consistent with the proposal's stated methodology.

## B.3 Economic feasibility

- **Tooling cost: effectively ₹0.** The substitution table holds every tool at free/open-source. Claude Code premium is already owned.
- **Grant headroom.** The ₹24.5L budget allocates ~₹4L to Software/Tools + IT Infrastructure. Under the free-tool strategy this becomes **risk buffer** (extra GPU credits if Colab free tier is exhausted, a paid LLM fallback if no free tier suffices, a laptop if hardware fails) rather than a hard dependency. The dominant real cost remains **personnel** (JRFs/RAs) — which is appropriate and unaffected.
- **Sustainability.** Because outputs are open-source-friendly (Solidity logic, UI blueprints, AI pipeline), the proposal's revenue/sustainability section (open-source release, low-cost licensing, GovTech lab) is unharmed by the free-tool approach — arguably strengthened.

**Verdict:** economically feasible with a comfortable margin.

## B.4 Schedule feasibility

The proposal's six 4-month phases align cleanly with a software lifecycle. Mapping:

| Proposal phase | Months | SE activity | Free-tool deliverable |
|---|---|---|---|
| 1 Inception | 1–4 | Requirements (this doc), persona/scheme research | This SRS + UP scheme catalogue |
| 2 Architecture | 5–8 | High-level design, smart-contract logic, AI pipeline design | UML/Mermaid diagrams, Solidity pseudocode, pipeline spec |
| 3 UI + AI sim | 9–12 | Detailed design + build | React prototype, Hardhat contracts, OCR+CV pipeline on ~25–30 synthetic docs |
| 4 Stakeholder/policy | 13–16 | Validation, expert review | Heuristic eval, expert interview analysis, policy mapping |
| 5 Comparative eval | 17–20 | Testing, benchmarking | DBT-vs-WelfareChain matrix, Locust load test, metrics |
| 6 Finalisation | 21–24 | Release, docs, dissemination | Final report, open-source repo, demo URL |

**Verdict:** schedule-feasible; the free-tool stack does not add schedule risk and removes procurement delay.

## B.5 Operational feasibility

- **Team skills:** the stack (React, Python, Solidity, OpenCV, free LLM APIs) is mainstream and well-supported, and Claude Code accelerates all of it. No exotic expertise required.
- **Validation operations:** expert interviews and mockup reviews are virtual/async (Zoom, Google Forms) — operationally light, as the proposal already plans.
- **No live-system operations:** because nothing is deployed to real users, there is no 24/7 ops burden, no SLA, no real money at risk.

**Verdict:** operationally feasible.

## B.6 Legal, ethical & data feasibility — and the "real data soon" flag ⚠️

This is the one area that needs a deliberate decision, because of the new fact you added.

**The proposal's binding commitment** (repeated across §§9, 12, 13, 14): *no real beneficiary data, no live government database integration, synthetic/mock data only, all personas fictitious.* That commitment is part of why the project is ethically clean and ICSSR-approvable.

**You said: "soon we'll get some real data also to integrate."** There are two very different cases, and the team must classify the incoming data before touching it:

1. **Real *public, non-personal* datasets** — e.g. scheme rules/eligibility from DBT Bharat, MGNREGA/PMAY parameters, aggregate Census/NFHS statistics, UP scheme catalogues. **This is fine and beneficial.** It makes eligibility logic and personas more realistic without touching anyone's privacy. *Recommended path.*

2. **Real *beneficiary personal data*** — anything tied to identifiable individuals (Aadhaar numbers, real applications, real income/caste documents). **This is a scope change and a legal trigger.** It would:
   - conflict with the proposal's stated ethics ("no real beneficiary data"), potentially requiring an amendment/clearance with ICSSR;
   - bring the project under the **Digital Personal Data Protection Act, 2023 (DPDP)** — consent, purpose limitation, data minimisation, security, breach obligations;
   - require an institutional **ethics/IRB review** and a data-sharing agreement with whoever provides the data;
   - mean we can no longer claim the system is risk-free synthetic research.

> **Recommendation R-1:** Default to **synthetic + real *public* datasets**. Treat any real *personal* data as out-of-scope for the funded simulation unless and until (a) ICSSR is informed/approves, (b) ethics clearance is obtained, and (c) a DPDP-compliant handling pipeline (anonymisation/pseudonymisation, encryption, access control, retention limits) is in place. Even then, prefer **de-identified** data. We will architect the system so that *swapping the synthetic data source for a compliant real one is a configuration change, not a redesign* — but we will not switch the flag without the clearances above.

**Verdict:** legally/ethically feasible **as a synthetic + public-data simulation**; real *personal* data is a gated future decision, not a default.

## B.7 Risk register (top risks + mitigations)

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Free LLM tier for the chatbot is discontinued or rate-limited mid-project | Med | Med | Model-agnostic chatbot interface; keep 2 free fallbacks (e.g. Gemini + Groq) and local Ollama as offline backup; budget buffer (§B.3) for a short paid window if needed. |
| R2 | "Real data" arrives as real PII, creating legal exposure | Med | **High** | Enforce R-1 gate; classify data *before* ingest; never wire personal data into the prototype without clearance. |
| R3 | Free GPU (Colab/Kaggle) insufficient for AI pipeline | Low | Med | Pipeline only needs *inference* on ~25–30 docs; CPU-fallback with lighter models; spread runs across free quotas. |
| R4 | Scope creep back toward the full production (Fabric/HSM) architecture | Med | Med | Hold Decision D-1 firm; production stack stays as *documented target*, not build target. |
| R5 | Proposal's internal region inconsistency (UP-only vs 5 regions) confuses deliverables | High | Low | This doc fixes scope to **UP**; multi-region is an explicit "future work" item, noted in the final report. |
| R6 | Over-claiming results (e.g. "92% faster") beyond what a simulation can prove | Med | Med | Report simulated metrics as *projected/conditional*, with methodology and assumptions stated; never present mock results as field-validated. |
| R7 | Expert/stakeholder no-shows reduce validation quality | Med | Med | Async formats, short sessions, over-recruit (proposal already plans 25–30). |

---

# PART C — Requirements Elicitation

**Elicitation methods used here** (consistent with a simulation-based design-science study): (1) **document analysis** of `draft1.docx` and `Proposal.docx`; (2) **stakeholder analysis** to derive needs by role; (3) **secondary-source grounding** (UP scheme catalogues, DBT/UIDAI/NITI Aayog material — public data only); (4) **persona modelling** for UP beneficiary types. Live beneficiary interviews are deliberately excluded per scope; expert interviews validate (not generate) requirements later.

## C.1 Stakeholder map

| Stakeholder | Role in the system | What they care about |
|---|---|---|
| **Citizen / beneficiary** (rural UP, urban-slum UP — Lucknow/Varanasi/Kanpur, semi-urban — Ghaziabad/Ayodhya) | Primary user: discovers, applies, receives funds | Simplicity, language, trust, getting money fast, not being excluded |
| **Welfare department officer / approver** | Defines scheme rules; oversees approvals | Correct eligibility logic, fraud prevention, less manual work |
| **Treasury (simulated)** | Authorises/funds disbursement | Auditability, no leakage, traceable fund flow |
| **Administrator / policy monitor** | Watches dashboards | Real-time visibility, anomaly alerts, regional analytics |
| **Digital facilitator** (ASHA worker, panchayat operator, kiosk) | Assists low-literacy citizens | Easy assisted-mode UI, offline tolerance |
| **NGO / civil society** | Represents vulnerable groups (consulted) | Inclusion, consent, grievance redress, fairness |
| **Research team (PI, RAs, consultants)** | Builds and validates the simulation | Buildability, ethics compliance, evaluable outputs |
| **Policy bodies** (NITI Aayog, MeitY, UIDAI — dissemination targets) | Future adopters of findings | Policy fit, scalability evidence, integration story |

## C.2 Elicited needs (grouped, source-traced)

**From the citizen's side**
- One place to find *all* schemes they qualify for (not many portals). *(Proposal §1, §5)*
- Help in their own language, including for low-literacy/first-time users — chatbot, voice, icons. *(Proposal §1, §6, §12, §20)*
- Upload documents and get verified quickly. *(Both docs)*
- Receive money reliably, with an SMS confirmation, and track status. *(Proposal §1)*
- Raise and follow grievances. *(Proposal §33, §35)*
- Work on a basic phone / poor connectivity (offline-first). *(Proposal §12, §20, §34)*

**From the government's side**
- Automatic, rules-based approval that cuts manual steps and delay. *(Both docs)*
- Strong fraud detection (forgery, duplicates, tampering). *(Both docs)*
- A tamper-proof, auditable record of every transaction. *(Both docs)*
- Real-time dashboards: disbursement totals, regional heat-maps, anomaly/fraud alerts. *(Proposal §1, §9, §16)*
- Traceable, programmable fund flow (tokenised) that converts to rupees. *(Both docs)*
- Role-based access for different departments. *(Both docs)*
- Evidence the new model beats the old DBT model on transparency, time, and cost. *(Proposal §9, §16)*

**Cross-cutting / non-functional needs**
- Security and privacy by design (encryption, RBAC, consent, ZKP, off-chain sensitive storage). *(Both docs)*
- Ethical, explainable AI with a **human fallback** when AI verification fails. *(Proposal §11, §14, §16)*
- Accessibility (WCAG 2.1), multilingual, low-literacy design. *(Proposal §9)*
- Scalability evidence (load-test methodology). *(Proposal §9)*
- Interoperability *story* with Aadhaar / Jan Dhan / DigiLocker / NPCI (simulated). *(Both docs)*

## C.3 Benefits — to Government and to People (you asked for this explicitly)

**Benefits to the Government**
1. **Lower leakage & fraud** — AI verification + smart-contract rules + immutable ledger reduce diversion, duplicates, and forged-document approvals.
2. **Faster, cheaper administration** — automating eligibility and disbursement cuts manual steps (~12 → ~3 in the proposal's framing) and administrative cost.
3. **Real-time governance** — dashboards turn welfare from a retrospective, paper-trail activity into a live, monitorable one (regional gaps, bottlenecks, anomalies surfaced as they happen).
4. **Auditability & trust** — every rupee's path is recorded immutably, strengthening accountability and public legitimacy.
5. **Policy intelligence** — analytics reveal under-served blocks and under-utilised schemes, enabling targeted allocation (aligned with the Aspirational Districts Programme in UP).
6. **Replicable, future-ready model** — a modular blueprint extensible to health, education, pensions, and other states; aligns with Digital India, AI for All, and the National Blockchain Strategy.

**Benefits to the People**
1. **Inclusion** — a single multilingual, voice/icon-assisted window means rural, low-literacy, and first-time digital users can actually find and claim what they're entitled to.
2. **Speed & certainty** — automated approval and tokenised disbursement mean faster, more predictable payments, with SMS confirmation.
3. **Dignity & independence** — citizens act on their own entitlements rather than depending on middlemen or gatekeepers.
4. **Transparency for the citizen** — they can track their application and funds, and raise grievances within the same system.
5. **Equity** — design accommodates people without standard documents, single women, persons with disabilities, and migrants; reduces both the digital divide and the social-access gap.
6. **Financial resilience** — timely, leak-free benefits help households budget around pensions/subsidies/scholarships and reduce reliance on informal credit.

---

# PART D — Software Requirements Specification (SRS)
*Structured per IEEE 830 / ISO-IEC-IEEE 29148.*

## D.1 Introduction

**D.1.1 Purpose.** This SRS specifies the requirements for the **WelfareChain simulation prototype** — a research artifact that models a blockchain- and AI-based DBT welfare-delivery platform, scoped to Uttar Pradesh, built with Claude Code and free tools, using synthetic data.

**D.1.2 Scope.** The system simulates: citizen identity/wallet, scheme discovery with a multilingual AI chatbot, AI document verification, smart-contract-driven approval, tokenised disbursement with token→fiat conversion, citizen status/grievance tracking, and an administrator analytics dashboard. It explicitly does **not** deploy to real users, connect to live government databases, or process real beneficiary personal data (see constraints D.5 and §B.6).

**D.1.3 Definitions.**
- *DBT* — Direct Benefit Transfer.
- *Welfare token* — a programmable on-chain unit representing an approved benefit, auto-converted to fiat (₹) in the wallet.
- *Smart contract* — on-chain program encoding a scheme's eligibility and disbursement rules.
- *Verification pipeline* — the AI stage (OCR → layout/understanding → tamper/forgery check → simulated DB cross-check).
- *Simulated* — runs on a local/free stack with mock data; mirrors production behaviour without production infrastructure.

**D.1.4 References.** `draft1.docx` (technical paper — target architecture); `Proposal.docx` (ICSSR proposal — governing scope).

## D.2 Overall description

**D.2.1 Product perspective.** A self-contained simulation comprising four subsystems: (1) **Citizen Web/PWA app**, (2) **AI services** (chatbot + verification pipeline), (3) **Blockchain layer** (local EVM + Solidity contracts + ERC-20 token), (4) **Admin dashboard**, backed by an off-chain store of mock data.

**D.2.2 User classes.** Citizen (incl. assisted/low-literacy mode), Approver/Welfare officer, Treasury (simulated), Administrator/monitor, Facilitator, Research/maintainer.

**D.2.3 Operating environment.** Web (responsive/PWA) for citizen and admin; local EVM (Hardhat) for chain; Python services for AI; free-tier hosting for the demo. Designed to degrade gracefully on low bandwidth (offline-first patterns).

**D.2.4 Design & implementation constraints.** Built via Claude Code; all other tools free/open-source; synthetic data only (pending §B.6); single-region (UP); no production-grade infrastructure.

**D.2.5 Assumptions & dependencies.** Availability of at least one free LLM tier (with fallbacks); free GPU for occasional AI inference; that "real data" will be *public/non-personal* unless the R-1 gate is cleared.

## D.3 Functional requirements

> Priority key: **M** = Must (core to the funded demo), **S** = Should, **C** = Could (nice-to-have / future).

### Module 1 — Identity & Wallet
- **FR-1.1 (M)** Create a citizen account and digital wallet using a **simulated** Aadhaar/Jan Dhan identity.
- **FR-1.2 (M)** Each wallet holds a fiat (₹) balance that reflects converted welfare tokens.
- **FR-1.3 (S)** Support an **assisted mode** where a facilitator operates on a citizen's behalf with consent recorded.
- **FR-1.4 (S)** Allow alternate/limited identity for citizens without standard documents (equity case).

### Module 2 — Scheme Discovery & Multilingual Chatbot
- **FR-2.1 (M)** Maintain a catalogue of UP welfare schemes with machine-readable eligibility rules.
- **FR-2.2 (M)** **Direct search**: a citizen who knows a scheme can find and start it.
- **FR-2.3 (M)** **Guided discovery**: the AI chatbot elicits citizen attributes and returns *all* schemes they are eligible for.
- **FR-2.4 (M)** Chatbot answers questions and guides application, in **Hindi** plus at least one further UP-relevant language; English supported.
- **FR-2.5 (S)** Voice input/output and icon-based navigation for low-literacy users.
- **FR-2.6 (C)** Personalised recommendations ranked by relevance/benefit value.

### Module 3 — Application & Document Upload
- **FR-3.1 (M)** Apply to one or more schemes from a single window.
- **FR-3.2 (M)** Upload required documents (e.g. simulated Aadhaar, income, caste, ration card).
- **FR-3.3 (M)** Validate file type/size and capture document metadata.

### Module 4 — AI Verification Pipeline (two-tier)
- **FR-4.1 (M)** **OCR** extraction of text from uploaded documents (Tesseract).
- **FR-4.2 (M)** **Layout/understanding** stage (LayoutLMv3/Donut inference) to interpret document structure.
- **FR-4.3 (M)** **Tamper/forgery detection** (OpenCV ELA, clone/edge analysis) + **metadata anomaly** checks.
- **FR-4.4 (M)** **Tier-2 cross-verification** against a **simulated** government records store.
- **FR-4.5 (M)** Produce a verification result with **confidence score** and a recorded decision (pass / flag / reject).
- **FR-4.6 (M)** **Human fallback**: flagged/failed documents route to a manual-review queue (ethical-AI requirement).
- **FR-4.7 (S)** Emit explainability output (which checks failed/passed) for auditability.

### Module 5 — Smart-Contract Approval & Eligibility
- **FR-5.1 (M)** Encode each scheme's eligibility + disbursement rules in a Solidity smart contract.
- **FR-5.2 (M)** On successful verification, the contract **automatically approves** and authorises funding.
- **FR-5.3 (M)** Enforce role-based actions (approver/treasury) within contract logic.
- **FR-5.4 (S)** Support conditional/time-bound rules (e.g. expiry, scheme-specific restrictions on token use).

### Module 6 — Token Issuance, Conversion & Disbursement
- **FR-6.1 (M)** Mint **welfare tokens** (ERC-20) for the approved amount upon authorisation.
- **FR-6.2 (M)** **Auto-convert** tokens to fiat (₹) in the citizen's wallet (and burn the token), so the citizen sees only rupees.
- **FR-6.3 (M)** Maintain an **immutable on-chain audit trail** of mint → convert/burn → credit.
- **FR-6.4 (M)** Send an **SMS/notification** (simulated) confirming disbursement.

### Module 7 — Status, Notifications & Grievance
- **FR-7.1 (M)** Citizen can track application status end-to-end.
- **FR-7.2 (S)** Citizen can file and follow up a grievance within the system.
- **FR-7.3 (S)** Notifications on each status change.

### Module 8 — Administrator Dashboard & Analytics
- **FR-8.1 (M)** Real-time disbursement totals and counts.
- **FR-8.2 (M)** **Regional (UP) analytics** — district/block-level breakdowns and heat-maps.
- **FR-8.3 (M)** **Automated anomaly/fraud alerts** (e.g. spikes, duplicate patterns, high reject rates).
- **FR-8.4 (S)** Scheme-effectiveness and bottleneck reports.
- **FR-8.5 (S)** Comparison view: WelfareChain (simulated) vs legacy DBT on transparency/time/steps (supports the proposal's evaluation matrix).

### Module 9 — Audit, Logging & Data Management
- **FR-9.1 (M)** Every significant action (verification decision, approval, disbursement) is logged immutably (on-chain) and/or in tamper-evident off-chain logs.
- **FR-9.2 (M)** Synthetic dataset management: generate/label ~25–30 documents incl. tampered/metadata-inconsistent samples for AI testing.
- **FR-9.3 (S)** Export evaluation metrics (confusion matrix, accuracy/precision/recall, processing time).

## D.4 Non-functional requirements

- **NFR-1 Security.** Encrypt sensitive (mock) data at rest and in transit; RBAC for officer/admin/treasury; (simulated) MFA for admin; demonstrate ZKP/off-chain-encryption concepts for sensitive fields. *(Both docs)*
- **NFR-2 Privacy & ethics.** Data minimisation, recorded consent flows, no real personal data (pending §B.6); explainable AI; bias-mitigation note for verification models. *(Proposal §10, §11)*
- **NFR-3 Transparency / auditability.** All disbursements verifiable via the on-chain trail; admin and (conceptually) citizen-visible. *(Both docs)*
- **NFR-4 Accessibility.** WCAG 2.1 AA target; multilingual; voice + icon navigation; readable on low-end devices. *(Proposal §9)*
- **NFR-5 Usability.** Validated by heuristic evaluation (Nielsen's 10) and expert walkthroughs; TAM/UTAUT-informed flows. *(Proposal §9, §10)*
- **NFR-6 Performance.** Verification + approval feels "near real-time" in the demo; measure and report processing time per document and per application.
- **NFR-7 Scalability (evidenced).** Demonstrate a load-testing methodology (Locust / scripted tx batches) and report projected behaviour; do not claim production-scale numbers as fact. *(Proposal §9, R6)*
- **NFR-8 Interoperability (simulated).** Provide clearly-marked mock adapters for Aadhaar / Jan Dhan / DigiLocker / NPCI to tell the integration story without live connection. *(Both docs)*
- **NFR-9 Reliability / graceful degradation.** Offline-first patterns; the prototype tolerates intermittent connectivity. *(Proposal §12, §20)*
- **NFR-10 Maintainability / modularity.** Subsystems are independently swappable (esp. the data source: synthetic ↔ compliant real — a config change, per §B.6).
- **NFR-11 Portability.** Web/PWA runs cross-platform; backend services run locally or on free tiers.

## D.5 Constraints (binding)

- **CON-1** Development through **Claude Code (premium)**; all other tools **free/open-source**.
- **CON-2** **Simulation-only** — no live deployment to real users.
- **CON-3** **No live government database** integration; cross-verification is simulated.
- **CON-4** **Synthetic data only** by default; real *personal* data is gated behind §B.6 / R-1 (ICSSR + ethics + DPDP).
- **CON-5** **Single region: Uttar Pradesh** (multi-region is future work).
- **CON-6** AI limited to **inference on a small synthetic set (~25–30 docs)**; no large-scale training.
- **CON-7** Budget ₹24.5L / 24 months / 6 phases.

## D.6 External interface requirements

- **UI:** Citizen Web/PWA (Hindi-first, voice/icon-capable, offline-tolerant); Admin dashboard (analytics, alerts); Facilitator assisted-mode view.
- **AI service API:** chatbot endpoint (model-agnostic) and verification-pipeline endpoint (returns decision + confidence + explainability).
- **Blockchain interface:** contract calls for register/approve/mint/convert; read access for audit/dashboard.
- **Simulated external adapters:** Aadhaar/Jan Dhan/DigiLocker/NPCI mock services with clearly-labelled fake responses.
- **Notification interface:** simulated SMS/notification gateway.

## D.7 Data requirements

- **Synthetic citizen personas** representative of UP (e.g. rural smallholder, urban-slum migrant worker, widow seeking pension, person without standard ID).
- **UP scheme catalogue** with machine-readable eligibility rules (from *public* sources).
- **Synthetic document set (~25–30)**: valid + tampered + metadata-inconsistent samples, labelled for AI evaluation.
- **Mock "government records"** store for Tier-2 cross-verification.
- **Transaction/audit ledger** (on-chain) + off-chain application state.
- *(Future, gated)* a compliant real *public* dataset feed; real personal data only under R-1.

## D.8 Acceptance criteria (what "done" looks like for Phase-1 build)

1. A citizen persona can, in Hindi, be guided by the chatbot to eligible UP schemes, apply, and upload synthetic documents.
2. The AI pipeline returns a pass/flag/reject decision with a confidence score; tampered samples are detected; failures route to human-review.
3. A smart contract auto-approves a passing application, mints a welfare token, converts it to ₹ in the wallet, and writes the full trail on-chain.
4. The citizen sees status + an SMS-style confirmation; an admin sees the disbursement in real-time UP analytics with anomaly alerting.
5. An evaluation pack exists: confusion matrix + timing metrics + a WelfareChain-vs-legacy-DBT comparison matrix.
6. Everything above runs on **free tools**, built via **Claude Code**, on **synthetic data**, for **UP**.

---

# PART E — Bridge to the next phases (Design & Development)

This document closes Phase 0 (feasibility) and Phase 1 (requirements). The agreed direction into **Design**:

1. **High-level architecture** for the four subsystems with the free-tool stack from §B.1, holding Decision **D-1** (local EVM, not Fabric).
2. **Smart-contract design** — scheme rule contracts + ERC-20 welfare token + conversion logic (Solidity, OpenZeppelin, Hardhat).
3. **AI pipeline design** — OCR → layout → tamper/forgery → simulated cross-check → decision+confidence, with human fallback and explainability.
4. **UX design** — Hindi-first, voice/icon, offline-first citizen flow + admin analytics, validated by heuristics.
5. **Data design** — synthetic personas, UP scheme catalogue, the labelled ~25–30 document set, mock records, on-chain ledger; with the swap-to-real-data seam (NFR-10) kept clean and gated (§B.6).

Two decisions to confirm before Design begins:
- **Confirm Decision D-1** (local EVM simulation as the on-chain backbone).
- **Classify the incoming "real data"** under §B.6 before any of it is integrated.

*(You said the next prompt will be about improvements — those will slot naturally on top of this baseline.)*
