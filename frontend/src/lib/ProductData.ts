// ─── Types ───────────────────────────────────────────────────────
export type Product = {
  id: number;
  name: string;
  variety: string;
  image?: string; // URL — leave empty for emoji fallback
  shortDesc: string;
  fullDesc: string;
  germination?: string;
  npkRatio?: string;
  season?: string;
  maturity?: string;
  seedRate?: string;
  dosage?: string;
  packagingSizes: string[];
  suitableCrops: string[];
  tags: string[];
  keyBenefits: string[];
  sowingInstructions?: string;
  applicationMethod?: string;
};

export type SubCategory = {
  id: string;
  label: string;
  icon: string;
  description: string;
  products: Product[];
};

export type Category = {
  id: string;
  label: string;
  tagline: string;
  icon: string;
  accent: string;
  subCategories: SubCategory[];
};

// ─── Storage ─────────────────────────────────────────────────────
export const STORAGE_KEY = "ranup_products_data";

export function getStoredData(): Category[] {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: Category[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("ranup-products-updated"));
}

export function resetData(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("ranup-products-updated"));
}

// ─── Default Data ────────────────────────────────────────────────
export const DEFAULT_DATA: Category[] = [
  {
    id: "vegetable-seeds",
    label: "Vegetable Seeds",
    tagline: "Certified F1 hybrids & open-pollinated varieties",
    icon: "🥦",
    accent: "#4d7d1a",
    subCategories: [
      {
        id: "tomato",
        label: "Tomato",
        icon: "🍅",
        description: "Round, cherry, and roma types for fresh market and processing.",
        products: [
          {
            id: 1,
            name: "Arka Rakshak F1",
            variety: "Indeterminate · Round",
            image: "",
            shortDesc: "Triple-disease resistant hybrid with 60–80 t/ha potential.",
            fullDesc:
              "Arka Rakshak F1 is India's first triple-disease resistant tomato hybrid, carrying resistance to Tomato Leaf Curl Virus (ToLCV), Tobacco Streak Virus (TSV), and early blight simultaneously. Fruits are round, firm, and deep-red with a thick pericarp (7–8 mm) ensuring a shelf life of 12–14 days.",
            germination: "94%",
            season: "Year Round",
            maturity: "65–70 days",
            seedRate: "150–200 g/acre",
            packagingSizes: ["10 g", "50 g", "100 g"],
            suitableCrops: ["Open field", "Polyhouse", "Shade net"],
            tags: ["Triple Disease Resistant", "F1 Hybrid", "Long Shelf Life"],
            keyBenefits: [
              "Resistant to ToLCV, TSV, and early blight",
              "Firm fruits — shelf life 12–14 days",
              "Yield potential 60–80 t/ha",
              "Suitable for fresh market and processing",
            ],
            sowingInstructions:
              "Raise in pro-trays with cocopeat. Transplant 25-day seedlings at 60 × 45 cm. Stake at 30 cm. Use drip irrigation with fertigation schedule.",
          },
          {
            id: 2,
            name: "NS 524",
            variety: "Semi-determinate · Oval",
            image: "",
            shortDesc: "High brix oval tomato preferred by sauce and ketchup processors.",
            fullDesc:
              "NS 524 is a semi-determinate processing tomato with concentrated fruit set ideal for once-over mechanical harvest. Fruits are oval, firm, with a high brix value (5.5–6.0°Bx). Plant has strong disease tolerance to Fusarium crown rot and Verticillium wilt.",
            germination: "93%",
            season: "Rabi · Summer",
            maturity: "70–75 days",
            seedRate: "150 g/acre",
            packagingSizes: ["10 g", "50 g"],
            suitableCrops: ["Open field", "Processing farms"],
            tags: ["Processing Grade", "High Brix", "Wilt Tolerant"],
            keyBenefits: [
              "Brix 5.5–6.0° — premium processing value",
              "Concentrated set — suited for mechanical harvest",
              "Fusarium and Verticillium wilt tolerant",
              "Thick flesh — low water content",
            ],
            sowingInstructions:
              "Transplant 25-day seedlings at 90 × 30 cm. Apply 120:80:80 kg NPK/ha. Withhold irrigation 7–10 days before harvest.",
          },
          {
            id: 3,
            name: "Sungold Cherry",
            variety: "Indeterminate · Cherry",
            image: "",
            shortDesc: "Golden cherry tomato with exceptional sweetness for premium retail.",
            fullDesc:
              "Sungold Cherry produces clusters of golden-orange cherry tomatoes (12–15 g each) with a brix of 8–10°. The indeterminate plant produces continuously over 5–6 months under polyhouse conditions.",
            germination: "92%",
            season: "Year Round (Polyhouse)",
            maturity: "55–60 days",
            seedRate: "80–100 g/acre",
            packagingSizes: ["5 g", "10 g"],
            suitableCrops: ["Polyhouse", "Shade net"],
            tags: ["Cherry Type", "High Brix", "Premium Export"],
            keyBenefits: [
              "Brix 8–10° — exceptional sweetness",
              "Continuous harvest 5–6 months",
              "High-value retail and export segment",
              "Attractive golden-orange colour",
            ],
            sowingInstructions:
              "Grow in polyhouse. Train to single stem. Space at 50 × 40 cm. Use high-K fertigation during fruiting.",
          },
        ],
      },
      {
        id: "brinjal",
        label: "Brinjal",
        icon: "🍆",
        description: "Long, round, and cluster types suited to all Indian markets.",
        products: [
          {
            id: 4,
            name: "Arka Nidhi F1",
            variety: "Long Purple · Hybrid",
            image: "",
            shortDesc: "Vigorous long-purple hybrid with continuous fruit set over 5 months.",
            fullDesc:
              "Arka Nidhi is a prolific long-purple brinjal hybrid from IIHR with fruits measuring 25–30 cm. The glossy, firm fruits carry the characteristic purple shine preferred in North Indian wholesale markets. The plant produces continuously for 4–5 months.",
            germination: "92%",
            season: "Year Round",
            maturity: "55–60 days",
            seedRate: "100–150 g/acre",
            packagingSizes: ["10 g", "50 g"],
            suitableCrops: ["Open field", "Shade net"],
            tags: ["F1 Hybrid", "Long Purple", "High Yield"],
            keyBenefits: [
              "Continuous harvest for 4–5 months",
              "Glossy finish — premium wholesale appeal",
              "Field tolerance to Phomopsis blight",
              "Good heat tolerance",
            ],
            sowingInstructions:
              "Transplant 30-day seedlings at 60 × 60 cm. Mulching recommended. Apply 150:75:75 kg NPK/ha.",
          },
          {
            id: 5,
            name: "Pusa Purple Cluster",
            variety: "Cluster · Small Round",
            image: "",
            shortDesc: "High-density cluster brinjal ideal for small-fruit markets.",
            fullDesc:
              "Pusa Purple Cluster produces clusters of 4–6 small round fruits (30–40 g each) per node. Popular in markets that prefer small round brinjal for stuffed preparations. Early bearing with field tolerance to bacterial wilt.",
            germination: "90%",
            season: "Kharif · Rabi",
            maturity: "50–55 days",
            seedRate: "120 g/acre",
            packagingSizes: ["10 g", "25 g"],
            suitableCrops: ["Open field"],
            tags: ["Cluster Type", "Small Round", "Early Bearing"],
            keyBenefits: [
              "4–6 fruits per node — very high fruit count",
              "Popular for stuffed-brinjal markets",
              "Field tolerance to bacterial wilt",
              "Early bearing — income starts in 50 days",
            ],
            sowingInstructions:
              "Transplant 25–30 day seedlings at 75 × 60 cm. Support stakes needed at 40 cm height.",
          },
        ],
      },
      {
        id: "capsicum",
        label: "Capsicum & Chilli",
        icon: "🫑",
        description: "Block-type capsicum and hot chilli varieties for all segments.",
        products: [
          {
            id: 6,
            name: "Orobelle F1",
            variety: "Block Type · Yellow",
            image: "",
            shortDesc: "Thick-walled yellow capsicum for polyhouse export production.",
            fullDesc:
              "Orobelle is a block-type yellow capsicum with 3–4 lobes, thick flesh (8–9 mm pericarp), and large fruit weight (180–220 g). Achieves 25–30 kg/m² under fertigation.",
            germination: "90%",
            season: "Oct–Mar (Plains) · Year Round (Polyhouse)",
            maturity: "70–75 days",
            seedRate: "80–100 g/acre",
            packagingSizes: ["10 g", "25 g"],
            suitableCrops: ["Polyhouse", "Shade net"],
            tags: ["Block Type", "Export Grade", "Polyhouse"],
            keyBenefits: [
              "Fruit weight 180–220 g — export grade",
              "Thick flesh 8–9 mm — long shelf life",
              "Yield 25–30 kg/m² under polyhouse",
              "Attractive yellow colour — retail premium",
            ],
            sowingInstructions:
              "Train to 2-stem system. Transplant 35-day seedlings at 50 × 40 cm. High-K fertigation from week 6.",
          },
          {
            id: 7,
            name: "Jwala Hot Chilli",
            variety: "Open Pollinated · Finger Type",
            image: "",
            shortDesc: "Traditional finger chilli with high pungency and deep red colour.",
            fullDesc:
              "Jwala is Gujarat's most beloved finger chilli, known for extreme pungency (50,000–60,000 SHU) and thin skin that dries evenly, ideal for chilli powder and export.",
            germination: "89%",
            season: "Kharif",
            maturity: "80–85 days",
            seedRate: "250–300 g/acre",
            packagingSizes: ["50 g", "100 g", "500 g"],
            suitableCrops: ["Open field", "Rainfed"],
            tags: ["High Pungency", "Drying Grade", "OP Variety"],
            keyBenefits: [
              "Pungency 50,000–60,000 SHU",
              "Thin skin — dries uniformly for powder",
              "Tolerant to rainfed conditions",
              "Deep red colour — high market value",
            ],
            sowingInstructions:
              "Transplant 30-day seedlings at 45 × 30 cm. Harvest when 80% fruits turn red.",
          },
        ],
      },
      {
        id: "cucurbits",
        label: "Cucurbits",
        icon: "🥒",
        description: "Cucumber, bitter gourd, bottle gourd, and pumpkin hybrids.",
        products: [
          {
            id: 8,
            name: "Priya F1 Cucumber",
            variety: "Slicing · Dark Green",
            image: "",
            shortDesc: "Gynoecious hybrid cucumber with early, prolific fruit set.",
            fullDesc:
              "Priya F1 is a gynoecious hybrid that sets fruits from the 3rd node. Fruits are dark green, straight (18–20 cm), crisp. Tolerant to powdery mildew and downy mildew.",
            germination: "93%",
            season: "Year Round",
            maturity: "38–42 days",
            seedRate: "200–250 g/acre",
            packagingSizes: ["10 g", "50 g", "100 g"],
            suitableCrops: ["Open field", "Polyhouse", "Shade net"],
            tags: ["Gynoecious", "Early Harvest", "Mildew Tolerant"],
            keyBenefits: [
              "Fruiting from 3rd node — very early harvest",
              "Dark green uniform fruits 18–20 cm",
              "Tolerant to powdery and downy mildew",
              "High yield 25–30 t/ha",
            ],
            sowingInstructions:
              "Direct sow 2 seeds/pit at 90 × 60 cm. Provide trellis support.",
          },
        ],
      },
    ],
  },
  {
    id: "fertilizers",
    label: "Fertilizers",
    tagline: "Balanced nutrition solutions for every crop stage",
    icon: "🧪",
    accent: "#a86b28",
    subCategories: [
      {
        id: "npk",
        label: "NPK Fertilizers",
        icon: "⚗️",
        description: "Balanced macronutrient grades for basal and top-dress application.",
        products: [
          {
            id: 101,
            name: "NPK 19:19:19",
            variety: "Fully Water Soluble · Crystalline",
            image: "",
            shortDesc: "Balanced water-soluble NPK ideal for fertigation and foliar application.",
            fullDesc:
              "NPK 19:19:19 is a fully water-soluble, balanced-grade fertiliser with equal proportions of nitrogen, phosphorus, and potassium. Free from chloride and sodium — safe for sensitive crops. Ideal for drip fertigation and foliar spray at vegetative and early flowering stages.",
            npkRatio: "19 : 19 : 19",
            dosage: "3–5 g/litre (foliar) · 2–5 kg/acre/week (drip)",
            packagingSizes: ["1 kg", "5 kg", "25 kg"],
            suitableCrops: ["All vegetables", "Floriculture", "Fruits", "Plantation crops"],
            tags: ["Water Soluble", "Chloride Free", "Fertigation Grade"],
            keyBenefits: [
              "Balanced N:P:K — supports vegetative growth",
              "100% water soluble — no clogging in drip lines",
              "Chloride and sodium free — safe for all crops",
              "Can be tank-mixed with most pesticides",
            ],
            applicationMethod:
              "Dissolve completely in water before applying through drip or sprayer. Best in morning. Avoid mixing with calcium or magnesium in concentrated form.",
          },
          {
            id: 102,
            name: "NPK 12:61:00",
            variety: "High Phosphorus Grade",
            image: "",
            shortDesc: "High-phosphorus grade to stimulate root development and flowering.",
            fullDesc:
              "NPK 12:61:00 is a high-phosphorus fertiliser for transplanting and early growth stages. Encourages early flowering and fruit set. Low nitrogen prevents excessive vegetative growth.",
            npkRatio: "12 : 61 : 00",
            dosage: "2–3 g/litre (foliar) · 1–2 kg/acre/week (drip)",
            packagingSizes: ["1 kg", "5 kg", "25 kg"],
            suitableCrops: ["Tomato", "Capsicum", "Cucumber", "Pulses", "Cereals"],
            tags: ["High Phosphorus", "Root Development", "Flowering Booster"],
            keyBenefits: [
              "Stimulates root development at transplant",
              "Promotes early and uniform flowering",
              "Low N prevents vegetative excess at flowering",
              "Compatible with most drip systems",
            ],
            applicationMethod:
              "Apply at transplanting and early flowering. Do not mix with calcium, magnesium, or sulphate fertilisers in concentrated solutions.",
          },
          {
            id: 103,
            name: "NPK 00:00:50 (SOP)",
            variety: "Sulphate of Potash · High Potassium",
            image: "",
            shortDesc: "Chloride-free high-potassium for fruit quality, firmness, and shelf life.",
            fullDesc:
              "SOP (00:00:50) is a chloride-free high-potassium fertiliser for fruit enlargement and maturity stages. Improves fruit size, brix, colour, firmness, and shelf life. Also supplies 18% sulphur.",
            npkRatio: "00 : 00 : 50",
            dosage: "3–5 g/litre (foliar) · 2–4 kg/acre/week (drip)",
            packagingSizes: ["1 kg", "5 kg", "25 kg", "50 kg"],
            suitableCrops: ["Tomato", "Capsicum", "Cucumber", "Mango", "Grapes"],
            tags: ["High Potassium", "Fruit Quality", "Chloride Free"],
            keyBenefits: [
              "Improves fruit brix, firmness, and colour",
              "18% sulphur — enhances flavour",
              "Chloride free — safe for sensitive crops",
              "Extends post-harvest shelf life",
            ],
            applicationMethod:
              "Begin at fruit initiation. Apply weekly through drip or fortnightly as foliar. Reduce 10 days before harvest.",
          },
        ],
      },
      {
        id: "micronutrients",
        label: "Micronutrients",
        icon: "🔬",
        description: "Chelated zinc, boron, calcium, and magnesium supplements.",
        products: [
          {
            id: 104,
            name: "Chelated Zinc EDTA 12%",
            variety: "Fully Chelated · Water Soluble",
            image: "",
            shortDesc: "Corrects zinc deficiency for improved grain filling and enzyme activity.",
            fullDesc:
              "Chelated Zinc EDTA 12% remains stable across pH 4–9, ensuring availability in calcareous soils. Corrects zinc deficiency within 7–10 days. Deficiency causes khaira disease in paddy, white bud in maize.",
            npkRatio: "Zn: 12%",
            dosage: "0.5 g/litre (foliar) · 250–500 g/acre (drip)",
            packagingSizes: ["250 g", "500 g", "1 kg", "5 kg"],
            suitableCrops: ["Paddy", "Maize", "All vegetables", "Wheat"],
            tags: ["Chelated", "High pH Stable", "Rapid Correction"],
            keyBenefits: [
              "Stable across pH 4–9 — works in all soils",
              "Corrects deficiency in 7–10 days",
              "Improves enzyme activity and grain filling",
              "Suitable for foliar, soil, and drip application",
            ],
            applicationMethod:
              "For foliar: 0.5 g/litre in morning. For soil: apply through drip. Repeat after 15 days if deficiency persists.",
          },
          {
            id: 105,
            name: "Boron 20% (Solubor)",
            variety: "Solubor · Highly Soluble",
            image: "",
            shortDesc: "Prevents hollow heart, tip burn, and blossom drop.",
            fullDesc:
              "Solubor 20% is the most soluble boron form, dissolving rapidly even in cold water. Critical for cell wall integrity, pollen germination, and sugar transport.",
            npkRatio: "B: 20%",
            dosage: "1–2 g/litre (foliar) · 500 g–1 kg/acre (drip)",
            packagingSizes: ["250 g", "500 g", "1 kg"],
            suitableCrops: ["Cauliflower", "Tomato", "Sunflower", "Cotton", "Fruits"],
            tags: ["High Solubility", "Prevents Flower Drop", "Cell Integrity"],
            keyBenefits: [
              "Prevents blossom drop and fruit set failure",
              "Corrects hollow heart and cracked stem",
              "Highest solubility — no filter clogging",
              "Improves pollen viability",
            ],
            applicationMethod:
              "Apply at pre-flowering and early fruit stage. Do not exceed recommended dose. Avoid hot afternoon application.",
          },
        ],
      },
      {
        id: "bio-fertilizers",
        label: "Bio-Fertilizers",
        icon: "🌿",
        description: "Rhizobium, PSB, Azotobacter and mycorrhiza-based inputs.",
        products: [
          {
            id: 107,
            name: "Rhizobium Culture",
            variety: "Liquid · Crop Specific",
            image: "",
            shortDesc: "Nitrogen-fixing bacteria — reduces urea requirement by 30–40%.",
            fullDesc:
              "Rhizobium forms root nodules in leguminous crops, fixing 100–200 kg N/ha/season. Liquid formulation at 2 × 10⁸ CFU/ml with 6-month shelf life.",
            npkRatio: "N-fixing: up to 200 kg/ha/season",
            dosage: "500 ml/acre (seed treatment or soil drench)",
            packagingSizes: ["250 ml", "500 ml", "1 litre"],
            suitableCrops: ["Soybean", "Chickpea", "Groundnut", "Moong", "Lentil"],
            tags: ["Nitrogen Fixing", "Organic", "Seed Treatment"],
            keyBenefits: [
              "Fixes up to 200 kg N/ha — reduces urea cost",
              "Increases nodulation by 40–60%",
              "Improves root architecture and crop vigour",
              "Compatible with organic farming programs",
            ],
            applicationMethod:
              "Seed treatment: mix 250 ml with 1–2% jaggery solution and coat seeds. Dry in shade 30 min before sowing. Do not expose to direct sunlight.",
          },
          {
            id: 108,
            name: "Mycorrhiza VAM Granules",
            variety: "Vesicular Arbuscular · Granular",
            image: "",
            shortDesc: "Root colonising fungi extending root system for superior nutrient uptake.",
            fullDesc:
              "VAM granules contain Glomus intraradices at 100 IP/g. Colonise plant roots within 2–3 weeks and extend a hyphal network up to 10× root volume.",
            npkRatio: "Spore count: 100 IP/g",
            dosage: "2–4 kg/acre (soil or transplant application)",
            packagingSizes: ["500 g", "1 kg", "5 kg"],
            suitableCrops: ["Vegetables", "Fruits", "Floriculture", "Plantation crops"],
            tags: ["Root Colonising", "Phosphorus Uptake", "Drought Tolerance"],
            keyBenefits: [
              "Extends root volume up to 10× via hyphal network",
              "Improves phosphorus and water uptake",
              "Reduces transplant shock significantly",
              "Improves tolerance to drought",
            ],
            applicationMethod:
              "Mix granules into root zone at transplanting. Do not apply with fungicides — wait 7 days after fungicide use.",
          },
        ],
      },
    ],
  },
];