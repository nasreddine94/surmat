import type { L } from "@/lib/i18n";

export type ApplicationId = "hospitality" | "residential" | "commercial" | "healthcare" | "public" | "outdoor";
export type SurfaceId = "floor" | "wall" | "feature" | "ceiling" | "counter";
export const surfaceIds: SurfaceId[] = ["floor", "wall", "feature", "ceiling", "counter"];

export type Application = {
  id: ApplicationId;
  name: L;
  sub: L;
  scene: L;
  description: L;
  /** Material slug on each surface of the scene. */
  surfaces: Record<SurfaceId, string>;
  /** Alternative materials a specifier would consider per surface. */
  options: Record<SurfaceId, string[]>;
  /** Warm light colour of the scene. */
  light: string;
  keywords: string[];
};

export const applications: Application[] = [
  {
    id: "hospitality",
    name: { en: "Hospitality", fr: "Hôtellerie", ar: "الضيافة" },
    sub: { en: "Hotels · Restaurants", fr: "Hôtels · Restaurants", ar: "فنادق · مطاعم" },
    scene: { en: "Hotel lobby", fr: "Hall d’hôtel", ar: "ردهة فندق" },
    description: {
      en: "Lobbies and restaurants carry heavy traffic and the whole brand at once — stone, large slabs and acoustic control do the work.",
      fr: "Halls et restaurants subissent un trafic intense et portent toute la marque — pierre, grandes dalles et acoustique font le travail.",
      ar: "تتحمّل الردهات والمطاعم حركة كثيفة وتحمل هوية العلامة كاملة — الحجر والألواح الكبيرة والتحكم الصوتي يقومون بالمهمة.",
    },
    surfaces: { floor: "porcelain", wall: "travertine", feature: "marble", ceiling: "acoustic-panels", counter: "onyx" },
    options: {
      floor: ["porcelain", "marble", "terrazzo", "granite"],
      wall: ["travertine", "decorative-plaster", "wall-panels", "limestone"],
      feature: ["marble", "zellige", "onyx", "effect-coatings", "large-format-slabs"],
      ceiling: ["acoustic-panels", "stretch-ceilings", "gypsum-boards"],
      counter: ["onyx", "quartz", "sintered-stone", "marble"],
    },
    light: "#f3c98b",
    keywords: ["hotel", "restaurant", "lobby", "hôtel", "فندق", "مطعم"],
  },
  {
    id: "residential",
    name: { en: "Residential", fr: "Résidentiel", ar: "السكني" },
    sub: { en: "Villas · Apartments", fr: "Villas · Appartements", ar: "فلل · شقق" },
    scene: { en: "Villa living room", fr: "Séjour de villa", ar: "صالون فيلا" },
    description: {
      en: "Homes mix durable floors with softer, warmer walls — and every buyer compares finishes room by room.",
      fr: "Les logements associent sols durables et murs plus chaleureux — chaque acquéreur compare les finitions pièce par pièce.",
      ar: "تجمع المنازل بين أرضيات متينة وجدران أدفأ — وكل مشترٍ يقارن التشطيبات غرفةً بغرفة.",
    },
    surfaces: { floor: "large-format-slabs", wall: "interior-paints", feature: "wall-panels", ceiling: "gypsum-boards", counter: "quartz" },
    options: {
      floor: ["large-format-slabs", "porcelain", "cement-tiles", "microcement"],
      wall: ["interior-paints", "microcement", "decorative-plaster"],
      feature: ["wall-panels", "zellige", "marble", "mouldings"],
      ceiling: ["gypsum-boards", "stretch-ceilings", "mouldings"],
      counter: ["quartz", "sintered-stone", "granite", "marble"],
    },
    light: "#f6dcb0",
    keywords: ["villa", "apartment", "home", "house", "appartement", "maison", "فيلا", "شقة", "منزل"],
  },
  {
    id: "commercial",
    name: { en: "Commercial", fr: "Commercial", ar: "التجاري" },
    sub: { en: "Retail · Offices", fr: "Commerces · Bureaux", ar: "متاجر · مكاتب" },
    scene: { en: "Retail showroom", fr: "Showroom", ar: "صالة عرض" },
    description: {
      en: "Shops and offices change often — finishes must install fast, clean easily and stay on brand.",
      fr: "Commerces et bureaux évoluent souvent — les finitions doivent se poser vite, s’entretenir facilement et rester fidèles à la marque.",
      ar: "تتغيّر المتاجر والمكاتب كثيرًا — يجب أن تُركّب التشطيبات بسرعة وتُنظّف بسهولة وتبقى وفية للعلامة.",
    },
    surfaces: { floor: "resin-epoxy", wall: "microcement", feature: "effect-coatings", ceiling: "suspended-ceilings", counter: "sintered-stone" },
    options: {
      floor: ["resin-epoxy", "porcelain", "terrazzo", "microcement"],
      wall: ["microcement", "interior-paints", "partitions", "wall-panels"],
      feature: ["effect-coatings", "wall-panels", "large-format-slabs", "zellige"],
      ceiling: ["suspended-ceilings", "acoustic-panels", "stretch-ceilings"],
      counter: ["sintered-stone", "quartz", "terrazzo"],
    },
    light: "#e9e4dc",
    keywords: ["retail", "shop", "store", "office", "boutique", "bureau", "متجر", "مكتب"],
  },
  {
    id: "healthcare",
    name: { en: "Healthcare", fr: "Santé", ar: "الصحة" },
    sub: { en: "Hospitals · Clinics", fr: "Hôpitaux · Cliniques", ar: "مستشفيات · عيادات" },
    scene: { en: "Clinic reception", fr: "Accueil de clinique", ar: "استقبال عيادة" },
    description: {
      en: "Hygiene first: seamless floors, cleanable walls and ceilings that keep services accessible.",
      fr: "L’hygiène d’abord : sols sans joints, murs lessivables et plafonds qui gardent les réseaux accessibles.",
      ar: "النظافة أولًا: أرضيات بلا فواصل وجدران قابلة للتنظيف وأسقف تبقي التمديدات في المتناول.",
    },
    surfaces: { floor: "resin-epoxy", wall: "interior-paints", feature: "wall-panels", ceiling: "suspended-ceilings", counter: "quartz" },
    options: {
      floor: ["resin-epoxy", "porcelain", "screeds"],
      wall: ["interior-paints", "ceramic-tiles", "partitions"],
      feature: ["wall-panels", "ceramic-tiles", "large-format-slabs"],
      ceiling: ["suspended-ceilings", "gypsum-boards"],
      counter: ["quartz", "sintered-stone"],
    },
    light: "#eef0ee",
    keywords: ["hospital", "clinic", "hôpital", "clinique", "مستشفى", "عيادة"],
  },
  {
    id: "public",
    name: { en: "Public spaces", fr: "Espaces publics", ar: "الفضاءات العامة" },
    sub: { en: "Education · Government", fr: "Éducation · Administration", ar: "تعليم · إدارة" },
    scene: { en: "Public hall", fr: "Hall public", ar: "قاعة عامة" },
    description: {
      en: "Airports, ministries, universities and stations — surfaces that must last decades under constant use.",
      fr: "Aéroports, ministères, universités et gares — des surfaces qui doivent durer des décennies sous usage constant.",
      ar: "المطارات والوزارات والجامعات والمحطات — أسطح يجب أن تدوم عقودًا تحت استخدام دائم.",
    },
    surfaces: { floor: "granite", wall: "limestone", feature: "terrazzo", ceiling: "acoustic-panels", counter: "granite" },
    options: {
      floor: ["granite", "terrazzo", "porcelain"],
      wall: ["limestone", "large-format-slabs", "exterior-paints"],
      feature: ["terrazzo", "marble", "wall-panels"],
      ceiling: ["acoustic-panels", "suspended-ceilings"],
      counter: ["granite", "sintered-stone"],
    },
    light: "#e4dfd6",
    keywords: ["airport", "school", "university", "government", "aéroport", "école", "مطار", "مدرسة", "جامعة"],
  },
  {
    id: "outdoor",
    name: { en: "Outdoor", fr: "Extérieur", ar: "الخارجي" },
    sub: { en: "Terraces · Landscape", fr: "Terrasses · Paysage", ar: "شرفات · تنسيق" },
    scene: { en: "Terrace & pool", fr: "Terrasse & piscine", ar: "شرفة ومسبح" },
    description: {
      en: "Sun, salt and heat: 20 mm porcelain, stone and waterproofing that survive the climate.",
      fr: "Soleil, sel et chaleur : grès 20 mm, pierre et étanchéité qui résistent au climat.",
      ar: "شمس وملح وحرارة: بورسلين 20 مم وحجر وعزل مائي تصمد أمام المناخ.",
    },
    surfaces: { floor: "outdoor-tiles", wall: "exterior-paints", feature: "mosaic", ceiling: "wall-panels", counter: "travertine" },
    options: {
      floor: ["outdoor-tiles", "travertine", "granite", "limestone"],
      wall: ["exterior-paints", "limestone", "travertine"],
      feature: ["mosaic", "zellige", "travertine"],
      ceiling: ["wall-panels", "exterior-paints"],
      counter: ["travertine", "sintered-stone", "granite"],
    },
    light: "#ffd9a0",
    keywords: ["terrace", "pool", "garden", "landscape", "terrasse", "piscine", "jardin", "مسبح", "حديقة"],
  },
];

export const applicationById = (id: string) => applications.find((a) => a.id === id);
