import type { L } from "@/lib/i18n";
import type { GroupId } from "./families";
import type { MediaKey } from "./event-media";
import type { SectorId } from "./sectors";

/**
 * Building systems, layer by layer. Each one pairs an on-site render with a technical section
 * (drawn in SVG by `components/system-section.tsx`) so visitors see what the products are, where
 * they go and which district of the exhibition shows them. Specifications are typical values
 * for the region and are language-neutral (units and EN standards).
 *
 * Names are written [en, fr, ar, es, pt, it, tr, zh, hi].
 */
type Row = [string, string, string, string, string, string, string, string, string];
const l = ([en, fr, ar, es, pt, it, tr, zh, hi]: Row): L => ({ en, fr, ar, es, pt, it, tr, zh, hi });

export type Pattern = "concrete" | "masonry" | "insulation" | "wool" | "membrane" | "mortar" | "tile" | "stone" | "air" | "metal" | "board" | "paint" | "screed" | "pipes" | "pedestal" | "render";

export type Layer = {
  name: L;
  /** Typical specification: thickness, class, standard. */
  spec: string;
  /** Exhibition district that shows this product (null = the structure itself). */
  group: GroupId | null;
  /** Relative thickness in the drawing. */
  w: number;
  pattern: Pattern;
};

export type BuildingSystem = {
  id: string;
  /** wall: drawn outside → inside; floor: top → bottom; process: stations in order. */
  kind: "wall" | "floor" | "process";
  name: L;
  text: L;
  media: MediaKey;
  layers: Layer[];
};

const layer = (name: Row, spec: string, group: GroupId | null, w: number, pattern: Pattern): Layer => ({ name: l(name), spec, group, w, pattern });

const STRUCT: Row = ["Load-bearing structure", "Structure porteuse", "الهيكل الحامل", "Estructura portante", "Estrutura resistente", "Struttura portante", "Taşıyıcı yapı", "承重结构", "भार-वहन संरचना"];
const SLAB: Row = ["Concrete slab", "Dalle béton", "بلاطة خرسانية", "Losa de hormigón", "Laje de betão", "Solaio in calcestruzzo", "Betonarme döşeme", "混凝土楼板", "कंक्रीट स्लैब"];

