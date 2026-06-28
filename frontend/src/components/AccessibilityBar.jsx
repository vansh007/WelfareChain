import React from "react";
import { Type, Contrast, Volume2, Mic, ChevronDown } from "lucide-react";
import { LOCALES } from "../i18n.js";

/** WCAG-minded toolbar: large text, high contrast, read-aloud trigger, locale picker */
export default function AccessibilityBar({
  t, loc, setLoc, onReadAloud, onOpenVoice, largeText, setLargeText,
  highContrast, setHighContrast,
}) {
  return (
    <div className="a11y-bar" role="toolbar" aria-label={t("a11y_bar")}>
      <div className="a11y-loc">
        <label htmlFor="locale-select" className="sr-only">{t("a11y_bar")}</label>
        <select
          id="locale-select"
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          aria-label="Language"
        >
          {LOCALES.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="sel-chev" aria-hidden="true" />
      </div>

      <button
        type="button"
        className={"a11y-btn " + (largeText ? "on" : "")}
        onClick={() => setLargeText(!largeText)}
        aria-pressed={largeText}
        title={t("a11y_large")}
      >
        <Type size={16} />
        <span className="a11y-lbl">{t("a11y_large")}</span>
      </button>

      <button
        type="button"
        className={"a11y-btn " + (highContrast ? "on" : "")}
        onClick={() => setHighContrast(!highContrast)}
        aria-pressed={highContrast}
        title={t("a11y_contrast")}
      >
        <Contrast size={16} />
        <span className="a11y-lbl">{t("a11y_contrast")}</span>
      </button>

      <button type="button" className="a11y-btn" onClick={onReadAloud} title={t("a11y_read")}>
        <Volume2 size={16} />
        <span className="a11y-lbl">{t("a11y_read")}</span>
      </button>

      <button type="button" className="a11y-btn voice-trigger" onClick={onOpenVoice} title={t("a11y_voice")}>
        <Mic size={16} />
        <span className="a11y-lbl">{t("a11y_voice")}</span>
      </button>
    </div>
  );
}
