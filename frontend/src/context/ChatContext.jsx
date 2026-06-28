import React, { createContext, useCallback, useContext, useState } from "react";
import { api } from "../api.js";

const ChatContext = createContext(null);

/** Shared conversation memory for Sahayak chatbot + Swar voice agent. */
export function ChatProvider({ children, userId, loc }) {
  const [messages, setMessages] = useState([]);
  const [lastMeta, setLastMeta] = useState(null);

  const ask = useCallback(async (text) => {
    const q = (text || "").trim();
    if (!q) return null;
    let history = [];
    setMessages((m) => {
      history = m.slice(-8).map(({ role, content }) => ({ role, content }));
      return [...m, { role: "user", content: q, ts: Date.now() }];
    });
    try {
      const res = await api.chat(userId || "guest", q, loc, history);
      setMessages((m) => [...m, {
        role: "assistant", content: res.reply, ts: Date.now(),
        provider: res.provider, citations: res.citations || [],
      }]);
      setLastMeta(res);
      return res;
    } catch {
      const err = loc === "hi" ? "क्षमा करें, जवाब नहीं मिला।" : "Sorry, couldn't answer.";
      setMessages((m) => [...m, { role: "assistant", content: err, ts: Date.now() }]);
      return null;
    }
  }, [userId, loc]);

  const reset = useCallback(() => { setMessages([]); setLastMeta(null); }, []);

  const addBot = useCallback((content) => {
    setMessages((m) => [...m, { role: "assistant", content, ts: Date.now() }]);
  }, []);

  const addUser = useCallback((content) => {
    setMessages((m) => [...m, { role: "user", content, ts: Date.now() }]);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, ask, reset, lastMeta, setMessages, addBot, addUser }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) return {
    messages: [], ask: async () => null, reset: () => {}, lastMeta: null,
    addBot: () => {}, addUser: () => {},
  };
  return ctx;
}
