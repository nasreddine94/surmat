import type { L } from "@/lib/i18n";
import type { SectorId } from "./sectors";

/**
 * The exhibition's full scope: every product family SURMAT accepts, not just the materials
 * documented in the library. Six core sectors plus three adjacent groups, so exhibitors
 * outside the headline materials can see themselves on the floor.
 *
 * Each family is written [en, fr, ar, es, pt, it, tr, zh, hi].
 */
type Row = [string, string, string, string, string, string, string, string, string];

const l = ([en, fr, ar, es, pt, it, tr, zh, hi]: Row): L => ({ en, fr, ar, es, pt, it, tr, zh, hi });

export type GroupId = SectorId | "facades-envelope" | "joinery-glazing" | "bath-kitchen";

export type FamilyGroup = { id: GroupId; name: L; core: boolean; families: L[] };

const group = (id: GroupId, name: Row, core: boolean, rows: Row[]): FamilyGroup => ({ id, name: l(name), core, families: rows.map(l) });

export const familyGroups: FamilyGroup[] = [
  group("ceramic-porcelain", ["Ceramic & Porcelain", "Céramique & Porcelaine", "السيراميك والبورسلين", "Cerámica y porcelánico", "Cerâmica e porcelânico", "Ceramica e gres", "Seramik ve porselen", "陶瓷与瓷砖", "सिरेमिक और पोर्सिलेन"], true, [
    ["Porcelain stoneware", "Grès cérame", "البورسلين الحجري", "Gres porcelánico", "Grés porcelânico", "Gres porcellanato", "Porselen karo", "通体瓷砖", "पोर्सिलेन स्टोनवेयर"],
    ["Large-format slabs", "Grandes dalles", "البلاطات الكبيرة", "Placas de gran formato", "Placas de grande formato", "Lastre di grande formato", "Büyük format levhalar", "大板", "बड़े फ़ॉर्मेट स्लैब"],
    ["Wall & floor tiles", "Carrelage mural & sol", "بلاط الجدران والأرضيات", "Azulejos y pavimentos", "Azulejos e pavimentos", "Piastrelle da parete e pavimento", "Duvar ve yer karoları", "墙地砖", "दीवार और फ़र्श टाइलें"],
    ["Zellige & handmade tiles", "Zellige & carreaux artisanaux", "الزليج والبلاط اليدوي", "Zellige y azulejos artesanales", "Zellige e azulejos artesanais", "Zellige e piastrelle artigianali", "Zellige ve el yapımı karolar", "马赛克手工砖", "ज़ेलिज और हस्तनिर्मित टाइलें"],
    ["Mosaic", "Mosaïque", "الفسيفساء", "Mosaico", "Mosaico", "Mosaico", "Mozaik", "马赛克", "मोज़ेक"],
    ["Cement & encaustic tiles", "Carreaux de ciment", "البلاط الإسمنتي", "Baldosas hidráulicas", "Ladrilho hidráulico", "Cementine", "Çimento karolar", "水泥花砖", "सीमेंट टाइलें"],
    ["Terrazzo", "Terrazzo", "التيرازو", "Terrazo", "Terrazzo", "Terrazzo", "Terrazzo", "水磨石", "टेराज़ो"],
    ["Terracotta & clay products", "Terre cuite", "الطين المشوي", "Terracota y barro cocido", "Terracota", "Cotto e laterizi", "Pişmiş toprak", "陶土制品", "टेराकोटा"],
    ["Roof tiles", "Tuiles", "قرميد الأسقف", "Tejas", "Telhas", "Tegole", "Kiremit", "屋面瓦", "छत टाइलें"],
  ]),
  group("natural-engineered-stone", ["Stone & Engineered Surfaces", "Pierre & surfaces reconstituées", "الحجر والأسطح المُصنّعة", "Piedra y superficies técnicas", "Pedra e superfícies técnicas", "Pietra e superfici tecniche", "Taş ve mühendislik yüzeyleri", "石材与人造表面", "पत्थर और इंजीनियर्ड सतहें"], true, [
    ["Marble", "Marbre", "الرخام", "Mármol", "Mármore", "Marmo", "Mermer", "大理石", "संगमरमर"],
    ["Granite", "Granit", "الغرانيت", "Granito", "Granito", "Granito", "Granit", "花岗岩", "ग्रेनाइट"],
    ["Travertine & limestone", "Travertin & calcaire", "الترافرتين والحجر الجيري", "Travertino y caliza", "Travertino e calcário", "Travertino e calcare", "Traverten ve kireçtaşı", "洞石与石灰石", "ट्रैवर्टीन और चूना पत्थर"],
    ["Onyx & semi-precious stone", "Onyx & pierres semi-précieuses", "الأونيكس والأحجار شبه الكريمة", "Ónix y piedras semipreciosas", "Ónix e pedras semipreciosas", "Onice e pietre semipreziose", "Oniks ve yarı değerli taşlar", "玛瑙与半宝石", "ओनिक्स और अर्ध-कीमती पत्थर"],
    ["Slate & sandstone", "Ardoise & grès", "الأردواز والحجر الرملي", "Pizarra y arenisca", "Ardósia e arenito", "Ardesia e arenaria", "Arduvaz ve kumtaşı", "板岩与砂岩", "स्लेट और बलुआ पत्थर"],
    ["Quartz surfaces", "Quartz", "أسطح الكوارتز", "Cuarzo", "Quartzo", "Quarzo", "Kuvars yüzeyler", "石英石", "क्वार्ट्ज़ सतहें"],
    ["Sintered stone", "Pierre frittée", "الحجر الملبّد", "Piedra sinterizada", "Pedra sinterizada", "Pietra sinterizzata", "Sinterlenmiş taş", "岩板", "सिंटर्ड स्टोन"],
    ["Solid surfaces", "Solid surface", "الأسطح الصلبة", "Superficie sólida", "Superfície sólida", "Solid surface", "Solid surface", "实体面材", "सॉलिड सरफेस"],
    ["Cast & reconstituted stone", "Pierre reconstituée", "الحجر المصبوب", "Piedra artificial", "Pedra reconstituída", "Pietra ricostruita", "Döküm taş", "人造铸石", "कास्ट स्टोन"],
    ["Paving & landscape stone", "Pavés & pierre paysagère", "حجر الرصف والتنسيق", "Adoquines y piedra de paisajismo", "Calçada e pedra paisagística", "Pavimentazioni e pietra per esterni", "Parke ve peyzaj taşı", "铺路与景观石", "पेविंग और लैंडस्केप पत्थर"],
  ]),
  group("paints-coatings", ["Paints & Decorative Finishes", "Peintures & finitions décoratives", "الدهانات والتشطيبات الزخرفية", "Pinturas y acabados decorativos", "Tintas e acabamentos decorativos", "Pitture e finiture decorative", "Boyalar ve dekoratif bitişler", "涂料与装饰饰面", "पेंट और सजावटी फिनिश"], true, [
    ["Interior & exterior paints", "Peintures intérieures & extérieures", "الدهانات الداخلية والخارجية", "Pinturas de interior y exterior", "Tintas interiores e exteriores", "Pitture per interni ed esterni", "İç ve dış cephe boyaları", "内外墙涂料", "आंतरिक और बाहरी पेंट"],
    ["Decorative plasters & tadelakt", "Enduits décoratifs & tadelakt", "اللياسة الزخرفية والتادلاكت", "Estucos decorativos y tadelakt", "Estuques decorativos e tadelakt", "Stucchi decorativi e tadelakt", "Dekoratif sıvalar ve tadelakt", "装饰灰泥与塔德拉克特", "सजावटी प्लास्टर और तडेलाक्त"],
    ["Microcement", "Béton ciré & microciment", "الميكروسمنت", "Microcemento", "Microcimento", "Microcemento", "Mikro beton", "微水泥", "माइक्रोसीमेंट"],
    ["Texture & facade coatings", "Revêtements de façade & texturés", "طلاءات الواجهات والمحببة", "Revestimientos de fachada y texturados", "Revestimentos de fachada e texturados", "Rivestimenti per facciate e materici", "Cephe ve dokulu kaplamalar", "外墙与质感涂料", "फ़साड और टेक्सचर कोटिंग्स"],
    ["Wood stains, oils & varnishes", "Lasures, huiles & vernis", "صبغات وزيوت وورنيش الخشب", "Lasures, aceites y barnices", "Velaturas, óleos e vernizes", "Impregnanti, oli e vernici", "Ahşap boya, yağ ve vernikler", "木器漆与木油", "लकड़ी के दाग, तेल और वार्निश"],
    ["Industrial & floor coatings", "Revêtements industriels & de sol", "طلاءات الأرضيات والصناعية", "Recubrimientos industriales y de suelo", "Revestimentos industriais e de piso", "Rivestimenti industriali e per pavimenti", "Endüstriyel ve zemin kaplamaları", "工业与地坪涂料", "औद्योगिक और फ़र्श कोटिंग्स"],
    ["Powder & metal coatings", "Thermolaquage & peintures métal", "طلاءات المعادن والمسحوق", "Pintura en polvo y para metal", "Pintura em pó e para metal", "Verniciature a polvere e per metallo", "Toz ve metal boyalar", "粉末与金属涂料", "पाउडर और मेटल कोटिंग्स"],
    ["Fire-retardant & protective coatings", "Peintures ignifuges & protectrices", "الطلاءات المقاومة للحريق والواقية", "Pinturas ignífugas y protectoras", "Tintas ignífugas e protetoras", "Vernici ignifughe e protettive", "Yangın geciktirici ve koruyucu boyalar", "防火与防护涂料", "अग्निरोधी और सुरक्षात्मक कोटिंग्स"],
    ["Pigments, colour systems & tinting", "Pigments & systèmes à teinter", "الأصباغ وأنظمة الألوان", "Pigmentos y sistemas tintométricos", "Pigmentos e sistemas tintométricos", "Pigmenti e sistemi tintometrici", "Pigmentler ve renk sistemleri", "颜料与调色系统", "पिगमेंट और टिंटिंग सिस्टम"],
    ["Wallpapers & wall coverings", "Papiers peints & revêtements muraux", "ورق الجدران والكسوات", "Papeles pintados y revestimientos murales", "Papel de parede e revestimentos murais", "Carte da parati e rivestimenti murali", "Duvar kâğıtları ve kaplamaları", "墙纸与墙布", "वॉलपेपर और वॉल कवरिंग"],
  ]),
  group("interior-finishing-systems", ["Interior Finishing Systems", "Second œuvre & aménagement", "أنظمة التشطيب الداخلي", "Sistemas de acabado interior", "Sistemas de acabamento interior", "Sistemi di finitura d’interni", "İç mekân bitiş sistemleri", "室内装修系统", "आंतरिक फिनिशिंग सिस्टम"], true, [
    ["Gypsum board & drywall", "Plaque de plâtre & cloisons sèches", "ألواح الجبس والجدران الجافة", "Placa de yeso y tabiquería seca", "Gesso cartonado", "Cartongesso", "Alçıpan ve kuru duvar", "石膏板与轻钢隔墙", "जिप्सम बोर्ड और ड्राईवॉल"],
    ["Suspended & acoustic ceilings", "Plafonds suspendus & acoustiques", "الأسقف المعلقة والصوتية", "Falsos techos y techos acústicos", "Tetos falsos e acústicos", "Controsoffitti e soffitti acustici", "Asma ve akustik tavanlar", "吊顶与吸音天花", "सस्पेंडेड और ध्वनिक छतें"],
    ["Acoustic panels", "Panneaux acoustiques", "الألواح الصوتية", "Paneles acústicos", "Painéis acústicos", "Pannelli fonoassorbenti", "Akustik paneller", "吸音板", "ध्वनिक पैनल"],
    ["Wall panels & cladding", "Panneaux & habillages muraux", "ألواح وكسوات الجدران", "Paneles y revestimientos de pared", "Painéis e revestimentos de parede", "Pannelli e rivestimenti a parete", "Duvar panelleri ve kaplamaları", "墙板与护墙", "वॉल पैनल और क्लैडिंग"],
    ["Parquet & engineered wood", "Parquet & bois contrecollé", "الباركيه والخشب الهندسي", "Parquet y madera técnica", "Parquet e madeira de engenharia", "Parquet e legno multistrato", "Parke ve lamine ahşap", "实木与复合地板", "पार्केट और इंजीनियर्ड वुड"],
    ["Laminate, vinyl & LVT", "Stratifié, vinyle & LVT", "اللامينيت والفينيل", "Laminado, vinilo y LVT", "Laminado, vinílico e LVT", "Laminato, vinile e LVT", "Laminat, vinil ve LVT", "强化、PVC与LVT地板", "लैमिनेट, विनाइल और LVT"],
    ["Carpet & textile floor coverings", "Moquettes & sols textiles", "السجاد والأرضيات النسيجية", "Moquetas y pavimentos textiles", "Alcatifas e pavimentos têxteis", "Moquette e pavimenti tessili", "Halı ve tekstil zemin", "地毯与织物地材", "कालीन और टेक्सटाइल फ़्लोरिंग"],
    ["Raised access floors", "Planchers techniques", "الأرضيات المرتفعة", "Suelos técnicos", "Pavimentos técnicos", "Pavimenti sopraelevati", "Yükseltilmiş döşemeler", "架空地板", "रेज़्ड एक्सेस फ़्लोर"],
    ["Partitions & office systems", "Cloisons & aménagement de bureaux", "القواطع وأنظمة المكاتب", "Mamparas y sistemas de oficina", "Divisórias e sistemas de escritório", "Pareti divisorie e sistemi per uffici", "Bölme ve ofis sistemleri", "隔断与办公系统", "पार्टिशन और ऑफ़िस सिस्टम"],
    ["Mouldings, cornices & decorative profiles", "Moulures, corniches & profilés", "الكرانيش والقوالب الزخرفية", "Molduras, cornisas y perfiles", "Molduras, sancas e perfis", "Modanature, cornici e profili", "Kartonpiyer ve dekoratif profiller", "线条与装饰型材", "मोल्डिंग और कॉर्निस"],
    ["Architectural & decorative lighting", "Éclairage architectural & décoratif", "الإضاءة المعمارية والزخرفية", "Iluminación arquitectónica y decorativa", "Iluminação arquitetónica e decorativa", "Illuminazione architetturale e decorativa", "Mimari ve dekoratif aydınlatma", "建筑与装饰照明", "आर्किटेक्चरल और सजावटी लाइटिंग"],
    ["Stairs, railings & balustrades", "Escaliers, garde-corps & rampes", "السلالم والدرابزين", "Escaleras, barandillas y balaustradas", "Escadas, guardas e balaustradas", "Scale, ringhiere e balaustre", "Merdiven, korkuluk ve küpeşteler", "楼梯与栏杆", "सीढ़ियाँ और रेलिंग"],
  ]),
  group("construction-chemicals", ["Construction Chemicals", "Chimie du bâtiment", "الكيماويات الإنشائية", "Química para la construcción", "Química para a construção", "Chimica per l’edilizia", "Yapı kimyasalları", "建筑化学品", "निर्माण रसायन"], true, [
    ["Tile adhesives & grouts", "Colles & joints de carrelage", "لاصقات وروبة البلاط", "Adhesivos y juntas cerámicas", "Colas e argamassas de juntas", "Adesivi e stucchi per piastrelle", "Karo yapıştırıcı ve derz dolgular", "瓷砖胶与填缝剂", "टाइल एडहेसिव और ग्राउट"],
    ["Waterproofing membranes & systems", "Étanchéité & membranes", "العزل المائي والأغشية", "Impermeabilización y membranas", "Impermeabilização e membranas", "Impermeabilizzazione e membrane", "Su yalıtımı ve membranlar", "防水卷材与系统", "वॉटरप्रूफ़िंग मेम्ब्रेन"],
    ["Screeds & self-levelling compounds", "Chapes & ragréages", "الطبقات التسوية والذاتية التسوية", "Recrecidos y autonivelantes", "Betonilhas e autonivelantes", "Massetti e autolivellanti", "Şap ve kendinden yayılan harçlar", "找平砂浆与自流平", "स्क्रीड और सेल्फ़-लेवलिंग"],
    ["Mortars, renders & plasters", "Mortiers, enduits & plâtres", "الملاط واللياسة والجص", "Morteros, revocos y yesos", "Argamassas, rebocos e gessos", "Malte, intonaci e gessi", "Harç, sıva ve alçılar", "砂浆、抹灰与石膏", "मोर्टार, रेंडर और प्लास्टर"],
    ["Sealants & joint systems", "Mastics & joints", "المواد المانعة للتسرب والفواصل", "Selladores y juntas", "Selantes e juntas", "Sigillanti e giunti", "Mastikler ve derz sistemleri", "密封胶与接缝系统", "सीलेंट और जॉइंट सिस्टम"],
    ["Concrete admixtures", "Adjuvants pour béton", "إضافات الخرسانة", "Aditivos para hormigón", "Adjuvantes para betão", "Additivi per calcestruzzo", "Beton katkıları", "混凝土外加剂", "कंक्रीट एडमिक्सचर"],
    ["Repair, anchoring & grouting", "Réparation, scellement & calage", "الإصلاح والتثبيت والحقن", "Reparación, anclaje y grout", "Reparação, ancoragem e grout", "Ripristino, ancoraggi e grout", "Tamir, ankraj ve grout", "修补、锚固与灌浆", "मरम्मत, एंकरिंग और ग्राउटिंग"],
    ["Resin floors & epoxy systems", "Sols résine & époxy", "الأرضيات الراتنجية والإيبوكسي", "Pavimentos de resina y epoxi", "Pavimentos em resina e epóxi", "Pavimenti in resina ed epossidici", "Reçine ve epoksi zeminler", "树脂与环氧地坪", "रेज़िन और इपॉक्सी फ़्लोर"],
    ["Surface protection & sealers", "Protection & hydrofuges de surface", "حماية ومعالجة الأسطح", "Protectores e hidrofugantes", "Proteção e hidrofugantes", "Protettivi e idrorepellenti", "Yüzey koruyucular", "表面防护剂", "सतह सुरक्षा और सीलर"],
    ["Thermal & acoustic insulation", "Isolation thermique & acoustique", "العزل الحراري والصوتي", "Aislamiento térmico y acústico", "Isolamento térmico e acústico", "Isolamento termico e acustico", "Isı ve ses yalıtımı", "保温与隔音材料", "थर्मल और ध्वनिक इंसुलेशन"],
  ]),
  group("surface-technologies", ["Equipment & Technologies", "Équipements & technologies", "المعدات والتقنيات", "Equipos y tecnologías", "Equipamentos e tecnologias", "Macchinari e tecnologie", "Ekipman ve teknolojiler", "设备与技术", "उपकरण और प्रौद्योगिकियाँ"], true, [
    ["Stone quarrying & cutting machinery", "Machines d’extraction & de découpe", "آلات استخراج وقطع الحجر", "Maquinaria de extracción y corte", "Máquinas de extração e corte", "Macchine per cava e taglio", "Ocak ve kesim makineleri", "石材开采与切割设备", "खनन और कटिंग मशीनरी"],
    ["CNC, waterjet & finishing lines", "CNC, jet d’eau & lignes de finition", "آلات CNC والقطع بالماء وخطوط التشطيب", "CNC, corte por agua y líneas de acabado", "CNC, jato de água e linhas de acabamento", "CNC, waterjet e linee di finitura", "CNC, su jeti ve bitiş hatları", "数控、水刀与加工线", "CNC, वॉटरजेट और फिनिशिंग लाइनें"],
    ["Ceramic production plants & kilns", "Usines & fours céramiques", "مصانع وأفران السيراميك", "Plantas y hornos cerámicos", "Fábricas e fornos cerâmicos", "Impianti e forni ceramici", "Seramik tesisleri ve fırınlar", "陶瓷生产线与窑炉", "सिरेमिक प्लांट और भट्ठियाँ"],
    ["Digital printing & glazing", "Impression numérique & émaillage", "الطباعة الرقمية والتزجيج", "Impresión digital y esmaltado", "Impressão digital e vidragem", "Stampa digitale e smaltatura", "Dijital baskı ve sırlama", "数码喷墨与施釉", "डिजिटल प्रिंटिंग और ग्लेज़िंग"],
    ["Paint & mortar production equipment", "Équipements de production peinture & mortier", "معدات إنتاج الدهانات والملاط", "Equipos para pinturas y morteros", "Equipamentos para tintas e argamassas", "Impianti per pitture e malte", "Boya ve harç üretim ekipmanı", "涂料与砂浆生产设备", "पेंट और मोर्टार उत्पादन उपकरण"],
    ["Application tools & spraying", "Outils d’application & projection", "أدوات التطبيق والرش", "Herramientas de aplicación y proyección", "Ferramentas de aplicação e projeção", "Attrezzi di posa e spruzzatura", "Uygulama ve püskürtme araçları", "施工工具与喷涂设备", "एप्लिकेशन टूल्स और स्प्रेइंग"],
    ["Diamond tools & abrasives", "Outils diamantés & abrasifs", "الأدوات الماسية والمواد الكاشطة", "Herramientas diamantadas y abrasivos", "Ferramentas diamantadas e abrasivos", "Utensili diamantati e abrasivi", "Elmas takımlar ve aşındırıcılar", "金刚石工具与磨具", "डायमंड टूल्स और अब्रेसिव"],
    ["Raw materials, minerals & additives", "Matières premières, minéraux & additifs", "المواد الخام والمعادن والإضافات", "Materias primas, minerales y aditivos", "Matérias-primas, minerais e aditivos", "Materie prime, minerali e additivi", "Hammaddeler, mineraller ve katkılar", "原料、矿物与添加剂", "कच्चा माल, खनिज और एडिटिव"],
    ["Testing, quality & certification", "Essais, qualité & certification", "الاختبار والجودة والاعتماد", "Ensayos, calidad y certificación", "Ensaios, qualidade e certificação", "Prove, qualità e certificazione", "Test, kalite ve belgelendirme", "检测、质量与认证", "परीक्षण, गुणवत्ता और प्रमाणन"],
    ["BIM, design & visualisation software", "BIM, logiciels de conception & visualisation", "برمجيات BIM والتصميم والتصور", "BIM, software de diseño y visualización", "BIM, software de design e visualização", "BIM, software di progettazione e visualizzazione", "BIM, tasarım ve görselleştirme yazılımı", "BIM、设计与可视化软件", "BIM, डिज़ाइन और विज़ुअलाइज़ेशन सॉफ़्टवेयर"],
    ["Packaging, handling & logistics", "Emballage, manutention & logistique", "التغليف والمناولة واللوجستيات", "Embalaje, manipulación y logística", "Embalagem, movimentação e logística", "Imballaggio, movimentazione e logistica", "Ambalaj, taşıma ve lojistik", "包装、搬运与物流", "पैकेजिंग, हैंडलिंग और लॉजिस्टिक्स"],
  ]),
  group("facades-envelope", ["Facades & Building Envelope", "Façades & enveloppe du bâtiment", "الواجهات وغلاف المبنى", "Fachadas y envolvente", "Fachadas e envolvente", "Facciate e involucro edilizio", "Cephe ve bina kabuğu", "幕墙与建筑围护", "फ़साड और बिल्डिंग एनवेलप"], false, [
    ["Ventilated facades", "Façades ventilées", "الواجهات المهواة", "Fachadas ventiladas", "Fachadas ventiladas", "Facciate ventilate", "Havalandırmalı cepheler", "干挂通风幕墙", "वेंटिलेटेड फ़साड"],
    ["Aluminium composite panels", "Panneaux composites aluminium", "ألواح الألومنيوم المركبة", "Paneles composite de aluminio", "Painéis compósitos de alumínio", "Pannelli compositi in alluminio", "Alüminyum kompozit paneller", "铝塑复合板", "एल्युमिनियम कम्पोज़िट पैनल"],
    ["Fibre-cement & HPL cladding", "Bardage fibres-ciment & HPL", "كسوة الألياف الإسمنتية وHPL", "Revestimiento de fibrocemento y HPL", "Revestimento em fibrocimento e HPL", "Rivestimenti in fibrocemento e HPL", "Lifli çimento ve HPL cephe", "纤维水泥板与HPL外墙板", "फ़ाइबर-सीमेंट और HPL क्लैडिंग"],
    ["Curtain walls & structural glazing", "Murs-rideaux & VEC", "الجدران الستائرية والزجاج الإنشائي", "Muros cortina y vidrio estructural", "Fachadas-cortina e vidro estrutural", "Facciate continue e vetro strutturale", "Giydirme cephe ve yapısal cam", "玻璃幕墙与结构玻璃", "कर्टन वॉल और स्ट्रक्चरल ग्लेज़िंग"],
    ["ETICS & external insulation", "ITE & isolation par l’extérieur", "العزل الخارجي للواجهات", "SATE y aislamiento exterior", "ETICS e isolamento exterior", "Cappotto termico", "Mantolama ve dış yalıtım", "外墙外保温系统", "ETICS और बाहरी इंसुलेशन"],
    ["GRC, GRP & architectural precast", "GRC, GRP & préfabriqué architectonique", "الخرسانة المسلحة بالألياف والمسبقة الصنع", "GRC, GRP y prefabricado arquitectónico", "GRC, GRP e pré-fabricado arquitetónico", "GRC, GRP e prefabbricati architettonici", "GRC, GRP ve mimari prekast", "GRC、GRP与建筑预制件", "GRC, GRP और आर्किटेक्चरल प्रीकास्ट"],
    ["Metal facades, louvres & sun shading", "Façades métalliques, brise-soleil", "الواجهات المعدنية وكاسرات الشمس", "Fachadas metálicas, lamas y parasoles", "Fachadas metálicas, lâminas e sombreamento", "Facciate metalliche, frangisole", "Metal cephe, panjur ve güneş kırıcılar", "金属幕墙、百叶与遮阳", "मेटल फ़साड, लूवर और सन शेडिंग"],
    ["Roofing & roof membranes", "Couverture & membranes de toiture", "الأسقف وأغشية الأسطح", "Cubiertas y membranas", "Coberturas e membranas", "Coperture e membrane", "Çatı ve çatı membranları", "屋面与屋面卷材", "रूफ़िंग और रूफ़ मेम्ब्रेन"],
    ["Brick & facing masonry", "Brique & parement", "الطوب والبناء الظاهر", "Ladrillo caravista", "Tijolo face à vista", "Laterizi faccia a vista", "Tuğla ve yüzey kaplama", "清水砖与饰面砌体", "ईंट और फ़ेसिंग मेसनरी"],
  ]),
  group("joinery-glazing", ["Doors, Windows & Glass", "Menuiseries, vitrages & verre", "الأبواب والنوافذ والزجاج", "Puertas, ventanas y vidrio", "Portas, janelas e vidro", "Porte, finestre e vetro", "Kapı, pencere ve cam", "门窗与玻璃", "दरवाज़े, खिड़कियाँ और कांच"], false, [
    ["Interior & entrance doors", "Portes intérieures & d’entrée", "الأبواب الداخلية والمداخل", "Puertas de interior y de entrada", "Portas interiores e de entrada", "Porte interne e d’ingresso", "İç ve giriş kapıları", "室内门与入户门", "आंतरिक और प्रवेश दरवाज़े"],
    ["Aluminium & PVC windows", "Fenêtres aluminium & PVC", "نوافذ الألومنيوم وPVC", "Ventanas de aluminio y PVC", "Janelas de alumínio e PVC", "Finestre in alluminio e PVC", "Alüminyum ve PVC pencereler", "铝合金与PVC门窗", "एल्युमिनियम और PVC खिड़कियाँ"],
    ["Architectural & decorative glass", "Verre architectural & décoratif", "الزجاج المعماري والزخرفي", "Vidrio arquitectónico y decorativo", "Vidro arquitetónico e decorativo", "Vetro architettonico e decorativo", "Mimari ve dekoratif cam", "建筑与装饰玻璃", "आर्किटेक्चरल और सजावटी कांच"],
    ["Glass partitions & shower enclosures", "Cloisons vitrées & parois de douche", "القواطع الزجاجية وكابينات الاستحمام", "Mamparas de vidrio y de ducha", "Divisórias de vidro e resguardos de duche", "Pareti vetrate e box doccia", "Cam bölmeler ve duşakabinler", "玻璃隔断与淋浴房", "कांच पार्टिशन और शावर एनक्लोज़र"],
    ["Hardware & ironmongery", "Quincaillerie architecturale", "الإكسسوارات والمقابض المعمارية", "Herrajes", "Ferragens", "Ferramenta e maniglieria", "Kapı ve pencere donanımı", "五金配件", "हार्डवेयर और आयरनमॉन्गरी"],
    ["Shutters, blinds & automation", "Volets, stores & automatismes", "المصاريع والستائر والأتمتة", "Persianas, estores y automatismos", "Estores, persianas e automatismos", "Tapparelle, tende e automazioni", "Panjur, perde ve otomasyon", "卷帘、遮阳与自动化", "शटर, ब्लाइंड्स और ऑटोमेशन"],
    ["Fire & security doors", "Portes coupe-feu & blindées", "أبواب الحريق والأمان", "Puertas cortafuegos y de seguridad", "Portas corta-fogo e de segurança", "Porte tagliafuoco e blindate", "Yangın ve çelik kapılar", "防火门与安全门", "फ़ायर और सिक्योरिटी दरवाज़े"],
  ]),
  group("bath-kitchen", ["Bathroom, Kitchen & Fit-out", "Salle de bains, cuisine & agencement", "الحمامات والمطابخ والتجهيز", "Baño, cocina y equipamiento", "Casa de banho, cozinha e equipamento", "Bagno, cucina e arredo", "Banyo, mutfak ve donatı", "卫浴、厨房与装修", "बाथरूम, किचन और फ़िट-आउट"], false, [
    ["Sanitaryware", "Sanitaires", "الأدوات الصحية", "Sanitarios", "Louça sanitária", "Sanitari", "Vitrifiye", "卫生洁具", "सैनिटरीवेयर"],
    ["Taps & mixers", "Robinetterie", "الحنفيات والخلاطات", "Grifería", "Torneiras e misturadoras", "Rubinetteria", "Armatürler", "龙头与水暖件", "नल और मिक्सर"],
    ["Bathroom furniture & wellness", "Meubles de salle de bains & bien-être", "أثاث الحمام والعافية", "Mueble de baño y wellness", "Móveis de casa de banho e bem-estar", "Mobili bagno e wellness", "Banyo mobilyası ve wellness", "浴室柜与康体设备", "बाथरूम फ़र्नीचर और वेलनेस"],
    ["Kitchens & worktops", "Cuisines & plans de travail", "المطابخ وأسطح العمل", "Cocinas y encimeras", "Cozinhas e bancadas", "Cucine e piani di lavoro", "Mutfak ve tezgâhlar", "橱柜与台面", "किचन और वर्कटॉप"],
    ["Built-in furniture & joinery", "Agencement & menuiserie intérieure", "الأثاث المدمج والنجارة", "Mobiliario a medida y carpintería", "Mobiliário por medida e carpintaria", "Arredo su misura e falegnameria", "Ankastre mobilya ve doğrama", "定制家具与木作", "बिल्ट-इन फ़र्नीचर और जॉइनरी"],
    ["Outdoor living & pool finishes", "Aménagements extérieurs & piscines", "المساحات الخارجية وتشطيبات المسابح", "Exterior y acabados de piscina", "Exterior e acabamentos de piscina", "Outdoor e finiture per piscine", "Dış mekân ve havuz kaplamaları", "户外与泳池饰面", "आउटडोर और पूल फ़िनिश"],
  ]),
];

export const familyCount = familyGroups.reduce((n, g) => n + g.families.length, 0);
