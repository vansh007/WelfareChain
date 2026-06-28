import React, { useEffect, useState } from "react";
import {
  CheckCircle2, ShieldAlert, Info, ChevronRight, FileCheck, Sparkles,
} from "lucide-react";
import { api } from "../api.js";
import { DOC_TYPES, docLabel } from "../documents.js";

/** Interactive catalogue of certifiable document types with live sample counts. */
export default function DocumentGuide({ t, loc, compact = false, schemeKey = null, onPickSample }) {
  const [samples, setSamples] = useState([]);
  const [active, setActive] = useState(schemeKey ? null : "income");

  useEffect(() => {
    api.samples().then(setSamples).catch(() => setSamples([]));
  }, []);

  const types = schemeKey
    ? DOC_TYPES.filter((d) => d.schemes.includes(schemeKey))
    : DOC_TYPES;

  useEffect(() => {
    if (types.length && !types.find((x) => x.id === active)) setActive(types[0].id);
  }, [schemeKey, types, active]);

  const countFor = (typeId, tampered) =>
    samples.filter((s) => s.doc_type === typeId && !!s.tampered === tampered).length;

  const preview = samples.filter((s) => s.doc_type === active).slice(0, compact ? 2 : 3);

  return (
    <section className={"doc-guide " + (compact ? "compact" : "")} aria-label={t("doc_guide_h")}>
      {!compact && (
        <div className="guide-head">
          <FileCheck size={22} />
          <div>
            <h2>{t("doc_guide_h")}</h2>
            <p className="sub">{t("doc_guide_s")}</p>
          </div>
        </div>
      )}

      <div className="doc-type-tabs" role="tablist">
        {types.map(({ id, Icon, color }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            className={"doc-tab " + (active === id ? "on" : "")}
            onClick={() => setActive(id)}
          >
            <span className="doc-tab-ico" style={{ background: color + "18", color }}>
              <Icon size={16} />
            </span>
            <span>{docLabel(id, loc, "name")}</span>
            <span className="doc-tab-count">{countFor(id, false)}+</span>
          </button>
        ))}
      </div>

      {active && (
        <div className="doc-detail card pad" role="tabpanel">
          <div className="doc-detail-top">
            <div>
              <h3>{docLabel(active, loc, "name")}</h3>
              <p className="sub">{docLabel(active, loc, "desc")}</p>
            </div>
            <div className="doc-badges">
              <span className="pill g"><CheckCircle2 size={11} /> {countFor(active, false)} {t("valid_samples")}</span>
              <span className="pill r"><ShieldAlert size={11} /> {countFor(active, true)} {t("tampered_samples")}</span>
            </div>
          </div>

          <div className="info-box">
            <Info size={16} />
            <div>
              <b>{t("fields_checked")}</b>
              <p>{docLabel(active, loc, "example")}</p>
            </div>
          </div>

          <div className="verify-steps-mini">
            <Sparkles size={14} />
            <span>{t("verify_mini")}</span>
          </div>

          {preview.length > 0 && (
            <div className="guide-preview">
              <p className="guide-preview-lbl">{t("example_docs")}</p>
              <div className="guide-preview-grid">
                {preview.map((d) => (
                  <button
                    key={d.sample_id}
                    type="button"
                    className={"guide-thumb " + (d.tampered ? "bad" : "ok")}
                    onClick={() => onPickSample?.(d)}
                    title={loc === "hi" ? d.title_hi : d.title}
                  >
                    <img src={d.url} alt="" loading="lazy" />
                    <span className={"thumb-tag " + (d.tampered ? "r" : "g")}>
                      {d.tampered ? t("tampered_tag") : t("valid_tag")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!compact && (
            <p className="sim-note">
              <ChevronRight size={14} />
              {t("doc_sim_note")}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
