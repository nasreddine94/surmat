import type { L, VocabKey } from "@/lib/i18n";
import type { TexKind } from "@/lib/textures";
import type { SectorId } from "./sectors";
import type { ApplicationId } from "./applications";

export type Material = {
  slug: string;
  sector: SectorId;
  tex: TexKind;
  seed: number;
  name: L;
  summary: L;
  finishes: VocabKey[];
  formats: VocabKey[];
  applications: ApplicationId[];
  /** Typical dimensions or range; language-neutral. */
  spec?: string;
  /** Extra search terms in any language. */
  keywords?: string[];
};

export const materials: Material[] = [
  /* ---------- 01 Ceramic & Porcelain ---------- */
  {
    slug: "porcelain", sector: "ceramic-porcelain", tex: "porcelain", seed: 3,
    name: { en: "Porcelain stoneware", fr: "Grès cérame", ar: "البورسلين الحجري" },
    summary: {
      en: "Dense, low-absorption tile fired above 1,200 °C — the default floor for hotels, homes and retail.",
      fr: "Carreau dense à faible absorption, cuit au-delà de 1 200 °C — le sol par défaut des hôtels, logements et commerces.",
      ar: "بلاط كثيف قليل الامتصاص يُحرق فوق 1200 درجة — الأرضية الأساسية للفنادق والمنازل والمتاجر.",
    },
    finishes: ["matt", "polished", "textured", "antiSlip"], formats: ["tile", "largeFormat", "slab"],
    applications: ["hospitality", "residential", "commercial", "healthcare", "public"],
    spec: "60×60 → 120×280 cm", keywords: ["tile", "floor", "carrelage", "sol", "بلاط", "أرضية", "gres"],
  },
  {
    slug: "large-format-slabs", sector: "ceramic-porcelain", tex: "calacatta", seed: 11,
    name: { en: "Large-format slabs", fr: "Grandes dalles", ar: "البلاطات كبيرة المقاس" },
    summary: {
      en: "Porcelain panels up to 3.2 m long for seamless walls, façades, worktops and furniture.",
      fr: "Panneaux en grès jusqu’à 3,2 m pour murs sans joints, façades, plans de travail et mobilier.",
      ar: "ألواح بورسلين بطول يصل إلى 3.2 م لجدران بلا فواصل وواجهات وأسطح عمل وأثاث.",
    },
    finishes: ["polished", "matt", "satin"], formats: ["slab", "largeFormat"],
    applications: ["hospitality", "residential", "commercial"],
    spec: "160×320 cm · 6–20 mm", keywords: ["slab", "wall", "worktop", "façade", "dalle"],
  },
  {
    slug: "ceramic-tiles", sector: "ceramic-porcelain", tex: "glaze", seed: 2,
    name: { en: "Ceramic wall & floor tiles", fr: "Carreaux céramiques", ar: "البلاط الخزفي" },
    summary: {
      en: "Glazed ceramic in every colour and relief for kitchens, bathrooms and residential floors.",
      fr: "Céramique émaillée en toutes couleurs et reliefs pour cuisines, salles de bains et sols résidentiels.",
      ar: "خزف مزجج بكل الألوان والنقوش للمطابخ والحمامات والأرضيات السكنية.",
    },
    finishes: ["glossy", "matt", "textured"], formats: ["tile"],
    applications: ["residential", "healthcare", "hospitality"],
    spec: "20×20 → 60×120 cm", keywords: ["bathroom", "kitchen", "faience", "faïence", "حمام", "مطبخ"],
  },
  {
    slug: "zellige", sector: "ceramic-porcelain", tex: "zellige", seed: 4,
    name: { en: "Zellige & glazed tiles", fr: "Zellige & carreaux émaillés", ar: "الزليج والبلاط المزجج" },
    summary: {
      en: "Hand-cut glazed terracotta with the irregular surface that catches light — a North African craft in contemporary interiors.",
      fr: "Terre cuite émaillée taillée à la main, à la surface irrégulière qui accroche la lumière — un savoir-faire maghrébin dans l’intérieur contemporain.",
      ar: "طين مزجج مقطوع يدويًا بسطح غير منتظم يلتقط الضوء — حرفة مغاربية في الديكور المعاصر.",
    },
    finishes: ["glossy"], formats: ["tile", "mosaic"],
    applications: ["hospitality", "residential", "commercial"],
    spec: "5×5 → 10×10 cm", keywords: ["zelij", "zellij", "craft", "artisan", "زليج"],
  },
  {
    slug: "mosaic", sector: "ceramic-porcelain", tex: "mosaic", seed: 5,
    name: { en: "Mosaic", fr: "Mosaïque", ar: "الفسيفساء" },
    summary: {
      en: "Glass, stone and ceramic tesserae on mesh for pools, spas and curved surfaces.",
      fr: "Tesselles de verre, pierre et céramique sur trame pour piscines, spas et surfaces courbes.",
      ar: "قطع زجاجية وحجرية وخزفية على شبك للمسابح والمنتجعات والأسطح المنحنية.",
    },
    finishes: ["glossy", "matt"], formats: ["mosaic"],
    applications: ["hospitality", "residential", "outdoor"],
    spec: "30×30 cm sheets", keywords: ["pool", "spa", "piscine", "مسبح"],
  },
  {
    slug: "cement-tiles", sector: "ceramic-porcelain", tex: "cementTile", seed: 6,
    name: { en: "Cement tiles", fr: "Carreaux de ciment", ar: "البلاط الإسمنتي" },
    summary: {
      en: "Pressed, unfired encaustic tiles with inlaid pattern — heritage floors for cafés, riads and homes.",
      fr: "Carreaux pressés non cuits aux motifs incrustés — sols patrimoniaux pour cafés, riads et maisons.",
      ar: "بلاط مضغوط غير محروق بنقوش مطعّمة — أرضيات تراثية للمقاهي والرياضات والمنازل.",
    },
    finishes: ["matt", "honed"], formats: ["tile"],
    applications: ["hospitality", "residential", "commercial"],
    spec: "20×20 cm", keywords: ["encaustic", "pattern", "motif", "carreau", "زخرفة"],
  },
  {
    slug: "terrazzo", sector: "ceramic-porcelain", tex: "terrazzo", seed: 8,
    name: { en: "Terrazzo", fr: "Terrazzo", ar: "التيرازو" },
    summary: {
      en: "Marble and stone chips bound in cement or resin, poured in place or supplied as tiles.",
      fr: "Éclats de marbre et de pierre liés au ciment ou à la résine, coulés en place ou en carreaux.",
      ar: "رقائق رخام وحجر مرتبطة بالإسمنت أو الراتنج، تُصب في الموقع أو تُورّد كبلاط.",
    },
    finishes: ["polished", "honed"], formats: ["tile", "slab"],
    applications: ["public", "commercial", "hospitality"],
    spec: "40×40 → 120×120 cm", keywords: ["granito", "chips", "airport", "مطار"],
  },
  {
    slug: "outdoor-tiles", sector: "ceramic-porcelain", tex: "outdoor", seed: 9,
    name: { en: "Outdoor tiles", fr: "Carrelage extérieur", ar: "البلاط الخارجي" },
    summary: {
      en: "20 mm porcelain for terraces, pool decks and paving — frost-resistant and slip-rated.",
      fr: "Grès de 20 mm pour terrasses, plages de piscine et pavage — ingélif et antidérapant.",
      ar: "بورسلين بسماكة 20 مم للشرفات وحواف المسابح والأرصفة — مقاوم للصقيع والانزلاق.",
    },
    finishes: ["antiSlip", "textured"], formats: ["tile", "largeFormat"],
    applications: ["outdoor", "residential", "hospitality"],
    spec: "60×60 → 60×120 cm · 20 mm", keywords: ["terrace", "exterior", "paving", "terrasse", "extérieur", "خارجي"],
  },

  /* ---------- 02 Natural & Engineered Stone ---------- */
  {
    slug: "marble", sector: "natural-engineered-stone", tex: "marble", seed: 1,
    name: { en: "Marble", fr: "Marbre", ar: "الرخام" },
    summary: {
      en: "Metamorphic limestone with veining that makes every slab unique — lobbies, bathrooms and statement walls.",
      fr: "Calcaire métamorphique dont les veines rendent chaque tranche unique — halls, salles de bains et murs signature.",
      ar: "حجر جيري متحوّل تجعل عروقه كل لوح فريدًا — للردهات والحمامات والجدران المميّزة.",
    },
    finishes: ["polished", "honed", "leather", "brushed"], formats: ["slab", "tile", "block"],
    applications: ["hospitality", "residential", "commercial", "public"],
    spec: "Slabs up to 320×190 cm", keywords: ["stone", "luxury", "lobby", "pierre", "حجر", "فخم"],
  },
  {
    slug: "travertine", sector: "natural-engineered-stone", tex: "travertine", seed: 2,
    name: { en: "Travertine", fr: "Travertin", ar: "الترافرتين" },
    summary: {
      en: "Banded, porous limestone in warm tones — filled and honed for walls, floors and façades.",
      fr: "Calcaire rubané et poreux aux tons chauds — rebouché et adouci pour murs, sols et façades.",
      ar: "حجر جيري متعدد الطبقات ومسامي بألوان دافئة — يُملأ ويُنعّم للجدران والأرضيات والواجهات.",
    },
    finishes: ["honed", "polished", "brushed"], formats: ["slab", "tile"],
    applications: ["hospitality", "residential", "public", "outdoor"],
    spec: "2–3 cm slabs", keywords: ["stone", "warm", "beige", "pierre", "حجر"],
  },
  {
    slug: "granite", sector: "natural-engineered-stone", tex: "granite", seed: 3,
    name: { en: "Granite", fr: "Granit", ar: "الغرانيت" },
    summary: {
      en: "Igneous stone with crystalline grain — the hardest natural surface for heavy traffic, stairs and kitchens.",
      fr: "Roche magmatique au grain cristallin — la surface naturelle la plus dure pour fort trafic, escaliers et cuisines.",
      ar: "صخر ناري ذو حبيبات بلورية — أصلب سطح طبيعي للحركة الكثيفة والسلالم والمطابخ.",
    },
    finishes: ["polished", "flamed", "leather", "bushHammered"], formats: ["slab", "tile", "block"],
    applications: ["public", "commercial", "outdoor", "residential"],
    spec: "2–3 cm slabs", keywords: ["stone", "kitchen", "worktop", "stairs", "pierre", "حجر"],
  },
  {
    slug: "limestone", sector: "natural-engineered-stone", tex: "limestone", seed: 4,
    name: { en: "Limestone", fr: "Pierre calcaire", ar: "الحجر الجيري" },
    summary: {
      en: "Quiet, even stone for façades, cladding and calm interiors.",
      fr: "Pierre calme et homogène pour façades, bardages et intérieurs sereins.",
      ar: "حجر هادئ ومتجانس للواجهات والتكسية والديكورات الهادئة.",
    },
    finishes: ["honed", "bushHammered", "brushed"], formats: ["slab", "tile", "block"],
    applications: ["public", "residential", "outdoor"],
    spec: "2–5 cm", keywords: ["façade", "cladding", "stone", "pierre", "واجهة"],
  },
  {
    slug: "onyx", sector: "natural-engineered-stone", tex: "onyx", seed: 5,
    name: { en: "Onyx", fr: "Onyx", ar: "الأونيكس" },
    summary: {
      en: "Translucent banded stone, often backlit for bars, receptions and feature walls.",
      fr: "Pierre rubanée translucide, souvent rétroéclairée pour bars, accueils et murs signature.",
      ar: "حجر شفاف متموّج، يُضاء غالبًا من الخلف للبارات والاستقبالات والجدران المميّزة.",
    },
    finishes: ["polished"], formats: ["slab"],
    applications: ["hospitality", "commercial"],
    spec: "Book-matched slabs", keywords: ["backlit", "luxury", "reception", "فخم"],
  },
  {
    slug: "quartz", sector: "natural-engineered-stone", tex: "quartz", seed: 6,
    name: { en: "Quartz surfaces", fr: "Quartz", ar: "أسطح الكوارتز" },
    summary: {
      en: "Engineered quartz with consistent colour and low porosity for worktops and vanities.",
      fr: "Quartz reconstitué à la teinte régulière et faible porosité pour plans de travail et vasques.",
      ar: "كوارتز مُصنّع بلون ثابت ومسامية منخفضة لأسطح المطابخ والمغاسل.",
    },
    finishes: ["polished", "matt"], formats: ["slab"],
    applications: ["residential", "healthcare", "commercial"],
    spec: "306×140 cm", keywords: ["engineered", "worktop", "kitchen", "counter", "plan de travail", "مطبخ"],
  },
  {
    slug: "sintered-stone", sector: "natural-engineered-stone", tex: "sintered", seed: 7,
    name: { en: "Sintered stone", fr: "Pierre frittée", ar: "الحجر الملبّد" },
    summary: {
      en: "Minerals compacted under heat and pressure into ultra-thin, heat- and scratch-resistant slabs.",
      fr: "Minéraux compactés sous chaleur et pression en dalles ultra-fines, résistantes à la chaleur et aux rayures.",
      ar: "معادن مضغوطة بالحرارة والضغط في ألواح رقيقة جدًا تقاوم الحرارة والخدش.",
    },
    finishes: ["matt", "polished", "textured"], formats: ["slab", "largeFormat"],
    applications: ["residential", "commercial", "outdoor"],
    spec: "320×160 cm · 6–20 mm", keywords: ["engineered", "worktop", "façade", "ultra compact"],
  },

  /* ---------- 03 Paints, Coatings & Decorative Finishes ---------- */
  {
    slug: "interior-paints", sector: "paints-coatings", tex: "paint", seed: 5,
    name: { en: "Interior paints", fr: "Peintures intérieures", ar: "الدهانات الداخلية" },
    summary: {
      en: "Washable, low-VOC emulsions and enamels for walls, ceilings and joinery.",
      fr: "Émulsions et laques lessivables à faible COV pour murs, plafonds et menuiseries.",
      ar: "دهانات مستحلبة وورنيش قابلة للغسل ومنخفضة المركبات العضوية للجدران والأسقف والنجارة.",
    },
    finishes: ["matt", "satin", "velvet", "glossy"], formats: ["liquid"],
    applications: ["residential", "healthcare", "commercial", "public"],
    keywords: ["colour", "color", "wall", "peinture", "دهان", "لون"],
  },
  {
    slug: "exterior-paints", sector: "paints-coatings", tex: "facade", seed: 3,
    name: { en: "Façade paints & renders", fr: "Peintures & enduits de façade", ar: "دهانات ولياسة الواجهات" },
    summary: {
      en: "Weather- and UV-resistant coatings for the heat, sun and coastal salt of the region.",
      fr: "Revêtements résistants aux intempéries et UV pour la chaleur, le soleil et le sel marin de la région.",
      ar: "طلاءات مقاومة للطقس والأشعة لحرارة المنطقة وشمسها وملوحة سواحلها.",
    },
    finishes: ["matt", "textured"], formats: ["liquid", "paste"],
    applications: ["residential", "public", "commercial", "outdoor"],
    keywords: ["exterior", "façade", "facade", "wall", "واجهة"],
  },
  {
    slug: "microcement", sector: "paints-coatings", tex: "microcement", seed: 2,
    name: { en: "Microcement", fr: "Microciment", ar: "الميكروسمنت" },
    summary: {
      en: "A 2–3 mm cementitious coating that covers floors, walls and showers without a single joint.",
      fr: "Un enduit cimentaire de 2 à 3 mm qui couvre sols, murs et douches sans aucun joint.",
      ar: "طلاء إسمنتي بسماكة 2–3 مم يغطي الأرضيات والجدران والدُّش دون أي فاصل.",
    },
    finishes: ["matt", "satin"], formats: ["powder", "paste"],
    applications: ["residential", "hospitality", "commercial"],
    spec: "2–3 mm", keywords: ["seamless", "concrete", "béton ciré", "continuous", "بدون فواصل"],
  },
  {
    slug: "decorative-plaster", sector: "paints-coatings", tex: "tadelakt", seed: 4,
    name: { en: "Tadelakt & decorative plaster", fr: "Tadelakt & enduits décoratifs", ar: "التادلاكت والجص الزخرفي" },
    summary: {
      en: "Lime plasters burnished to a soft sheen — waterproof tadelakt for hammams and bathrooms, stucco for walls.",
      fr: "Enduits à la chaux lissés jusqu’à un léger lustre — tadelakt étanche pour hammams et salles de bains, stuc pour les murs.",
      ar: "لياسة جيرية مصقولة بلمعان خفيف — تادلاكت مقاوم للماء للحمّامات، وستوكو للجدران.",
    },
    finishes: ["satin", "polished", "textured"], formats: ["paste", "powder"],
    applications: ["hospitality", "residential"],
    keywords: ["stucco", "lime", "chaux", "hammam", "حمام", "جير"],
  },
  {
    slug: "effect-coatings", sector: "paints-coatings", tex: "metallic", seed: 6,
    name: { en: "Effect coatings", fr: "Revêtements à effets", ar: "طلاءات المؤثرات" },
    summary: {
      en: "Metallic, pearl, sand and oxidised finishes for walls that read as material, not colour.",
      fr: "Finitions métallisées, nacrées, sablées ou oxydées pour des murs qui se lisent comme une matière.",
      ar: "تشطيبات معدنية ولؤلؤية ورملية ومؤكسدة لجدران تبدو مادةً لا لونًا.",
    },
    finishes: ["metallic", "textured", "satin"], formats: ["liquid", "paste"],
    applications: ["hospitality", "commercial", "residential"],
    keywords: ["metallic", "decorative", "gold", "rust", "معدني"],
  },
  {
    slug: "resin-epoxy", sector: "paints-coatings", tex: "resin", seed: 3,
    name: { en: "Resin & epoxy floors", fr: "Sols résine & époxy", ar: "أرضيات الراتنج والإيبوكسي" },
    summary: {
      en: "Poured, seamless floors for clinics, showrooms, kitchens and industry — hygienic and chemical-resistant.",
      fr: "Sols coulés sans joints pour cliniques, showrooms, cuisines et industrie — hygiéniques et résistants aux produits chimiques.",
      ar: "أرضيات مصبوبة بلا فواصل للعيادات وصالات العرض والمطابخ والصناعة — صحية ومقاومة للكيماويات.",
    },
    finishes: ["glossy", "satin", "antiSlip"], formats: ["liquid"],
    applications: ["healthcare", "commercial", "public"],
    keywords: ["seamless", "hygienic", "industrial", "floor", "hospital", "sol", "أرضية", "مستشفى"],
  },

  /* ---------- 04 Interior Finishing Systems ---------- */
  {
    slug: "gypsum-boards", sector: "interior-finishing-systems", tex: "gypsum", seed: 1,
    name: { en: "Gypsum boards", fr: "Plaques de plâtre", ar: "ألواح الجبس" },
    summary: {
      en: "Standard, moisture-, fire- and impact-rated boards for walls, linings and ceilings.",
      fr: "Plaques standard, hydrofuges, coupe-feu et haute dureté pour cloisons, doublages et plafonds.",
      ar: "ألواح قياسية ومقاومة للرطوبة والحريق والصدمات للجدران والتكسية والأسقف.",
    },
    finishes: ["raw"], formats: ["board"],
    applications: ["residential", "commercial", "healthcare", "public", "hospitality"],
    spec: "120×250 cm · 12.5 mm", keywords: ["plasterboard", "placo", "drywall", "BA13", "جبس"],
  },
  {
    slug: "suspended-ceilings", sector: "interior-finishing-systems", tex: "ceilingGrid", seed: 2,
    name: { en: "Suspended ceilings", fr: "Plafonds suspendus", ar: "الأسقف المعلقة" },
    summary: {
      en: "Grid and tile ceilings that hide services and keep them accessible in offices, schools and clinics.",
      fr: "Plafonds à ossature et dalles qui dissimulent les réseaux tout en les gardant accessibles.",
      ar: "أسقف بشبكة وبلاطات تخفي التمديدات وتبقيها قابلة للوصول في المكاتب والمدارس والعيادات.",
    },
    finishes: ["matt"], formats: ["tile", "module"],
    applications: ["commercial", "healthcare", "public"],
    spec: "60×60 cm", keywords: ["ceiling", "false ceiling", "faux plafond", "سقف"],
  },
  {
    slug: "acoustic-panels", sector: "interior-finishing-systems", tex: "acoustic", seed: 3,
    name: { en: "Acoustic panels", fr: "Panneaux acoustiques", ar: "الألواح الصوتية" },
    summary: {
      en: "Slatted and felt-backed panels that absorb sound in restaurants, offices and auditoriums.",
      fr: "Panneaux à lames sur feutre qui absorbent le son dans les restaurants, bureaux et auditoriums.",
      ar: "ألواح شرائحية بظهر لبادي تمتص الصوت في المطاعم والمكاتب والقاعات.",
    },
    finishes: ["matt", "raw"], formats: ["panel"],
    applications: ["commercial", "hospitality", "public"],
    spec: "60×240 cm", keywords: ["sound", "acoustic", "slats", "wood", "bois", "صوت"],
  },
  {
    slug: "wall-panels", sector: "interior-finishing-systems", tex: "woodSlats", seed: 4,
    name: { en: "Decorative wall panels", fr: "Panneaux muraux décoratifs", ar: "الألواح الجدارية الزخرفية" },
    summary: {
      en: "Timber, veneer, fluted and 3D panels that give walls rhythm and warmth.",
      fr: "Panneaux bois, placage, cannelés et 3D qui donnent rythme et chaleur aux murs.",
      ar: "ألواح خشبية وقشرية ومخدّدة وثلاثية الأبعاد تمنح الجدران إيقاعًا ودفئًا.",
    },
    finishes: ["raw", "satin"], formats: ["panel"],
    applications: ["hospitality", "residential", "commercial"],
    keywords: ["wood", "fluted", "cladding", "bois", "خشب"],
  },
  {
    slug: "partitions", sector: "interior-finishing-systems", tex: "partition", seed: 5,
    name: { en: "Partition systems", fr: "Cloisons", ar: "أنظمة الفواصل" },
    summary: {
      en: "Glazed and solid demountable partitions for offices, clinics and flexible floor plates.",
      fr: "Cloisons vitrées et pleines démontables pour bureaux, cliniques et plateaux flexibles.",
      ar: "فواصل زجاجية وصلبة قابلة للفك للمكاتب والعيادات والمساحات المرنة.",
    },
    finishes: ["raw", "glossy"], formats: ["module", "panel"],
    applications: ["commercial", "healthcare"],
    keywords: ["glass", "office", "verre", "bureau", "زجاج", "مكتب"],
  },
  {
    slug: "mouldings", sector: "interior-finishing-systems", tex: "moulding", seed: 6,
    name: { en: "Mouldings & profiles", fr: "Moulures & profilés", ar: "الكرانيش والمقاطع" },
    summary: {
      en: "Cornices, skirting, panel mouldings and trims in plaster, PU and aluminium.",
      fr: "Corniches, plinthes, moulures et profilés en plâtre, PU et aluminium.",
      ar: "كرانيش ووزرات وإطارات ومقاطع من الجبس والبولي يوريثان والألمنيوم.",
    },
    finishes: ["raw", "satin"], formats: ["panel"],
    applications: ["residential", "hospitality"],
    keywords: ["cornice", "corniche", "plinthe", "skirting", "كرنيش"],
  },
  {
    slug: "stretch-ceilings", sector: "interior-finishing-systems", tex: "stretch", seed: 7,
    name: { en: "Stretch ceilings", fr: "Plafonds tendus", ar: "الأسقف المشدودة" },
    summary: {
      en: "PVC and fabric membranes tensioned wall to wall — gloss, matt, printed or backlit.",
      fr: "Membranes PVC ou textiles tendues de mur à mur — laquées, mates, imprimées ou rétroéclairées.",
      ar: "أغشية PVC أو قماشية مشدودة من جدار إلى جدار — لامعة أو مطفية أو مطبوعة أو مضاءة.",
    },
    finishes: ["glossy", "matt"], formats: ["roll"],
    applications: ["residential", "commercial", "hospitality"],
    keywords: ["ceiling", "backlit", "plafond", "سقف"],
  },

  /* ---------- 05 Construction Chemicals ---------- */
  {
    slug: "tile-adhesives", sector: "construction-chemicals", tex: "adhesive", seed: 1,
    name: { en: "Tile adhesives", fr: "Colles à carrelage", ar: "لواصق البلاط" },
    summary: {
      en: "C1 to C2S2 cementitious adhesives rated for large formats, heat and deformation.",
      fr: "Mortiers-colles C1 à C2S2 adaptés aux grands formats, à la chaleur et à la déformation.",
      ar: "لواصق إسمنتية من C1 إلى C2S2 مناسبة للمقاسات الكبيرة والحرارة والتشوّه.",
    },
    finishes: ["raw"], formats: ["powder", "paste"],
    applications: ["residential", "commercial", "public", "hospitality", "outdoor"],
    spec: "25 kg bags", keywords: ["glue", "colle", "installation", "لاصق"],
  },
  {
    slug: "grouts", sector: "construction-chemicals", tex: "grout", seed: 2,
    name: { en: "Grouts", fr: "Joints", ar: "مواد الترويب" },
    summary: {
      en: "Cementitious and epoxy grouts in matched colours, stain- and mould-resistant.",
      fr: "Joints cimentaires et époxy aux teintes assorties, anti-taches et anti-moisissures.",
      ar: "مواد ترويب إسمنتية وإيبوكسية بألوان متناسقة، مقاومة للبقع والعفن.",
    },
    finishes: ["raw"], formats: ["powder", "paste"],
    applications: ["residential", "healthcare", "hospitality"],
    keywords: ["joint", "epoxy", "ترويب"],
  },
  {
    slug: "screeds", sector: "construction-chemicals", tex: "screed", seed: 3,
    name: { en: "Screeds & self-levelling", fr: "Chapes & ragréages", ar: "طبقات التسوية" },
    summary: {
      en: "Flat, fast-curing bases that make every floor finish possible.",
      fr: "Supports plans à séchage rapide qui rendent possible chaque revêtement de sol.",
      ar: "طبقات مستوية سريعة الجفاف تجعل كل تشطيب أرضي ممكنًا.",
    },
    finishes: ["raw"], formats: ["powder"],
    applications: ["residential", "commercial", "public", "healthcare"],
    keywords: ["floor", "levelling", "ragréage", "chape", "تسوية"],
  },
  {
    slug: "waterproofing", sector: "construction-chemicals", tex: "membrane", seed: 4,
    name: { en: "Waterproofing & membranes", fr: "Étanchéité & membranes", ar: "العزل المائي والأغشية" },
    summary: {
      en: "Bituminous, liquid and cementitious systems for roofs, basements, wet rooms and pools.",
      fr: "Systèmes bitumineux, liquides et cimentaires pour toitures, sous-sols, pièces humides et piscines.",
      ar: "أنظمة بيتومينية وسائلة وإسمنتية للأسطح والأقبية والغرف الرطبة والمسابح.",
    },
    finishes: ["raw"], formats: ["roll", "liquid"],
    applications: ["residential", "public", "outdoor", "hospitality"],
    keywords: ["waterproof", "roof", "étanchéité", "toiture", "عزل", "سطح"],
  },
  {
    slug: "sealants", sector: "construction-chemicals", tex: "powder", seed: 5,
    name: { en: "Sealants & primers", fr: "Mastics & primaires", ar: "مواد الإحكام والبرايمر" },
    summary: {
      en: "Silicone, PU and hybrid sealants with primers that prepare every substrate.",
      fr: "Mastics silicone, PU et hybrides avec primaires adaptés à chaque support.",
      ar: "مواد إحكام سيليكونية وبولي يوريثان وهجينة مع برايمر يهيّئ كل سطح.",
    },
    finishes: ["raw"], formats: ["cartridge", "liquid"],
    applications: ["residential", "commercial", "public"],
    keywords: ["silicone", "mastic", "joint", "primer", "سيليكون"],
  },
  {
    slug: "mortars", sector: "construction-chemicals", tex: "powder", seed: 9,
    name: { en: "Mortars & renders", fr: "Mortiers & enduits", ar: "الملاط واللياسة" },
    summary: {
      en: "Ready-mixed masonry, repair and render mortars with consistent performance on site.",
      fr: "Mortiers prêts à l’emploi de maçonnerie, réparation et enduit, constants sur chantier.",
      ar: "ملاط جاهز للبناء والترميم واللياسة بأداء ثابت في الموقع.",
    },
    finishes: ["raw"], formats: ["powder"],
    applications: ["residential", "public", "commercial"],
    keywords: ["mortar", "mortier", "enduit", "ملاط"],
  },

  /* ---------- 06 Processing Equipment & Technologies ---------- */
  {
    slug: "cnc-waterjet", sector: "surface-technologies", tex: "metal", seed: 1,
    name: { en: "CNC & waterjet cutting", fr: "Découpe CNC & jet d’eau", ar: "القطع الرقمي وبالماء" },
    summary: {
      en: "Bridge saws, 5-axis CNC and waterjets that turn blocks and slabs into finished pieces.",
      fr: "Débiteuses, CNC 5 axes et jets d’eau qui transforment blocs et tranches en pièces finies.",
      ar: "مناشير جسرية وآلات تحكم رقمي خماسية المحاور وقطع بالماء تحوّل الكتل والألواح إلى قطع جاهزة.",
    },
    finishes: ["raw"], formats: ["machine"],
    applications: ["commercial"],
    keywords: ["machine", "cutting", "saw", "découpe", "آلة", "قطع"],
  },
  {
    slug: "polishing", sector: "surface-technologies", tex: "perforated", seed: 2,
    name: { en: "Polishing & grinding", fr: "Polissage & ponçage", ar: "الصقل والجلخ" },
    summary: {
      en: "Line polishers, calibrators and abrasives for stone, ceramic and terrazzo.",
      fr: "Polisseuses en ligne, calibreuses et abrasifs pour pierre, céramique et terrazzo.",
      ar: "آلات صقل ومعايرة ومواد كاشطة للحجر والخزف والتيرازو.",
    },
    finishes: ["raw"], formats: ["machine"],
    applications: ["commercial"],
    keywords: ["abrasive", "polish", "polissage", "صقل"],
  },
  {
    slug: "ceramic-lines", sector: "surface-technologies", tex: "kiln", seed: 3,
    name: { en: "Ceramic lines & kilns", fr: "Lignes céramiques & fours", ar: "خطوط السيراميك والأفران" },
    summary: {
      en: "Presses, dryers, glazing lines and roller kilns for tile and slab production.",
      fr: "Presses, séchoirs, lignes d’émaillage et fours à rouleaux pour carreaux et dalles.",
      ar: "مكابس ومجففات وخطوط تزجيج وأفران أسطوانية لإنتاج البلاط والألواح.",
    },
    finishes: ["raw"], formats: ["line"],
    applications: ["commercial"],
    keywords: ["kiln", "four", "press", "factory", "usine", "فرن", "مصنع"],
  },
  {
    slug: "digital-decoration", sector: "surface-technologies", tex: "inkjet", seed: 4,
    name: { en: "Digital decoration", fr: "Décoration numérique", ar: "الزخرفة الرقمية" },
    summary: {
      en: "Inkjet printers and ceramic inks that reproduce stone, wood and pattern at production speed.",
      fr: "Imprimantes jet d’encre et encres céramiques qui reproduisent pierre, bois et motifs en production.",
      ar: "طابعات نفث الحبر وأحبار خزفية تعيد إنتاج الحجر والخشب والنقوش بسرعة الإنتاج.",
    },
    finishes: ["raw"], formats: ["machine"],
    applications: ["commercial"],
    keywords: ["inkjet", "printing", "impression", "طباعة"],
  },
  {
    slug: "automation", sector: "surface-technologies", tex: "perforated", seed: 7,
    name: { en: "Handling, automation & packaging", fr: "Manutention, automatisation & emballage", ar: "المناولة والأتمتة والتغليف" },
    summary: {
      en: "Robots, sorting, palletising and quality control at the end of the line.",
      fr: "Robots, tri, palettisation et contrôle qualité en bout de ligne.",
      ar: "روبوتات وفرز وتكديس وضبط جودة في نهاية خط الإنتاج.",
    },
    finishes: ["raw"], formats: ["line", "machine"],
    applications: ["commercial"],
    keywords: ["robot", "packaging", "emballage", "تغليف"],
  },
  {
    slug: "raw-materials", sector: "surface-technologies", tex: "pigment", seed: 5,
    name: { en: "Raw materials & glazes", fr: "Matières premières & émaux", ar: "المواد الخام والمينا" },
    summary: {
      en: "Clays, feldspars, frits, pigments and glazes — the inputs of every ceramic surface.",
      fr: "Argiles, feldspaths, frittes, pigments et émaux — les intrants de chaque surface céramique.",
      ar: "الطين والفلسبار والفريت والأصباغ والمينا — مدخلات كل سطح خزفي.",
    },
    finishes: ["raw"], formats: ["powder"],
    applications: ["commercial"],
    keywords: ["clay", "argile", "pigment", "glaze", "émail", "طين"],
  },
];

export const materialBySlug = (slug: string) => materials.find((m) => m.slug === slug);
export const materialsBySector = (id: SectorId) => materials.filter((m) => m.sector === id);
