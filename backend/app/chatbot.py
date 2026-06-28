"""Sahayak — the WelfareChain assistant (SRS FR-2.3/2.4, SDD §4.2).
Model-agnostic adapter: tries GEMINI_API_KEY, then GROQ_API_KEY, then a
capable rule-based fallback — so the chatbot is ALWAYS helpful, even with
no API keys configured (resilience requirement R1).
"""
import os
import re

import requests

from .schemes import SCHEMES, SCHEME_BY_KEY, evaluate, eligible_keys

GEMINI_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GROQ_KEY = os.getenv("GROQ_API_KEY", "").strip()

# Locale → display name for LLM prompts; regional UP languages use rule-based fallback primarily
_LOCALE_LANG = {
    "hi": "Hindi",
    "en": "English",
    "bho": "Bhojpuri (eastern UP dialect — reply in simple Bhojpuri mixed Hindi)",
    "awa": "Awadhi (central UP dialect — reply in simple Awadhi mixed Hindi)",
    "ur": "Urdu (UP cities — reply in simple Urdu script if possible, else Roman Urdu)",
}


def _scheme_label(s, locale):
    """Resolve scheme name for locale; fall back hi → en."""
    name = s.get("name") or {}
    return name.get(locale) or name.get("hi") or name.get("en") or s.get("key", "")


def _fmt(n):
    return f"₹{int(n):,}"


def _system_prompt(profile, locale):
    evald = evaluate(profile)
    eligible = [_scheme_label(SCHEME_BY_KEY[e["key"]], locale) for e in evald if e["eligible"]]
    catalogue = [{"name": _scheme_label(s, locale), "amount": s["amount"], "docs": s["docs"]} for s in SCHEMES]
    lang = _LOCALE_LANG.get(locale, "Hindi")
    return (
        f"You are 'Sahayak', the warm, simple assistant of WelfareChain — a SIMULATED welfare "
        f"platform for Uttar Pradesh, India (research prototype, synthetic data only). "
        f"Reply ONLY in {lang}. Maximum 90 words. Use very plain words for low-literacy users. "
        f"Citizen profile: {profile}. Scheme catalogue (illustrative rules): {catalogue}. "
        f"Schemes this citizen qualifies for right now: {eligible or 'none'}. "
        f"Help them understand eligibility, required documents, and how to apply (steps: "
        f"choose scheme -> upload document -> AI verification -> automatic payout to wallet). "
        f"Never invent scheme rules. If asked about something outside welfare, gently redirect. "
        f"Remind users this is a simulation if they ask about real money."
    )


def _try_gemini(system, message):
    url = ("https://generativelanguage.googleapis.com/v1beta/models/"
           f"gemini-1.5-flash:generateContent?key={GEMINI_KEY}")
    body = {"systemInstruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": message}]}],
            "generationConfig": {"maxOutputTokens": 300}}
    r = requests.post(url, json=body, timeout=20)
    r.raise_for_status()
    data = r.json()
    return data["candidates"][0]["content"]["parts"][0]["text"].strip()


def _try_groq(system, message):
    r = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {GROQ_KEY}"},
        json={"model": "llama-3.1-8b-instant", "max_tokens": 300,
              "messages": [{"role": "system", "content": system},
                           {"role": "user", "content": message}]},
        timeout=20)
    r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"].strip()


