import React from "react";
import {
  ArrowRight, Shield, Link2, Mic, Languages, Zap, Users, CheckCircle2, FileCheck,
} from "lucide-react";
import Logo from "./Logo.jsx";
import DocumentGuide from "./DocumentGuide.jsx";
import { fmt } from "../i18n.js";
import { DOC_TYPES } from "../documents.js";

export default function Landing({ t, loc, onLaunch, chain }) {
  const problems = [t("prob_1"), t("prob_2"), t("prob_3")];
  const solutions = [t("sol_1"), t("sol_2"), t("sol_3")];

  return (
    <div className="landing">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-badge">
            <Logo size={52} />
            <span>WelfareChain</span>
            {chain === "live" && <span className="live-dot">● live chain</span>}
          </div>
          <h1 id="hero-title">{t("landing_hero")}</h1>
          <p className="hero-sub">{t("landing_sub")}</p>
          <div className="hero-actions">
            <button className="btn btn-xl" onClick={onLaunch}>
              {t("launch")} <ArrowRight size={18} />
            </button>
            <button className="btn ghost btn-xl" onClick={onLaunch}>
              {t("skip_landing")}
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>7</strong>
              <span>{t("stat_schemes")}</span>
            </div>
            <div className="stat">
              <strong>{DOC_TYPES.length}</strong>
              <span>{t("stat_docs")}</span>
            </div>
            <div className="stat">
              <strong>5</strong>
              <span>{t("stat_langs")}</span>
            </div>
            <div className="stat">
              <strong>12→3</strong>
              <span>{t("stat_steps")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-grid wrap" aria-label="Problem and solution">
        <div className="card pad landing-card">
          <div className="card-icon alert"><Shield size={22} /></div>
          <h2>{t("landing_problem")}</h2>
          <ul className="check-list">
            {problems.map((p) => (
              <li key={p}><span className="dot bad" />{p}</li>
            ))}
          </ul>
        </div>
        <div className="card pad landing-card highlight">
          <div className="card-icon verify"><Link2 size={22} /></div>
          <h2>{t("landing_solution")}</h2>
          <ul className="check-list">
            {solutions.map((s) => (
              <li key={s}><CheckCircle2 size={16} className="ok-icon" />{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap landing-docs">
        <DocumentGuide t={t} loc={loc} />
      </section>

      <section className="how-it-works wrap">
        <h2 className="section-title"><FileCheck size={20} /> {t("apply_steps")}</h2>
        <div className="how-steps">
          <div className="how-step card pad">
            <span className="how-num">1</span>
            <h3>{t("step1")}</h3>
            <p className="sub">{loc === "hi" ? "7 योजनाओं में से पात्रता देखें" : "Check eligibility among 7 schemes"}</p>
          </div>
          <div className="how-step card pad">
            <span className="how-num">2</span>
            <h3>{t("step2")}</h3>
            <p className="sub">{loc === "hi" ? "6 प्रकार के प्रमाण — नमूना या अपनी फ़ाइल" : "6 proof types — sample or your file"}</p>
          </div>
          <div className="how-step card pad">
            <span className="how-num">3</span>
            <h3>{t("step3")}</h3>
            <p className="sub">{loc === "hi" ? "4-चरण AI + ब्लॉकचेन + वॉलेट" : "4-stage AI + blockchain + wallet"}</p>
          </div>
        </div>
      </section>

      <section className="features wrap" aria-label="Key features">
        <div className="feat">
          <Mic size={28} strokeWidth={1.6} />
          <h3>{t("a11y_voice")}</h3>
          <p>{loc === "hi" ? "हिंदी, भोजपुरी, अवधी, उर्दू, अंग्रेज़ी — बोलकर उपयोग करें" : "Hindi, Bhojpuri, Awadhi, Urdu, English — speak to navigate"}</p>
        </div>
        <div className="feat">
          <Languages size={28} strokeWidth={1.6} />
          <h3>{t("stat_langs")}</h3>
          <p>{loc === "hi" ? "बड़े अक्षर, पढ़कर सुनाएँ, उच्च कंट्रास्ट" : "Large text, read-aloud, high contrast"}</p>
        </div>
        <div className="feat">
          <Zap size={28} strokeWidth={1.6} />
          <h3>AI + Blockchain</h3>
          <p>{loc === "hi" ? "OCR · लेआउट · ELA · सरकारी रिकॉर्ड मिलान" : "OCR · layout · ELA · gov record match"}</p>
        </div>
        <div className="feat">
          <Users size={28} strokeWidth={1.6} />
          <h3>{t("assisted")}</h3>
          <p>{t("tip_assisted")}</p>
        </div>
      </section>

      <section className="cta-band wrap">
        <div className="card pad cta-inner">
          <div>
            <h2>{fmt(2450000)}+ {loc === "hi" ? "लाभार्थियों का सिमुलेशन" : "beneficiaries simulated"}</h2>
            <p className="sub">{t("footer")}</p>
          </div>
          <button className="btn btn-xl ink" onClick={onLaunch}>
            {t("launch")} <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