export const systems: BuildingSystem[] = [
  {
    id: "ventilated-facade",
    kind: "wall",
    media: "tFacade",
    name: l(["Ventilated facade", "Façade ventilée", "واجهة مهواة", "Fachada ventilada", "Fachada ventilada", "Facciata ventilata", "Havalandırmalı cephe", "通风幕墙", "वेंटिलेटेड फ़साड"]),
    text: l([
      "Panels hung on a metal frame in front of insulation, with a ventilated cavity that dries the wall and keeps heat out.",
      "Des panneaux suspendus à une ossature métallique devant l’isolant, avec une lame d’air ventilée qui assèche le mur et bloque la chaleur.",
      "ألواح معلّقة على هيكل معدني أمام العزل، مع فراغ مهوّى يجفّف الجدار ويصدّ الحرارة.",
      "Paneles colgados de una subestructura metálica delante del aislamiento, con una cámara ventilada que seca el muro y frena el calor.",
      "Painéis suspensos numa estrutura metálica à frente do isolamento, com caixa de ar ventilada que seca a parede e trava o calor.",
      "Pannelli agganciati a una sottostruttura metallica davanti all’isolante, con un’intercapedine ventilata che asciuga il muro e respinge il calore.",
      "Yalıtımın önünde metal taşıyıcıya asılan paneller; havalandırmalı boşluk duvarı kurutur ve ısıyı dışarıda tutar.",
      "面板挂在保温层外侧的金属龙骨上，通风空腔使墙体保持干燥并隔绝热量。",
      "इंसुलेशन के आगे धातु फ्रेम पर टँगे पैनल; हवादार गुहा दीवार को सूखा रखती है और गर्मी रोकती है।",
    ]),
    layers: [
      layer(["Cladding panel", "Panneau de parement", "لوح الكسوة", "Panel de revestimiento", "Painel de revestimento", "Pannello di rivestimento", "Kaplama paneli", "外挂面板", "क्लैडिंग पैनल"], "Porcelain · stone · HPL · ACP · 8–30 mm", "facades-envelope", 1.2, "tile"),
      layer(["Ventilated cavity", "Lame d’air ventilée", "فراغ هوائي مهوّى", "Cámara ventilada", "Caixa de ar ventilada", "Intercapedine ventilata", "Havalandırma boşluğu", "通风空腔", "हवादार गुहा"], "≥ 20–40 mm", null, 1.3, "air"),
      layer(["Aluminium substructure", "Ossature aluminium", "هيكل ألمنيوم", "Subestructura de aluminio", "Subestrutura em alumínio", "Sottostruttura in alluminio", "Alüminyum taşıyıcı", "铝合金龙骨", "एल्युमिनियम सबस्ट्रक्चर"], "Brackets + T/L rails · EN 1999", "facades-envelope", 0.7, "metal"),
      layer(["Mineral wool insulation", "Isolant laine minérale", "عزل الصوف المعدني", "Aislamiento de lana mineral", "Isolamento em lã mineral", "Isolante in lana minerale", "Taş yünü yalıtım", "岩棉保温层", "मिनरल वूल इंसुलेशन"], "λ 0.035 W/mK · 80–160 mm · A1", "construction-chemicals", 2, "wool"),
      layer(STRUCT, "Concrete / masonry", null, 2.6, "concrete"),
    ],
  },
  {
    id: "etics",
    kind: "wall",
    media: "tEtics",
    name: l(["External insulation (ETICS)", "Isolation thermique par l’extérieur (ITE)", "العزل الحراري الخارجي", "Aislamiento exterior (SATE)", "Isolamento exterior (ETICS)", "Cappotto termico (ETICS)", "Dış cephe ısı yalıtımı (mantolama)", "外墙外保温系统", "बाहरी थर्मल इंसुलेशन (ETICS)"]),
    text: l([
      "Insulation boards bonded and anchored to the wall, reinforced with mesh and finished with render — the most common energy retrofit.",
      "Des panneaux isolants collés et chevillés, armés d’un treillis et finis par un enduit — la rénovation énergétique la plus courante.",
      "ألواح عازلة تُلصق وتُثبّت على الجدار، تُقوّى بشبكة وتُنهى بطبقة لياسة — أكثر حلول التجديد الطاقوي شيوعًا.",
      "Placas aislantes pegadas y ancladas al muro, armadas con malla y acabadas con revoco — la rehabilitación energética más habitual.",
      "Placas isolantes coladas e fixadas à parede, armadas com rede e acabadas com reboco — a reabilitação energética mais comum.",
      "Pannelli isolanti incollati e tassellati, armati con rete e finiti a intonaco — la riqualificazione energetica più diffusa.",
      "Duvara yapıştırılıp dübellenen, file ile güçlendirilip sıva ile bitirilen yalıtım levhaları — en yaygın enerji iyileştirmesi.",
      "保温板粘贴并锚固于墙体，以网格布增强并用饰面砂浆收面——最常见的节能改造方式。",
      "दीवार पर चिपकाए और एंकर किए गए इंसुलेशन बोर्ड, जाली से मज़बूत और रेंडर से फिनिश — सबसे आम ऊर्जा सुधार।",
    ]),
    layers: [
      layer(["Finish render / paint", "Enduit de finition / peinture", "لياسة نهائية / دهان", "Revoco de acabado / pintura", "Reboco de acabamento / tinta", "Intonachino / pittura", "Son kat sıva / boya", "饰面砂浆 / 涂料", "फिनिश रेंडर / पेंट"], "Silicone / acrylic · 1.5–3 mm", "paints-coatings", 0.5, "render"),
      layer(["Base coat + glass-fibre mesh", "Sous-enduit + treillis de verre", "طبقة أساس + شبكة ألياف زجاجية", "Capa base + malla de fibra de vidrio", "Camada base + rede de fibra de vidro", "Rasatura + rete in fibra di vetro", "Ara kat + cam elyaf file", "抹面砂浆 + 玻纤网", "बेस कोट + ग्लास-फ़ाइबर जाली"], "3–5 mm · mesh 160 g/m²", "construction-chemicals", 0.6, "mortar"),
      layer(["Insulation board", "Panneau isolant", "لوح عازل", "Placa aislante", "Placa isolante", "Pannello isolante", "Yalıtım levhası", "保温板", "इंसुलेशन बोर्ड"], "EPS · XPS · mineral wool · λ 0.031–0.040 · 60–200 mm", "construction-chemicals", 2.4, "insulation"),
      layer(["Adhesive mortar + anchors", "Mortier-colle + chevilles", "ملاط لاصق + مثبتات", "Mortero adhesivo + anclajes", "Argamassa-cola + buchas", "Collante + tasselli", "Yapıştırma harcı + dübel", "粘结砂浆 + 锚栓", "चिपकने वाला मोर्टार + एंकर"], "EAD 040083 · ≥ 40 % contact", "construction-chemicals", 0.5, "mortar"),
      layer(STRUCT, "Brick / block / concrete", null, 2.4, "masonry"),
      layer(["Interior plaster", "Enduit intérieur", "لياسة داخلية", "Enlucido interior", "Reboco interior", "Intonaco interno", "İç sıva", "内墙抹灰", "आंतरिक प्लास्टर"], "Gypsum / lime · 10–15 mm", "construction-chemicals", 0.5, "render"),
    ],
  },
  {
    id: "wet-area",
    kind: "floor",
    media: "tWet",
    name: l(["Bathrooms & wet areas", "Salles de bains & pièces humides", "الحمامات والمناطق الرطبة", "Baños y zonas húmedas", "Casas de banho e zonas húmidas", "Bagni e zone umide", "Banyolar ve ıslak hacimler", "卫浴与湿区", "बाथरूम और गीले क्षेत्र"]),
    text: l([
      "Under every tile of a shower sits a system: a sloped screed, a waterproofing membrane, a flexible adhesive and a stain-resistant grout.",
      "Sous chaque carreau de douche se cache un système : chape en pente, étanchéité liquide, colle flexible et joint anti-taches.",
      "تحت كل بلاطة في الدش نظام كامل: طبقة تسوية مائلة، وغشاء عزل مائي، ولاصق مرن، وروبة مقاومة للبقع.",
      "Bajo cada baldosa de una ducha hay un sistema: recrecido con pendiente, impermeabilización, adhesivo flexible y junta antimanchas.",
      "Debaixo de cada azulejo de um duche há um sistema: betonilha com pendente, impermeabilização, cola flexível e junta antimanchas.",
      "Sotto ogni piastrella di una doccia c’è un sistema: massetto in pendenza, impermeabilizzazione, adesivo flessibile e stucco antimacchia.",
      "Duştaki her karonun altında bir sistem vardır: eğimli şap, su yalıtım membranı, esnek yapıştırıcı ve leke tutmaz derz.",
      "每块淋浴区瓷砖之下都是一个系统：找坡层、防水涂膜、柔性瓷砖胶和防污填缝剂。",
      "शावर की हर टाइल के नीचे एक सिस्टम है: ढलान वाला स्क्रीड, वॉटरप्रूफ़िंग मेम्ब्रेन, लचीला एडहेसिव और दाग-रोधी ग्राउट।",
    ]),
    layers: [
      layer(["Porcelain tile", "Carreau grès cérame", "بلاط بورسلين", "Baldosa porcelánica", "Ladrilho porcelânico", "Piastrella in gres", "Porselen karo", "瓷质砖", "पोर्सिलेन टाइल"], "EN 14411 BIa · R10–R11 · 8–10 mm", "ceramic-porcelain", 0.9, "tile"),
      layer(["Grout", "Joint", "الروبة", "Junta", "Junta", "Stucco", "Derz dolgu", "填缝剂", "ग्राउट"], "CG2WA cement · RG epoxy · EN 13888", "construction-chemicals", 0.3, "mortar"),
      layer(["Flexible tile adhesive", "Colle carrelage flexible", "لاصق بلاط مرن", "Adhesivo flexible", "Cola flexível", "Adesivo flessibile", "Esnek karo yapıştırıcı", "柔性瓷砖胶", "लचीला टाइल एडहेसिव"], "C2TE S1 · EN 12004 · 3–5 mm", "construction-chemicals", 0.5, "mortar"),
      layer(["Liquid waterproofing + tape", "Étanchéité liquide + bande", "عزل مائي سائل + شريط", "Impermeabilización líquida + banda", "Impermeabilização líquida + banda", "Guaina liquida + bandella", "Sıvı su yalıtımı + bant", "液体防水涂膜 + 密封带", "तरल वॉटरप्रूफ़िंग + टेप"], "CM O2P · EN 14891 · 1–2 mm", "construction-chemicals", 0.35, "membrane"),
      layer(["Sloped screed", "Chape en pente", "طبقة تسوية مائلة", "Recrecido con pendiente", "Betonilha com pendente", "Massetto in pendenza", "Eğimli şap", "找坡砂浆层", "ढलान वाला स्क्रीड"], "≥ 1.5 % to drain · CT-C25-F4 · EN 13813", "construction-chemicals", 1.4, "screed"),
      layer(SLAB, "150–200 mm", null, 2.2, "concrete"),
    ],
  },
  {
    id: "floor",
    kind: "floor",
    media: "tFloor",
    name: l(["Floors & large-format slabs", "Sols & grandes dalles", "الأرضيات والبلاطات الكبيرة", "Suelos y gran formato", "Pavimentos e grande formato", "Pavimenti e grandi lastre", "Zeminler ve büyük format", "地面与大板铺贴", "फ़र्श और बड़े स्लैब"]),
    text: l([
      "A heated, acoustic floor: insulation, screed with heating pipes, a self-levelling layer and slabs laid with full adhesive cover.",
      "Un sol chauffant et acoustique : isolant, chape avec tubes chauffants, ragréage et dalles posées à double encollage.",
      "أرضية مدفّأة وعازلة للصوت: عزل، وطبقة تسوية بأنابيب التدفئة، وطبقة ذاتية التسوية، وبلاطات بتغطية لاصق كاملة.",
      "Un suelo radiante y acústico: aislamiento, recrecido con tubos, autonivelante y placas con doble encolado.",
      "Um pavimento radiante e acústico: isolamento, betonilha com tubos, autonivelante e placas com dupla colagem.",
      "Un pavimento radiante e acustico: isolante, massetto con tubi, autolivellante e lastre posate a doppia spalmatura.",
      "Isıtmalı ve akustik zemin: yalıtım, borulu şap, kendinden yayılan tesviye ve tam yapıştırıcı ile döşenen plakalar.",
      "地暖隔音地面：保温层、带地暖管的找平层、自流平层，以及满浆铺贴的大板。",
      "गर्म और ध्वनिरोधी फ़र्श: इंसुलेशन, हीटिंग पाइप वाला स्क्रीड, सेल्फ़-लेवलिंग परत और पूरे एडहेसिव से बिछे स्लैब।",
    ]),
    layers: [
      layer(["Large-format slab", "Grande dalle", "بلاطة كبيرة", "Placa de gran formato", "Placa de grande formato", "Lastra di grande formato", "Büyük format plaka", "大规格板材", "बड़े फ़ॉर्मेट का स्लैब"], "Porcelain / sintered · 120×280 cm · 6–12 mm", "ceramic-porcelain", 0.8, "stone"),
      layer(["Adhesive, double spread", "Colle, double encollage", "لاصق بطبقتين", "Adhesivo, doble encolado", "Cola, dupla colagem", "Adesivo, doppia spalmatura", "Çift taraflı yapıştırıcı", "双面满浆瓷砖胶", "दोहरा एडहेसिव"], "C2 S2 · EN 12004 · ≥ 95 % cover", "construction-chemicals", 0.45, "mortar"),
      layer(["Self-levelling underlayment", "Ragréage autolissant", "طبقة ذاتية التسوية", "Autonivelante", "Autonivelante", "Autolivellante", "Kendinden yayılan tesviye", "自流平", "सेल्फ़-लेवलिंग अंडरले"], "CT-C30-F7 · 3–10 mm", "construction-chemicals", 0.45, "screed"),
      layer(["Screed with heating pipes", "Chape avec plancher chauffant", "طبقة تسوية بأنابيب تدفئة", "Recrecido con suelo radiante", "Betonilha com piso radiante", "Massetto con riscaldamento a pavimento", "Yerden ısıtmalı şap", "地暖找平层", "हीटिंग पाइप वाला स्क्रीड"], "65 mm over pipes · EN 13813 / EN 1264", "construction-chemicals", 1.6, "pipes"),
      layer(["Acoustic & thermal insulation", "Isolant thermo-acoustique", "عزل حراري وصوتي", "Aislamiento termoacústico", "Isolamento termoacústico", "Isolante termoacustico", "Isı ve ses yalıtımı", "保温隔声层", "थर्मल और ध्वनिक इंसुलेशन"], "EPS / PE · ΔLw ≥ 20 dB · 20–40 mm", "construction-chemicals", 0.8, "insulation"),
      layer(SLAB, "150–250 mm", null, 2, "concrete"),
    ],
  },
  {
    id: "partition",
    kind: "wall",
    media: "tPartition",
    name: l(["Drywall partitions & ceilings", "Cloisons & plafonds plaque de plâtre", "القواطع والأسقف الجافة", "Tabiques y techos de placa", "Divisórias e tetos em gesso cartonado", "Pareti e controsoffitti in cartongesso", "Alçıpan bölmeler ve tavanlar", "轻钢龙骨隔墙与吊顶", "ड्राईवॉल पार्टिशन और छतें"]),
    text: l([
      "Metal studs, mineral wool and two layers of gypsum board each side: light, fast, fire-rated and acoustic.",
      "Montants métalliques, laine minérale et deux plaques de plâtre de chaque côté : léger, rapide, coupe-feu et acoustique.",
      "قوائم معدنية وصوف معدني وطبقتان من ألواح الجبس على كل جانب: خفيف وسريع ومقاوم للحريق وعازل للصوت.",
      "Montantes metálicos, lana mineral y dos placas de yeso por cara: ligero, rápido, resistente al fuego y acústico.",
      "Montantes metálicos, lã mineral e duas placas de gesso de cada lado: leve, rápido, resistente ao fogo e acústico.",
      "Montanti metallici, lana minerale e due lastre di gesso per lato: leggero, rapido, resistente al fuoco e acustico.",
      "Metal profiller, taş yünü ve her iki yüzde çift kat alçıpan: hafif, hızlı, yangına ve sese dayanıklı.",
      "轻钢龙骨、岩棉，每侧双层石膏板：轻质、快速、防火且隔音。",
      "धातु स्टड, मिनरल वूल और हर ओर जिप्सम बोर्ड की दो परतें: हल्का, तेज़, अग्निरोधी और ध्वनिरोधी।",
    ]),
    layers: [
      layer(["Paint or wall covering", "Peinture ou revêtement mural", "دهان أو كسوة جدارية", "Pintura o revestimiento", "Tinta ou revestimento", "Pittura o rivestimento", "Boya veya duvar kaplaması", "涂料或墙面饰材", "पेंट या वॉल कवरिंग"], "Primer + 2 coats · class A+", "paints-coatings", 0.35, "paint"),
      layer(["Gypsum boards ×2", "Plaques de plâtre ×2", "ألواح جبس ×2", "Placas de yeso ×2", "Placas de gesso ×2", "Lastre di gesso ×2", "Alçıpan ×2", "石膏板 ×2", "जिप्सम बोर्ड ×2"], "2 × 12.5 mm · EN 520 type A / H2 / DF", "interior-finishing-systems", 0.9, "board"),
      layer(["Metal studs + mineral wool", "Montants métalliques + laine minérale", "قوائم معدنية + صوف معدني", "Montantes + lana mineral", "Montantes + lã mineral", "Montanti + lana minerale", "Metal profil + taş yünü", "轻钢龙骨 + 岩棉", "धातु स्टड + मिनरल वूल"], "C 50–100 · EN 14195 · Rw 50–60 dB", "interior-finishing-systems", 2.4, "wool"),
      layer(["Gypsum boards ×2", "Plaques de plâtre ×2", "ألواح جبس ×2", "Placas de yeso ×2", "Placas de gesso ×2", "Lastre di gesso ×2", "Alçıpan ×2", "石膏板 ×2", "जिप्सम बोर्ड ×2"], "Fire EI 60–120 with type DF", "interior-finishing-systems", 0.9, "board"),
      layer(["Tiles in wet rooms", "Carrelage en pièce humide", "بلاط في الغرف الرطبة", "Alicatado en zonas húmedas", "Revestimento cerâmico em zonas húmidas", "Piastrelle nei locali umidi", "Islak hacimde seramik", "湿区墙砖", "गीले कमरों में टाइलें"], "On H2 board + waterproofing", "ceramic-porcelain", 0.5, "tile"),
    ],
  },
  {
    id: "flat-roof",
    kind: "floor",
    media: "tRoof",
    name: l(["Flat roofs & terraces", "Toitures-terrasses", "الأسطح المستوية والشرفات", "Cubiertas planas y terrazas", "Coberturas planas e terraços", "Coperture piane e terrazze", "Düz çatılar ve teraslar", "平屋面与露台", "सपाट छतें और टैरेस"]),
    text: l([
      "The roof protects everything below: a sloped screed, a vapour barrier, insulation, a waterproofing membrane and walkable pavers.",
      "La toiture protège tout ce qui est dessous : forme de pente, pare-vapeur, isolant, étanchéité et dalles circulables.",
      "السطح يحمي كل ما تحته: طبقة ميول، حاجز بخار، عزل، غشاء عزل مائي، وبلاطات للمشي.",
      "La cubierta protege todo lo que hay debajo: formación de pendientes, barrera de vapor, aislamiento, impermeabilización y baldosas transitables.",
      "A cobertura protege tudo por baixo: enchimento de pendentes, barreira pára-vapor, isolamento, impermeabilização e lajetas transitáveis.",
      "La copertura protegge tutto ciò che sta sotto: massetto di pendenza, barriera al vapore, isolante, impermeabilizzazione e pavimento calpestabile.",
      "Çatı altındaki her şeyi korur: eğim şapı, buhar kesici, yalıtım, su yalıtım membranı ve üzerinde yürünebilir kaplama.",
      "屋面保护下方的一切：找坡层、隔汽层、保温层、防水卷材和可上人铺面。",
      "छत नीचे की हर चीज़ की रक्षा करती है: ढलान स्क्रीड, वाष्प अवरोध, इंसुलेशन, वॉटरप्रूफ़ मेम्ब्रेन और चलने योग्य पेवर।",
    ]),
    layers: [
      layer(["Pavers on pedestals", "Dalles sur plots", "بلاطات على قواعد", "Baldosas sobre plots", "Lajetas sobre apoios", "Pavimento su supporti", "Ayaklı döşeme plakaları", "架空铺装板", "पेडेस्टल पर पेवर"], "Porcelain 20 mm / stone · adjustable pedestals", "ceramic-porcelain", 1, "pedestal"),
      layer(["Waterproofing membrane", "Membrane d’étanchéité", "غشاء العزل المائي", "Membrana impermeabilizante", "Membrana de impermeabilização", "Membrana impermeabilizzante", "Su yalıtım membranı", "防水卷材", "वॉटरप्रूफ़िंग मेम्ब्रेन"], "SBS bitumen 2 × 4 mm / TPO 1.5 mm", "construction-chemicals", 0.4, "membrane"),
      layer(["Rigid insulation", "Isolant rigide", "عزل صلب", "Aislamiento rígido", "Isolamento rígido", "Isolante rigido", "Sert yalıtım levhası", "硬质保温板", "कठोर इंसुलेशन"], "XPS / PIR · λ 0.022–0.034 · 100–160 mm", "construction-chemicals", 1.5, "insulation"),
      layer(["Vapour barrier", "Pare-vapeur", "حاجز بخار", "Barrera de vapor", "Barreira pára-vapor", "Barriera al vapore", "Buhar kesici", "隔汽层", "वाष्प अवरोध"], "Bitumen / PE · Sd ≥ 100 m", "construction-chemicals", 0.25, "membrane"),
      layer(["Slope screed", "Forme de pente", "طبقة الميول", "Formación de pendientes", "Enchimento de pendentes", "Massetto di pendenza", "Eğim şapı", "找坡层", "ढलान स्क्रीड"], "≥ 1.5 % · lightweight concrete", "construction-chemicals", 0.9, "screed"),
      layer(SLAB, "200 mm", null, 1.8, "concrete"),
    ],
  },
  {
    id: "ceramic-line",
    kind: "process",
    media: "tCeramicLine",
    name: l(["Ceramic tile production line", "Ligne de production céramique", "خط إنتاج البلاط الخزفي", "Línea de producción cerámica", "Linha de produção cerâmica", "Linea di produzione ceramica", "Seramik karo üretim hattı", "陶瓷砖生产线", "सिरेमिक टाइल उत्पादन लाइन"]),
    text: l([
      "From clay to packed pallet in about a day — every station is a machine, a supplier and a stand at SURMAT.",
      "De l’argile à la palette en une journée environ — chaque poste est une machine, un fournisseur et un stand à SURMAT.",
      "من الطين إلى المنصة المغلّفة في يوم تقريبًا — كل محطة آلة ومورد وجناح في سورمات.",
      "De la arcilla al palé en un día aproximadamente — cada estación es una máquina, un proveedor y un stand en SURMAT.",
      "Da argila à palete em cerca de um dia — cada estação é uma máquina, um fornecedor e um stand na SURMAT.",
      "Dall’argilla al pallet in circa un giorno — ogni stazione è una macchina, un fornitore e uno stand a SURMAT.",
      "Kilden palete yaklaşık bir günde — her istasyon SURMAT’ta bir makine, bir tedarikçi ve bir stanttır.",
      "从黏土到打包出厂约需一天——每个工位都是一台设备、一家供应商，也是 SURMAT 的一个展位。",
      "मिट्टी से पैक पैलेट तक लगभग एक दिन — हर स्टेशन एक मशीन, एक आपूर्तिकर्ता और SURMAT में एक स्टैंड है।",
    ]),
    layers: [
      layer(["Raw materials & milling", "Matières premières & broyage", "المواد الخام والطحن", "Materias primas y molienda", "Matérias-primas e moagem", "Materie prime e macinazione", "Hammadde ve öğütme", "原料与球磨", "कच्चा माल और पिसाई"], "Clays, feldspar, sand · ball mills", "surface-technologies", 1, "concrete"),
      layer(["Spray drying", "Atomisation", "التجفيف بالرذاذ", "Atomización", "Atomização", "Atomizzazione", "Püskürtmeli kurutma", "喷雾干燥", "स्प्रे ड्राइंग"], "Granulated powder · 5–7 % moisture", "surface-technologies", 1, "mortar"),
      layer(["Pressing", "Pressage", "الكبس", "Prensado", "Prensagem", "Pressatura", "Presleme", "压制成型", "प्रेसिंग"], "Hydraulic presses up to 7,000 t · slab compaction", "surface-technologies", 1, "metal"),
      layer(["Drying", "Séchage", "التجفيف", "Secado", "Secagem", "Essiccazione", "Kurutma", "干燥", "सुखाना"], "Vertical / horizontal dryers", "surface-technologies", 1, "air"),
      layer(["Glazing & digital printing", "Émaillage & impression numérique", "التزجيج والطباعة الرقمية", "Esmaltado e impresión digital", "Vidragem e impressão digital", "Smaltatura e stampa digitale", "Sırlama ve dijital baskı", "施釉与数码喷墨", "ग्लेज़िंग और डिजिटल प्रिंटिंग"], "Inkjet 360–600 dpi · glazes, frits, inks", "surface-technologies", 1, "paint"),
      layer(["Roller kiln firing", "Cuisson au four à rouleaux", "الحرق في فرن الأسطوانات", "Cocción en horno de rodillos", "Cozedura em forno de rolos", "Cottura in forno a rulli", "Merdaneli fırında pişirme", "辊道窑烧成", "रोलर किल्न में पकाना"], "1,180–1,220 °C · 40–60 min", "surface-technologies", 1, "tile"),
      layer(["Squaring, sorting, packing", "Rectification, tri, emballage", "التقويم والفرز والتغليف", "Rectificado, clasificación, embalaje", "Retificação, escolha, embalagem", "Rettifica, scelta, imballaggio", "Rektifiye, ayıklama, paketleme", "磨边、分选与包装", "किनारे सुधारना, छँटाई, पैकिंग"], "Rectified edges · shade & calibre", "surface-technologies", 1, "board"),
    ],
  },
  {
    id: "stone-line",
    kind: "process",
    media: "tStoneLine",
    name: l(["Natural stone processing", "Transformation de la pierre naturelle", "معالجة الحجر الطبيعي", "Transformación de piedra natural", "Transformação de pedra natural", "Lavorazione della pietra naturale", "Doğal taş işleme", "天然石材加工", "प्राकृतिक पत्थर प्रसंस्करण"]),
    text: l([
      "From quarry block to finished countertop: saws, resin lines, polishers and CNC — the technology district of the show.",
      "Du bloc de carrière au plan de travail fini : scies, lignes de résinage, polisseuses et CNC — le quartier technologie du salon.",
      "من كتلة المحجر إلى سطح العمل النهائي: مناشير وخطوط الراتنج وآلات الصقل وCNC — حي التكنولوجيا في المعرض.",
      "Del bloque de cantera a la encimera acabada: sierras, líneas de resinado, pulidoras y CNC — el distrito tecnológico de la feria.",
      "Do bloco de pedreira à bancada acabada: serras, linhas de resinagem, polidoras e CNC — o distrito tecnológico da feira.",
      "Dal blocco di cava al top finito: segatrici, linee di resinatura, lucidatrici e CNC — il distretto tecnologico della fiera.",
      "Ocak blokundan bitmiş tezgâha: testereler, reçine hatları, cilalama makineleri ve CNC — fuarın teknoloji bölgesi.",
      "从荒料到成品台面：锯切、补胶线、抛光与数控加工——展会的技术展区。",
      "खदान ब्लॉक से तैयार काउंटरटॉप तक: आरी, रेज़िन लाइन, पॉलिशर और CNC — प्रदर्शनी का तकनीकी ज़िला।",
    ]),
    layers: [
      layer(["Quarrying", "Extraction", "الاستخراج", "Extracción", "Extração", "Estrazione", "Ocak işletmesi", "开采", "खनन"], "Diamond wire saws · chain cutters", "surface-technologies", 1, "stone"),
      layer(["Block cutting", "Sciage des blocs", "نشر الكتل", "Corte de bloques", "Corte de blocos", "Taglio blocchi", "Blok kesimi", "荒料锯切", "ब्लॉक कटिंग"], "Multi-wire saws · gang saws · 2–3 cm slabs", "surface-technologies", 1, "metal"),
      layer(["Resin & mesh backing", "Résinage & filet", "الراتنج والشبكة الخلفية", "Resinado y malla", "Resinagem e rede", "Resinatura e rete", "Reçine ve file", "补胶与背网", "रेज़िन और जाली बैकिंग"], "Epoxy / polyester · UV & oven curing", "construction-chemicals", 1, "membrane"),
      layer(["Polishing", "Polissage", "الصقل", "Pulido", "Polimento", "Lucidatura", "Cilalama", "抛光", "पॉलिशिंग"], "Multi-head lines · honed, polished, leathered", "surface-technologies", 1, "paint"),
      layer(["CNC & waterjet cutting", "Découpe CNC & jet d’eau", "القطع بالتحكم الرقمي والماء", "Corte CNC y por agua", "Corte CNC e jato de água", "Taglio CNC e waterjet", "CNC ve su jeti kesim", "数控与水刀切割", "CNC और वॉटरजेट कटिंग"], "5-axis bridge saws · 4,000–6,000 bar", "surface-technologies", 1, "tile"),
      layer(["Edges, finishing, crating", "Chants, finition, colisage", "الحواف والتشطيب والتعبئة", "Cantos, acabado y embalaje", "Arestas, acabamento, embalagem", "Coste, finitura, imballaggio", "Kenar, bitiş, sandıklama", "磨边、精加工与装箱", "किनारे, फिनिशिंग, पैकिंग"], "Edge profilers · diamond tools & abrasives", "surface-technologies", 1, "board"),
    ],
  },
];

/** Which systems each sector's page shows. */
export const systemsForSector: Record<SectorId, string[]> = {
  "ceramic-porcelain": ["wet-area", "floor", "ceramic-line"],
  "natural-engineered-stone": ["ventilated-facade", "floor", "stone-line"],
  "paints-coatings": ["etics", "partition", "ventilated-facade"],
  "interior-finishing-systems": ["partition", "floor", "wet-area"],
  "construction-chemicals": ["wet-area", "etics", "flat-roof", "floor"],
  "surface-technologies": ["ceramic-line", "stone-line"],
};
