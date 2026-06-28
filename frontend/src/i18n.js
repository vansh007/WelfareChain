// Hindi-first multilingual i18n — hi, en + UP regional: Bhojpuri, Awadhi, Urdu (SRS NFR-4)

export const LOCALES = [
  { id: "hi", label: "हिंदी", speech: "hi-IN", native: true },
  { id: "bho", label: "भोजपुरी", speech: "hi-IN", native: true },
  { id: "awa", label: "अवधी", speech: "hi-IN", native: true },
  { id: "ur", label: "اردو", speech: "ur-PK", native: true },
  { id: "en", label: "English", speech: "en-IN", native: false },
];

const _ = (hi, en, bho, awa, ur) => ({ hi, en, bho, awa, ur });

export const STR = {
  tagline: _("पारदर्शी कल्याण वितरण · सिमुलेशन", "Transparent welfare delivery · simulation",
    "पारदर्शी कल्याण वितरण · सिमुलेशन", "पारदर्शी कल्याण वितरण · सिमुलेशन", "شفاف فلاحی تقسیم · simulasyon"),
  citizen: _("नागरिक", "Citizen", "नागरिक", "नागरिक", "شہری"),
  admin: _("प्रशासक", "Administrator", "प्रशासक", "प्रशासक", "منتظم"),
  chain_live: _("ब्लॉकचेन: लाइव", "Blockchain: live", "ब्लॉकचेन: लाइव", "ब्लॉकचेन: लाइव", "بلاک چین: live"),
  chain_sim: _("ब्लॉकचेन: सिमुलेशन", "Blockchain: simulated", "ब्लॉकचेन: सिमुलेशन", "ब्लॉकचेन: सिमुलेशन", "بلاک چین: simulasyon"),

  // landing
  landing_hero: _("एक ही जगह — सभी योजनाएँ, पूरी पारदर्शिता", "One place — every scheme, full transparency",
    "एगो जगह — सब योजना, पूरा पारदर्श", "एक ठौर — सब योजना, पूरा पारदर्श", "ایک جگہ — تمام اسکیمیں، مکمل شفافیت"),
  landing_sub: _(
    "WelfareChain उत्तर प्रदेश के लिए एक सिम्युलेटेड DBT प्लेटफ़ॉर्म है। AI सहायता, ब्लॉकचेन ऑडिट, और आवाज़ से मार्गदर्शन — सभी के लिए सुलभ।",
    "WelfareChain is a simulated DBT platform for Uttar Pradesh. AI assistance, blockchain audit, and voice guidance — accessible to everyone.",
    "WelfareChain उत्तर प्रदेश खातिर सिम्युलेटेड DBT प्लेटफ़ॉर्म बा। AI मदद, ब्लॉकचेन ऑडिट, आवाज़ से राह देखावल — सबके खातिर।",
    "WelfareChain उत्तर प्रदेश खातir simulated DBT platform बा। AI सहाय, blockchain audit, आवाज़ से मार्गदर्शन — सबके लेल।",
    "WelfareChain اتر پردیش کے لیے simulated DBT platform ہے۔ AI مدد، blockchain audit، آواز سے رہنمائی — سب کے لیے۔"
  ),
  launch: _("सिमुलेशन शुरू करें", "Launch simulation", "सिमुलेशन शुरू करीं", "सिमुलेशन शुरू करौ", "simulasyon شروع کریں"),
  landing_problem: _("समस्या", "The problem", "समस्या", "समस्या", "مسئلہ"),
  landing_solution: _("समाधान", "The solution", "समाधान", "समाधान", "حل"),
  prob_1: _("योजना विखंडन — कई पोर्टल", "Scheme fragmentation — many portals", "योजना बिखरल — बहुते पोर्टल", "योजना बिखरल — kaee portal", "اسکیمیں الگ الگ — کئی portals"),
  prob_2: _("धोखाधड़ी और देरी", "Fraud and delays", "धोखाधड़ी आ देरी", "धोखाधड़ी अर देरी", "فراڈ اور تاخیر"),
  prob_3: _("डिजिटल साक्षरता की कमी", "Low digital literacy", "डिजिटल ज्ञान कम", "डिजिटल ज्ञान कम", "ڈیجیٹل literacy کم"),
  sol_1: _("AI + ब्लॉकचेन सत्यापन", "AI + blockchain verification", "AI + blockchain जाँच", "AI + blockchain जाँच", "AI + blockchain verification"),
  sol_2: _("हिंदी · भोजपुरी · अवधी · उर्दू · आवाज़", "Hindi · Bhojpuri · Awadhi · Urdu · voice", "हिंदी · भोजपुरी · अवधी · उर्दू · आवाज़", "हिंदी · भोजपुरी · अवधी · उर्दू · आवाज़", "ہندی · بھوجپوری · اودھی · اردو · آواز"),
  sol_3: _("मानवीय समीक्षा — कोई स्वतः अस्वीकृति नहीं", "Human review — no auto-rejection", "मानव समीक्षा — auto reject नइखे", "मानव समीक्षा — auto reject नाही", "انسانی جائزہ — خودکار مسترد نہیں"),
  stat_schemes: _("योजनाएँ", "Schemes", "योजना", "योजना", "اسکیمیں"),
  stat_langs: _("भाषाएँ", "Languages", "भाषा", "भाषा", "زبانیں"),
  stat_docs: _("दस्तावेज़ प्रकार", "Document types", "document type", "document type", "document types"),
  stat_steps: _("चरण (12→3)", "Steps (12→3)", "चरण (12→3)", "चरण (12→3)", "steps (12→3)"),
  skip_landing: _("छोड़ें", "Skip", "छोड़ीं", "छोड़ौ", "چھوڑیں"),

  // document guide
  doc_guide_h: _("प्रमाणित दस्तावेज़ — उदाहरण", "Certifiable documents — examples",
    "certified document — example", "certified document — example", "certified documents"),
  doc_guide_s: _(
    "AI इन 6 प्रकार के दस्तावेज़ों को सत्यापित कर सकता है। हरे = वैध नमूना, लाल = बदला हुआ (AI पकड़ेगा)।",
    "AI can verify these 6 document types. Green = valid sample, red = tampered (AI will flag).",
    "AI 6 type ke document check karela। green = valid, red = tampered।",
    "AI 6 type ke document check karela। green = valid, red = tampered।",
    "AI 6 types verify karta hai۔ green = valid, red = tampered۔"
  ),
  valid_samples: _("वैध", "valid", "valid", "valid", "valid"),
  tampered_samples: _("बदले", "tampered", "tampered", "tampered", "tampered"),
  valid_tag: _("वैध ✓", "Valid ✓", "valid ✓", "valid ✓", "valid ✓"),
  tampered_tag: _("बदला ⚠", "Tampered ⚠", "tampered ⚠", "tampered ⚠", "tampered ⚠"),
  fields_checked: _("AI क्या जाँचता है", "What AI checks", "AI ka check", "AI ka check", "AI kya check"),
  verify_mini: _("OCR → लेआउट → छेड़छाड़ → सरकारी रिकॉर्ड", "OCR → layout → tamper → gov records",
    "OCR → layout → tamper → record", "OCR → layout → tamper → record", "OCR → layout → tamper → record"),
  example_docs: _("उदाहरण देखें (क्लिक करें)", "See examples (click)", "example dekhi", "example dekho", "examples dekhen"),
  doc_sim_note: _("सभी नमूने सिंथेटिक हैं — कोई असली सरकारी दस्तावेज़ नहीं।", "All samples are synthetic — not real government documents.",
    "sab synthetic sample — real document nai.", "sab synthetic — real document nahi.", "sab synthetic — real nahi."),
  required_docs: _("ज़रूरी दस्तावेज़", "Required documents", "jaruri document", "jaruri document", "required docs"),
  filter_all: _("सभी", "All", "sab", "sab", "sab"),
  filter_valid: _("केवल वैध", "Valid only", "valid", "valid", "valid only"),
  filter_tampered: _("बदले हुए (डेमो)", "Tampered (demo)", "tampered demo", "tampered demo", "tampered demo"),
  selected_doc: _("चयनित दस्तावेज़", "Selected document", "chuni document", "chuna document", "selected"),
  preview_doc: _("बड़ा देखें", "Preview", "preview", "preview", "preview"),
  apply_steps: _("3 आसान चरण", "3 easy steps", "3 step", "3 step", "3 steps"),
  step1: _("1. योजना चुनें", "1. Pick a scheme", "1. yojana", "1. yojana", "1. scheme"),
  step2: _("2. दस्तावेज़ अपलोड", "2. Upload document", "2. document", "2. document", "2. document"),
  step3: _("3. AI + भुगतान", "3. AI + payout", "3. AI payout", "3. AI payout", "3. AI payout"),
  wallet_ready: _("आपका वॉलेट तैयार", "Your wallet is ready", "wallet ready", "wallet ready", "wallet ready"),
  eligible_count: _("पात्र योजनाएँ", "Eligible schemes", "eligible yojana", "eligible yojana", "eligible schemes"),
  tip_assisted: _("सहायता मोड: सुविधाकर्ता आपकी ओर से भर सकता है", "Assisted mode: a facilitator can fill on your behalf",
    "facilitator bhar sakta", "facilitator bhar sakta", "facilitator bhar sakta"),
  use_sample: _("इस नमूने का उपयोग करें", "Use this sample", "ei sample use kari", "ei sample use karau", "ye sample use karein"),
  no_docs_filter: _("इस फ़िल्टर में कोई नमूना नहीं", "No samples for this filter", "koi sample nai", "koi sample nahi", "koi sample nahi"),

  // accessibility toolbar
  a11y_bar: _("सुलभता", "Accessibility", "सुलभता", "सुलभता", "رسائی"),
  a11y_large: _("बड़ा अक्षर", "Large text", "बड़ अक्षर", "बड़ अक्षर", "بڑا متن"),
  a11y_contrast: _("उच्च कंट्रास्ट", "High contrast", "उच्च contrast", "उच्च contrast", "high contrast"),
  a11y_read: _("पढ़कर सुनाएँ", "Read aloud", "पढ़ के सुनावीं", "पढ़ के सुनावौ", "بلند پڑھیں"),
  a11y_voice: _("आवाज़ सहायक", "Voice assistant", "आवाज़ सहायक", "आवाज़ सहायक", "آواز assistant"),

  // voice agent
  voice_name: _("स्वर सहायक", "Swar Sahayak", "स्वर सहायक", "स्वर सहायक", "آواز سahayak"),
  voice_sub: _("बोलकर पूछें — 5 भाषाओं में", "Ask by voice — 5 languages", "बोल के पूछीं — 5 भाषा में", "बोल के पूछौ — 5 भाषा में", "بول کر پوچھیں — 5 زبانیں"),
  voice_listen: _("सुन रहा हूँ…", "Listening…", "सुनत बानी…", "सुनत बानौ…", "سن رہا ہوں…"),
  voice_tap: _("माइक दबाएँ और बोलें", "Tap mic and speak", "माइक dabav aur bolo", "माइक dabav aur bolo", "مائک دبائیں اور بولیں"),
  voice_unsupported: _("आपका ब्राउज़र आवाज़ समर्थन नहीं करता। Chrome आज़माएँ।", "Your browser doesn't support voice. Try Chrome.",
    "Browser आवाज़ support नइखे। Chrome try करीं।", "Browser आवाज़ support नाही। Chrome try करौ।", "Browser voice support نہیں۔ Chrome آزمائیں۔"),
  voice_hint: _("कहें: \"कौन सी योजनाएँ?\" या \"आवेदन कैसे?\"", "Say: \"Which schemes?\" or \"How to apply?\"",
    "कहीं: \"kaun si yojana?\" या \"apply kaise?\"", "कहौ: \"kaun si yojana?\" या \"apply kaise?\"", "کہیں: \"kaun si scheme?\" یا \"apply kaise?\""),

  s_id: _("पहचान", "Identity", "पहचान", "पहचान", "شناخت"),
  s_find: _("योजनाएँ खोजें", "Find schemes", "योजना खोजीं", "योजना खोजौ", "اسکیمیں تلاش"),
  s_apply: _("आवेदन", "Apply", "आवेदन", "आवेदन", "درخواست"),
  s_verify: _("सत्यापन", "Verify", "जाँच", "जाँच", "تصدیق"),
  s_done: _("भुगतान", "Payout", "भुगतान", "भुगतान", "ادائیگی"),

  welcome: _("अपनी डिजिटल पहचान बनाएँ", "Create your digital identity", "अपना digital identity बनावीं", "अपन digital identity बनावौ", "اپنی digital identity بنائیں"),
  welcome_s: _(
    "एक सिम्युलेटेड आधार/जन धन पहचान से आपका वॉलेट बनेगा। कोई असली डेटा उपयोग नहीं होता।",
    "A simulated Aadhaar/Jan Dhan identity creates your wallet. No real data is used.",
    "Simulated Aadhaar/Jan Dhan से wallet बनिह। असली data use नइखे होत।",
    "Simulated Aadhaar/Jan Dhan से wallet बनih। असली data use नाही होत।",
    "Simulated Aadhaar/Jan Dhan سے wallet بنے گا۔ real data use نہیں۔"
  ),
  name: _("नाम", "Name", "नाम", "नाम", "نام"),
  aadhaar: _("आधार संख्या (नकली)", "Aadhaar number (mock)", "आधार नंबर (nakli)", "आधार number (nakli)", "آधار number (mock)"),
  age: _("उम्र", "Age", "उमिर", "उमिर", "عمر"),
  gender: _("लिंग", "Gender", "लिंग", "लिंग", "جنس"),
  female: _("महिला", "Female", "मेहरारू", "मेहरारू", "خاتون"),
  male: _("पुरुष", "Male", "मर्द", "मर्द", "مرد"),
  income: _("वार्षिक आय (₹)", "Annual income (₹)", "सालाना आमदनी (₹)", "सालाना आमदनी (₹)", "سالانہ آمدنی (₹)"),
  occ: _("व्यवसाय", "Occupation", "काम", "काम", "پیشہ"),
  farmer: _("किसान", "Farmer", "कisan", "कisan", "کسان"),
  laborer: _("मज़दूर", "Labourer", "मजदूर", "मजदूर", "مزدور"),
  other: _("अन्य", "Other", "अउर", "अउर", "دیگر"),
  district: _("ज़िला (उ.प्र.)", "District (UP)", "जिला (उ.प्र.)", "जिला (उ.प्र.)", "ضلع (UP)"),
  area: _("क्षेत्र", "Area", "इलाका", "इलाका", "علاقہ"),
  rural: _("ग्रामीण", "Rural", "गाँव", "गाँव", "دیہی"),
  urban: _("शहरी", "Urban", "शहर", "शहर", "شہری"),
  widow: _("विधवा", "Widow", "विधवा", "विधवा", "بیوہ"),
  disabled: _("दिव्यांग", "Disability", "विकलांग", "विकलांग", "معذور"),
  girl: _("घर में बालिका", "Girl child", "घर में लईकी", "घर में लईकी", "گھر میں لڑکی"),
  house: _("मकान", "House type", "घर", "घर", "مکان"),
  pucca: _("पक्का", "Pucca", "पक्का", "पक्का", "پکا"),
  kutcha: _("कच्चा", "Kutcha", "कच्चा", "कच्चा", "کچا"),
  assisted: _("सहायता प्राप्त मोड", "Assisted mode (facilitator)", "सहायता mode", "सहायता mode", "مدد mode"),
  yes: _("हाँ", "Yes", "हाँ", "हाँ", "ہاں"),
  no: _("नहीं", "No", "नइखे", "नाही", "نہیں"),
  create: _("वॉलेट बनाएँ", "Create wallet", "wallet बनावीं", "wallet बनावौ", "wallet بنائیں"),
  creating: _("बन रहा है…", "Creating…", "बनत बा…", "बनत बा…", "بن رہا ہے…"),

  findh: _("आपके लिए योजनाएँ", "Schemes for you", "रउआ खातir योजना", "तोहार लेल योजना", "آپ کے لیے اسکیمیں"),
  finds: _(
    "सहायक से पूछें या सीधे चुनें। पात्र योजनाएँ हरे रंग से चिह्नित हैं।",
    "Ask the assistant or pick directly. Eligible schemes are marked green.",
    "सहायक से पूछीं या सीधे चुनीं। पात्र योजना हरियर रंग में।",
    "सहायक से पूछौ या सीधे चुनौ। पात्र योजना हरियर रंग में।",
    "assistant سے پوچھیں یا براہ راست چنیں۔ eligible سبز رنگ میں۔"
  ),
  eligible: _("पात्र", "Eligible", "पात्र", "पात्र", "اہل"),
  noteli: _("पात्र नहीं", "Not eligible", "पात्र नइखे", "पात्र नाही", "نااہل"),
  why: _("कारण", "Why", "कारण", "कारण", "وجہ"),
  assistant: _("सहायक", "Assistant", "सहायक", "सहायक", "مددگار"),
  asst_sub: _("बहुभाषी AI मार्गदर्शन", "Multilingual AI guidance", "बहुभाषी AI", "बहुभाषी AI", "کثیر لسانی AI"),
  asked: _("मुझे कौन सी योजनाएँ मिल सकती हैं?", "Which schemes can I get?",
    "हमरा kaun si yojana mile?", "हमका kaun si yojana mile?", "mujhe kaun si scheme mile?"),
  how_apply: _("आवेदन कैसे करें?", "How do I apply?", "apply kaise kari?", "apply kaise karau?", "apply kaise karein?"),
  type_here: _("यहाँ लिखें…", "Type here…", "इहाँ likho…", "इहाँ likho…", "یہاں likho…"),
  send: _("भेजें", "Send", "भेजीं", "भेजौ", "بھیجیں"),
  mic: _("माइक", "Mic", "माइक", "माइक", "مائک"),

  applyfor: _("आवेदन करें:", "Apply for:", "apply kari:", "apply karau:", "apply karein:"),
  pickdoc: _("सहायक दस्तावेज़ चुनें", "Choose a supporting document", "document chuni", "document chunau", "document chunen"),
  pickdoc_s: _(
    "ये सिम्युलेटेड नमूने हैं। कुछ में छेड़छाड़ की गई है — AI उन्हें पकड़ता है। अपनी फ़ाइल भी अपलोड कर सकते हैं।",
    "Simulated samples. Some are tampered — the AI catches them. You can upload your own file too.",
    "Simulated sample बा। कुछ में छेड़छाड़ — AI pakad lela। अपन file upload कर सकत बानी।",
    "Simulated sample बा। कुछ में छेड़छाड़ — AI pakad lela। अपन file upload कर सकत बानौ।",
    "Simulated samples۔ کچھ tampered — AI pakad leta۔ apni file upload kar sakte hain۔"
  ),
  upload_own: _("अपनी फ़ाइल अपलोड करें", "Upload your own file", "अपन file upload kari", "अपन file upload karau", "apni file upload karein"),
  startv: _("सत्यापन शुरू करें", "Run verification", "जाँच shuru kari", "जाँच shuru karau", "verification shuru karein"),
  verifying: _("AI सत्यापन पाइपलाइन", "AI verification pipeline", "AI जाँच", "AI जाँच", "AI verification"),
  doc_label: _("दस्तावेज़:", "Document:", "document:", "document:", "document:"),
  v_ocr: _("OCR पाठ निष्कर्षण", "OCR text extraction", "OCR text", "OCR text", "OCR text"),
  v_layout: _("लेआउट समझ", "Layout understanding", "layout check", "layout check", "layout check"),
  v_tamper: _("छेड़छाड़ जाँच", "Tamper / forgery check", "छेड़छाड़ check", "छेड़छाड़ check", "tamper check"),
  v_cross: _("सरकारी रिकॉर्ड मिलान", "Gov records cross-check", "sarkari record match", "sarkari record match", "gov record match"),
  running: _("चल रहा", "running", "chalat", "chalat", "running"),
  conf: _("विश्वास स्कोर", "Confidence score", "confidence", "confidence", "confidence"),
  logged: _("प्रत्येक चरण ब्लॉकचेन पर दर्ज।", "Every stage recorded on the blockchain.", "har step blockchain pe.", "har step blockchain pe.", "har step blockchain pe."),

  flagged: _("मानवीय समीक्षा के लिए भेजा गया", "Sent for human review", "human review pe bhej dihal", "human review pe bhej dihal", "human review ke liye"),
  flagged_s: _(
    "दस्तावेज़ में गड़बड़ी का संकेत। अधिकारी देखेंगे — कोई स्वतः अस्वीकृति नहीं।",
    "Document showed anomalies. An officer will review — no automatic rejection.",
    "Document mein gadbad। officer dekhe — auto reject nai.",
    "Document mein gadbad। officer dekhe — auto reject nahi.",
    "Document mein issue۔ officer dekhega — auto reject nahi۔"
  ),
  reasons: _("AI ने क्या पाया", "What the AI found", "AI ka paya", "AI ka paya", "AI ne kya paya"),
  paid: _("भुगतान हो गया!", "Payout complete!", "paisa mil gail!", "paisa mil gail!", "payment ho gaya!"),
  credited: _("आपके वॉलेट में जमा", "credited to your wallet", "wallet mein jama", "wallet mein jama", "wallet mein jama"),
  wallet_bal: _("वॉलेट शेष", "Wallet balance", "wallet balance", "wallet balance", "wallet balance"),
  again: _("दूसरी योजना के लिए आवेदन", "Apply for another scheme", "aur yojana apply kari", "aur yojana apply karau", "aur scheme apply karein"),
  goadmin: _("प्रशासक डैशबोर्ड", "View admin dashboard", "admin dashboard", "admin dashboard", "admin dashboard"),
  trail: _("ब्लॉकचेन ऑडिट ट्रेल", "Blockchain audit trail", "blockchain trail", "blockchain trail", "blockchain trail"),

  adm_h: _("प्रशासक डैशबोर्ड · उ.प्र.", "Administrator dashboard · UP", "admin · UP", "admin · UP", "admin · UP"),
  adm_s: _("रीयल-टाइम वितरण और पारदर्शिता बही", "Real-time disbursement and transparency ledger", "real-time data", "real-time data", "real-time data"),
  total_disb: _("कुल वितरित", "Total disbursed", "kul disbursed", "kul disbursed", "total disbursed"),
  apps: _("आवेदन", "Applications", "applications", "applications", "applications"),
  appr_rate: _("स्वीकृति दर", "Approval rate", "approval rate", "approval rate", "approval rate"),
  flags: _("धोखाधड़ी फ़्लैग", "Fraud flags", "fraud flags", "fraud flags", "fraud flags"),
  by_district: _("ज़िलेवार वितरण", "Disbursement by district", "jila wise", "jila wise", "district wise"),
  reg_an: _("क्षेत्रीय विश्लेषण", "Regional analytics", "regional", "regional", "regional"),
  no_disb: _("अभी कोई वितरण नहीं।", "No disbursements yet.", "abhi koi disbursement nai.", "abhi koi disbursement nahi.", "abhi koi disbursement nahi."),
  alerts_h: _("विसंगति / धोखाधड़ी अलर्ट", "Anomaly / fraud alerts", "alerts", "alerts", "alerts"),
  alerts_s: _("AI फ़्लैग — मानवीय समीक्षा", "AI-flagged — human review", "AI flag", "AI flag", "AI flag"),
  no_alerts: _("कोई सक्रिय अलर्ट नहीं।", "No active alerts.", "koi alert nai.", "koi alert nahi.", "koi alert nahi."),
  approve: _("स्वीकृत करें", "Approve", "approve kari", "approve karau", "approve karein"),
  reject: _("अस्वीकार करें", "Reject", "reject kari", "reject karau", "reject karein"),
  reason_lbl: _("कारण:", "reason:", "reason:", "reason:", "reason:"),
  ledger_h: _("पारदर्शिता बही · ऑन-चेन", "Transparency ledger · on-chain", "ledger", "ledger", "ledger"),
  ledger_s: _("प्रत्येक कार्रवाई दर्ज", "Every action recorded", "har action recorded", "har action recorded", "har action recorded"),
  cmp_h: _("WelfareChain बनाम DBT", "WelfareChain vs legacy DBT", "WelfareChain vs DBT", "WelfareChain vs DBT", "WelfareChain vs DBT"),
  cmp_s: _("सिम्युलेटेड — अनुमानित", "Simulated — projected", "simulated", "simulated", "simulated"),
  param: _("मापदंड", "Parameter", "parameter", "parameter", "parameter"),
  legacy: _("मौजूदा DBT", "Legacy DBT", "legacy DBT", "legacy DBT", "legacy DBT"),
  refresh: _("ताज़ा करें", "Refresh", "refresh", "refresh", "refresh"),
  back: _("पीछे", "Back", "pichhe", "pichhe", "wapis"),
  smsbox: _("SMS सूचनाएँ", "SMS notifications", "SMS", "SMS", "SMS"),

  // blockchain explorer
  explorer_h: _("ब्लॉकचेन एक्सप्लोरर", "Blockchain explorer", "blockchain explorer", "blockchain explorer", "blockchain explorer"),
  explorer_s: _("Hardhat चेन — ब्लॉक, अनुबंध, इवेंट", "Hardhat chain — blocks, contracts, events",
    "Hardhat chain — block, contract", "Hardhat chain — block, contract", "Hardhat chain — blocks, contracts"),
  chain_mode: _("चेन मोड", "Chain mode", "chain mode", "chain mode", "chain mode"),
  block_num: _("ब्लॉक", "Block", "block", "block", "block"),
  recent_blocks: _("हाल के ब्लॉक", "Recent blocks", "recent blocks", "recent blocks", "recent blocks"),
  chain_events: _("नवीनतम ऑन-चेन इवेंट", "Latest on-chain events", "latest events", "latest events", "latest events"),
  explorer_sim_note: _("Hardhat नode ऑफलाइन — सिमुलेशन मोड। `npm run chain` से चेन शुरू करें।",
    "Hardhat node offline — simulation mode. Start chain with `npm run chain`.",
    "Hardhat offline — simulation mode.", "Hardhat offline — simulation mode.", "Hardhat offline — simulation mode."),
  tx_detail: _("लेन-देन विवरण", "Transaction details", "transaction detail", "transaction detail", "transaction details"),
  tx_not_found: _("लेन-देन नहीं मिला (सिमुलेशन या पुराना हैश)।", "Transaction not found (simulated or stale hash).",
    "transaction nahi mila.", "transaction nahi mila.", "transaction nahi mila."),

  // chat enhancements
  chat_blockchain: _("ब्लॉकचेन कैसे काम करता है?", "How does blockchain work?", "blockchain kaise?", "blockchain kaise?", "blockchain kaise?"),
  chat_docs: _("कौन से दस्तावेज़ चाहिए?", "Which documents are needed?", "kaun document?", "kaun document?", "kaun se documents?"),
  chat_reset: _("बातचीत रीसेट", "Reset conversation", "chat reset", "chat reset", "chat reset"),
  chat_cites: _("संबंधित योजनाएँ:", "Related schemes:", "related yojana:", "related yojana:", "related schemes:"),
  auto_speak: _("स्वतः बोलें", "Auto-speak replies", "auto speak", "auto speak", "auto speak"),
  app_history: _("आपके आवेदन", "Your applications", "aapke application", "tohare application", "aapke applications"),
  ledger_click: _("लेन-देन देखने के लिए क्लिक करें", "Click a row to view transaction", "tx dekhne click kari", "tx dekhne click karau", "tx dekhne click karein"),

  footer: _(
    "सिमुलेशन प्रोटोटाइप · सिंथेटिक डेटा · उ.प्र. · कोई असली आधार/लाभार्थी डेटा नहीं।",
    "Simulation prototype · synthetic data · UP · no real Aadhaar/beneficiary data.",
    "simulation · synthetic data · UP · real data nai.",
    "simulation · synthetic data · UP · real data nahi.",
    "simulation · synthetic data · UP · real data nahi۔"
  ),
};

/** Resolve string for locale; falls back hi → en → key */
export const T = (loc) => (k, rep) => {
  const entry = STR[k];
  let s = entry?.[loc] || entry?.hi || entry?.en || k;
  if (rep) Object.keys(rep).forEach((x) => { s = s.replace("{" + x + "}", rep[x]); });
  return s;
};

export const UP_DISTRICTS = [
  "Lucknow", "Varanasi", "Kanpur", "Ghaziabad", "Ayodhya", "Prayagraj", "Gorakhpur", "Bahraich",
  "Ballia", "Meerut", "Agra", "Aligarh", "Mirzapur", "Jaunpur",
];
export const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

/** Greeting per locale for voice + chatbot */
export const GREET = {
  hi: "नमस्ते! मैं सहायक हूँ। आपकी योजनाओं और आवेदन में मदद करूँगा।",
  en: "Hello! I'm Sahayak. I can help with schemes and how to apply.",
  bho: "प्रणाम! हम सहायक बानी। रउआ के योजना आ apply में madad करब।",
  awa: "राम राम! हम सहायक बानौ। तोहार योजना आ apply में madad करब।",
  ur: "السلام! میں Sahayak ہوں۔ schemes اور apply میں مدد کروں گا۔",
};
