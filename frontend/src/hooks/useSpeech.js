import { useCallback, useEffect, useRef, useState } from "react";

/** Web Speech API helpers — free, browser-native (NFR-4 voice affordances). */
const SR = typeof window !== "undefined"
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

export function speechSupported() {
  return !!(SR && window.speechSynthesis);
}

/** Map WelfareChain locale → BCP-47 for recognition / synthesis. */
export const SPEECH_LANG = {
  hi: "hi-IN",
  en: "en-IN",
  bho: "hi-IN",   // Bhojpuri: no dedicated Web Speech tag; hi-IN closest for UP speech
  awa: "hi-IN",   // Awadhi: same pragmatic fallback
  ur: "ur-PK",    // Urdu (UP cities): ur-PK often available in browsers
};

export function useSpeech(locale = "hi") {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.maxAlternatives = 1;
    recRef.current = r;
    return () => { try { r.abort(); } catch { /* noop */ } };
  }, []);

  const listen = useCallback((onResult, onError) => {
    if (!recRef.current) {
      onError?.("speech_unsupported");
      return;
    }
    const r = recRef.current;
    r.lang = SPEECH_LANG[locale] || "hi-IN";
    r.onresult = (ev) => {
      setListening(false);
      const text = ev.results?.[0]?.[0]?.transcript || "";
      onResult(text.trim());
    };
    r.onerror = () => { setListening(false); onError?.("speech_error"); };
    r.onend = () => setListening(false);
    setListening(true);
    try { r.start(); } catch { setListening(false); onError?.("speech_error"); }
  }, [locale]);

  const stopListen = useCallback(() => {
    try { recRef.current?.stop(); } catch { /* noop */ }
    setListening(false);
  }, []);

  const speak = useCallback((text, lang) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || SPEECH_LANG[locale] || "hi-IN";
    u.rate = locale === "en" ? 0.95 : 0.88;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [locale]);

  const stopSpeak = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { listening, speaking, listen, stopListen, speak, stopSpeak, supported: speechSupported() };
}
