import React, { useCallback, useEffect, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX, X, Bot, Loader2 } from "lucide-react";
import { api } from "../api.js";
import { GREET } from "../i18n.js";
import { useSpeech } from "../hooks/useSpeech.js";

/** Floating voice agent — Swar Sahayak. Web Speech API (free). Regional UP languages via i18n. */
export default function VoiceAgent({
  t, loc, userId, open, onClose, currentStep, onNavigate,
}) {
  const { listening, speaking, listen, stopListen, speak, stopSpeak, supported } = useSpeech(loc);
  const [msgs, setMsgs] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open && msgs.length === 0) {
      const g = GREET[loc] || GREET.hi;
      setMsgs([{ role: "bot", text: g }]);
      speak(g);
    }
  }, [open, loc]);

  useEffect(() => {
    if (!open) return;
    setMsgs([{ role: "bot", text: GREET[loc] || GREET.hi }]);
  }, [loc]);

  const stepHelp = useCallback(() => {
    const map = {
      id: { hi: "पहले अपना नाम, उम्र, ज़िला भरें और वॉलेट बनाएँ।", en: "First fill your name, age, district and create a wallet.",
        bho: "पहिले नाम, उमिर, जिला भरीं आ wallet बनावीं।", awa: "पहिले नाम, उमिर, जिला भरौ आ wallet बनावौ।",
        ur: "Pehle naam, umar, district bharien aur wallet banayein." },
      find: { hi: "हरी योजनाएँ चुनें या सहायक से पूछें।", en: "Pick green schemes or ask the assistant.",
        bho: "हरियर योजना chuni या सहायक से puchhi।", awa: "हरियर योजना chunau या सहायक से puchho।",
        ur: "Green schemes chunen ya assistant se puchhen." },
      apply: { hi: "एक दस्तावेज़ चुनें और सत्यापन शुरू करें।", en: "Choose a document and run verification.",
        bho: "एगो document chuni आ verification shuru kari।", awa: "एक document chunau आ verification shuru karau।",
        ur: "Ek document chunen aur verification shuru karein." },
      verify: { hi: "AI चार चरणों में दस्तावेज़ जाँच रहा है।", en: "AI is checking your document in four stages.",
        bho: "AI chaar step mein document check karat ba।", awa: "AI chaar step mein document check karat ba।",
        ur: "AI chaar steps mein document check kar raha hai." },
      done: { hi: "परिणाम देखें। फिर दूसरी योजना के लिए आवेदन कर सकते हैं।", en: "See the result. You can apply for another scheme.",
        bho: "Result dekhi। aur yojana apply kar sakta baani।", awa: "Result dekho। aur yojana apply kar sakta baani।",
        ur: "Result dekhen. Aur scheme apply kar sakte hain." },
    };
    return map[currentStep]?.[loc] || map[currentStep]?.hi || "";
  }, [currentStep, loc]);

  const localIntent = useCallback((text) => {
    const q = text.toLowerCase();
    if (/help|madad|सहाय|madad|مدد|step|chalan|कहाँ|where|kahan/.test(q)) {
      return stepHelp() || t("voice_hint");
    }
    if (/identity|pahchan|पहचान|wallet|वॉलेट|شناخت/.test(q)) {
      onNavigate?.("id");
      return loc === "hi" ? "पहचान चरण पर ले गया। अपना विवरण भरें।" : "Going to identity step. Fill your details.";
    }
    if (/scheme|yojana|योजन|اسکیم/.test(q)) {
      onNavigate?.("find");
      return loc === "hi" ? "योजना चरण पर। हरी बैज वाली योजनाएँ चुनें।" : "Schemes step. Pick ones marked green.";
    }
    if (/apply|awedan|आवेदन|درخواست/.test(q)) {
      return loc === "hi" ? "पहले पात्र योजना चुनें, फिर आवेदन बटन दबाएँ।" : "First pick an eligible scheme, then tap Apply.";
    }
    if (/read|padh|पढ़|پڑھ/.test(q)) {
      return stepHelp();
    }
    return null;
  }, [stepHelp, onNavigate, loc, t]);

  const handleVoice = useCallback(async (transcript) => {
    if (!transcript) return;
    setMsgs((m) => [...m, { role: "user", text: transcript }]);
    setBusy(true);

    const local = localIntent(transcript);
    if (local) {
      setMsgs((m) => [...m, { role: "bot", text: local }]);
      speak(local);
      setBusy(false);
      return;
    }

    try {
      const res = await api.chat(userId || "guest", transcript, loc);
      setMsgs((m) => [...m, { role: "bot", text: res.reply }]);
      speak(res.reply);
    } catch {
      const err = loc === "hi" ? "क्षमा करें, जवाब नहीं मिला। फिर कोशिश करें।"
        : "Sorry, couldn't answer. Try again.";
      setMsgs((m) => [...m, { role: "bot", text: err }]);
      speak(err);
    }
    setBusy(false);
  }, [userId, loc, localIntent, speak]);

  const startMic = () => {
    if (!supported) {
      const msg = t("voice_unsupported");
      setMsgs((m) => [...m, { role: "bot", text: msg }]);
      return;
    }
    if (listening) { stopListen(); return; }
    listen(handleVoice, () => {
      setMsgs((m) => [...m, { role: "bot", text: t("voice_unsupported") }]);
    });
  };

  if (!open) return null;

  return (
    <div className="voice-panel" role="dialog" aria-label={t("voice_name")} aria-modal="true">
      <div className="voice-head">
        <div className="row">
          <span className="voice-avatar"><Bot size={20} /></span>
          <div>
            <b>{t("voice_name")}</b>
            <p className="sub">{t("voice_sub")}</p>
          </div>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="voice-msgs">
        {msgs.map((m, i) => (
          <div key={i} className={"voice-bub " + m.role}>{m.text}</div>
        ))}
        {busy && (
          <div className="voice-bub bot">
            <Loader2 size={16} className="spin" />
          </div>
        )}
      </div>

      <p className="voice-hint">{listening ? t("voice_listen") : t("voice_hint")}</p>

      <div className="voice-controls">
        <button
          type="button"
          className={"voice-mic " + (listening ? "active" : "")}
          onClick={startMic}
          aria-pressed={listening}
          aria-label={t("mic")}
        >
          {listening ? <MicOff size={28} /> : <Mic size={28} />}
        </button>
        <button type="button" className="icon-btn" onClick={speaking ? stopSpeak : () => speak(msgs.at(-1)?.text || "")}
          aria-label={t("a11y_read")}>
          {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
}
