/** Certifiable document types — UI catalogue (simulation only). */
import {
  CreditCard, FileBadge, Home, Accessibility, Utensils, ScrollText,
} from "lucide-react";

export const DOC_TYPES = [
  {
    id: "aadhaar",
    Icon: CreditCard,
    color: "#1b2440",
    schemes: ["oap", "wid", "div", "kny", "kis", "nfsa", "pmay"],
  },
  {
    id: "income",
    Icon: ScrollText,
    color: "#bf7d0a",
    schemes: ["oap", "wid", "div", "kny", "nfsa", "pmay"],
  },
  {
    id: "caste",
    Icon: FileBadge,
    color: "#6b4c9a",
    schemes: ["pmay", "nfsa"],
  },
  {
    id: "residence",
    Icon: Home,
    color: "#1f7a5a",
    schemes: ["pmay", "nfsa", "wid"],
  },
  {
    id: "disability",
    Icon: Accessibility,
    color: "#2563eb",
    schemes: ["div"],
  },
  {
    id: "ration",
    Icon: Utensils,
    color: "#c0392b",
    schemes: ["nfsa"],
  },
];

/** Localized labels — keyed for t() fallback via docTypes helper */
export const DOC_LABELS = {
  aadhaar: {
    hi: "आधार (सिम्युलेटेड)", en: "Aadhaar (simulated)",
    desc_hi: "पहचान प्रमाण — UIDAI प्रारूप (नकली नमूना)",
    desc_en: "Identity proof — UIDAI-style specimen (mock)",
    example_hi: "नाम, जन्मतिथि, पता, 12-अंकीय ID",
    example_en: "Name, DOB, address, 12-digit ID",
  },
  income: {
    hi: "आय प्रमाण पत्र", en: "Income certificate",
    desc_hi: "तहसीलदार/SDM द्वारा जारी वार्षिक आय",
    desc_en: "Annual income issued by Tehsildar/SDM",
    example_hi: "DOC-ID, नाम, ज़िला, वार्षिक आय ₹",
    example_en: "DOC-ID, name, district, annual income ₹",
  },
  caste: {
    hi: "जाति प्रमाण पत्र", en: "Caste certificate",
    desc_hi: "अनुसूचित/पिछड़ा/सामान्य वर्ग प्रमाण",
    desc_en: "SC/ST/OBC/General category proof",
    example_hi: "जाति, उपजाति, जारीकर्ता मुहर",
    example_en: "Caste, sub-caste, issuing authority seal",
  },
  residence: {
    hi: "निवास प्रमाण", en: "Residence proof",
    desc_hi: "ग्राम/prabhag में निवास की पुष्टि",
    desc_en: "Proof of residence in village/ward",
    example_hi: "पता, ज़िला, प्रधान/नगर निगम हस्ताक्षर",
    example_en: "Address, district, pradhan/municipal sign",
  },
  disability: {
    hi: "दिव्यांग प्रमाण पत्र", en: "Disability certificate",
    desc_hi: "चिकित्सा बोर्ड द्वारा विकलांगता प्रतिशत",
    desc_en: "Disability % from medical board",
    example_hi: "प्रतिशत, प्रकार, UDID नंबर (नकली)",
    example_en: "Percentage, type, UDID number (mock)",
  },
  ration: {
    hi: "राशन कार्ड (NFSA)", en: "Ration card (NFSA)",
    desc_hi: "खाद्य सुरक्षा कार्ड — APL/BPL/AAY",
    desc_en: "Food security card — APL/BPL/AAY",
    example_hi: "परिवार ID, सदस्य, श्रेणी",
    example_en: "Family ID, members, category",
  },
};

export function docLabel(type, loc, field = "hi") {
  const L = DOC_LABELS[type];
  if (!L) return type;
  if (field === "name") return loc === "en" ? L.en : L.hi;
  if (field === "desc") return loc === "en" ? L.desc_en : L.desc_hi;
  if (field === "example") return loc === "en" ? L.example_en : L.example_hi;
  return L.hi;
}

export function docsForScheme(schemeKey) {
  return DOC_TYPES.filter((d) => d.schemes.includes(schemeKey));
}
