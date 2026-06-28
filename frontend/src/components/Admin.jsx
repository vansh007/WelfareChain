import React, { useEffect, useState } from "react";
import {
  BarChart3, IndianRupee, Files, BadgeCheck, ShieldAlert, AlertTriangle,
  Link2, RefreshCw, Check, X,
} from "lucide-react";
import { api } from "../api.js";
import { fmt } from "../i18n.js";
import BlockExplorer from "./BlockExplorer.jsx";
import TxModal from "./TxModal.jsx";

export default function Admin({ t, loc }) {
  const [m, setM] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [txModal, setTxModal] = useState(null);

  const load = async () => {
    try {
      const [mm, ll] = await Promise.all([api.adminMetrics(), api.adminLedger()]);
      setM(mm); setLedger(ll);
    } catch { /* backend offline */ }
  };
  useEffect(() => {
    load();
    const iv = setInterval(load, 6000);
    return () => clearInterval(iv);
  }, []);

  const review = async (appId, approve) => {
    setBusyId(appId);
    try { await api.review(appId, approve, approve ? "human approved" : "forged document"); await load(); }
    catch { /* noop */ }
    setBusyId(null);
  };

  if (!m) return <div className="card pad"><p className="sub">Loading… (is the backend running on :8000?)</p></div>;

  const maxD = Math.max(1, ...m.by_district.map(([, v]) => v));

  return (
    <div>
      <div className="card pad" style={{ marginBottom: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <span className="ico" style={{ background: "var(--ink)", color: "#fff" }}><BarChart3 size={20} /></span>
            <div>
              <h1 style={{ margin: 0 }}>{t("adm_h")}</h1>
              <p className="sub">{t("adm_s")}</p>
            </div>
          </div>
          <button type="button" className="btn ghost" onClick={load}><RefreshCw size={14} /> {t("refresh")}</button>
        </div>
      </div>

      <BlockExplorer t={t} loc={loc} />

      <div className="tiles" style={{ marginBottom: 16 }}>
        <div className="card tile">
          <div className="k"><IndianRupee size={13} /> {t("total_disb")}</div>
          <div className="v">{fmt(m.total_disbursed)}</div>
        </div>
        <div className="card tile">
          <div className="k"><Files size={13} /> {t("apps")}</div>
          <div className="v">{m.applications}</div>
        </div>
        <div className="card tile">
          <div className="k"><BadgeCheck size={13} /> {t("appr_rate")}</div>
          <div className="v" style={{ color: "var(--verify)" }}>{m.approval_rate}%</div>
        </div>
        <div className="card tile">
          <div className="k"><ShieldAlert size={13} /> {t("flags")}</div>
          <div className="v" style={{ color: "var(--alert)" }}>{m.fraud_flags}</div>
        </div>
      </div>

      <div className="grid2" style={{ marginBottom: 16 }}>
        <div className="card pad">
          <h2>{t("by_district")}</h2>
          <p className="sub" style={{ marginBottom: 16 }}>{t("reg_an")}</p>
          {m.by_district.length === 0 && <p className="note">{t("no_disb")}</p>}
          {m.by_district.map(([d, v]) => (
            <div key={d} className="dist">
              <span className="nm">{d}</span>
              <span className="bx"><span className="bar"><i style={{ width: (v / maxD) * 100 + "%" }} /></span></span>
              <span className="vl">{fmt(v)}</span>
            </div>
          ))}
        </div>

        <div className="card pad">
          <h2>{t("alerts_h")}</h2>
          <p className="sub" style={{ marginBottom: 16 }}>{t("alerts_s")}</p>
          {m.alerts.length === 0 && <p className="note">{t("no_alerts")}</p>}
          {m.alerts.map((a) => (
            <div key={a.id} className="alertrow">
              <AlertTriangle size={17} color="var(--alert)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 14 }}>{a.scheme_key.toUpperCase()} · {a.district}</b>
                <p className="sub" style={{ margin: "2px 0 8px" }}>{t("reason_lbl")} {a.reason} · #{a.app_id.slice(0, 6)}</p>
                <div className="row">
                  <button type="button" className="btn" style={{ padding: "7px 13px", fontSize: 13 }}
                    disabled={busyId === a.app_id} onClick={() => review(a.app_id, true)}>
                    <Check size={13} /> {t("approve")}
                  </button>
                  <button type="button" className="btn danger" style={{ padding: "7px 13px", fontSize: 13 }}
                    disabled={busyId === a.app_id} onClick={() => review(a.app_id, false)}>
                    <X size={13} /> {t("reject")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ledger" style={{ marginBottom: 16 }}>
        <div className="lhead"><Link2 size={13} /> {t("ledger_h")}</div>
        <h2 style={{ marginTop: 0, marginBottom: 14 }}>{t("ledger_s")}</h2>
        <p className="sub" style={{ marginBottom: 12, color: "#9fb0d6" }}>{t("ledger_click")}</p>
        <div style={{ maxHeight: 360, overflow: "auto" }}>
          {ledger.map((e, i) => (
            <button key={i} type="button" className="lentry lentry-btn" onClick={() => setTxModal(e.tx_hash)}>
              <div className="la">{e.action}
                <span className={"ltag " + (e.onchain ? "live" : "")}>{e.onchain ? "on-chain" : "simulated"}</span>
              </div>
              <div className="lm mono">
                {e.block ? `block #${e.block} · ` : ""}
                {Object.entries(e.meta).map(([k, v]) => `${k}=${v}`).join(" · ")}
              </div>
              <div className="lh mono">{e.tx_hash}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card pad">
        <h2>{t("cmp_h")}</h2>
        <p className="sub" style={{ marginBottom: 8 }}>{t("cmp_s")}</p>
        <table className="cmp">
          <thead>
            <tr><th>{t("param")}</th><th>{t("legacy")}</th><th>WelfareChain</th></tr>
          </thead>
          <tbody>
            {[
              [loc === "hi" ? "पारदर्शिता" : "Transparency", loc === "hi" ? "सीमित" : "limited", loc === "hi" ? "ऑन-चेन बही" : "on-chain ledger"],
              [loc === "hi" ? "सत्यापन समय" : "Verification time", loc === "hi" ? "विलंबित (दिन)" : "delayed (days)", loc === "hi" ? "AI रीयल-टाइम" : "AI real-time"],
              [loc === "hi" ? "योजना विखंडन" : "Scheme fragmentation", loc === "hi" ? "अधिक" : "high", loc === "hi" ? "एकीकृत पोर्टल" : "unified portal"],
              [loc === "hi" ? "दस्तावेज़ धोखाधड़ी" : "Document fraud", loc === "hi" ? "मैनुअल जाँच" : "manual checks", loc === "hi" ? "AI + मानवीय समीक्षा" : "AI + human review"],
              [loc === "hi" ? "प्रक्रिया चरण" : "Process steps", "~12", "~3"],
            ].map((r) => (
              <tr key={r[0]}><td>{r[0]}</td><td className="old">{r[1]}</td><td className="new">{r[2]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {txModal && <TxModal txHash={txModal} onClose={() => setTxModal(null)} t={t} loc={loc} />}
    </div>
  );
}
