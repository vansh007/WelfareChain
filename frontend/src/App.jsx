import React, { useCallback, useEffect, useRef, useState } from "react";
import { Landmark, UserRound, MessageSquareHeart, Mic } from "lucide-react";
import { T } from "./i18n.js";
import { api } from "./api.js";
import Logo from "./components/Logo.jsx";
import Landing from "./components/Landing.jsx";
import AccessibilityBar from "./components/AccessibilityBar.jsx";
import VoiceAgent from "./components/VoiceAgent.jsx";
import CitizenFlow from "./components/CitizenFlow.jsx";
import Admin from "./components/Admin.jsx";
import { useSpeech } from "./hooks/useSpeech.js";

export default function App() {
  const [loc, setLoc] = useState("hi");
  const [role, setRole] = useState("citizen");
  const [chain, setChain] = useState("…");
  const [toast, setToast] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [citizenStep, setCitizenStep] = useState("id");
  const [userId, setUserId] = useState(null);
  const mainRef = useRef(null);
  const { speak } = useSpeech(loc);
  const t = T(loc);

  useEffect(() => {
    api.health().then((h) => setChain(h.chain)).catch(() => setChain("offline"));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("large-text", largeText);
    document.body.classList.toggle("high-contrast", highContrast);
    document.body.classList.toggle("on-landing", showLanding);
    document.documentElement.lang = loc === "ur" ? "ur" : loc === "en" ? "en" : "hi";
  }, [largeText, highContrast, showLanding, loc]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 5500);
  };

  const launchApp = () => {
    setShowLanding(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const readAloud = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    const text = el.innerText?.slice(0, 800) || "";
    speak(text);
  }, [speak]);

  const handleNavigate = useCallback((step) => {
    setCitizenStep(step);
    setRole("citizen");
    setShowLanding(false);
  }, []);

  return (
    <div>
      <a href="#main" className="skip-link">{loc === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to main content"}</a>

      <AccessibilityBar
        t={t} loc={loc} setLoc={setLoc}
        largeText={largeText} setLargeText={setLargeText}
        highContrast={highContrast} setHighContrast={setHighContrast}
        onReadAloud={readAloud}
        onOpenVoice={() => setVoiceOpen(true)}
      />

      <header className="top" role="banner">
        <div className="topin">
          <button type="button" className="brand" onClick={() => setShowLanding(true)} aria-label="WelfareChain home">
            <Logo size={42} />
            <span className="brand-text">
              WelfareChain
              <small>{t("tagline")}</small>
            </span>
          </button>
          <span
            className={"chainbadge " + (chain === "live" ? "live" : "")}
            title="Hardhat local EVM status"
            aria-live="polite"
          >
            <Landmark size={13} aria-hidden="true" />
            {chain === "live" ? t("chain_live") : t("chain_sim")}
          </span>
          <span className="spacer" />
          <div className="seg" role="group" aria-label="Role">
            <button type="button" className={role === "citizen" ? "on" : ""} onClick={() => { setRole("citizen"); setShowLanding(false); }}>
              <UserRound size={15} aria-hidden="true" /> {t("citizen")}
            </button>
            <button type="button" className={role === "admin" ? "on" : ""} onClick={() => { setRole("admin"); setShowLanding(false); }}>
              <MessageSquareHeart size={15} aria-hidden="true" /> {t("admin")}
            </button>
          </div>
        </div>
      </header>

      <div className="wrap" id="main" ref={mainRef} tabIndex={-1}>
        {showLanding && role === "citizen" ? (
          <Landing t={t} loc={loc} onLaunch={launchApp} chain={chain} />
        ) : role === "citizen" ? (
          <CitizenFlow
            t={t} loc={loc} showToast={showToast}
            goAdmin={() => setRole("admin")}
            onStepChange={setCitizenStep}
            onUserCreated={setUserId}
            navigateStep={citizenStep}
          />
        ) : (
          <Admin t={t} loc={loc} />
        )}
        <footer role="contentinfo">
          <b>WelfareChain · ICSSR research prototype.</b> {t("footer")}
        </footer>
      </div>

      <VoiceAgent
        t={t} loc={loc} userId={userId}
        open={voiceOpen} onClose={() => setVoiceOpen(false)}
        currentStep={citizenStep}
        onNavigate={handleNavigate}
      />

      {!voiceOpen && (
        <button
          type="button"
          className="voice-fab"
          onClick={() => setVoiceOpen(true)}
          aria-label={t("a11y_voice")}
          title={t("voice_name")}
        >
          <Mic size={24} />
        </button>
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <MessageSquareHeart size={17} color="var(--marigold)" aria-hidden="true" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
