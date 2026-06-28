import React, { useEffect, useRef, useState } from "react";
import {
  UserRound, HeartHandshake, Accessibility, Baby, Wheat, Utensils, Home,
  Check, X, FileText, ScanLine, LayoutTemplate, ShieldAlert, Database,
  Loader2, Wallet, ArrowLeft, ArrowRight, Upload, AlertTriangle, Link2,
} from "lucide-react";
import { api } from "../api.js";
import { UP_DISTRICTS, fmt } from "../i18n.js";
import { docLabel, docsForScheme } from "../documents.js";
import Chatbot from "./Chatbot.jsx";
import DocumentGuide from "./DocumentGuide.jsx";
import ApplicationHistory from "./ApplicationHistory.jsx";

const SCHEME_ICONS = {
  "user-round": UserRound, "heart-handshake": HeartHandshake, accessibility: Accessibility,
  baby: Baby, wheat: Wheat, utensils: Utensils, home: Home,
};
const SchemeIcon = ({ name, size = 22 }) => {
  const C = SCHEME_ICONS[name] || FileText;
  return <C size={size} />;
};

const DEFAULT_PROFILE = {
  name: "", aadhaar_mock: "", age: 65, gender: "female", annual_income: 60000,
  occupation: "farmer", district: "Bahraich", area: "rural",
  is_widow: true, is_disabled: false, has_girl_child: false, house_type: "kutcha",
  assisted: false,
};

