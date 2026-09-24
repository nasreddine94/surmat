import type { L } from "@/lib/i18n";
import type { EditionId } from "@/lib/editions";
import type { SectorId } from "./sectors";

export type Exhibitor = {
  slug: string;
  name: string;
  /** ISO country code of headquarters. */
  country: string;
  sectors: SectorId[];
  materials: string[];
  editions: EditionId[];
  /** Stand code per edition, e.g. "B-14". The letter is the district hall. */
  stands: Partial<Record<EditionId, string>>;
  blurb: L;
  founded?: number;
  /**
   * Sample profiles demonstrate the showroom layout before real exhibitors
   * are imported from the CMS. They are always labelled in the UI.
   */
  sample: boolean;
};

export const exhibitors: Exhibitor[] = [
  {
    slug: "tassili-stoneworks",
    name: "Tassili Stoneworks",
    country: "DZ",
    sectors: ["natural-engineered-stone"],
    materials: ["marble", "travertine", "limestone", "granite"],
    editions: ["dz", "sn"],
    stands: { dz: "B-04", sn: "B-02" },
    blurb: {
      en: "Quarrying and slab processing of regional marble and limestone, from block to cut-to-size.",
      fr: "Extraction et transformation de marbres et calcaires régionaux, du bloc au débit sur mesure.",
      ar: "استخراج ومعالجة الرخام والحجر الجيري المحلي، من الكتلة إلى القطع حسب المقاس.",
    },
    founded: 1998,
    sample: true,
  },
  {
    slug: "medina-zellige-atelier",
    name: "Médina Zellige Atelier",
    country: "DZ",
    sectors: ["ceramic-porcelain"],
    materials: ["zellige", "cement-tiles", "mosaic"],
    editions: ["dz"],
    stands: { dz: "A-11" },
    blurb: {
      en: "Hand-cut zellige and encaustic cement tiles for hotels, riads and residences.",
      fr: "Zellige taillé main et carreaux de ciment pour hôtels, riads et résidences.",
      ar: "زليج مقطوع يدويًا وبلاط إسمنتي للفنادق والرياضات والمساكن.",
    },
    founded: 2006,
    sample: true,
  },
  {
    slug: "kora-surfaces",
    name: "Kora Surfaces",
    country: "SN",
    sectors: ["ceramic-porcelain", "natural-engineered-stone"],
    materials: ["porcelain", "large-format-slabs", "sintered-stone", "outdoor-tiles"],
    editions: ["sn", "dz"],
    stands: { sn: "A-03", dz: "A-02" },
    blurb: {
      en: "Distributor of porcelain and sintered slabs across West Africa, with stock in Dakar.",
      fr: "Distributeur de grès cérame et de pierre frittée en Afrique de l’Ouest, avec stock à Dakar.",
      ar: "موزّع للبورسلين والحجر الملبّد في غرب أفريقيا، مع مخزون في داكار.",
    },
    founded: 2012,
    sample: true,
  },
  {
    slug: "sahel-coatings",
    name: "Sahel Coatings",
    country: "SN",
    sectors: ["paints-coatings"],
    materials: ["exterior-paints", "interior-paints", "microcement", "effect-coatings"],
    editions: ["sn"],
    stands: { sn: "C-07" },
    blurb: {
      en: "Façade and interior coatings formulated for tropical heat, humidity and coastal salt.",
      fr: "Peintures de façade et d’intérieur formulées pour la chaleur tropicale, l’humidité et le sel marin.",
      ar: "طلاءات للواجهات والداخل مصمّمة لحرارة المناطق الاستوائية ورطوبتها وملوحة السواحل.",
    },
    founded: 2003,
    sample: true,
  },
  {
    slug: "hoggar-interior-systems",
    name: "Hoggar Interior Systems",
    country: "DZ",
    sectors: ["interior-finishing-systems"],
    materials: ["gypsum-boards", "suspended-ceilings", "partitions", "acoustic-panels"],
    editions: ["dz", "sn"],
    stands: { dz: "D-06", sn: "D-01" },
    blurb: {
      en: "Gypsum boards, metal framing and ceiling systems for offices, schools and hospitals.",
      fr: "Plaques de plâtre, ossatures métalliques et plafonds pour bureaux, écoles et hôpitaux.",
      ar: "ألواح جبس وهياكل معدنية وأنظمة أسقف للمكاتب والمدارس والمستشفيات.",
    },
    founded: 2009,
    sample: true,
  },
  {
    slug: "numidia-building-chemicals",
    name: "Numidia Building Chemicals",
    country: "DZ",
    sectors: ["construction-chemicals"],
    materials: ["tile-adhesives", "grouts", "waterproofing", "screeds"],
    editions: ["dz"],
    stands: { dz: "E-02" },
    blurb: {
      en: "Adhesives, grouts and waterproofing systems with on-site technical support for installers.",
      fr: "Colles, joints et systèmes d’étanchéité avec assistance technique sur chantier pour les poseurs.",
      ar: "لواصق ومواد ترويب وأنظمة عزل مائي مع دعم فني في الموقع للمركّبين.",
    },
    founded: 2001,
    sample: true,
  },
  {
    slug: "baobab-wall-studio",
    name: "Baobab Wall Studio",
    country: "SN",
    sectors: ["interior-finishing-systems", "paints-coatings"],
    materials: ["wall-panels", "decorative-plaster", "mouldings"],
    editions: ["sn"],
    stands: { sn: "D-05" },
    blurb: {
      en: "Timber wall panels and lime plasters for hospitality interiors.",
      fr: "Panneaux muraux bois et enduits à la chaux pour l’hôtellerie.",
      ar: "ألواح جدارية خشبية ولياسة جيرية لديكورات الضيافة.",
    },
    founded: 2015,
    sample: true,
  },
  {
    slug: "atlas-line-machinery",
    name: "Atlas Line Machinery",
    country: "IT",
    sectors: ["surface-technologies"],
    materials: ["cnc-waterjet", "polishing", "ceramic-lines", "digital-decoration"],
    editions: ["dz", "sn"],
    stands: { dz: "F-01", sn: "F-01" },
    blurb: {
      en: "Cutting, polishing and inkjet decoration lines for stone and ceramic manufacturers.",
      fr: "Lignes de découpe, polissage et décoration jet d’encre pour fabricants de pierre et céramique.",
      ar: "خطوط قطع وصقل وزخرفة بنفث الحبر لمصنّعي الحجر والخزف.",
    },
    founded: 1987,
    sample: true,
  },
];

export const exhibitorBySlug = (slug: string) => exhibitors.find((e) => e.slug === slug);
export const exhibitorsFor = (edition: EditionId) => exhibitors.filter((e) => e.editions.includes(edition));
