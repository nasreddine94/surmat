import type { L } from "@/lib/i18n";
import type { TexKind } from "@/lib/textures";

export type SectorId =
  | "ceramic-porcelain"
  | "natural-engineered-stone"
  | "paints-coatings"
  | "interior-finishing-systems"
  | "construction-chemicals"
  | "surface-technologies";

export type Sector = {
  id: SectorId;
  /** Hall order on the exhibition floor. */
  order: number;
  name: L;
  short: L;
  description: L;
  /** Contextual exhibitor pitch — the site acting as a sales representative. */
  pitch: L;
  /** Floating CTA label on pages in this sector. */
  ctaLabel: L;
  accent: string;
  tex: TexKind;
  seed: number;
};

export const sectors: Sector[] = [
  {
    id: "ceramic-porcelain",
    order: 1,
    name: { en: "Ceramic & Porcelain", fr: "Céramique & Porcelaine", ar: "السيراميك والبورسلين" },
    short: { en: "Ceramic", fr: "Céramique", ar: "السيراميك" },
    description: {
      en: "Porcelain stoneware, large-format slabs, zellige, mosaic, cement tiles and terrazzo — the surfaces that cover most floors and walls in the region.",
      fr: "Grès cérame, grandes dalles, zellige, mosaïque, carreaux de ciment et terrazzo — les surfaces qui couvrent la plupart des sols et murs de la région.",
      ar: "البورسلين الحجري والبلاطات الكبيرة والزليج والفسيفساء والبلاط الإسمنتي والتيرازو — الأسطح التي تغطي معظم أرضيات وجدران المنطقة.",
    },
    pitch: {
      en: "Showcase your ceramic collections to architects, developers and buyers.",
      fr: "Présentez vos collections céramiques aux architectes, promoteurs et acheteurs.",
      ar: "اعرض مجموعاتك الخزفية أمام المهندسين المعماريين والمطورين والمشترين.",
    },
    ctaLabel: { en: "Show your ceramics at SURMAT", fr: "Exposez votre céramique au SURMAT", ar: "اعرض خزفك في سورمات" },
    accent: "#c3cfd2",
    tex: "porcelain",
    seed: 3,
  },
  {
    id: "natural-engineered-stone",
    order: 2,
    name: { en: "Natural & Engineered Stone", fr: "Pierre naturelle & reconstituée", ar: "الحجر الطبيعي والمُصنّع" },
    short: { en: "Stone", fr: "Pierre", ar: "الحجر" },
    description: {
      en: "Marble, granite, travertine, limestone, onyx, quartz and sintered stone — from quarry block to finished slab.",
      fr: "Marbre, granit, travertin, calcaire, onyx, quartz et pierre frittée — du bloc de carrière à la tranche finie.",
      ar: "الرخام والغرانيت والترافرتين والحجر الجيري والأونيكس والكوارتز والحجر الملبّد — من كتلة المحجر إلى اللوح الجاهز.",
    },
    pitch: {
      en: "Present your stone portfolio at the region’s surface materials exhibition.",
      fr: "Présentez votre portefeuille de pierres au salon des matériaux de surface de la région.",
      ar: "قدّم مجموعة أحجارك في معرض مواد الأسطح في المنطقة.",
    },
    ctaLabel: { en: "Show your stone at SURMAT", fr: "Exposez votre pierre au SURMAT", ar: "اعرض أحجارك في سورمات" },
    accent: "#bfa684",
    tex: "calacatta",
    seed: 7,
  },
  {
    id: "paints-coatings",
    order: 3,
    name: { en: "Paints, Coatings & Decorative Finishes", fr: "Peintures, revêtements & finitions décoratives", ar: "الدهانات والطلاءات والتشطيبات الزخرفية" },
    short: { en: "Paint & finishes", fr: "Peintures & finitions", ar: "الدهانات" },
    description: {
      en: "Interior and façade paints, microcement, tadelakt, decorative plasters, effect coatings and resin floors.",
      fr: "Peintures intérieures et de façade, microciment, tadelakt, enduits décoratifs, revêtements à effets et sols résine.",
      ar: "دهانات داخلية وللواجهات، ميكروسمنت، تادلاكت، جص زخرفي، طلاءات مؤثرات وأرضيات راتنج.",
    },
    pitch: {
      en: "Demonstrate your finishing systems to contractors and specifiers.",
      fr: "Démontrez vos systèmes de finition aux entreprises et prescripteurs.",
      ar: "اعرض أنظمة التشطيب لديك أمام المقاولين وواضعي المواصفات.",
    },
    ctaLabel: { en: "Show your finishes at SURMAT", fr: "Exposez vos finitions au SURMAT", ar: "اعرض تشطيباتك في سورمات" },
    accent: "#6f9a8b",
    tex: "paint",
    seed: 5,
  },
  {
    id: "interior-finishing-systems",
    order: 4,
    name: { en: "Interior Finishing Systems", fr: "Systèmes de finition intérieure", ar: "أنظمة التشطيب الداخلي" },
    short: { en: "Interior systems", fr: "Second œuvre", ar: "التشطيب الداخلي" },
    description: {
      en: "Gypsum boards, suspended and acoustic ceilings, wall panels, partitions, mouldings and stretch ceilings.",
      fr: "Plaques de plâtre, plafonds suspendus et acoustiques, panneaux muraux, cloisons, moulures et plafonds tendus.",
      ar: "ألواح الجبس والأسقف المعلقة والصوتية والألواح الجدارية والفواصل والكرانيش والأسقف المشدودة.",
    },
    pitch: {
      en: "Put your ceilings, partitions and wall systems in front of the people who specify them.",
      fr: "Présentez vos plafonds, cloisons et systèmes muraux à ceux qui les prescrivent.",
      ar: "ضع أسقفك وفواصلك وأنظمة جدرانك أمام من يحدّدون مواصفاتها.",
    },
    ctaLabel: { en: "Show your systems at SURMAT", fr: "Exposez vos systèmes au SURMAT", ar: "اعرض أنظمتك في سورمات" },
    accent: "#cbb89b",
    tex: "woodSlats",
    seed: 2,
  },
  {
    id: "construction-chemicals",
    order: 5,
    name: { en: "Construction Chemicals", fr: "Chimie du bâtiment", ar: "الكيماويات الإنشائية" },
    short: { en: "Chemicals", fr: "Chimie", ar: "الكيماويات" },
    description: {
      en: "Tile adhesives, grouts, screeds, waterproofing, sealants and mortars — the systems that hold every surface in place.",
      fr: "Colles, joints, chapes, étanchéité, mastics et mortiers — les systèmes qui tiennent chaque surface en place.",
      ar: "لواصق البلاط ومواد الترويب وطبقات التسوية والعزل المائي ومواد الإحكام والملاط — الأنظمة التي تثبّت كل سطح.",
    },
    pitch: {
      en: "Show installers and contractors the systems behind every finished surface.",
      fr: "Montrez aux poseurs et entreprises les systèmes derrière chaque surface finie.",
      ar: "أرِ المركّبين والمقاولين الأنظمة التي تقف خلف كل سطح منجز.",
    },
    ctaLabel: { en: "Show your systems at SURMAT", fr: "Exposez vos solutions au SURMAT", ar: "اعرض حلولك في سورمات" },
    accent: "#a3a58d",
    tex: "adhesive",
    seed: 4,
  },
  {
    id: "surface-technologies",
    order: 6,
    name: { en: "Processing Equipment & Technologies", fr: "Équipements & technologies de transformation", ar: "معدات وتقنيات المعالجة" },
    short: { en: "Technology", fr: "Technologies", ar: "التقنيات" },
    description: {
      en: "CNC and waterjet cutting, polishing, ceramic lines and kilns, digital decoration, handling and raw materials.",
      fr: "Découpe CNC et jet d’eau, polissage, lignes céramiques et fours, décoration numérique, manutention et matières premières.",
      ar: "القطع بالتحكم الرقمي والماء، الصقل، خطوط السيراميك والأفران، الزخرفة الرقمية، المناولة والمواد الخام.",
    },
    pitch: {
      en: "Put your production technology in front of manufacturers.",
      fr: "Présentez vos technologies de production aux fabricants.",
      ar: "ضع تقنيات الإنتاج لديك أمام المصنّعين.",
    },
    ctaLabel: { en: "Show your technology at SURMAT", fr: "Exposez vos technologies au SURMAT", ar: "اعرض تقنياتك في سورمات" },
    accent: "#8e9dab",
    tex: "metal",
    seed: 6,
  },
];

export const sectorById = (id: string) => sectors.find((s) => s.id === id);
