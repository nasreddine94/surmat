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
    name: { en: "Hospitality", fr: "Hôtellerie", ar: "الضيافة", es: "Hostelería", pt: "Hotelaria", it: "Ospitalità", tr: "Konaklama", zh: "酒店餐饮", hi: "आतिथ्य" },
    sub: { en: "Hotels · Restaurants", fr: "Hôtels · Restaurants", ar: "فنادق · مطاعم", es: "Hoteles · Restaurantes", pt: "Hotéis · Restaurantes", it: "Hotel · Ristoranti", tr: "Oteller · Restoranlar", zh: "酒店 · 餐厅", hi: "होटल · रेस्तरां" },
    scene: { en: "Hotel lobby", fr: "Hall d’hôtel", ar: "ردهة فندق", es: "Vestíbulo de hotel", pt: "Lobby de hotel", it: "Hall d’albergo", tr: "Otel lobisi", zh: "酒店大堂", hi: "होटल लॉबी" },
    description: {
      en: "Lobbies and restaurants carry heavy traffic and the whole brand at once — stone, large slabs and acoustic control do the work.",
      fr: "Halls et restaurants subissent un trafic intense et portent toute la marque — pierre, grandes dalles et acoustique font le travail.",
      ar: "تتحمّل الردهات والمطاعم حركة كثيفة وتحمل هوية العلامة كاملة — الحجر والألواح الكبيرة والتحكم الصوتي يقومون بالمهمة.",
      es: "Vestíbulos y restaurantes soportan un tráfico intenso y toda la imagen de marca a la vez — la piedra, las grandes placas y el control acústico hacen el trabajo.",
      pt: "Lobbies e restaurantes suportam tráfego intenso e toda a imagem da marca ao mesmo tempo — pedra, grandes placas e controlo acústico fazem o trabalho.",
      it: "Hall e ristoranti sopportano traffico intenso e portano l’intera immagine del marchio — pietra, grandi lastre e controllo acustico fanno il lavoro.",
      tr: "Lobiler ve restoranlar yoğun trafiği ve markanın tüm imajını aynı anda taşır — doğal taş, büyük plakalar ve akustik kontrol işi görür.",
      zh: "大堂和餐厅承受大量人流，同时承载整个品牌形象——石材、大板和声学控制各司其职。",
      hi: "लॉबी और रेस्तरां भारी आवाजाही और पूरे ब्रांड की छवि एक साथ उठाते हैं — पत्थर, बड़े स्लैब और ध्वनि नियंत्रण यह काम करते हैं।",
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
    name: { en: "Residential", fr: "Résidentiel", ar: "السكني", es: "Residencial", pt: "Residencial", it: "Residenziale", tr: "Konut", zh: "住宅", hi: "आवासीय" },
    sub: { en: "Villas · Apartments", fr: "Villas · Appartements", ar: "فلل · شقق", es: "Villas · Apartamentos", pt: "Moradias · Apartamentos", it: "Ville · Appartamenti", tr: "Villalar · Daireler", zh: "别墅 · 公寓", hi: "विला · अपार्टमेंट" },
    scene: { en: "Villa living room", fr: "Séjour de villa", ar: "صالون فيلا", es: "Salón de villa", pt: "Sala de estar de moradia", it: "Soggiorno di villa", tr: "Villa oturma odası", zh: "别墅客厅", hi: "विला बैठक कक्ष" },
    description: {
      en: "Homes mix durable floors with softer, warmer walls — and every buyer compares finishes room by room.",
      fr: "Les logements associent sols durables et murs plus chaleureux — chaque acquéreur compare les finitions pièce par pièce.",
      ar: "تجمع المنازل بين أرضيات متينة وجدران أدفأ — وكل مشترٍ يقارن التشطيبات غرفةً بغرفة.",
      es: "Las viviendas combinan suelos resistentes con paredes más cálidas — y cada comprador compara los acabados estancia por estancia.",
      pt: "As casas combinam pavimentos resistentes com paredes mais suaves e acolhedoras — e cada comprador compara os acabamentos divisão a divisão.",
      it: "Le case uniscono pavimenti resistenti a pareti più morbide e calde — e ogni acquirente confronta le finiture stanza per stanza.",
      tr: "Konutlar dayanıklı zeminleri daha yumuşak, sıcak duvarlarla birleştirir — ve her alıcı kaplamaları oda oda karşılaştırır.",
      zh: "住宅将耐用的地面与更柔和温暖的墙面结合——每位买家都会逐个房间比较饰面。",
      hi: "घरों में टिकाऊ फर्श के साथ नरम, गर्म दीवारें होती हैं — और हर खरीदार कमरा-दर-कमरा फिनिश की तुलना करता है।",
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
    name: { en: "Commercial", fr: "Commercial", ar: "التجاري", es: "Comercial", pt: "Comercial", it: "Commerciale", tr: "Ticari", zh: "商业", hi: "वाणिज्यिक" },
    sub: { en: "Retail · Offices", fr: "Commerces · Bureaux", ar: "متاجر · مكاتب", es: "Comercio · Oficinas", pt: "Comércio · Escritórios", it: "Negozi · Uffici", tr: "Perakende · Ofisler", zh: "零售 · 办公", hi: "रिटेल · कार्यालय" },
    scene: { en: "Retail showroom", fr: "Showroom", ar: "صالة عرض", es: "Showroom comercial", pt: "Showroom comercial", it: "Showroom commerciale", tr: "Perakende showroom", zh: "零售展厅", hi: "रिटेल शोरूम" },
    description: {
      en: "Shops and offices change often — finishes must install fast, clean easily and stay on brand.",
      fr: "Commerces et bureaux évoluent souvent — les finitions doivent se poser vite, s’entretenir facilement et rester fidèles à la marque.",
      ar: "تتغيّر المتاجر والمكاتب كثيرًا — يجب أن تُركّب التشطيبات بسرعة وتُنظّف بسهولة وتبقى وفية للعلامة.",
      es: "Tiendas y oficinas cambian a menudo — los acabados deben instalarse rápido, limpiarse con facilidad y mantener la imagen de marca.",
      pt: "Lojas e escritórios mudam com frequência — os acabamentos têm de se instalar depressa, limpar-se facilmente e manter a identidade da marca.",
      it: "Negozi e uffici cambiano spesso — le finiture devono posarsi in fretta, pulirsi facilmente e restare coerenti con il marchio.",
      tr: "Mağazalar ve ofisler sık değişir — kaplamalar hızlı uygulanmalı, kolay temizlenmeli ve marka kimliğini korumalıdır.",
      zh: "商店和办公室经常翻新——饰面必须安装快、易清洁，并始终体现品牌。",
      hi: "दुकानें और कार्यालय अक्सर बदलते हैं — फिनिश जल्दी लगनी चाहिए, आसानी से साफ़ होनी चाहिए और ब्रांड के अनुरूप रहनी चाहिए।",
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
    name: { en: "Healthcare", fr: "Santé", ar: "الصحة", es: "Sanidad", pt: "Saúde", it: "Sanità", tr: "Sağlık", zh: "医疗", hi: "स्वास्थ्य सेवा" },
    sub: { en: "Hospitals · Clinics", fr: "Hôpitaux · Cliniques", ar: "مستشفيات · عيادات", es: "Hospitales · Clínicas", pt: "Hospitais · Clínicas", it: "Ospedali · Cliniche", tr: "Hastaneler · Klinikler", zh: "医院 · 诊所", hi: "अस्पताल · क्लिनिक" },
    scene: { en: "Clinic reception", fr: "Accueil de clinique", ar: "استقبال عيادة", es: "Recepción de clínica", pt: "Receção de clínica", it: "Reception di clinica", tr: "Klinik resepsiyonu", zh: "诊所接待区", hi: "क्लिनिक रिसेप्शन" },
    description: {
      en: "Hygiene first: seamless floors, cleanable walls and ceilings that keep services accessible.",
      fr: "L’hygiène d’abord : sols sans joints, murs lessivables et plafonds qui gardent les réseaux accessibles.",
      ar: "النظافة أولًا: أرضيات بلا فواصل وجدران قابلة للتنظيف وأسقف تبقي التمديدات في المتناول.",
      es: "La higiene primero: suelos continuos, paredes lavables y techos que mantienen las instalaciones accesibles.",
      pt: "Higiene em primeiro lugar: pavimentos contínuos, paredes laváveis e tetos que mantêm as instalações acessíveis.",
      it: "Prima l’igiene: pavimenti continui, pareti lavabili e controsoffitti che lasciano gli impianti accessibili.",
      tr: "Önce hijyen: derzsiz zeminler, temizlenebilir duvarlar ve tesisatı erişilebilir tutan tavanlar.",
      zh: "卫生第一：无缝地面、可清洁墙面，以及便于检修设备的吊顶。",
      hi: "स्वच्छता सबसे पहले: जोड़-रहित फर्श, साफ़ होने योग्य दीवारें और ऐसी छतें जो सेवाओं तक पहुँच बनाए रखें।",
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
    name: { en: "Public spaces", fr: "Espaces publics", ar: "الفضاءات العامة", es: "Espacios públicos", pt: "Espaços públicos", it: "Spazi pubblici", tr: "Kamusal alanlar", zh: "公共空间", hi: "सार्वजनिक स्थान" },
    sub: { en: "Education · Government", fr: "Éducation · Administration", ar: "تعليم · إدارة", es: "Educación · Administración", pt: "Educação · Administração", it: "Istruzione · Pubblica amministrazione", tr: "Eğitim · Kamu", zh: "教育 · 政府", hi: "शिक्षा · सरकार" },
    scene: { en: "Public hall", fr: "Hall public", ar: "قاعة عامة", es: "Vestíbulo público", pt: "Átrio público", it: "Atrio pubblico", tr: "Kamu holü", zh: "公共大厅", hi: "सार्वजनिक हॉल" },
    description: {
      en: "Airports, ministries, universities and stations — surfaces that must last decades under constant use.",
      fr: "Aéroports, ministères, universités et gares — des surfaces qui doivent durer des décennies sous usage constant.",
      ar: "المطارات والوزارات والجامعات والمحطات — أسطح يجب أن تدوم عقودًا تحت استخدام دائم.",
      es: "Aeropuertos, ministerios, universidades y estaciones — superficies que deben durar décadas bajo un uso constante.",
      pt: "Aeroportos, ministérios, universidades e estações — superfícies que têm de durar décadas sob uso constante.",
      it: "Aeroporti, ministeri, università e stazioni — superfici che devono durare decenni sotto un uso costante.",
      tr: "Havalimanları, bakanlıklar, üniversiteler ve istasyonlar — sürekli kullanım altında on yıllarca dayanması gereken yüzeyler.",
      zh: "机场、部委、大学和车站——在持续使用下必须经久数十年的表面。",
      hi: "हवाई अड्डे, मंत्रालय, विश्वविद्यालय और स्टेशन — ऐसी सतहें जिन्हें लगातार उपयोग में दशकों तक टिकना है।",
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
    name: { en: "Outdoor", fr: "Extérieur", ar: "الخارجي", es: "Exterior", pt: "Exterior", it: "Esterni", tr: "Dış mekân", zh: "户外", hi: "बाहरी स्थान" },
    sub: { en: "Terraces · Landscape", fr: "Terrasses · Paysage", ar: "شرفات · تنسيق", es: "Terrazas · Paisajismo", pt: "Terraços · Paisagismo", it: "Terrazze · Paesaggio", tr: "Teraslar · Peyzaj", zh: "露台 · 景观", hi: "टैरेस · लैंडस्केप" },
    scene: { en: "Terrace & pool", fr: "Terrasse & piscine", ar: "شرفة ومسبح", es: "Terraza y piscina", pt: "Terraço e piscina", it: "Terrazza e piscina", tr: "Teras ve havuz", zh: "露台与泳池", hi: "टैरेस और पूल" },
    description: {
      en: "Sun, salt and heat: 20 mm porcelain, stone and waterproofing that survive the climate.",
      fr: "Soleil, sel et chaleur : grès 20 mm, pierre et étanchéité qui résistent au climat.",
      ar: "شمس وملح وحرارة: بورسلين 20 مم وحجر وعزل مائي تصمد أمام المناخ.",
      es: "Sol, sal y calor: porcelánico de 20 mm, piedra e impermeabilización que resisten el clima.",
      pt: "Sol, sal e calor: porcelânico de 20 mm, pedra e impermeabilização que resistem ao clima.",
      it: "Sole, salsedine e calore: gres da 20 mm, pietra e impermeabilizzazioni che resistono al clima.",
      tr: "Güneş, tuz ve sıcak: iklime dayanan 20 mm porselen, doğal taş ve su yalıtımı.",
      zh: "阳光、盐分与高温：能经受气候考验的 20 毫米瓷砖、石材和防水系统。",
      hi: "धूप, नमक और गर्मी: जलवायु को झेलने वाली 20 मिमी पोर्सिलेन, पत्थर और वॉटरप्रूफ़िंग।",
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