def _fallback(profile, message, locale):
    msg = (message or "").lower()
    evald = evaluate(profile)
    elig = [e["key"] for e in evald if e["eligible"]]

    def names(keys):
        return ", ".join(_scheme_label(SCHEME_BY_KEY[k], locale) for k in keys)

    # Regional UP language responses (rule-based, always available)
    _REGional = {
        "bho": {
            "apply": ("Apply aasan ba: 1) yojana chuni 2) document upload kari 3) AI check karela "
                      "4) pass hoe tab paisa wallet mein. Simulation ba — real paisa nai."),
            "eligible": lambda n: f"Raua eligible ba: {n}. Yojana naam puchhi ya Apply dabavi.",
            "none": "Abhi koi yojana match nai kail. Aay ya detail check kari.",
        },
        "awa": {
            "apply": ("Apply aasan ba: 1) yojana chunau 2) document upload karau 3) AI janch karela "
                      "4) pass hoe tab paisa wallet mein. Simulation ba."),
            "eligible": lambda n: f"Tohar layak yojana: {n}. Naam puchho ya Apply dabavau.",
            "none": "Abhi koi yojana match nai. Aay check karau.",
        },
        "ur": {
            "apply": ("Apply aasan hai: 1) scheme chunen 2) document upload 3) AI check "
                      "4) pass hone par wallet mein paisa. Yeh simulation hai — real paisa nahi."),
            "eligible": lambda n: f"Aap eligible hain: {n}. Scheme ka naam poochein ya Apply dabayein.",
            "none": "Abhi koi scheme match nahi. Aamdani check karein.",
        },
    }

    if locale in _REGional:
        reg = _REGional[locale]
        if any(w in msg for w in ["how", "apply", "कैसे", "आवेदन", "kaise", "steps"]):
            return reg["apply"]
        if elig:
            return reg["eligible"](names(elig))
        return reg["none"]

    hi = locale == "hi"

    # scheme detail intent
    for s in SCHEMES:
        tokens = [s["name"]["en"].lower(), s["name"]["hi"], s["key"]]
        if any(tok and tok in msg for tok in tokens):
            ok = s["key"] in elig
            label = _scheme_label(s, locale)
            desc = s["desc"].get(locale) or s["desc"]["hi"]
            if hi:
                return (f"{label}: {desc} लाभ {_fmt(s['amount'])}। "
                        f"दस्तावेज़: {', '.join(s['docs'])}। "
                        + ("आप पात्र हैं — 'आवेदन करें' दबाएँ।" if ok else "आप पात्र नहीं दिख रहे।"))
            if locale == "en":
                return (f"{label}: {desc} Benefit {_fmt(s['amount'])}. "
                        f"Docs: {', '.join(s['docs'])}. "
                        + ("You qualify — press Apply." if ok else "You don't appear eligible."))
            return (f"{label}: {desc} {_fmt(s['amount'])}. "
                    + ("Apply dabayein." if ok else "Eligible nahi."))

    # how-to intent
    if any(w in msg for w in ["how", "apply", "कैसे", "आवेदन", "steps", "process", "kaise"]):
        return ("आवेदन: 1) योजना चुनें 2) दस्तावेज़ अपलोड 3) AI जाँच 4) पास होने पर वॉलेट में राशि। सिमुलेशन।"
                if hi else
                "Apply: 1) pick scheme 2) upload doc 3) AI check 4) wallet credit on pass. Simulation.")

    # default: eligibility answer
    if elig:
        if hi:
            return (f"आप इन योजनाओं के पात्र हैं: {names(elig)}। "
                    f"नाम पूछें या 'आवेदन करें' दबाएँ।")
        return f"You qualify for: {names(elig)}. Ask by name or press Apply."
    return ("कोई योजना मेल नहीं खाई। विवरण जाँचें।" if hi
            else "No scheme matched. Check your details.")


def chat(profile: dict, message: str, locale: str = "hi"):
    """Returns {reply, suggested, provider}."""
    system = _system_prompt(profile, locale)
    provider = "fallback"
    reply = None
    if GEMINI_KEY:
        try:
            reply, provider = _try_gemini(system, message), "gemini"
        except Exception:  # noqa: BLE001
            reply = None
    if reply is None and GROQ_KEY:
        try:
            reply, provider = _try_groq(system, message), "groq"
        except Exception:  # noqa: BLE001
            reply = None
    if reply is None:
        reply = _fallback(profile, message, locale)

    return {"reply": reply, "suggested": eligible_keys(profile), "provider": provider}
