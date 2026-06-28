import React, { useCallback, useEffect, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX, X, Bot, Loader2, RotateCcw } from "lucide-react";
import { GREET } from "../i18n.js";
import { useSpeech } from "../hooks/useSpeech.js";
import { useChat } from "../context/ChatContext.jsx";

const VOICE_CHIPS = {
  hi: ["कौन सी योजनाएँ?", "आवेदन कैसे?", "ब्लॉकचेन क्या है?", "मदद"],
  en: ["Which schemes?", "How to apply?", "What is blockchain?", "Help"],
  bho: ["kaun si yojana?", "apply kaise?", "madad"],
  awa: ["kaun si yojana?", "apply kaise?", "madad"],
  ur: ["kaun si scheme?", "apply kaise?", "madad"],
};

/** Floating voice agent — Swar Sahayak with shared chat memory + navigation. */
export default function VoiceAgent({
  t, loc, open, onClose, currentStep, onNavigate, onOpenAdmin, autoSpeak = true,
}) {
  const { messages, ask, reset, addBot, addUser } = useChat();
  const { listening, speaking, listen, stopListen, speak, stopSpeak, supported } = useSpeech(loc);
  const [busy, setBusy] = useState(false);
  const [autoOn, setAutoOn] = useState(autoSpeak);

  useEffect(() => {
    if (open && messages.length === 0) {
      const g = GREET[loc] || GREET.hi;
      if (autoOn) speak(g);
    }
  }, [open, loc]);

  const stepHelp = useCallback(() => {
    const map = {
      id: { hi: "पहले नाम, उम्र, ज़िला भरें और वॉलेट बनाएँ।", en: "Fill name, age, district and create wallet." },
      find: { hi: "हरी योजनाएँ चुनें या मुझसे पूछें।", en: "Pick green schemes or ask me." },
      apply: { hi: "दस्तावेज़ चुनें — वैध (हरा) या बदला (लाल) डेमो।", en: "Pick a document — valid (green) or tampered (red) demo." },
      verify: { hi: "AI चार चरणों में जाँच कर रहा है।", en: "AI is running four verification stages." },
      done: { hi: "परिणाम देखें। दूसरी योजना के लिए फिर आवेदन करें।", en: "See result. Apply for another scheme if you wish." },
    };
    return map[currentStep]?.[loc] || map[currentStep]?.hi || t("voice_hint");
  }, [currentStep, loc, t]);

  const localIntent = useCallback((text) => {
    const q = text.toLowerCase();
    if (/help|madad|सहाय|مدد|step|kahan|कहाँ|where/.test(q)) return stepHelp();
    if (/identity|pahchan|पहचान|wallet|वॉलेट|شناخت/.test(q)) {
      onNavigate?.("id");
      return loc === "hi" ? "पहचान चरण पर ले गया।" : "Going to identity step.";
    }
    if (/scheme|yojana|योजन|اسکیم/.test(q)) {
      onNavigate?.("find");
      return loc === "hi" ? "योजना चरण पर।" : "Schemes step.";
    }
    if (/document|dastavez|दस्तावेज|upload/.test(q)) {
      onNavigate?.("apply");
      return loc === "hi" ? "दस्तावेज़ चरण। वैध नमूना चुनें।" : "Document step. Pick a valid sample.";
    }
    if (/admin|dashboard|प्रशासक|officer/.test(q)) {
      onOpenAdmin?.();
      return loc === "hi" ? "प्रशासक डैशबोर्ड खोला।" : "Opening admin dashboard.";
    }
    if (/blockchain|chain|ब्लॉक/.test(q)) {
      return loc === "hi"
        ? "हर कार्रवाई Hardhat चेन पर दर्ज होती है। प्रशासक में एक्सप्लोरर देखें।"
        : "Every action is recorded on Hardhat. See explorer in admin.";
    }
    if (/tamper|fraud|धोखा|badla|बदला/.test(q)) {
      return loc === "hi"
        ? "बदला हुआ दस्तावेज़ चुनें — AI पकड़ेगा और मानवीय समीक्षा होगी।"
        : "Pick a tampered document — AI will flag it for human review.";
    }
    return null;
  }, [stepHelp, onNavigate, onOpenAdmin, loc]);

  const handleVoice = useCallback(async (transcript) => {
    if (!transcript) return;
    setBusy(true);
    const local = localIntent(transcript);
    if (local) {
      addUser(transcript);
      addBot(local);
      if (autoOn) speak(local);
      setBusy(false);
      return;
    }
    const res = await ask(transcript);
    if (res?.reply && autoOn) speak(res.reply);
    setBusy(false);
  }, [localIntent, ask, speak, autoOn, addBot, addUser]);

  const startMic = () => {
    if (!supported) return;
    if (listening) { stopListen(); return; }
    listen(handleVoice, () => speak(t("voice_unsupported")));
  };

  const chips = VOICE_CHIPS[loc] || VOICE_CHIPS.hi;
  const display = messages.length ? messages : [{ role: "assistant", content: GREET[loc] || GREET.hi }];

  if (!open) return null;

  return (
    <div className="voice-panel" role="dialog" aria-label={t("voice_name")} aria-modal="true">
      <div className="voice-head">
        <div className="row">
          <span className={"voice-avatar " + (listening ? "pulse" : "")}><Bot size={20} /></span>
          <div>
            <b>{t("voice_name")}</b>
            <p className="sub">{t("voice_sub")}</p>
          </div>
        </div>
        <div className="row">
          <button type="button" className="icon-btn" onClick={reset} title={t("chat_reset")}>
            <RotateCcw size={16} />
          </button>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="voice-chips">
        {chips.map((c) => (
          <button key={c} type="button" className="voice-chip" onClick={() => handleVoice(c)}>{c}</button>
        ))}
      </div>

      <div className="voice-msgs">
        {display.slice(-6).map((m, i) => (
          <div key={i} className={"voice-bub " + m.role}>{m.content}</div>
        ))}
        {busy && <div className="voice-bub bot"><Loader2 size={16} className="spin" /></div>}
      </div>

      {listening && (
        <div className="voice-wave" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((n) => <span key={n} className="wave-bar" />)}
        </div>
      )}

      <p className="voice-hint">{listening ? t("voice_listen") : stepHelp()}</p>

      <div className="voice-controls">
        <button type="button" className={"voice-mic " + (listening ? "active" : "")}
          onClick={startMic} aria-pressed={listening} aria-label={t("mic")}>
          {listening ? <MicOff size={28} /> : <Mic size={28} />}
        </button>
        <button type="button" className={"icon-btn " + (autoOn ? "on" : "")}
          onClick={() => setAutoOn(!autoOn)} title={t("auto_speak")}>
          {autoOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button type="button" className="icon-btn"
          onClick={speaking ? stopSpeak : () => speak(display.at(-1)?.content || "")}>
          {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
}
