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
    name: { en: "Ceramic & Porcelain", fr: "Céramique & Porcelaine", ar: "السيراميك والبورسلين", es: "Cerámica y porcelánico", pt: "Cerâmica e porcelânico", it: "Ceramica e gres porcellanato", tr: "Seramik ve porselen", zh: "陶瓷与瓷砖", hi: "सिरेमिक और पोर्सिलेन" },
    short: { en: "Ceramic", fr: "Céramique", ar: "السيراميك", es: "Cerámica", pt: "Cerâmica", it: "Ceramica", tr: "Seramik", zh: "陶瓷", hi: "सिरेमिक" },
    description: {
      en: "Porcelain stoneware, large-format slabs, zellige, mosaic, cement tiles and terrazzo — the surfaces that cover most floors and walls in the region.",
      fr: "Grès cérame, grandes dalles, zellige, mosaïque, carreaux de ciment et terrazzo — les surfaces qui couvrent la plupart des sols et murs de la région.",
      ar: "البورسلين الحجري والبلاطات الكبيرة والزليج والفسيفساء والبلاط الإسمنتي والتيرازو — الأسطح التي تغطي معظم أرضيات وجدران المنطقة.",
      es: "Gres porcelánico, placas de gran formato, zellige, mosaico, baldosas hidráulicas y terrazo — las superficies que cubren la mayoría de suelos y paredes de la región.",
      pt: "Grés porcelânico, placas de grande formato, zellige, mosaico, ladrilho hidráulico e terrazzo — as superfícies que cobrem a maior parte dos pavimentos e paredes da região.",
      it: "Gres porcellanato, lastre di grande formato, zellige, mosaico, cementine e terrazzo — le superfici che coprono la maggior parte dei pavimenti e delle pareti della regione.",
      tr: "Porselen karo, büyük ebatlı plakalar, zellige, mozaik, hidrolik çini ve terrazzo — bölgedeki zemin ve duvarların çoğunu kaplayan yüzeyler.",
      zh: "瓷质砖、大规格岩板、zellige、马赛克、水泥花砖和水磨石——覆盖本地区大部分地面和墙面的表面材料。",
      hi: "पोर्सिलेन स्टोनवेयर, बड़े स्लैब, ज़ेलीज, मोज़ेक, सीमेंट टाइलें और टेराज़ो — वे सतहें जो क्षेत्र के अधिकांश फर्श और दीवारें ढकती हैं।",
    },
    pitch: {
      en: "Showcase your ceramic collections to architects, developers and buyers.",
      fr: "Présentez vos collections céramiques aux architectes, promoteurs et acheteurs.",
      ar: "اعرض مجموعاتك الخزفية أمام المهندسين المعماريين والمطورين والمشترين.",
      es: "Muestre sus colecciones cerámicas a arquitectos, promotores y compradores.",
      pt: "Mostre as suas coleções cerâmicas a arquitetos, promotores e compradores.",
      it: "Presentate le vostre collezioni ceramiche ad architetti, sviluppatori e buyer.",
      tr: "Seramik koleksiyonlarınızı mimarlara, geliştiricilere ve alıcılara sergileyin.",
      zh: "向建筑师、开发商和采购商展示您的陶瓷系列。",
      hi: "अपने सिरेमिक संग्रह आर्किटेक्ट, डेवलपर और खरीदारों को दिखाएँ।",
    },
    ctaLabel: { en: "Show your ceramics at SURMAT", fr: "Exposez votre céramique au SURMAT", ar: "اعرض خزفك في سورمات", es: "Exponga su cerámica en SURMAT", pt: "Exponha a sua cerâmica na SURMAT", it: "Esponete la vostra ceramica a SURMAT", tr: "Seramiklerinizi SURMAT’ta sergileyin", zh: "在 SURMAT 展示您的陶瓷", hi: "SURMAT में अपना सिरेमिक प्रदर्शित करें" },
    accent: "#c3cfd2",
    tex: "porcelain",
    seed: 3,
  },
  {
    id: "natural-engineered-stone",
    order: 2,
    name: { en: "Natural Stone & Engineered Surfaces", fr: "Pierre naturelle & surfaces reconstituées", ar: "الحجر الطبيعي والأسطح المُصنّعة", es: "Piedra natural y superficies técnicas", pt: "Pedra natural e superfícies técnicas", it: "Pietra naturale e superfici tecniche", tr: "Doğal taş ve mühendislik yüzeyleri", zh: "天然石材与人造表面", hi: "प्राकृतिक पत्थर और इंजीनियर्ड सतहें" },
    short: { en: "Stone", fr: "Pierre", ar: "الحجر", es: "Piedra", pt: "Pedra", it: "Pietra", tr: "Taş", zh: "石材", hi: "पत्थर" },
    description: {
      en: "Marble, granite, travertine, limestone, onyx, quartz and sintered stone — from quarry block to finished slab.",
      fr: "Marbre, granit, travertin, calcaire, onyx, quartz et pierre frittée — du bloc de carrière à la tranche finie.",
      ar: "الرخام والغرانيت والترافرتين والحجر الجيري والأونيكس والكوارتز والحجر الملبّد — من كتلة المحجر إلى اللوح الجاهز.",
      es: "Mármol, granito, travertino, caliza, ónix, cuarzo y piedra sinterizada — del bloque de cantera a la placa acabada.",
      pt: "Mármore, granito, travertino, calcário, ónix, quartzo e pedra sinterizada — do bloco de pedreira à placa acabada.",
      it: "Marmo, granito, travertino, calcare, onice, quarzo e pietra sinterizzata — dal blocco di cava alla lastra finita.",
      tr: "Mermer, granit, traverten, kireç taşı, oniks, kuvars ve sinterlenmiş taş — ocak bloğundan bitmiş plakaya.",
      zh: "大理石、花岗岩、洞石、石灰石、缟玛瑙、石英石和岩板——从矿山荒料到成品板材。",
      hi: "मार्बल, ग्रेनाइट, ट्रैवर्टीन, लाइमस्टोन, ओनिक्स, क्वार्ट्ज़ और सिंटर्ड स्टोन — खदान के ब्लॉक से तैयार स्लैब तक।",
    },
    pitch: {
      en: "Present your stone portfolio at the region’s surface materials exhibition.",
      fr: "Présentez votre portefeuille de pierres au salon des matériaux de surface de la région.",
      ar: "قدّم مجموعة أحجارك في معرض مواد الأسطح في المنطقة.",
      es: "Presente su catálogo de piedra en la feria de materiales de superficie de la región.",
      pt: "Apresente o seu portefólio de pedra na feira de materiais de superfície da região.",
      it: "Presentate il vostro portfolio di pietre alla fiera dei materiali di superficie della regione.",
      tr: "Taş portföyünüzü bölgenin yüzey malzemeleri fuarında tanıtın.",
      zh: "在本地区的表面材料展上展示您的石材产品。",
      hi: "अपना पत्थर पोर्टफ़ोलियो क्षेत्र की सतह सामग्री प्रदर्शनी में प्रस्तुत करें।",
    },
    ctaLabel: { en: "Show your stone at SURMAT", fr: "Exposez votre pierre au SURMAT", ar: "اعرض أحجارك في سورمات", es: "Exponga su piedra en SURMAT", pt: "Exponha a sua pedra na SURMAT", it: "Esponete la vostra pietra a SURMAT", tr: "Taşlarınızı SURMAT’ta sergileyin", zh: "在 SURMAT 展示您的石材", hi: "SURMAT में अपना पत्थर प्रदर्शित करें" },
    accent: "#bfa684",
    tex: "calacatta",
    seed: 7,
  },
  {
    id: "paints-coatings",
    order: 3,
    name: { en: "Paints, Coatings & Decorative Finishes", fr: "Peintures, revêtements & finitions décoratives", ar: "الدهانات والطلاءات والتشطيبات الزخرفية", es: "Pinturas, revestimientos y acabados decorativos", pt: "Tintas, revestimentos e acabamentos decorativos", it: "Pitture, rivestimenti e finiture decorative", tr: "Boyalar, kaplamalar ve dekoratif bitişler", zh: "涂料、涂层与装饰饰面", hi: "पेंट, कोटिंग्स और सजावटी फिनिश" },
    short: { en: "Paint & finishes", fr: "Peintures & finitions", ar: "الدهانات", es: "Pinturas y acabados", pt: "Tintas e acabamentos", it: "Pitture e finiture", tr: "Boya ve bitişler", zh: "涂料与饰面", hi: "पेंट और फिनिश" },
    description: {
      en: "Interior and façade paints, microcement, tadelakt, decorative plasters, effect coatings and resin floors.",
      fr: "Peintures intérieures et de façade, microciment, tadelakt, enduits décoratifs, revêtements à effets et sols résine.",
      ar: "دهانات داخلية وللواجهات، ميكروسمنت، تادلاكت، جص زخرفي، طلاءات مؤثرات وأرضيات راتنج.",
      es: "Pinturas de interior y fachada, microcemento, tadelakt, revocos decorativos, pinturas de efecto y suelos de resina.",
      pt: "Tintas de interior e fachada, microcimento, tadelakt, rebocos decorativos, tintas de efeito e pavimentos de resina.",
      it: "Pitture per interni e facciate, microcemento, tadelakt, intonaci decorativi, pitture a effetto e pavimenti in resina.",
      tr: "İç ve dış cephe boyaları, mikro beton, tadelakt, dekoratif sıvalar, efekt boyalar ve reçine zeminler.",
      zh: "内外墙涂料、微水泥、tadelakt、装饰灰泥、艺术涂料和树脂地坪。",
      hi: "आंतरिक और बाहरी पेंट, माइक्रोसीमेंट, तादेलाक्त, सजावटी प्लास्टर, इफ़ेक्ट कोटिंग्स और रेज़िन फर्श।",
    },
    pitch: {
      en: "Demonstrate your finishing systems to contractors and specifiers.",
      fr: "Démontrez vos systèmes de finition aux entreprises et prescripteurs.",
      ar: "اعرض أنظمة التشطيب لديك أمام المقاولين وواضعي المواصفات.",
      es: "Demuestre sus sistemas de acabado a constructores y prescriptores.",
      pt: "Demonstre os seus sistemas de acabamento a empreiteiros e prescritores.",
      it: "Dimostrate i vostri sistemi di finitura a imprese e progettisti.",
      tr: "Bitiş sistemlerinizi müteahhitlere ve proje sahiplerine gösterin.",
      zh: "向承包商和设计方演示您的饰面系统。",
      hi: "अपने फिनिशिंग सिस्टम ठेकेदारों और विशेषज्ञों को प्रदर्शित करें।",
    },
    ctaLabel: { en: "Show your finishes at SURMAT", fr: "Exposez vos finitions au SURMAT", ar: "اعرض تشطيباتك في سورمات", es: "Exponga sus acabados en SURMAT", pt: "Exponha os seus acabamentos na SURMAT", it: "Esponete le vostre finiture a SURMAT", tr: "Bitişlerinizi SURMAT’ta sergileyin", zh: "在 SURMAT 展示您的饰面", hi: "SURMAT में अपनी फिनिश प्रदर्शित करें" },
    accent: "#6f9a8b",
    tex: "paint",
    seed: 5,
  },
  {
    id: "interior-finishing-systems",
    order: 4,
    name: { en: "Interior Finishing Systems", fr: "Systèmes de finition intérieure", ar: "أنظمة التشطيب الداخلي", es: "Sistemas de acabado interior", pt: "Sistemas de acabamento interior", it: "Sistemi di finitura d’interni", tr: "İç mekân bitiş sistemleri", zh: "室内装修系统", hi: "आंतरिक फिनिशिंग सिस्टम" },
    short: { en: "Interior systems", fr: "Second œuvre", ar: "التشطيب الداخلي", es: "Sistemas interiores", pt: "Sistemas interiores", it: "Sistemi d’interni", tr: "İç mekân sistemleri", zh: "室内系统", hi: "आंतरिक सिस्टम" },
    description: {
      en: "Gypsum boards, suspended and acoustic ceilings, wall panels, partitions, mouldings and stretch ceilings.",
      fr: "Plaques de plâtre, plafonds suspendus et acoustiques, panneaux muraux, cloisons, moulures et plafonds tendus.",
      ar: "ألواح الجبس والأسقف المعلقة والصوتية والألواح الجدارية والفواصل والكرانيش والأسقف المشدودة.",
      es: "Placas de yeso, falsos techos y techos acústicos, paneles murales, tabiquería, molduras y techos tensados.",
      pt: "Gesso cartonado, tetos falsos e acústicos, painéis de parede, divisórias, molduras e tetos tensionados.",
      it: "Cartongesso, controsoffitti e soffitti acustici, pannelli murali, partizioni, cornici e controsoffitti tesi.",
      tr: "Alçı levhalar, asma ve akustik tavanlar, duvar panelleri, bölmeler, kartonpiyerler ve gergi tavanlar.",
      zh: "石膏板、吊顶和声学天花、墙板、隔断、线条和软膜天花。",
      hi: "जिप्सम बोर्ड, सस्पेंडेड और ध्वनिक छतें, वॉल पैनल, पार्टिशन, मोल्डिंग और स्ट्रेच सीलिंग।",
    },
    pitch: {
      en: "Put your ceilings, partitions and wall systems in front of the people who specify them.",
      fr: "Présentez vos plafonds, cloisons et systèmes muraux à ceux qui les prescrivent.",
      ar: "ضع أسقفك وفواصلك وأنظمة جدرانك أمام من يحدّدون مواصفاتها.",
      es: "Ponga sus techos, tabiques y sistemas murales ante quienes los prescriben.",
      pt: "Coloque os seus tetos, divisórias e sistemas de parede diante de quem os prescreve.",
      it: "Mettete controsoffitti, partizioni e sistemi murali davanti a chi li prescrive.",
      tr: "Tavanlarınızı, bölmelerinizi ve duvar sistemlerinizi onları şartnameye yazanların önüne koyun.",
      zh: "让选用它们的人看到您的吊顶、隔断和墙面系统。",
      hi: "अपनी छतें, पार्टिशन और दीवार सिस्टम उन लोगों के सामने रखें जो उन्हें निर्दिष्ट करते हैं।",
    },
    ctaLabel: { en: "Show your systems at SURMAT", fr: "Exposez vos systèmes au SURMAT", ar: "اعرض أنظمتك في سورمات", es: "Exponga sus sistemas en SURMAT", pt: "Exponha os seus sistemas na SURMAT", it: "Esponete i vostri sistemi a SURMAT", tr: "Sistemlerinizi SURMAT’ta sergileyin", zh: "在 SURMAT 展示您的系统", hi: "SURMAT में अपने सिस्टम प्रदर्शित करें" },
    accent: "#cbb89b",
    tex: "woodSlats",
    seed: 2,
  },
  {
    id: "construction-chemicals",
    order: 5,
    name: { en: "Construction Chemicals", fr: "Chimie du bâtiment", ar: "الكيماويات الإنشائية", es: "Química para la construcción", pt: "Química para a construção", it: "Chimica per l’edilizia", tr: "Yapı kimyasalları", zh: "建筑化学品", hi: "निर्माण रसायन" },
    short: { en: "Chemicals", fr: "Chimie", ar: "الكيماويات", es: "Química", pt: "Química", it: "Chimica", tr: "Kimyasallar", zh: "化学品", hi: "रसायन" },
    description: {
      en: "Tile adhesives, grouts, screeds, waterproofing, sealants and mortars — the systems that hold every surface in place.",
      fr: "Colles, joints, chapes, étanchéité, mastics et mortiers — les systèmes qui tiennent chaque surface en place.",
      ar: "لواصق البلاط ومواد الترويب وطبقات التسوية والعزل المائي ومواد الإحكام والملاط — الأنظمة التي تثبّت كل سطح.",
      es: "Adhesivos, juntas, recrecidos, impermeabilización, selladores y morteros — los sistemas que sostienen cada superficie.",
      pt: "Colas, juntas, betonilhas, impermeabilização, selantes e argamassas — os sistemas que seguram cada superfície.",
      it: "Adesivi, stucchi, massetti, impermeabilizzanti, sigillanti e malte — i sistemi che tengono al suo posto ogni superficie.",
      tr: "Karo yapıştırıcıları, derz dolguları, şaplar, su yalıtımı, mastikler ve harçlar — her yüzeyi yerinde tutan sistemler.",
      zh: "瓷砖胶、填缝剂、找平层、防水、密封胶和砂浆——固定每一个表面的系统。",
      hi: "टाइल एडहेसिव, ग्राउट, स्क्रीड, वॉटरप्रूफ़िंग, सीलेंट और मोर्टार — वे सिस्टम जो हर सतह को अपनी जगह थामे रखते हैं।",
    },
    pitch: {
      en: "Show installers and contractors the systems behind every finished surface.",
      fr: "Montrez aux poseurs et entreprises les systèmes derrière chaque surface finie.",
      ar: "أرِ المركّبين والمقاولين الأنظمة التي تقف خلف كل سطح منجز.",
      es: "Muestre a instaladores y constructores los sistemas que hay detrás de cada superficie acabada.",
      pt: "Mostre a aplicadores e empreiteiros os sistemas por trás de cada superfície acabada.",
      it: "Mostrate a posatori e imprese i sistemi dietro ogni superficie finita.",
      tr: "Uygulayıcılara ve müteahhitlere her bitmiş yüzeyin arkasındaki sistemleri gösterin.",
      zh: "向施工方和承包商展示每个成品表面背后的系统。",
      hi: "इंस्टॉलरों और ठेकेदारों को हर तैयार सतह के पीछे के सिस्टम दिखाएँ।",
    },
    ctaLabel: { en: "Show your systems at SURMAT", fr: "Exposez vos solutions au SURMAT", ar: "اعرض حلولك في سورمات", es: "Exponga sus sistemas en SURMAT", pt: "Exponha os seus sistemas na SURMAT", it: "Esponete i vostri sistemi a SURMAT", tr: "Sistemlerinizi SURMAT’ta sergileyin", zh: "在 SURMAT 展示您的系统", hi: "SURMAT में अपने सिस्टम प्रदर्शित करें" },
    accent: "#a3a58d",
    tex: "adhesive",
    seed: 4,
  },
  {
    id: "surface-technologies",
    order: 6,
    name: { en: "Surface Processing Equipment & Manufacturing Technologies", fr: "Équipements de traitement de surface & technologies de fabrication", ar: "معدات معالجة الأسطح وتقنيات التصنيع", es: "Equipos de tratamiento de superficies y tecnologías de fabricación", pt: "Equipamentos de tratamento de superfícies e tecnologias de fabrico", it: "Macchinari per la lavorazione delle superfici e tecnologie di produzione", tr: "Yüzey işleme ekipmanları ve üretim teknolojileri", zh: "表面加工设备与制造技术", hi: "सतह प्रसंस्करण उपकरण और विनिर्माण प्रौद्योगिकियाँ" },
    short: { en: "Technology", fr: "Technologies", ar: "التقنيات", es: "Tecnología", pt: "Tecnologia", it: "Tecnologia", tr: "Teknoloji", zh: "技术", hi: "प्रौद्योगिकी" },
    description: {
      en: "CNC and waterjet cutting, polishing, ceramic lines and kilns, digital decoration, handling and raw materials.",
      fr: "Découpe CNC et jet d’eau, polissage, lignes céramiques et fours, décoration numérique, manutention et matières premières.",
      ar: "القطع بالتحكم الرقمي والماء، الصقل، خطوط السيراميك والأفران، الزخرفة الرقمية، المناولة والمواد الخام.",
      es: "Corte CNC y por agua, pulido, líneas cerámicas y hornos, decoración digital, manipulación y materias primas.",
      pt: "Corte CNC e por água, polimento, linhas cerâmicas e fornos, decoração digital, movimentação e matérias-primas.",
      it: "Taglio CNC e ad acqua, lucidatura, linee ceramiche e forni, decorazione digitale, movimentazione e materie prime.",
      tr: "CNC ve su jeti ile kesim, parlatma, seramik hatları ve fırınlar, dijital dekorasyon, taşıma ve hammaddeler.",
      zh: "CNC 与水刀切割、抛光、陶瓷生产线与窑炉、数码装饰、搬运和原料。",
      hi: "CNC और वॉटरजेट कटिंग, पॉलिशिंग, सिरेमिक लाइनें और भट्ठियाँ, डिजिटल सजावट, हैंडलिंग और कच्चा माल।",
    },
    pitch: {
      en: "Put your production technology in front of manufacturers.",
      fr: "Présentez vos technologies de production aux fabricants.",
      ar: "ضع تقنيات الإنتاج لديك أمام المصنّعين.",
      es: "Ponga su tecnología de producción ante los fabricantes.",
      pt: "Coloque a sua tecnologia de produção diante dos fabricantes.",
      it: "Mettete la vostra tecnologia di produzione davanti ai produttori.",
      tr: "Üretim teknolojinizi üreticilerin önüne koyun.",
      zh: "让制造商看到您的生产技术。",
      hi: "अपनी उत्पादन तकनीक निर्माताओं के सामने रखें।",
    },
    ctaLabel: { en: "Show your technology at SURMAT", fr: "Exposez vos technologies au SURMAT", ar: "اعرض تقنياتك في سورمات", es: "Exponga su tecnología en SURMAT", pt: "Exponha a sua tecnologia na SURMAT", it: "Esponete la vostra tecnologia a SURMAT", tr: "Teknolojinizi SURMAT’ta sergileyin", zh: "在 SURMAT 展示您的技术", hi: "SURMAT में अपनी तकनीक प्रदर्शित करें" },
    accent: "#8e9dab",
    tex: "metal",
    seed: 6,
  },
];

export const sectorById = (id: string) => sectors.find((s) => s.id === id);
