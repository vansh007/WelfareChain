import React, { useEffect, useRef, useState } from "react";
import { BotMessageSquare, SendHorizonal, Mic, MicOff } from "lucide-react";
import { api } from "../api.js";
import { GREET } from "../i18n.js";
import { useSpeech } from "../hooks/useSpeech.js";

export default function Chatbot({ t, loc, userId }) {
  const [msgs, setMsgs] = useState([{ r: "bot", x: GREET[loc] || GREET.hi }]);
  const [val, setVal] = useState("");
  const [busy, setBusy] = useState(false);
  const boxRef = useRef();
  const { listening, listen, stopListen, speak, supported } = useSpeech(loc);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [msgs, busy]);

  useEffect(() => {
    setMsgs([{ r: "bot", x: GREET[loc] || GREET.hi }]);
  }, [loc]);

  const send = async (text) => {
    const q = (text || val).trim();
    if (!q || busy) return;
    setMsgs((m) => [...m, { r: "me", x: q }]);
    setVal("");
    setBusy(true);
    try {
      const res = await api.chat(userId, q, loc);
      setMsgs((m) => [...m, { r: "bot", x: res.reply }]);
      speak(res.reply);
    } catch {
      const err = loc === "hi" ? "क्षमा करें, अभी जवाब नहीं मिल पाया।"
        : "Sorry, I couldn't answer right now.";
      setMsgs((m) => [...m, { r: "bot", x: err }]);
    }
    setBusy(false);
  };

  const toggleMic = () => {
    if (!supported) return;
    if (listening) { stopListen(); return; }
    listen((transcript) => { if (transcript) send(transcript); });
  };

  return (
    <div className="card chatcard" aria-label={t("assistant")}>
      <div className="chathead">
        <span className="ico" style={{ width: 36, height: 36, background: "var(--ink)", color: "var(--marigold)" }}>
          <BotMessageSquare size={18} aria-hidden="true" />
        </span>
        <div>
          <b style={{ fontSize: 15 }}>{t("assistant")} · Sahayak</b>
          <p className="sub" style={{ margin: 0, fontSize: 12 }}>{t("asst_sub")}</p>
        </div>
      </div>
      <div className="chat">
        <div className="msgs" ref={boxRef} role="log" aria-live="polite" aria-relevant="additions">
          {msgs.map((m, i) => (
            <div key={i} className={"bub " + (m.r === "bot" ? "bot" : "me")} role={m.r === "bot" ? "status" : undefined}>
              {m.x}
            </div>
          ))}
          {busy && (
            <div className="bub bot" aria-busy="true">
              <div className="typing"><i /><i /><i /></div>
            </div>
          )}
        </div>
        <div className="chatbar">
          {supported && (
            <button
              type="button"
              className={"mic-btn " + (listening ? "active" : "")}
              onClick={toggleMic}
              aria-pressed={listening}
              aria-label={t("mic")}
              title={listening ? t("voice_listen") : t("voice_tap")}
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("type_here")}
            aria-label={t("assistant")}
          />
          <button type="button" className="btn ink" style={{ padding: "10px 16px" }} onClick={() => send()} disabled={busy}>
            <SendHorizonal size={15} aria-hidden="true" /> {t("send")}
          </button>
        </div>
      </div>
      <div className="quick">
        <button type="button" className="btn ghost" onClick={() => send(t("asked"))}>{t("asked")}</button>
        <button type="button" className="btn ghost" onClick={() => send(t("how_apply"))}>{t("how_apply")}</button>
      </div>
    </div>
  );
}
