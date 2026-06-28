"""UP scheme catalogue + eligibility engine (SRS FR-2.1, FR-2.3).
RULES ARE ILLUSTRATIVE — simulation only. Swap in real *public* scheme data via
this single module (the DataSource seam, SDD §7.4) when available.
Keys/order must stay in sync with chain/scripts/deploy.js.
"""

SCHEMES = [
    {
        "key": "oap", "icon": "user-round",
        "name": {"en": "Old Age Pension", "hi": "वृद्धावस्था पेंशन"},
        "desc": {"en": "Monthly support for senior citizens (60+).",
                 "hi": "60+ वरिष्ठ नागरिकों के लिए मासिक सहायता।"},
        "amount": 12000, "docs": ["aadhaar", "income"],
    },
    {
        "key": "wid", "icon": "heart-handshake",
        "name": {"en": "Widow Pension", "hi": "विधवा पेंशन"},
        "desc": {"en": "Support for widowed women.", "hi": "विधवा महिलाओं के लिए सहायता।"},
        "amount": 6000, "docs": ["aadhaar", "income"],
    },
    {
        "key": "div", "icon": "accessibility",
        "name": {"en": "Divyangjan Pension", "hi": "दिव्यांगजन पेंशन"},
        "desc": {"en": "Support for persons with disability.", "hi": "दिव्यांग व्यक्तियों के लिए सहायता।"},
        "amount": 12000, "docs": ["aadhaar", "income"],
    },
    {
        "key": "kny", "icon": "baby",
        "name": {"en": "Kanya Sumangala Yojana", "hi": "कन्या सुमंगला योजना"},
        "desc": {"en": "Benefit for families with a girl child.", "hi": "बालिका वाले परिवारों के लिए लाभ।"},
        "amount": 25000, "docs": ["aadhaar", "income"],
    },
    {
        "key": "kis", "icon": "wheat",
        "name": {"en": "PM-KISAN", "hi": "पीएम-किसान"},
        "desc": {"en": "Income support for farmer families.", "hi": "किसान परिवारों के लिए आय सहायता।"},
        "amount": 6000, "docs": ["aadhaar"],
    },
    {
        "key": "nfsa", "icon": "utensils",
        "name": {"en": "Food Subsidy (NFSA)", "hi": "खाद्य सब्सिडी (राशन)"},
        "desc": {"en": "Subsidised foodgrain entitlement.", "hi": "रियायती राशन का अधिकार।"},
        "amount": 6000, "docs": ["aadhaar", "income"],
    },
    {
        "key": "pmay", "icon": "home",
        "name": {"en": "Housing (PMAY-G)", "hi": "आवास योजना (PMAY-G)"},
        "desc": {"en": "Housing assistance for rural kutcha homes.",
                 "hi": "ग्रामीण कच्चे मकान हेतु आवास सहायता।"},
        "amount": 120000, "docs": ["aadhaar", "income"],
    },
]

SCHEME_BY_KEY = {s["key"]: s for s in SCHEMES}


def _r(en, hi):
    return {"en": en, "hi": hi}


def evaluate(profile: dict):
    """Return [{key, eligible, reasons:[{en,hi}...]}] for every scheme."""
    p = profile
    age = int(p.get("age") or 0)
    income = int(p.get("annual_income") or 0)
    out = []

    def add(key, ok, reasons):
        out.append({"key": key, "eligible": ok, "reasons": reasons})

    add("oap", age >= 60 and income <= 120000,
        [_r("Age 60+ required", "आयु 60+ आवश्यक") if age < 60 else _r("Age criterion met", "आयु मानदंड पूर्ण"),
         _r("Income ≤ ₹1,20,000", "आय ≤ ₹1,20,000") if income > 120000 else _r("Income criterion met", "आय मानदंड पूर्ण")])

    add("wid", p.get("gender") == "female" and bool(p.get("is_widow")) and income <= 200000,
        [_r("For widowed women", "विधवा महिलाओं हेतु"),
         _r("Income ≤ ₹2,00,000", "आय ≤ ₹2,00,000")])

    add("div", bool(p.get("is_disabled")) and income <= 120000,
        [_r("Disability status required", "दिव्यांगता स्थिति आवश्यक"),
         _r("Income ≤ ₹1,20,000", "आय ≤ ₹1,20,000")])

    add("kny", bool(p.get("has_girl_child")) and income <= 300000,
        [_r("Family with a girl child", "बालिका वाला परिवार"),
         _r("Income ≤ ₹3,00,000", "आय ≤ ₹3,00,000")])

    add("kis", p.get("occupation") == "farmer" and p.get("area") == "rural",
        [_r("For rural farmer families", "ग्रामीण किसान परिवारों हेतु")])

    add("nfsa", income <= 100000,
        [_r("Income ≤ ₹1,00,000", "आय ≤ ₹1,00,000")])

    add("pmay", p.get("area") == "rural" and p.get("house_type") == "kutcha" and income <= 120000,
        [_r("Rural kutcha house", "ग्रामीण कच्चा मकान"),
         _r("Income ≤ ₹1,20,000", "आय ≤ ₹1,20,000")])

    return out


def eligible_keys(profile: dict):
    return [e["key"] for e in evaluate(profile) if e["eligible"]]