function FlowDiagram({ t, currentIdx }) {
  const nodes = ["s_id", "s_find", "s_apply", "s_verify", "s_done"];
  return (
    <nav className="flow-diagram" aria-label="Application flow">
      {nodes.map((k, i) => (
        <React.Fragment key={k}>
          {i > 0 && <span className="flow-arrow" aria-hidden="true">→</span>}
          <div className={"flow-node " + (i < currentIdx ? "done" : i === currentIdx ? "on" : "")}>
            {t(k)}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
}

function Confetti() {
  const colors = ["#e8a019", "#1f7a5a", "#1b2440", "#c0392b", "#f0b429"];
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => (
        <span key={i} style={{
          left: `${(i * 4.2) % 100}%`,
          top: `${(i * 7) % 30}%`,
          background: colors[i % colors.length],
          animationDelay: `${(i % 8) * 0.12}s`,
        }} />
      ))}
    </div>
  );
}

export default function CitizenFlow({ t, loc, showToast, goAdmin, onStepChange, onUserCreated, navigateStep }) {
  const [step, setStep] = useState("id");
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [user, setUser] = useState(null);          // {user_id, wallet, eligibility}
  const [schemes, setSchemes] = useState([]);
  const [scheme, setScheme] = useState(null);
  const [appId, setAppId] = useState(null);
  const [verifyOut, setVerifyOut] = useState(null); // backend verify response
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { api.schemes().then(setSchemes).catch(() => {}); }, []);

  useEffect(() => { onStepChange?.(step); }, [step, onStepChange]);

  useEffect(() => {
    if (navigateStep && navigateStep !== step) setStep(navigateStep);
  }, [navigateStep]);

  const STEPS = [["id", "s_id"], ["find", "s_find"], ["apply", "s_apply"], ["verify", "s_verify"], ["done", "s_done"]];
  const idx = STEPS.findIndex((s) => s[0] === step);

  const createWallet = async () => {
    setBusy(true); setErr("");
    try {
      const u = await api.createUser(profile);
      setUser(u);
      onUserCreated?.(u.user_id);
      setStep("find");
    } catch (e) { setErr(String(e.message || e)); }
    setBusy(false);
  };

  const startApply = async (s) => {
    setBusy(true); setErr("");
    try {
      const a = await api.apply(user.user_id, s.key);
      setScheme(s); setAppId(a.app_id); setStep("apply");
    } catch (e) { setErr(String(e.message || e)); }
    setBusy(false);
  };

  const eligibilityOf = (key) => (user?.eligibility || []).find((e) => e.key === key);

  return (
    <div aria-label="Citizen application flow">
      <FlowDiagram t={t} currentIdx={idx} />
      <div className="steps" role="list" aria-label="Progress steps">
        {STEPS.map(([k, lbl], i) => (
          <div key={k} className={"s " + (i < idx ? "done" : i === idx ? "on" : "")}>
            <span className="n">{i < idx ? <Check size={12} /> : i + 1}</span>
            {t(lbl)}
          </div>
        ))}
      </div>

      {err && <p className="note" style={{ borderColor: "var(--alert)", color: "var(--alert)", marginBottom: 14 }}>{err}</p>}

      {step === "id" && (
        <IdentityForm t={t} loc={loc} profile={profile} setProfile={setProfile}
          onSubmit={createWallet} busy={busy} />
      )}

      {step === "find" && user && (
        <div>
          <div className="wallet-banner card pad">
            <div className="wallet-banner-main">
              <Wallet size={22} />
              <div>
                <b>{t("wallet_ready")}</b>
                <p className="sub mono">{user.wallet}</p>
              </div>
            </div>
            <div className="wallet-stat">
              <span className="sub">{t("eligible_count")}</span>
              <strong>{(user.eligibility || []).filter((e) => e.eligible).length}</strong>
            </div>
          </div>

          <div className="card pad" style={{ marginBottom: 16 }}>
            <h1 style={{ marginTop: 0 }}>{t("findh")}</h1>
            <p className="sub">{t("finds")}</p>
          </div>

          <div className="grid2" style={{ marginBottom: 20 }}>
            <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
              {schemes.map((s) => {
                const el = eligibilityOf(s.key);
                const ok = el?.eligible;
                const reqDocs = docsForScheme(s.key);
                return (
                  <div key={s.key} className={"scheme " + (ok ? "scheme-eligible" : "")}>
                    <span className="ico"><SchemeIcon name={s.icon} /></span>
                    <div style={{ flex: 1 }}>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <b>{s.name[loc] || s.name.hi}</b>
                        <span className={"pill " + (ok ? "g" : "r")}>
                          {ok ? <Check size={12} /> : <X size={12} />} {ok ? t("eligible") : t("noteli")}
                        </span>
                      </div>
                      <p className="sub" style={{ margin: "3px 0 8px" }}>
                        {s.desc[loc] || s.desc.hi} · <span className="amt">{fmt(s.amount)}</span>
                      </p>
                      <div className="doc-chips">
                        <span className="sub" style={{ fontSize: 11, marginRight: 4 }}>{t("required_docs")}:</span>
                        {reqDocs.map((d) => (
                          <span key={d.id} className="doc-chip">{docLabel(d.id, loc, "name")}</span>
                        ))}
                      </div>
                      {!ok && el?.reasons?.length > 0 && (
                        <p className="sub" style={{ fontSize: 12, margin: "8px 0 0" }}>
                          {t("why")}: {el.reasons.map((r) => r[loc] || r.hi).join(" · ")}
                        </p>
                      )}
                      {ok && (
                        <button className="btn" style={{ padding: "8px 16px", fontSize: 14, marginTop: 10 }}
                          disabled={busy} onClick={() => startApply(s)}>
                          {t("s_apply")} <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <Chatbot t={t} loc={loc} userId={user.user_id}
              onApplyScheme={(key) => {
                const s = schemes.find((x) => x.key === key);
                const el = eligibilityOf(key);
                if (s && el?.eligible) startApply(s);
              }} />
          </div>

          <ApplicationHistory t={t} loc={loc} userId={user.user_id} />

          <DocumentGuide t={t} loc={loc} compact />
        </div>
      )}

      {step === "apply" && (
        <ApplyStep t={t} loc={loc} scheme={scheme} appId={appId}
          onBack={() => setStep("find")} onVerifyStart={() => setStep("verify")} setErr={setErr} />
      )}

      {step === "verify" && (
        <VerifyStep t={t} loc={loc} appId={appId}
          onDone={(out) => {
            setVerifyOut(out);
            if (out.status === "Disbursed")
              showToast(`SMS: ${fmt(scheme.amount)} ${t("credited")} — WelfareChain`);
            setStep("done");
          }} />
      )}

      {step === "done" && verifyOut && (
        <DoneStep t={t} loc={loc} out={verifyOut} appId={appId} scheme={scheme}
          again={() => { setScheme(null); setAppId(null); setVerifyOut(null); setStep("find"); }}
          goAdmin={goAdmin} showConfetti={verifyOut.status === "Disbursed"} />
      )}
    </div>
  );
}

/* ---------------- identity ---------------- */
function IdentityForm({ t, loc, profile, setProfile, onSubmit, busy }) {
  const p = profile;
  const set = (k, v) => setProfile({ ...p, [k]: v });
  const presets = [
    { label: loc === "hi" ? "विधवा किसान, बहराइच" : "Widow farmer, Bahraich",
      data: { name: "Sunita Devi", age: 65, gender: "female", annual_income: 48000,
        occupation: "farmer", district: "Bahraich", area: "rural", is_widow: true,
        is_disabled: false, has_girl_child: false, house_type: "kutcha" } },
    { label: loc === "hi" ? "वरिष्ठ नागरिक, लखनऊ" : "Senior citizen, Lucknow",
      data: { name: "Ramesh Kumar", age: 72, gender: "male", annual_income: 90000,
        occupation: "other", district: "Lucknow", area: "urban", is_widow: false,
        is_disabled: false, has_girl_child: false, house_type: "pucca" } },
    { label: loc === "hi" ? "दिव्यांग, वाराणसी" : "Person with disability, Varanasi",
      data: { name: "Geeta Verma", age: 45, gender: "female", annual_income: 60000,
        occupation: "laborer", district: "Varanasi", area: "urban", is_widow: false,
        is_disabled: true, has_girl_child: false, house_type: "kutcha" } },
  ];
  return (
    <div>
      <div className="card pad" style={{ marginBottom: 14 }}>
        <h1 style={{ marginTop: 0 }}>{t("welcome")}</h1>
        <p className="sub" style={{ marginBottom: 14 }}>{t("welcome_s")}</p>
        <div className="preset-row">
          <span className="sub">{loc === "hi" ? "उदाहरण प्रोफ़ाइल:" : "Example profiles:"}</span>
          {presets.map((pr) => (
            <button key={pr.label} type="button" className="preset-btn"
              onClick={() => setProfile({ ...p, ...pr.data })}>{pr.label}</button>
          ))}
        </div>
      </div>
      <div className="card pad">
      <div className="grid2">
        <div>
          <label className="fld" htmlFor="nm">{t("name")}</label>
          <input id="nm" value={p.name} onChange={(e) => set("name", e.target.value)}
            placeholder={loc === "hi" ? "जैसे सुनीता देवी" : "e.g. Sunita Devi"} />
        </div>
        <div>
          <label className="fld" htmlFor="aad">{t("aadhaar")}</label>
          <input id="aad" className="mono" value={p.aadhaar_mock} maxLength={14}
            onChange={(e) => set("aadhaar_mock", e.target.value)} placeholder="XXXX-XXXX-XXXX" />
        </div>
        <div>
          <label className="fld" htmlFor="age">{t("age")}</label>
          <input id="age" type="number" min="0" value={p.age} onChange={(e) => set("age", +e.target.value)} />
        </div>
        <div>
          <label className="fld" htmlFor="gen">{t("gender")}</label>
          <select id="gen" value={p.gender} onChange={(e) => set("gender", e.target.value)}>
            <option value="female">{t("female")}</option>
            <option value="male">{t("male")}</option>
          </select>
        </div>
        <div>
          <label className="fld" htmlFor="inc">{t("income")}</label>
          <input id="inc" type="number" min="0" step="1000" value={p.annual_income}
            onChange={(e) => set("annual_income", +e.target.value)} />
        </div>
        <div>
          <label className="fld" htmlFor="occ">{t("occ")}</label>
          <select id="occ" value={p.occupation} onChange={(e) => set("occupation", e.target.value)}>
            <option value="farmer">{t("farmer")}</option>
            <option value="laborer">{t("laborer")}</option>
            <option value="other">{t("other")}</option>
          </select>
        </div>
        <div>
          <label className="fld" htmlFor="dst">{t("district")}</label>
          <select id="dst" value={p.district} onChange={(e) => set("district", e.target.value)}>
            {UP_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="fld" htmlFor="ar">{t("area")}</label>
          <select id="ar" value={p.area} onChange={(e) => set("area", e.target.value)}>
            <option value="rural">{t("rural")}</option>
            <option value="urban">{t("urban")}</option>
          </select>
        </div>
        <div>
          <label className="fld" htmlFor="hs">{t("house")}</label>
          <select id="hs" value={p.house_type} onChange={(e) => set("house_type", e.target.value)}>
            <option value="kutcha">{t("kutcha")}</option>
            <option value="pucca">{t("pucca")}</option>
          </select>
        </div>
      </div>
      <div className="row" style={{ margin: "16px 0 6px", gap: 18 }}>
        <Toggle label={t("widow")} on={p.is_widow} set={(v) => set("is_widow", v)} t={t} />
        <Toggle label={t("disabled")} on={p.is_disabled} set={(v) => set("is_disabled", v)} t={t} />
        <Toggle label={t("girl")} on={p.has_girl_child} set={(v) => set("has_girl_child", v)} t={t} />
        <Toggle label={t("assisted")} on={p.assisted} set={(v) => set("assisted", v)} t={t} />
      </div>
      <button className="btn" style={{ marginTop: 14 }} onClick={onSubmit} disabled={busy}>
        {busy ? <Loader2 size={16} /> : <Wallet size={16} />}
        {busy ? t("creating") : t("create")}
      </button>
      </div>
    </div>
  );
}

function Toggle({ label, on, set, t }) {
  return (
    <div className="row" style={{ gap: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>{label}</span>
      <div className="seg" style={{ padding: 2 }}>
        <button className={on ? "on" : ""} style={{ padding: "5px 11px", fontSize: 13 }} onClick={() => set(true)}>{t("yes")}</button>
        <button className={!on ? "on" : ""} style={{ padding: "5px 11px", fontSize: 13 }} onClick={() => set(false)}>{t("no")}</button>
      </div>
    </div>
  );
}

/* ---------------- apply: pick a document ---------------- */
function ApplyStep({ t, loc, scheme, appId, onBack, onVerifyStart, setErr }) {
  const [samples, setSamples] = useState([]);
  const [sel, setSel] = useState(null);
  const [ownFile, setOwnFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [docFilter, setDocFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const reqDocs = docsForScheme(scheme.key);

  useEffect(() => { api.samples().then(setSamples).catch(() => setSamples([])); }, []);

  useEffect(() => {
    const preferred = reqDocs.find((d) => d.id === "income")?.id || reqDocs[0]?.id;
    if (preferred) setTypeFilter(preferred);
  }, [scheme.key]);

  const filtered = samples.filter((d) => {
    if (typeFilter !== "all" && d.doc_type !== typeFilter) return false;
    if (docFilter === "valid") return !d.tampered;
    if (docFilter === "tampered") return d.tampered;
    return true;
  });

  const pick = (d) => {
    setSel(d.sample_id);
    setOwnFile(null);
    setPreview(d);
  };

  const go = async () => {
    setBusy(true); setErr("");
    try {
      const docType = typeFilter !== "all" ? typeFilter : "income";
      if (ownFile) await api.uploadFile(appId, ownFile, docType);
      else if (sel) {
        const s = samples.find((x) => x.sample_id === sel);
        await api.uploadSample(appId, sel, s?.doc_type || docType);
      }
      else { setBusy(false); return; }
      onVerifyStart();
    } catch (e) { setErr(String(e.message || e)); }
    setBusy(false);
  };

  return (
    <div className="apply-layout">
      <div className="card pad apply-header">
        <button type="button" className="btn ghost" style={{ marginBottom: 12 }} onClick={onBack}>
          <ArrowLeft size={14} /> {t("back")}
        </button>
        <div className="apply-header-grid">
          <div>
            <h2 style={{ marginTop: 0 }}>{t("applyfor")} {scheme.name[loc] || scheme.name.hi}</h2>
            <p className="sub"><span className="amt">{fmt(scheme.amount)}</span> · {scheme.desc[loc] || scheme.desc.hi}</p>
          </div>
          <div className="required-box">
            <span className="sub">{t("required_docs")}</span>
            <div className="doc-chips">
              {reqDocs.map((d) => (
                <button key={d.id} type="button"
                  className={"doc-chip clickable " + (typeFilter === d.id ? "on" : "")}
                  onClick={() => setTypeFilter(d.id)}>
                  {docLabel(d.id, loc, "name")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DocumentGuide t={t} loc={loc} compact schemeKey={scheme.key}
        onPickSample={(d) => { setTypeFilter(d.doc_type); pick(d); }} />

      <div className="card pad">
        <h2>{t("pickdoc")}</h2>
        <p className="sub" style={{ marginBottom: 14 }}>{t("pickdoc_s")}</p>

        <div className="filter-bar">
          <div className="seg warm" role="group">
            {["all", "valid", "tampered"].map((f) => (
              <button key={f} type="button" className={docFilter === f ? "on" : ""}
                onClick={() => setDocFilter(f)}>
                {f === "all" ? t("filter_all") : f === "valid" ? t("filter_valid") : t("filter_tampered")}
              </button>
            ))}
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Document type">
            <option value="all">{t("filter_all")}</option>
            {reqDocs.map((d) => (
              <option key={d.id} value={d.id}>{docLabel(d.id, loc, "name")}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="note">{t("no_docs_filter")}</p>
        ) : (
          <div className="docgrid">
            {filtered.map((d) => (
              <button key={d.sample_id} type="button"
                className={"doccard " + (sel === d.sample_id && !ownFile ? "sel" : "") + (d.tampered ? " tampered" : "")}
                onClick={() => pick(d)}>
                <div className="doccard-badge">
                  <span className={"pill " + (d.tampered ? "r" : "g")}>
                    {d.tampered ? t("tampered_tag") : t("valid_tag")}
                  </span>
                </div>
                <img src={d.url} alt="" loading="lazy" />
                <div className="dm">
                  <b>{loc === "hi" ? d.title_hi : d.title}</b>
                  <span>{docLabel(d.doc_type, loc, "name")} · {d.hint}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {preview && sel && !ownFile && (
          <div className="selected-preview card pad">
            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <div>
                <b>{t("selected_doc")}</b>
                <p className="sub">{loc === "hi" ? preview.title_hi : preview.title}</p>
              </div>
              <span className={"pill " + (preview.tampered ? "r" : "g")}>
                {preview.tampered ? t("tampered_tag") : t("valid_tag")}
              </span>
            </div>
            <img className="preview-large" src={preview.url} alt="" />
          </div>
        )}

        <div className="upload-zone">
          <button type="button" className="btn ghost" onClick={() => fileRef.current?.click()}>
            <Upload size={15} /> {t("upload_own")}
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png" hidden
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setOwnFile(e.target.files[0]);
                setSel(null);
                setPreview(null);
              }
            }} />
          {ownFile && <span className="pill m"><FileText size={12} /> {ownFile.name}</span>}
          <p className="sub upload-hint">JPG/PNG · max 5MB · {docLabel(typeFilter !== "all" ? typeFilter : "income", loc, "example")}</p>
        </div>

        <button type="button" className="btn btn-xl" style={{ marginTop: 18, width: "100%" }}
          disabled={busy || (!sel && !ownFile)} onClick={go}>
          {busy ? <Loader2 size={16} /> : <ScanLine size={16} />} {t("startv")}
        </button>
      </div>
    </div>
  );
}

/* ---------------- verify: animated pipeline over the real API result ---------------- */
function VerifyStep({ t, loc, appId, onDone }) {
  const stages = [
    { k: "ocr", lbl: t("v_ocr"), tool: "Tesseract OCR", Icon: ScanLine },
    { k: "layout", lbl: t("v_layout"), tool: "Layout analysis", Icon: LayoutTemplate },
    { k: "tamper", lbl: t("v_tamper"), tool: "ELA + metadata forensics", Icon: ShieldAlert },
    { k: "crosscheck", lbl: t("v_cross"), tool: "Simulated Gov Records DB", Icon: Database },
  ];
  const [state, setState] = useState({});
  const [conf, setConf] = useState(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      let out;
      try { out = await api.verify(appId); }
      catch (e) { out = { status: "Error", error: String(e.message || e) }; }
      if (cancel) return;
      const checks = out.result?.checks || {};
      const bad = {
        ocr: false,
        layout: checks.layout?.status === "anomaly",
        tamper: checks.tamper?.ela_suspicious || checks.tamper?.metadata_suspicious,
        crosscheck: checks.crosscheck?.status !== "match",
      };
      for (const s of stages) {
        if (cancel) return;
        setState((p) => ({ ...p, [s.k]: "run" }));
        await new Promise((r) => setTimeout(r, 750));
        if (cancel) return;
        setState((p) => ({ ...p, [s.k]: bad[s.k] ? "bad" : "ok" }));
      }
      if (out.result) setConf(out.result.confidence);
      await new Promise((r) => setTimeout(r, 700));
      if (!cancel) onDone(out);
    })();
    return () => { cancel = true; };
  }, [appId]);

  return (
    <div className="card pad">
      <h1 style={{ marginTop: 0 }}>{t("verifying")}</h1>
      <p className="sub" style={{ marginBottom: 18 }}>{t("logged")}</p>
      {stages.map(({ k, lbl, tool, Icon }) => (
        <div key={k} className={"stage " + (state[k] || "")}>
          <span className="dot">
            {state[k] === "ok" ? <Check size={15} /> : state[k] === "bad" ? <X size={15} />
              : state[k] === "run" ? <Loader2 size={15} /> : <Icon size={14} />}
          </span>
          <div className="meta"><b>{lbl}</b><p>{tool}</p></div>
          <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
            {!state[k] ? "…" : state[k] === "run" ? t("running") : state[k]}
          </span>
        </div>
      ))}
      {conf !== null && (
        <div className="note" style={{ marginTop: 8 }}>
          {t("conf")}: <b className="mono">{(conf * 100).toFixed(1)}%</b>
        </div>
      )}
    </div>
  );
}

/* ---------------- done: payout or human review, with audit trail ---------------- */
function DoneStep({ t, loc, out, appId, scheme, again, goAdmin, showConfetti }) {
  const flagged = out.status !== "Disbursed";
  const [trail, setTrail] = useState([]);
  useEffect(() => {
    api.application(appId).then((a) => setTrail(a.audit_trail || [])).catch(() => {});
  }, [appId]);

  return (
    <div>
      <div className={"card pad success-card " + (showConfetti ? "celebrate" : "")} style={{ textAlign: "center", marginBottom: 16 }}>
        {showConfetti && <Confetti />}
        <div className="ico" style={{
          margin: "0 auto 14px", width: 66, height: 66, borderRadius: 18,
          background: flagged ? "var(--alert-soft)" : "var(--verify-soft)",
          color: flagged ? "var(--alert)" : "var(--verify)",
        }}>
          {flagged ? <AlertTriangle size={30} /> : <Check size={32} strokeWidth={3} />}
        </div>
        {flagged ? (
          <>
            <h1 style={{ marginTop: 0 }}>{t("flagged")}</h1>
            <p className="sub" style={{ maxWidth: 480, margin: "0 auto" }}>{t("flagged_s")}</p>
            {out.result?.reasons?.length > 0 && (
              <div className="note" style={{ display: "inline-block", marginTop: 14, textAlign: "left" }}>
                <b>{t("reasons")}:</b>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  {out.result.reasons.map((r, i) => <li key={i}>{r[loc]}</li>)}
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 style={{ marginTop: 0 }}>{t("paid")}</h1>
            <p className="sub">{fmt(scheme.amount)} {t("credited")} · {scheme.name[loc]}</p>
            <div className="row" style={{ justifyContent: "center", gap: 28, margin: "18px 0 4px" }}>
              <div>
                <div className="sub">{t("wallet_bal")}</div>
                <div style={{ fontSize: 30, fontWeight: 700 }}>{fmt(out.wallet_balance)}</div>
              </div>
              <div>
                <div className="sub">{t("conf")}</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "var(--verify)" }}>
                  {((out.result?.confidence || 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </>
        )}
        <div className="row" style={{ justifyContent: "center", marginTop: 16 }}>
          <button className="btn" onClick={again}>{t("again")}</button>
          <button className="btn ghost" onClick={goAdmin}>{t("goadmin")} <ArrowRight size={14} /></button>
        </div>
      </div>

      {trail.length > 0 && (
        <div className="ledger">
          <div className="lhead"><Link2 size={13} /> {t("trail")}</div>
          {trail.map((e, i) => (
            <div key={i} className="lentry">
              <div className="la">{e.action}
                <span className={"ltag " + (e.onchain ? "live" : "")}>{e.onchain ? "on-chain" : "simulated"}</span>
              </div>
              <div className="lm mono">{Object.entries(e.meta).map(([k, v]) => `${k}=${v}`).join(" · ")}</div>
              <div className="lh mono">{e.tx_hash}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
