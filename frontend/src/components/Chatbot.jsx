import React, { useEffect, useRef, useState } from "react";
import { BotMessageSquare, SendHorizonal, Mic, MicOff, Sparkles, RotateCcw } from "lucide-react";
import { GREET } from "../i18n.js";
import { fmt } from "../i18n.js";
import { useSpeech } from "../hooks/useSpeech.js";
import { useChat } from "../context/ChatContext.jsx";

const PROVIDER_LABEL = {
  gemini: "Gemini", groq: "Groq", fallback: "Offline", faq: "FAQ",
};

export default function Chatbot({ t, loc, userId, onApplyScheme }) {
  const { messages, ask, reset, lastMeta } = useChat();
  const [val, setVal] = useState("");
  const [busy, setBusy] = useState(false);
  const boxRef = useRef();
  const prevLoc = useRef(loc);
  const { listening, listen, stopListen, speak, supported } = useSpeech(loc);

  useEffect(() => {
    if (prevLoc.current !== loc) {
      reset();
      prevLoc.current = loc;
    }
  }, [loc, reset]);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, busy]);

  const displayMsgs = messages.length
    ? messages
    : [{ role: "assistant", content: GREET[loc] || GREET.hi }];

  const send = async (text) => {
    const q = (text || val).trim();
    if (!q || busy) return;
    setVal("");
    setBusy(true);
    const res = await ask(q);
    if (res?.reply) speak(res.reply);
    setBusy(false);
  };

  const toggleMic = () => {
    if (!supported) return;
    if (listening) { stopListen(); return; }
    listen((transcript) => { if (transcript) send(transcript); });
  };

  const quick = [
    { k: t("asked"), send: t("asked") },
    { k: t("how_apply"), send: t("how_apply") },
    { k: t("chat_blockchain"), send: t("chat_blockchain") },
    { k: t("chat_docs"), send: t("chat_docs") },
  ];

  const provider = lastMeta?.provider || "fallback";

  return (
    <div className="card chatcard" aria-label={t("assistant")}>
      <div className="chathead">
        <span className="ico" style={{ width: 36, height: 36, background: "var(--ink)", color: "var(--marigold)" }}>
          <BotMessageSquare size={18} aria-hidden="true" />
        </span>
        <div style={{ flex: 1 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <b style={{ fontSize: 15 }}>{t("assistant")} · Sahayak</b>
            <span className="provider-badge">{PROVIDER_LABEL[provider] || provider}</span>
          </div>
          <p className="sub" style={{ margin: 0, fontSize: 12 }}>{t("asst_sub")}</p>
        </div>
        <button type="button" className="icon-btn-sm" onClick={reset} title={t("chat_reset")}>
          <RotateCcw size={14} />
        </button>
      </div>
      <div className="chat">
        <div className="msgs" ref={boxRef} role="log" aria-live="polite">
          {displayMsgs.map((m, i) => (
            <div key={i}>
              <div className={"bub " + (m.role === "user" ? "me" : "bot")}>{m.content}</div>
              {m.citations?.length > 0 && (
                <div className="citations">
                  <Sparkles size={11} /> {t("chat_cites")}
                  {m.citations.map((c) => (
                    <button key={c.key} type="button" className="cite-chip"
                      onClick={() => onApplyScheme?.(c.key)}>
                      {c.name} · {fmt(c.amount)}
                    </button>
                  ))}
                </div>
              )}
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
            <button type="button" className={"mic-btn " + (listening ? "active" : "")}
              onClick={toggleMic} aria-pressed={listening} aria-label={t("mic")}>
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
          <input value={val} onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()} placeholder={t("type_here")}
            aria-label={t("assistant")} />
          <button type="button" className="btn ink" style={{ padding: "10px 16px" }}
            onClick={() => send()} disabled={busy}>
            <SendHorizonal size={15} /> {t("send")}
          </button>
        </div>
      </div>
      <div className="quick">
        {quick.map((q) => (
          <button key={q.k} type="button" className="btn ghost" onClick={() => send(q.send)}>{q.k}</button>
        ))}
      </div>
    </div>
  );
}
