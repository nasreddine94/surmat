import type { L } from "@/lib/i18n";
import type { GroupId } from "./families";

/**
 * The material board & render studio: one board per product family — four real samples on the
 * left, the family in use on the right with numbered technical callouts — rebuilt natively
 * from the SURMAT "Global Architectural Material Board" (docs/Global_Architectural_Material_Board).
 *
 * Swatches are cropped from that board (public/images/board/s{n}-{i}.webp). Renders are the
 * board's scenes with the baked-in labels removed (`render`); callouts are placed in the
 * board's own pixel coordinates (`at`, on a 1834 × 1024 slide) and converted through `crop`,
 * so they sit exactly where the original annotations pointed.
 *
 * Text is written [en, fr, ar, es, pt, it, tr, zh, hi].
 */
type Row = [string, string, string, string, string, string, string, string, string];
const l = ([en, fr, ar, es, pt, it, tr, zh, hi]: Row): L => ({ en, fr, ar, es, pt, it, tr, zh, hi });

export type Callout = { at: [number, number]; text: L };
export type Board = {
  id: string;
  n: number;
  title: L;
  group: GroupId;
  /** Render crop on the original slide: x, y, width, height. */
  crop: [number, number, number, number];
  render: string;
  swatches: L[];
  callouts: Callout[];
};

const HF = "https://d8j0ntlcm91z4.cloudfront.net/user_39GebVBNf0LF9ZNbDOYTMnx1vfO";

const b = (n: number, id: string, group: GroupId, crop: Board["crop"], render: string, title: Row, swatches: Row[], callouts: [number, number, Row][]): Board => ({
  id,
  n,
  group,
  crop,
  render: render.startsWith("http") ? render : `${HF}/${render}`,
  title: l(title),
  swatches: swatches.map(l),
  callouts: callouts.map(([x, y, t]) => ({ at: [x, y], text: l(t) })),
});

/** Callout position as a percentage of the render. */
export const pos = (board: Board, c: Callout) => ({
  x: ((c.at[0] - board.crop[0]) / board.crop[2]) * 100,
  y: ((c.at[1] - board.crop[1]) / board.crop[3]) * 100,
});

export const swatchSrc = (board: Board, i: number) => `/images/board/s${board.n}-${i + 1}.webp`;

export const boards: Board[] = [
  b(2, "heavy-clay", "ceramic-porcelain", [917, 267, 917, 545], "hf_20260925_232333_0144a712-f589-4df1-ab17-6967ebb4b333.png",
    ["Heavy clay & technical ceramics", "Terre cuite & céramiques techniques", "الطين المشوي والسيراميك التقني", "Cerámica estructural y técnica", "Cerâmica estrutural e técnica", "Laterizi e ceramiche tecniche", "Pişmiş toprak ve teknik seramik", "黏土制品与技术陶瓷", "हेवी क्ले और तकनीकी सिरेमिक"],
    [
      ["Red terracotta", "Terre cuite rouge", "طين مشوي أحمر", "Terracota roja", "Terracota vermelha", "Cotto rosso", "Kırmızı pişmiş toprak", "红陶", "लाल टेराकोटा"],
      ["Extruded perforated brick", "Brique perforée extrudée", "طوب مثقّب مبثوق", "Ladrillo perforado extruido", "Tijolo perfurado extrudido", "Laterizio forato estruso", "Ekstrüde delikli tuğla", "挤出多孔砖", "एक्सट्रूडेड छिद्रित ईंट"],
      ["Advanced technical ceramic", "Céramique technique avancée", "سيراميك تقني متقدّم", "Cerámica técnica avanzada", "Cerâmica técnica avançada", "Ceramica tecnica avanzata", "İleri teknik seramik", "先进技术陶瓷", "उन्नत तकनीकी सिरेमिक"],
      ["Precast architectural concrete", "Béton architectonique préfabriqué", "خرسانة معمارية مسبقة الصب", "Hormigón arquitectónico prefabricado", "Betão arquitetónico pré-fabricado", "Calcestruzzo architettonico prefabbricato", "Prekast mimari beton", "预制建筑混凝土", "प्रीकास्ट आर्किटेक्चरल कंक्रीट"],
    ],
    [
      [1052, 432, ["High thermal mass & acoustic insulation", "Forte inertie thermique & isolation acoustique", "كتلة حرارية عالية وعزل صوتي", "Alta inercia térmica y aislamiento acústico", "Elevada inércia térmica e isolamento acústico", "Elevata massa termica e isolamento acustico", "Yüksek ısıl kütle ve ses yalıtımı", "高热惰性与隔声", "उच्च थर्मल मास और ध्वनि इंसुलेशन"]],
      [1240, 752, ["Thermal shock resistance", "Résistance aux chocs thermiques", "مقاومة الصدمات الحرارية", "Resistencia al choque térmico", "Resistência ao choque térmico", "Resistenza agli shock termici", "Isıl şok direnci", "抗热震", "थर्मल शॉक प्रतिरोध"]],
      [1520, 672, ["Heavy-load capacity for commercial traffic", "Forte charge pour le trafic commercial", "تحمّل أحمال ثقيلة للحركة التجارية", "Gran capacidad de carga para tráfico comercial", "Alta capacidade de carga para tráfego comercial", "Elevata portata per traffico commerciale", "Ticari trafik için yüksek yük kapasitesi", "适应商业人流的高承载", "व्यावसायिक आवाजाही के लिए भारी भार क्षमता"]],
    ]),
  b(3, "porcelain-slabs", "ceramic-porcelain", [970, 127, 810, 836], "hf_20260925_232309_af04586f-858e-467f-8020-d9fd3ffb09cf.png",
    ["Large-format porcelain slabs", "Grandes dalles en grès cérame", "بلاطات البورسلين الكبيرة", "Placas porcelánicas de gran formato", "Placas porcelânicas de grande formato", "Lastre in gres di grande formato", "Büyük format porselen levhalar", "大规格瓷质板", "बड़े फ़ॉर्मेट पोर्सिलेन स्लैब"],
    [
      ["Matte white porcelain", "Grès cérame blanc mat", "بورسلين أبيض مطفأ", "Porcelánico blanco mate", "Porcelânico branco mate", "Gres bianco opaco", "Mat beyaz porselen", "哑光白瓷砖", "मैट सफ़ेद पोर्सिलेन"],
      ["High-gloss polished porcelain", "Grès cérame poli brillant", "بورسلين مصقول لامع", "Porcelánico pulido brillante", "Porcelânico polido brilhante", "Gres lucidato a specchio", "Parlak cilalı porselen", "高光抛光瓷砖", "हाई-ग्लॉस पॉलिश पोर्सिलेन"],
      ["Textured stone-look porcelain", "Grès cérame effet pierre texturé", "بورسلين بمظهر الحجر", "Porcelánico efecto piedra texturizado", "Porcelânico efeito pedra texturado", "Gres effetto pietra strutturato", "Doku taş görünümlü porselen", "仿石纹理瓷砖", "टेक्सचर्ड पत्थर-लुक पोर्सिलेन"],
      ["Oxidised metal-look porcelain", "Grès cérame effet métal oxydé", "بورسلين بمظهر المعدن المؤكسد", "Porcelánico efecto metal oxidado", "Porcelânico efeito metal oxidado", "Gres effetto metallo ossidato", "Oksitlenmiş metal görünümlü porselen", "仿氧化金属瓷砖", "ऑक्सीडाइज़्ड मेटल-लुक पोर्सिलेन"],
    ],
    [
      [1218, 764, ["Minimal 1 mm joints for a monolithic look", "Joints minimaux de 1 mm pour un aspect monolithique", "فواصل 1 مم لمظهر متّصل", "Juntas mínimas de 1 mm para un aspecto monolítico", "Juntas mínimas de 1 mm para um aspeto monolítico", "Fughe minime da 1 mm per un effetto monolitico", "Monolitik görünüm için 1 mm derz", "1 毫米细缝，整体无缝效果", "एकरूप दिखावट के लिए 1 मिमी जोड़"]],
      [1446, 498, ["Ultra-thin 6 mm cladding over existing walls", "Habillage ultra-fin de 6 mm sur supports existants", "كسوة رقيقة 6 مم فوق الجدران القائمة", "Revestimiento ultrafino de 6 mm sobre soportes existentes", "Revestimento ultrafino de 6 mm sobre suportes existentes", "Rivestimento ultrasottile da 6 mm su supporti esistenti", "Mevcut yüzey üzerine 6 mm ince kaplama", "6 毫米超薄板直接覆盖原墙面", "मौजूदा दीवारों पर 6 मिमी अल्ट्रा-थिन क्लैडिंग"]],
    ]),
  b(4, "marble-stone", "natural-engineered-stone", [970, 0, 864, 1024], "hf_20260925_232333_047349fc-f999-4ece-9af1-c83032e83088.png",
    ["Natural marble & stone", "Marbre & pierre naturelle", "الرخام والحجر الطبيعي", "Mármol y piedra natural", "Mármore e pedra natural", "Marmo e pietra naturale", "Doğal mermer ve taş", "天然大理石与石材", "प्राकृतिक संगमरमर और पत्थर"],
    [
      ["Vein-cut travertine", "Travertin coupe veine", "ترافرتين مقطوع مع العروق", "Travertino corte vena", "Travertino corte veio", "Travertino taglio vena", "Damar kesim traverten", "顺纹切洞石", "वेन-कट ट्रैवर्टीन"],
      ["Calacatta Gold marble", "Marbre Calacatta Gold", "رخام كالاكاتا غولد", "Mármol Calacatta Gold", "Mármore Calacatta Gold", "Marmo Calacatta Oro", "Calacatta Gold mermer", "金色卡拉卡塔大理石", "कैलाकट्टा गोल्ड संगमरमर"],
      ["Nero Marquina marble", "Marbre Nero Marquina", "رخام نيرو ماركينا", "Mármol Nero Marquina", "Mármore Nero Marquina", "Marmo Nero Marquina", "Nero Marquina mermer", "黑白根大理石", "नीरो मार्किना संगमरमर"],
      ["Rough-cut granite", "Granit brut de sciage", "غرانيت خام", "Granito en bruto", "Granito em bruto", "Granito grezzo", "Kaba kesim granit", "粗面花岗岩", "रफ़-कट ग्रेनाइट"],
    ],
    [
      [1400, 325, ["Book-matched vein alignment", "Veines en livre ouvert", "مطابقة العروق المتناظرة", "Vetas en libro abierto", "Veios em livro aberto", "Venature a macchia aperta", "Kitap açılımı damar eşleşmesi", "对纹拼接", "बुक-मैच्ड नसें"]],
      [1400, 648, ["CNC precision edge finishing", "Chants usinés CNC de précision", "تشطيب حواف دقيق بالتحكم الرقمي", "Cantos de precisión por CNC", "Arestas de precisão por CNC", "Coste di precisione CNC", "CNC hassas kenar işleme", "数控精密磨边", "CNC सटीक किनारा फ़िनिश"]],
      [1553, 832, ["Traceable quarrying", "Extraction traçable", "استخراج قابل للتتبّع", "Extracción trazable", "Extração rastreável", "Estrazione tracciabile", "İzlenebilir ocak üretimi", "可追溯开采", "ट्रेस करने योग्य खनन"]],
    ]),
  b(5, "quartz", "natural-engineered-stone", [997, 195, 745, 750], "hf_20260925_232332_3cb43fe1-8981-40c7-be4e-7e4e194b6f9a.png",
    ["Engineered quartz & terrazzo", "Quartz reconstitué & terrazzo", "الكوارتز المُصنّع والتيرازو", "Cuarzo técnico y terrazo", "Quartzo técnico e terrazzo", "Quarzo tecnico e terrazzo", "Mühendislik kuvarsı ve terrazzo", "石英石与水磨石", "इंजीनियर्ड क्वार्ट्ज़ और टेराज़ो"],
    [
      ["Pure white quartz", "Quartz blanc pur", "كوارتز أبيض ناصع", "Cuarzo blanco puro", "Quartzo branco puro", "Quarzo bianco puro", "Saf beyaz kuvars", "纯白石英石", "शुद्ध सफ़ेद क्वार्ट्ज़"],
      ["Palladiana terrazzo", "Terrazzo palladien", "تيرازو بالاديانا", "Terrazo palladiana", "Terrazzo palladiana", "Terrazzo alla palladiana", "Palladiana terrazzo", "帕拉迪亚纳水磨石", "पल्लाडियाना टेराज़ो"],
      ["Concrete-look quartz", "Quartz effet béton", "كوارتز بمظهر الخرسانة", "Cuarzo efecto hormigón", "Quartzo efeito betão", "Quarzo effetto cemento", "Beton görünümlü kuvars", "仿水泥石英石", "कंक्रीट-लुक क्वार्ट्ज़"],
      ["Deep-veined engineered stone", "Pierre reconstituée veinée", "حجر مُصنّع بعروق عميقة", "Piedra técnica veteada", "Pedra técnica veiada", "Pietra tecnica venata", "Derin damarlı yapay taş", "深纹人造石", "गहरी नसों वाला इंजीनियर्ड स्टोन"],
    ],
    [
      [1165, 517, ["Non-porous resin-bound surface", "Surface non poreuse liée à la résine", "سطح غير مسامي مرتبط بالراتنج", "Superficie no porosa con resina", "Superfície não porosa com resina", "Superficie non porosa legata a resina", "Gözeneksiz reçine bağlı yüzey", "树脂结合、无孔表面", "रेज़िन-बद्ध गैर-छिद्रित सतह"]],
      [1351, 517, ["Stain resistant, no sealing", "Anti-taches, sans traitement", "مقاوم للبقع دون معالجة", "Antimanchas, sin sellado", "Antimanchas, sem selagem", "Antimacchia, senza trattamenti", "Leke tutmaz, cilaya gerek yok", "耐污，无需封护", "दाग-रोधी, सीलिंग की ज़रूरत नहीं"]],
      [1530, 464, ["Heat-resistant prep zones", "Plans de préparation résistants à la chaleur", "مناطق تحضير مقاومة للحرارة", "Zonas de trabajo resistentes al calor", "Zonas de preparação resistentes ao calor", "Zone di lavoro resistenti al calore", "Isıya dayanıklı hazırlık alanları", "耐热操作区", "गर्मी-प्रतिरोधी तैयारी क्षेत्र"]],
    ]),
  b(6, "wood", "interior-finishing-systems", [997, 195, 745, 750], "hf_20260925_232309_63feb939-50c1-4b7d-a165-5585b6b2148e.png",
    ["Solid wood & parquet", "Bois massif & parquet", "الخشب الصلب والباركيه", "Madera maciza y parquet", "Madeira maciça e parquet", "Legno massello e parquet", "Masif ahşap ve parke", "实木与拼花地板", "ठोस लकड़ी और पार्केट"],
    [
      ["Herringbone oak", "Chêne point de Hongrie", "بلوط بنمط عظمة السمكة", "Roble en espiga", "Carvalho espinha", "Rovere a spina", "Balıksırtı meşe", "橡木人字拼", "हेरिंगबोन ओक"],
      ["Wide-plank European walnut", "Noyer européen grandes lames", "جوز أوروبي بألواح عريضة", "Nogal europeo de tabla ancha", "Nogueira europeia de tábua larga", "Noce europeo a plancia larga", "Geniş tahta Avrupa cevizi", "宽板欧洲胡桃木", "चौड़े तख़्ते वाला यूरोपीय अखरोट"],
      ["Reclaimed timber", "Bois de récupération", "خشب معاد التدوير", "Madera recuperada", "Madeira recuperada", "Legno di recupero", "Geri kazanılmış ahşap", "回收旧木", "रीक्लेम्ड लकड़ी"],
      ["Light Nordic ash", "Frêne nordique clair", "دردار شمالي فاتح", "Fresno nórdico claro", "Freixo nórdico claro", "Frassino nordico chiaro", "Açık İskandinav dişbudağı", "浅色北欧白蜡木", "हल्की नॉर्डिक ऐश"],
    ],
    [
      [1148, 695, ["Acoustic underlay", "Sous-couche acoustique", "طبقة سفلية عازلة للصوت", "Base acústica", "Base acústica", "Materassino acustico", "Akustik alt katman", "隔音垫层", "ध्वनिक अंडरले"]],
      [1383, 876, ["Precision click-lock installation", "Pose clipsable de précision", "تركيب دقيق بنظام التعشيق", "Instalación de clic de precisión", "Instalação de encaixe de precisão", "Posa a incastro di precisione", "Hassas tıklamalı montaj", "精密锁扣安装", "सटीक क्लिक-लॉक इंस्टॉलेशन"]],
      [1570, 766, ["Natural thermal comfort", "Confort thermique naturel", "راحة حرارية طبيعية", "Confort térmico natural", "Conforto térmico natural", "Comfort termico naturale", "Doğal ısıl konfor", "天然温润脚感", "प्राकृतिक थर्मल आराम"]],
    ]),
  b(7, "resilient", "interior-finishing-systems", [997, 195, 745, 750], "hf_20260925_232309_f18041b5-216f-4e44-8dd5-d5e0ee03ad5f.png",
    ["Resilient & LVT flooring", "Sols souples & LVT", "الأرضيات المرنة وLVT", "Pavimentos flexibles y LVT", "Pavimentos vinílicos e LVT", "Pavimenti resilienti e LVT", "Esnek zemin ve LVT", "弹性地材与 LVT", "रेज़िलिएंट और LVT फ़्लोरिंग"],
    [
      ["Concrete-look LVT", "LVT effet béton", "LVT بمظهر الخرسانة", "LVT efecto hormigón", "LVT efeito betão", "LVT effetto cemento", "Beton görünümlü LVT", "仿水泥 LVT", "कंक्रीट-लुक LVT"],
      ["Rigid-core vinyl plank", "Lame vinyle à âme rigide", "ألواح فينيل بقلب صلب", "Lama vinílica de núcleo rígido", "Lâmina vinílica de núcleo rígido", "Plancia vinilica a nucleo rigido", "Sert çekirdekli vinil", "硬芯石塑地板", "रिजिड-कोर विनाइल प्लैंक"],
      ["Natural linoleum", "Linoléum naturel", "لينوليوم طبيعي", "Linóleo natural", "Linóleo natural", "Linoleum naturale", "Doğal linolyum", "天然亚麻地板", "प्राकृतिक लिनोलियम"],
      ["Commercial rubber", "Caoutchouc commercial", "مطاط تجاري", "Caucho comercial", "Borracha comercial", "Gomma commerciale", "Ticari kauçuk", "商用橡胶地板", "कमर्शियल रबर"],
    ],
    [
      [1386, 638, ["0.7 mm commercial wear layer", "Couche d’usure commerciale 0,7 mm", "طبقة اهتراء تجارية 0.7 مم", "Capa de uso comercial de 0,7 mm", "Camada de uso comercial 0,7 mm", "Strato d’usura commerciale 0,7 mm", "0,7 mm ticari aşınma katmanı", "0.7 毫米商用耐磨层", "0.7 मिमी कमर्शियल वियर लेयर"]],
      [1343, 783, ["100 % waterproof backing", "Envers 100 % étanche", "طبقة خلفية مقاومة للماء 100%", "Base 100 % impermeable", "Base 100 % impermeável", "Supporto 100 % impermeabile", "%100 su geçirmez taban", "100% 防水背层", "100% वॉटरप्रूफ़ बैकिंग"]],
      [1601, 726, ["High-traffic scratch durability", "Résistance aux rayures en fort trafic", "مقاومة الخدش في الحركة الكثيفة", "Resistencia al rayado en alto tránsito", "Resistência a riscos em tráfego intenso", "Resistenza ai graffi ad alto traffico", "Yoğun trafikte çizilme direnci", "高人流耐刮擦", "भारी आवाजाही में खरोंच-रोधी"]],
    ]),
  b(8, "carpet", "interior-finishing-systems", [917, 105, 917, 919], "hf_20260925_232343_5f110dc0-505d-4c00-a2be-e0b1e272190f.png",
    ["Textile floors & carpets", "Sols textiles & moquettes", "الأرضيات النسيجية والسجاد", "Suelos textiles y moquetas", "Pavimentos têxteis e alcatifas", "Pavimenti tessili e moquette", "Tekstil zeminler ve halılar", "纺织地材与地毯", "टेक्सटाइल फ़्लोर और कालीन"],
    [
      ["Woven broadloom", "Moquette tissée en lés", "سجاد منسوج بعرض كامل", "Moqueta tejida", "Alcatifa tecida", "Moquette tessuta", "Dokuma geniş halı", "机织满铺地毯", "बुना हुआ ब्रॉडलूम"],
      ["Commercial carpet tiles", "Dalles de moquette", "بلاطات سجاد تجارية", "Losetas de moqueta", "Placas de alcatifa", "Quadrotte di moquette", "Ticari halı karo", "商用方块地毯", "कमर्शियल कार्पेट टाइल्स"],
      ["Plush tufted wool", "Laine tuftée épaisse", "صوف كثيف معنقد", "Lana tufting mullida", "Lã tufada felpuda", "Lana tufted soffice", "Kalın tufting yün", "簇绒羊毛", "मुलायम टफ़्टेड ऊन"],
      ["High-performance yarn", "Fil haute performance", "خيوط عالية الأداء", "Hilo de alto rendimiento", "Fio de alto desempenho", "Filato ad alte prestazioni", "Yüksek performanslı iplik", "高性能纱线", "हाई-परफ़ॉर्मेंस यार्न"],
    ],
    [
      [1200, 770, ["High sound absorption", "Forte absorption acoustique", "امتصاص صوتي عالٍ", "Alta absorción acústica", "Elevada absorção sonora", "Elevato assorbimento acustico", "Yüksek ses yutumu", "高吸声", "उच्च ध्वनि अवशोषण"]],
      [1465, 625, ["Modular tiles, local replacement", "Dalles modulaires, remplacement localisé", "بلاطات معيارية قابلة للاستبدال الموضعي", "Losetas modulares, reposición local", "Placas modulares, substituição localizada", "Quadrotte modulari, sostituzione locale", "Modüler karo, yerel değişim", "模块化铺装，可局部更换", "मॉड्यूलर टाइलें, स्थानीय बदलाव"]],
      [1550, 795, ["Crush-resistant yarn", "Fil résistant à l’écrasement", "خيوط مقاومة للانضغاط", "Hilo resistente al aplastamiento", "Fio resistente ao esmagamento", "Filato resistente allo schiacciamento", "Ezilmeye dayanıklı iplik", "抗压回弹纱线", "दबाव-रोधी यार्न"]],
    ]),
  b(9, "microcement", "paints-coatings", [917, 178, 917, 846], "hf_20260925_232343_83d87b92-a014-431d-b472-c5a0925327e3.png",
    ["Microcement & seamless resins", "Microciment & résines coulées", "الميكروسمنت والراتنجات المتّصلة", "Microcemento y resinas continuas", "Microcimento e resinas contínuas", "Microcemento e resine continue", "Mikro beton ve derzsiz reçineler", "微水泥与无缝树脂", "माइक्रोसीमेंट और सीमलेस रेज़िन"],
    [
      ["Polished grey microcement", "Microciment gris poli", "ميكروسمنت رمادي مصقول", "Microcemento gris pulido", "Microcimento cinzento polido", "Microcemento grigio lucidato", "Cilalı gri mikro beton", "抛光灰色微水泥", "पॉलिश्ड ग्रे माइक्रोसीमेंट"],
      ["Matte white epoxy", "Époxy blanc mat", "إيبوكسي أبيض مطفأ", "Epoxi blanco mate", "Epóxi branco mate", "Epossidico bianco opaco", "Mat beyaz epoksi", "哑光白环氧", "मैट सफ़ेद इपॉक्सी"],
      ["Textured polyurethane resin", "Résine polyuréthane texturée", "راتنج بولي يوريثان محبّب", "Resina de poliuretano texturizada", "Resina de poliuretano texturada", "Resina poliuretanica materica", "Dokulu poliüretan reçine", "纹理聚氨酯树脂", "टेक्सचर्ड पॉलीयूरेथेन रेज़िन"],
      ["Metallic floor coating", "Revêtement de sol métallisé", "طلاء أرضيات معدني", "Recubrimiento metálico de suelo", "Revestimento metálico de pavimento", "Rivestimento metallico per pavimenti", "Metalik zemin kaplaması", "金属效果地坪涂层", "मेटैलिक फ़्लोर कोटिंग"],
    ],
    [
      [1365, 645, ["Continuous, poured application", "Application coulée en continu", "تطبيق متّصل بالصبّ", "Aplicación continua vertida", "Aplicação contínua vertida", "Applicazione continua colata", "Kesintisiz dökme uygulama", "连续浇筑施工", "निरंतर ढलाई अनुप्रयोग"]],
      [1688, 700, ["No joints on floors and walls", "Aucun joint au sol comme au mur", "بلا فواصل على الأرض والجدران", "Sin juntas en suelos y paredes", "Sem juntas em pavimentos e paredes", "Nessuna fuga su pavimenti e pareti", "Zemin ve duvarda derzsiz", "地面墙面无接缝", "फ़र्श और दीवारों पर कोई जोड़ नहीं"]],
      [1079, 843, ["Bonds over existing tiles", "Adhère sur carrelage existant", "يلتصق فوق البلاط القائم", "Se adhiere sobre baldosas existentes", "Adere sobre ladrilho existente", "Aderisce su piastrelle esistenti", "Mevcut karo üzerine uygulanır", "可直接覆盖原瓷砖", "मौजूदा टाइलों पर चिपकता है"]],
    ]),
  b(10, "decorative-paint", "paints-coatings", [917, 141, 643, 834], "hf_20260925_232309_fe6b0b1a-0d40-4359-b264-4b04ac568145.png",
    ["Decorative paints & plasters", "Peintures & enduits décoratifs", "الدهانات واللياسة الزخرفية", "Pinturas y estucos decorativos", "Tintas e estuques decorativos", "Pitture e stucchi decorativi", "Dekoratif boya ve sıvalar", "装饰涂料与艺术灰泥", "सजावटी पेंट और प्लास्टर"],
    [
      ["High-gloss Venetian plaster", "Stuc vénitien brillant", "جص فينيسي لامع", "Estuco veneciano brillante", "Estuque veneziano brilhante", "Stucco veneziano lucido", "Parlak Venedik sıvası", "高光威尼斯灰泥", "हाई-ग्लॉस वेनेशियन प्लास्टर"],
      ["Ultra-matte acrylic paint", "Peinture acrylique ultra-mate", "دهان أكريليك مطفأ جدًا", "Pintura acrílica ultramate", "Tinta acrílica ultramate", "Pittura acrilica ultraopaca", "Ultra mat akrilik boya", "超哑光丙烯酸涂料", "अल्ट्रा-मैट एक्रेलिक पेंट"],
      ["Pearlescent metallic wash", "Patine métallisée nacrée", "طلاء معدني لؤلؤي", "Veladura metálica perlada", "Velatura metálica perolada", "Velatura metallica perlata", "Sedefli metalik yıkama", "珠光金属涂层", "मोती जैसी मेटैलिक वॉश"],
      ["Textured mineral stucco", "Enduit minéral texturé", "لياسة معدنية محبّبة", "Estuco mineral texturizado", "Estuque mineral texturado", "Stucco minerale materico", "Dokulu mineral sıva", "肌理矿物灰泥", "टेक्सचर्ड मिनरल स्टको"],
    ],
    [
      [1385, 348, ["High light reflectance", "Forte réflexion lumineuse", "انعكاس ضوئي عالٍ", "Alta reflexión de la luz", "Elevada reflexão da luz", "Elevata riflessione della luce", "Yüksek ışık yansıtma", "高光反射率", "उच्च प्रकाश परावर्तन"]],
      [1385, 528, ["Breathable mineral layers", "Couches minérales respirantes", "طبقات معدنية تسمح بالتنفّس", "Capas minerales transpirables", "Camadas minerais respiráveis", "Strati minerali traspiranti", "Nefes alan mineral katmanlar", "透气矿物层", "सांस लेने योग्य खनिज परतें"]],
      [1425, 685, ["Multi-coat artisan application", "Application artisanale multicouche", "تطبيق حرفي متعدد الطبقات", "Aplicación artesanal en varias capas", "Aplicação artesanal em várias demãos", "Applicazione artigianale a più mani", "Çok katlı zanaat uygulaması", "多遍手工施工", "कई परतों वाला कारीगरी अनुप्रयोग"]],
    ]),
  b(11, "panelling", "interior-finishing-systems", [917, 0, 917, 1024], "hf_20260925_232309_6b231f55-5271-4a6a-8a3f-343e23ab44fa.png",
    ["Wall & ceiling panelling", "Panneaux muraux & plafonds", "ألواح الجدران والأسقف", "Paneles de pared y techo", "Painéis de parede e teto", "Pannelli per pareti e soffitti", "Duvar ve tavan panelleri", "墙面与吊顶饰板", "दीवार और छत पैनलिंग"],
    [
      ["Fluted walnut panels", "Panneaux cannelés en noyer", "ألواح جوز مضلّعة", "Paneles acanalados de nogal", "Painéis canelados em nogueira", "Pannelli cannettati in noce", "Oluklu ceviz panel", "胡桃木格栅板", "फ़्लूटेड अखरोट पैनल"],
      ["3D geometric panels", "Panneaux 3D géométriques", "ألواح هندسية ثلاثية الأبعاد", "Paneles geométricos 3D", "Painéis geométricos 3D", "Pannelli geometrici 3D", "3B geometrik paneller", "3D 几何造型板", "3D ज्यामितीय पैनल"],
      ["Ribbed acoustic PET felt", "Feutre acoustique PET rainuré", "لباد PET صوتي مضلّع", "Fieltro acústico PET ranurado", "Feltro acústico PET canelado", "Feltro acustico PET a coste", "Nervürlü akustik PET keçe", "条纹 PET 吸音毡", "रिब्ड ध्वनिक PET फ़ेल्ट"],
      ["Aluminium trim profiles", "Profilés de finition aluminium", "مقاطع تشطيب ألمنيوم", "Perfiles de remate de aluminio", "Perfis de acabamento em alumínio", "Profili di finitura in alluminio", "Alüminyum bitiş profilleri", "铝合金收边条", "एल्युमिनियम ट्रिम प्रोफ़ाइल"],
    ],
    [
      [1300, 171, ["Acoustic baffles", "Baffles acoustiques", "حواجز صوتية معلّقة", "Bafles acústicos", "Baffles acústicos", "Baffle acustici", "Akustik bafıllar", "吸音垂片", "ध्वनिक बैफ़ल"]],
      [1487, 468, ["Hidden-clip fixing", "Fixation par clips invisibles", "تثبيت بمشابك مخفية", "Fijación con clips ocultos", "Fixação com clipes ocultos", "Fissaggio a clip nascoste", "Gizli klips montaj", "隐藏卡扣安装", "छिपी क्लिप फ़िक्सिंग"]],
      [1120, 695, ["Integrated LED channels", "Profils LED intégrés", "قنوات LED مدمجة", "Canales LED integrados", "Canais LED integrados", "Canali LED integrati", "Entegre LED kanalları", "集成 LED 灯槽", "एकीकृत LED चैनल"]],
    ]),
  b(12, "plasterboard", "interior-finishing-systems", [1100, 170, 700, 790], "hf_20260925_232430_6e990243-b4f2-439d-9ae7-31859f53d9eb.png",
    ["Plasterboard & partitions", "Plaques de plâtre & cloisons", "ألواح الجبس والقواطع", "Placas de yeso y tabiques", "Gesso cartonado e divisórias", "Cartongesso e pareti divisorie", "Alçıpan ve bölme duvarlar", "石膏板与隔墙", "प्लास्टरबोर्ड और पार्टिशन"],
    [
      ["Perforated acoustic board", "Plaque acoustique perforée", "لوح صوتي مثقّب", "Placa acústica perforada", "Placa acústica perfurada", "Lastra acustica forata", "Delikli akustik levha", "穿孔吸音石膏板", "छिद्रित ध्वनिक बोर्ड"],
      ["Moisture-resistant board", "Plaque hydrofuge", "لوح مقاوم للرطوبة", "Placa hidrófuga", "Placa hidrófuga", "Lastra idrorepellente", "Neme dayanıklı levha", "防潮石膏板", "नमी-रोधी बोर्ड"],
      ["Fire-rated board", "Plaque coupe-feu", "لوح مقاوم للحريق", "Placa ignífuga", "Placa corta-fogo", "Lastra antincendio", "Yangına dayanıklı levha", "防火石膏板", "अग्नि-रेटेड बोर्ड"],
      ["High-density impact board", "Plaque haute dureté", "لوح عالي الكثافة مقاوم للصدمات", "Placa de alta densidad antiimpacto", "Placa de alta densidade anti-impacto", "Lastra ad alta densità antiurto", "Yüksek yoğunluklu darbe levhası", "高密度抗冲击板", "उच्च घनत्व प्रभाव-रोधी बोर्ड"],
    ],
    [
      [1165, 348, ["Layered sound reduction", "Réduction acoustique multicouche", "تقليل الصوت بطبقات متعددة", "Reducción acústica por capas", "Redução acústica por camadas", "Riduzione acustica a strati", "Katmanlı ses azaltımı", "多层隔声", "परतदार ध्वनि कमी"]],
      [1345, 590, ["Mineral wool in the cavity", "Laine minérale dans l’ossature", "صوف معدني داخل الفراغ", "Lana mineral en la cámara", "Lã mineral na caixa", "Lana minerale nell’intercapedine", "Boşlukta taş yünü", "空腔填充岩棉", "गुहा में मिनरल वूल"]],
      [1482, 810, ["Fire-rated for commercial buildings", "Classement feu pour bâtiments tertiaires", "مقاومة للحريق للمباني التجارية", "Resistencia al fuego para edificios comerciales", "Resistência ao fogo para edifícios comerciais", "Resistenza al fuoco per edifici commerciali", "Ticari binalar için yangın sınıfı", "满足商业建筑防火等级", "व्यावसायिक इमारतों के लिए अग्नि-रेटिंग"]],
    ]),
  b(13, "sanitaryware", "bath-kitchen", [917, 150, 917, 874], "hf_20260925_232309_9ede1605-ec68-4495-995d-9b2ea0afc718.png",
    ["Ceramic sanitaryware", "Sanitaires en céramique", "الأدوات الصحية الخزفية", "Sanitarios cerámicos", "Louça sanitária cerâmica", "Sanitari in ceramica", "Seramik vitrifiye", "陶瓷卫浴", "सिरेमिक सैनिटरीवेयर"],
    [
      ["Glazed white porcelain", "Porcelaine blanche émaillée", "بورسلين أبيض مزجّج", "Porcelana blanca esmaltada", "Porcelana branca vidrada", "Porcellana bianca smaltata", "Sırlı beyaz porselen", "白色釉面陶瓷", "ग्लेज़्ड सफ़ेद पोर्सिलेन"],
      ["Matte black ceramic", "Céramique noire mate", "سيراميك أسود مطفأ", "Cerámica negra mate", "Cerâmica preta mate", "Ceramica nera opaca", "Mat siyah seramik", "哑光黑陶瓷", "मैट काला सिरेमिक"],
      ["Antibacterial glaze", "Émail antibactérien", "تزجيج مضاد للبكتيريا", "Esmalte antibacteriano", "Vidrado antibacteriano", "Smalto antibatterico", "Antibakteriyel sır", "抗菌釉面", "जीवाणुरोधी ग्लेज़"],
      ["Earth-coloured fireclay", "Grès chamotté teinte terre", "فخار ناري بلون ترابي", "Gres refractario color tierra", "Grés refratário cor de terra", "Fireclay color terra", "Toprak renkli şamot", "大地色耐火黏土", "मिट्टी के रंग का फ़ायरक्ले"],
    ],
    [
      [1122, 600, ["Rimless flushing", "Chasse sans bride", "تدفّق بدون حافة", "Descarga sin brida", "Descarga sem rebordo", "Scarico senza brida", "Çerçevesiz sifon", "无边缘冲洗", "रिमलेस फ़्लशिंग"]],
      [1720, 389, ["High-temperature non-porous glaze", "Émail non poreux cuit à haute température", "تزجيج غير مسامي بحرارة عالية", "Esmalte no poroso a alta temperatura", "Vidrado não poroso a alta temperatura", "Smalto non poroso ad alta temperatura", "Yüksek ısıda gözeneksiz sır", "高温烧制无孔釉", "उच्च ताप पर गैर-छिद्रित ग्लेज़"]],
      [1232, 632, ["Hygienic, easy-clean surface", "Surface hygiénique facile d’entretien", "سطح صحي سهل التنظيف", "Superficie higiénica y fácil de limpiar", "Superfície higiénica e fácil de limpar", "Superficie igienica, facile da pulire", "Hijyenik, kolay temizlenen yüzey", "卫生易清洁表面", "स्वच्छ, आसानी से साफ़ होने वाली सतह"]],
    ]),
  b(14, "fittings", "bath-kitchen", [917, 100, 917, 924], "hf_20260925_232429_f5fae125-49e8-4639-a1da-ae0c857a177b.png",
    ["Bathroom fittings & hardware", "Robinetterie & quincaillerie", "تجهيزات الحمام والإكسسوارات", "Grifería y herrajes", "Torneiras e ferragens", "Rubinetteria e ferramenta", "Armatür ve donanım", "卫浴龙头与五金", "बाथरूम फ़िटिंग्स और हार्डवेयर"],
    [
      ["Brushed brass", "Laiton brossé", "نحاس أصفر مصقول بالفرشاة", "Latón cepillado", "Latão escovado", "Ottone spazzolato", "Fırçalanmış pirinç", "拉丝黄铜", "ब्रश्ड पीतल"],
      ["Matte black powder coat", "Laquage poudre noir mat", "طلاء بودرة أسود مطفأ", "Lacado en polvo negro mate", "Pintura em pó preto mate", "Verniciatura a polvere nero opaco", "Mat siyah toz boya", "哑光黑粉末涂层", "मैट काला पाउडर कोट"],
      ["Polished chrome", "Chrome poli", "كروم مصقول", "Cromo pulido", "Cromado polido", "Cromo lucido", "Parlak krom", "抛光镀铬", "पॉलिश्ड क्रोम"],
      ["Knurled steel", "Acier moleté", "فولاذ محزّز", "Acero moleteado", "Aço recartilhado", "Acciaio zigrinato", "Tırtıllı çelik", "滚花不锈钢", "नर्ल्ड स्टील"],
    ],
    [
      [1455, 210, ["Aerated water-saving shower", "Douche à économie d’eau aérée", "دش موفّر للمياه بالتهوية", "Ducha con ahorro de agua aireada", "Chuveiro aerado de poupança de água", "Soffione aerato a risparmio idrico", "Havalandırmalı su tasarruflu duş", "充气节水花洒", "हवादार पानी-बचत शावर"]],
      [1416, 622, ["Thermostatic mixing valve", "Mitigeur thermostatique", "خلاط ثرموستاتي", "Mezclador termostático", "Misturadora termostática", "Miscelatore termostatico", "Termostatik batarya", "恒温混水阀", "थर्मोस्टैटिक मिक्सिंग वाल्व"]],
      [1395, 758, ["PVD coating for scratch resistance", "Revêtement PVD anti-rayures", "طلاء PVD مقاوم للخدش", "Recubrimiento PVD antiarañazos", "Revestimento PVD anti-riscos", "Rivestimento PVD antigraffio", "Çizilmeye dayanıklı PVD kaplama", "PVD 镀层耐刮擦", "खरोंच-रोधी PVD कोटिंग"]],
    ]),
  b(15, "mosaics", "ceramic-porcelain", [917, 0, 917, 1024], "hf_20260925_232458_1987ae50-1cd1-492a-bc21-c4f64d347012.png",
    ["Mosaics & glass tiles", "Mosaïques & pâtes de verre", "الفسيفساء وبلاط الزجاج", "Mosaicos y gresite", "Mosaicos e pastilhas de vidro", "Mosaici e tessere in vetro", "Mozaik ve cam karolar", "马赛克与玻璃砖", "मोज़ेक और कांच टाइलें"],
    [
      ["Glass penny rounds", "Pastilles de verre rondes", "فسيفساء زجاجية دائرية", "Mosaico de vidrio redondo", "Pastilhas de vidro redondas", "Tessere rotonde in vetro", "Yuvarlak cam mozaik", "圆形玻璃马赛克", "गोल कांच मोज़ेक"],
      ["Waterjet marble mosaic", "Mosaïque de marbre jet d’eau", "فسيفساء رخام بالقطع المائي", "Mosaico de mármol por chorro de agua", "Mosaico de mármore por jato de água", "Mosaico in marmo a getto d’acqua", "Su jeti mermer mozaik", "水刀大理石马赛克", "वॉटरजेट संगमरमर मोज़ेक"],
      ["Metallic hexagons", "Hexagones métallisés", "سداسيات معدنية", "Hexágonos metálicos", "Hexágonos metálicos", "Esagoni metallici", "Metalik altıgenler", "金属六角砖", "मेटैलिक षट्भुज"],
      ["Recycled glass squares", "Carrés de verre recyclé", "مربعات زجاج معاد تدويره", "Cuadrados de vidrio reciclado", "Quadrados de vidro reciclado", "Quadrati in vetro riciclato", "Geri dönüştürülmüş cam kareler", "再生玻璃方块", "पुनर्चक्रित कांच वर्ग"],
    ],
    [
      [1283, 625, ["Mesh-backed for curved surfaces", "Sur trame pour surfaces courbes", "مثبّتة على شبكة للأسطح المنحنية", "Con malla para superficies curvas", "Em rede para superfícies curvas", "Su rete per superfici curve", "Kavisli yüzeyler için fileli", "背网适合曲面", "घुमावदार सतहों के लिए जाली-युक्त"]],
      [1435, 647, ["Impermeable epoxy grout", "Joint époxy imperméable", "روبة إيبوكسي غير منفذة", "Junta epoxi impermeable", "Junta epóxi impermeável", "Stucco epossidico impermeabile", "Su geçirmez epoksi derz", "防水环氧填缝", "अभेद्य इपॉक्सी ग्राउट"]],
      [1585, 677, ["Durable fully submerged", "Durable en immersion totale", "تتحمّل الغمر الكامل", "Duradero en inmersión total", "Durável em imersão total", "Durevole in immersione totale", "Tamamen su altında dayanıklı", "长期浸水耐用", "पूरी तरह डूबे रहने पर भी टिकाऊ"]],
    ]),
  b(16, "glass", "joinery-glazing", [917, 115, 580, 840], "hf_20260925_232458_81cddfab-ed4d-4ee1-8c3f-21fdd3ac590a.png",
    ["Architectural glass", "Verre architectural", "الزجاج المعماري", "Vidrio arquitectónico", "Vidro arquitetónico", "Vetro architettonico", "Mimari cam", "建筑玻璃", "आर्किटेक्चरल ग्लास"],
    [
      ["Tinted solar-control glass", "Verre de contrôle solaire teinté", "زجاج ملوّن للتحكم الشمسي", "Vidrio de control solar tintado", "Vidro de controlo solar colorido", "Vetro colorato a controllo solare", "Renkli güneş kontrol camı", "着色阳光控制玻璃", "टिंटेड सोलर-कंट्रोल ग्लास"],
      ["Fluted glass", "Verre cannelé", "زجاج مضلّع", "Vidrio acanalado", "Vidro canelado", "Vetro cannettato", "Oluklu cam", "长虹玻璃", "फ़्लूटेड ग्लास"],
      ["Frosted privacy glass", "Verre dépoli", "زجاج مصنفر للخصوصية", "Vidrio esmerilado", "Vidro fosco", "Vetro satinato", "Buzlu cam", "磨砂隐私玻璃", "फ़्रॉस्टेड प्राइवेसी ग्लास"],
      ["Acoustic laminated double glazing", "Double vitrage feuilleté acoustique", "زجاج مزدوج مصفّح عازل للصوت", "Doble acristalamiento laminado acústico", "Vidro duplo laminado acústico", "Vetrocamera stratificata acustica", "Akustik lamine çift cam", "隔声夹胶中空玻璃", "ध्वनिक लैमिनेटेड डबल ग्लेज़िंग"],
    ],
    [
      [1280, 288, ["Optimised U-values", "Coefficients U optimisés", "قيم انتقال حراري U محسّنة", "Valores U optimizados", "Valores U otimizados", "Valori U ottimizzati", "Optimize U değerleri", "优化传热系数 U 值", "अनुकूलित U-मान"]],
      [1424, 469, ["UV-filtering coatings", "Couches anti-UV", "طبقات مرشّحة للأشعة فوق البنفسجية", "Recubrimientos filtro UV", "Revestimentos com filtro UV", "Rivestimenti con filtro UV", "UV filtreli kaplamalar", "防紫外线镀膜", "UV-फ़िल्टरिंग कोटिंग"]],
      [1327, 653, ["Structural silicone glazing", "Vitrage extérieur collé (VEC)", "تزجيج إنشائي بالسيليكون", "Acristalamiento estructural con silicona", "Envidraçado estrutural com silicone", "Vetrata strutturale a silicone", "Yapısal silikon cam", "结构硅酮玻璃幕墙", "स्ट्रक्चरल सिलिकॉन ग्लेज़िंग"]],
    ]),
  b(17, "cladding", "facades-envelope", [917, 98, 917, 926], "hf_20260925_232529_a1d22398-6baa-4f66-b54a-8f3f05d7d1f3.png",
    ["Exterior cladding & panels", "Bardages & panneaux de façade", "كسوات الواجهات والألواح", "Revestimientos y paneles de fachada", "Revestimentos e painéis de fachada", "Rivestimenti e pannelli di facciata", "Dış cephe kaplamaları ve paneller", "外墙挂板与面板", "बाहरी क्लैडिंग और पैनल"],
    [
      ["Aluminium composite panel", "Panneau composite aluminium", "لوح ألمنيوم مركّب", "Panel composite de aluminio", "Painel compósito de alumínio", "Pannello composito in alluminio", "Alüminyum kompozit panel", "铝塑复合板", "एल्युमिनियम कम्पोज़िट पैनल"],
      ["Textured fibre-cement board", "Plaque fibres-ciment texturée", "لوح ألياف إسمنتية محبّب", "Placa de fibrocemento texturizada", "Placa de fibrocimento texturada", "Lastra in fibrocemento materica", "Dokulu lifli çimento levha", "纹理纤维水泥板", "टेक्सचर्ड फ़ाइबर-सीमेंट बोर्ड"],
      ["Weathering Corten steel", "Acier Corten patiné", "فولاذ كورتن مؤكسد", "Acero Corten", "Aço Corten", "Acciaio Corten", "Corten çelik", "耐候钢（考顿钢）", "कॉर्टेन स्टील"],
      ["Exterior-grade HPL", "HPL extérieur", "HPL للاستخدام الخارجي", "HPL para exterior", "HPL de exterior", "HPL per esterni", "Dış cephe HPL", "室外级高压层压板", "बाहरी ग्रेड HPL"],
    ],
    [
      [1440, 362, ["Thermal-break substructure", "Ossature à rupture de pont thermique", "هيكل بقاطع جسر حراري", "Subestructura con rotura de puente térmico", "Subestrutura com corte térmico", "Sottostruttura a taglio termico", "Isı köprüsü kesicili taşıyıcı", "断热龙骨", "थर्मल-ब्रेक सबस्ट्रक्चर"]],
      [1240, 534, ["Drained, ventilated cavity", "Lame d’air ventilée et drainée", "فراغ مهوّى ومصرّف", "Cámara ventilada y drenada", "Caixa de ar ventilada e drenada", "Intercapedine ventilata e drenata", "Havalandırmalı, drenajlı boşluk", "排水通风空腔", "जल-निकासी वाली हवादार गुहा"]],
      [1360, 759, ["High wind-load resistance", "Forte résistance au vent", "مقاومة عالية لأحمال الرياح", "Alta resistencia al viento", "Elevada resistência ao vento", "Elevata resistenza al vento", "Yüksek rüzgâr yükü direnci", "高抗风压性能", "उच्च पवन-भार प्रतिरोध"]],
    ]),
  b(18, "outdoor", "ceramic-porcelain", [917, 162, 917, 862], "hf_20260925_232529_f7fe7284-1521-49c8-8235-05a50a437f86.png",
    ["Outdoor paving & decking", "Revêtements extérieurs & terrasses", "أرضيات الخارج والأسطح الخشبية", "Pavimento exterior y tarimas", "Pavimentos exteriores e decks", "Pavimenti esterni e decking", "Dış mekân kaplamaları ve deck", "户外铺装与地板", "आउटडोर पेविंग और डेकिंग"],
    [
      ["WPC composite decking", "Lames composites WPC", "ألواح WPC المركّبة", "Tarima composite WPC", "Deck compósito WPC", "Decking composito WPC", "WPC kompozit deck", "木塑复合地板", "WPC कम्पोज़िट डेकिंग"],
      ["20 mm outdoor porcelain", "Grès cérame 20 mm extérieur", "بورسلين خارجي 20 مم", "Porcelánico exterior de 20 mm", "Porcelânico de exterior 20 mm", "Gres da esterno 20 mm", "20 mm dış mekân porseleni", "20 毫米户外瓷砖", "20 मिमी आउटडोर पोर्सिलेन"],
      ["Flamed natural stone", "Pierre naturelle flammée", "حجر طبيعي معالج باللهب", "Piedra natural flameada", "Pedra natural flamejada", "Pietra naturale fiammata", "Alevli doğal taş", "火烧面天然石", "फ़्लेम्ड प्राकृतिक पत्थर"],
      ["Treated pine", "Pin traité autoclave", "صنوبر معالج", "Pino tratado", "Pinho tratado", "Pino trattato", "Emprenyeli çam", "防腐松木", "उपचारित चीड़"],
    ],
    [
      [1213, 501, ["High slip resistance (R11+)", "Forte adhérence (R11+)", "مقاومة عالية للانزلاق (R11+)", "Alta resistencia al deslizamiento (R11+)", "Elevada resistência ao deslizamento (R11+)", "Elevata resistenza allo scivolamento (R11+)", "Yüksek kaymazlık (R11+)", "高防滑等级（R11+）", "उच्च फिसलन-रोधी (R11+)"]],
      [1642, 548, ["UV-stable colour", "Couleur stable aux UV", "لون ثابت أمام الأشعة فوق البنفسجية", "Color estable a los UV", "Cor estável aos UV", "Colore stabile ai raggi UV", "UV’ye dayanıklı renk", "抗紫外线不褪色", "UV-स्थिर रंग"]],
      [1128, 772, ["Adjustable pedestals for drainage", "Plots réglables pour le drainage", "قواعد قابلة للتعديل لتصريف المياه", "Plots regulables para el drenaje", "Apoios reguláveis para drenagem", "Supporti regolabili per il drenaggio", "Drenaj için ayarlanabilir ayaklar", "可调支撑，利于排水", "जल निकासी के लिए समायोज्य पेडेस्टल"]],
    ]),
  b(19, "green", "interior-finishing-systems", [917, 242, 917, 623], "hf_20260925_232539_5f3df8c7-9e84-40c9-98cc-8ba1d644403b.png",
    ["Sustainable ‘green collection’ materials", "Matériaux durables « collection verte »", "مواد مستدامة «المجموعة الخضراء»", "Materiales sostenibles «colección verde»", "Materiais sustentáveis «coleção verde»", "Materiali sostenibili «collezione verde»", "Sürdürülebilir ‘yeşil koleksiyon’ malzemeleri", "可持续“绿色系列”材料", "टिकाऊ ‘ग्रीन कलेक्शन’ सामग्री"],
    [
      ["High-density cork", "Liège aggloméré haute densité", "فلين عالي الكثافة", "Corcho de alta densidad", "Cortiça de alta densidade", "Sughero ad alta densità", "Yüksek yoğunluklu mantar", "高密度软木", "उच्च घनत्व कॉर्क"],
      ["Strand-woven bamboo", "Bambou densifié", "خيزران منسوج مضغوط", "Bambú prensado", "Bambu prensado", "Bambù pressato", "Sıkıştırılmış bambu", "重竹", "स्ट्रैंड-वोवन बांस"],
      ["Recycled PET acoustic felt", "Feutre acoustique PET recyclé", "لباد صوتي من PET معاد تدويره", "Fieltro acústico de PET reciclado", "Feltro acústico de PET reciclado", "Feltro acustico in PET riciclato", "Geri dönüştürülmüş PET akustik keçe", "再生 PET 吸音毡", "पुनर्चक्रित PET ध्वनिक फ़ेल्ट"],
      ["Bio-based composites", "Composites biosourcés", "مركّبات حيوية", "Composites de origen biológico", "Compósitos de base biológica", "Compositi a base biologica", "Biyo bazlı kompozitler", "生物基复合材料", "जैव-आधारित कम्पोज़िट"],
    ],
    [
      [1511, 284, ["Fully recyclable, circular", "Recyclable et circulaire", "قابلة لإعادة التدوير بالكامل", "Totalmente reciclable, circular", "Totalmente reciclável, circular", "Totalmente riciclabile, circolare", "Tamamen geri dönüştürülebilir", "可完全回收，循环利用", "पूरी तरह पुनर्चक्रण योग्य"]],
      [1068, 833, ["Low embodied carbon", "Faible carbone intrinsèque", "بصمة كربونية منخفضة", "Bajo carbono incorporado", "Baixo carbono incorporado", "Basso carbonio incorporato", "Düşük gömülü karbon", "低隐含碳", "कम अंतर्निहित कार्बन"]],
      [1480, 762, ["Counts towards LEED / BREEAM", "Contribue aux points LEED / BREEAM", "تساهم في نقاط LEED / BREEAM", "Suma puntos LEED / BREEAM", "Contribui para LEED / BREEAM", "Contribuisce a LEED / BREEAM", "LEED / BREEAM puanına katkı", "助力 LEED / BREEAM 认证", "LEED / BREEAM अंकों में योगदान"]],
    ]),
];

/** Slide 20: the palette and where each sample ends up in one building. */
export const synthesis = {
  crop: [917, 68, 917, 956] as [number, number, number, number],
  render: `${HF}/hf_20260925_232539_97311a9b-84df-4d8f-8641-8b3fa605bb31.png`,
  /** Swatch index (0–11, s20-{i+1}.webp) → point on the render (slide coordinates). */
  links: [
    { swatch: 0, at: [1170, 845] as [number, number], text: l(["Marble lobby floor and reception", "Sol et accueil en marbre", "أرضية واستقبال من الرخام", "Suelo y recepción de mármol", "Pavimento e receção em mármore", "Pavimento e reception in marmo", "Mermer lobi zemini ve resepsiyon", "大理石大堂地面与前台", "संगमरमर लॉबी फ़र्श और रिसेप्शन"]) },
    { swatch: 1, at: [1300, 880] as [number, number], text: l(["Walnut wall panels", "Panneaux muraux en noyer", "ألواح جدارية من الجوز", "Paneles de nogal", "Painéis em nogueira", "Pannelli in noce", "Ceviz duvar panelleri", "胡桃木墙板", "अखरोट दीवार पैनल"]) },
    { swatch: 2, at: [1541, 446] as [number, number], text: l(["Corten facade cladding", "Bardage de façade en Corten", "كسوة واجهة من الكورتن", "Fachada de acero Corten", "Fachada em aço Corten", "Facciata in Corten", "Corten cephe kaplaması", "耐候钢外立面", "कॉर्टेन फ़साड क्लैडिंग"]) },
    { swatch: 3, at: [998, 375] as [number, number], text: l(["Concrete-look bathroom walls", "Murs de salle de bains effet béton", "جدران حمام بمظهر الخرسانة", "Paredes de baño efecto hormigón", "Paredes de casa de banho efeito betão", "Pareti del bagno effetto cemento", "Beton görünümlü banyo duvarları", "仿水泥卫浴墙面", "कंक्रीट-लुक बाथरूम दीवारें"]) },
    { swatch: 4, at: [1459, 655] as [number, number], text: l(["Stone terrace paving", "Dallage de terrasse en pierre", "رصف الشرفة بالحجر", "Pavimento de terraza en piedra", "Pavimento de terraço em pedra", "Pavimentazione in pietra della terrazza", "Taş teras kaplaması", "石材露台铺装", "पत्थर टैरेस पेविंग"]) },
    { swatch: 5, at: [1560, 700] as [number, number], text: l(["Timber pool deck", "Terrasse de piscine en bois", "سطح خشبي للمسبح", "Tarima de piscina de madera", "Deck de piscina em madeira", "Bordo piscina in legno", "Ahşap havuz deck’i", "木质泳池平台", "लकड़ी का पूल डेक"]) },
    { swatch: 6, at: [1150, 612] as [number, number], text: l(["Bamboo office floor", "Sol de bureau en bambou", "أرضية مكتب من الخيزران", "Suelo de oficina de bambú", "Pavimento de escritório em bambu", "Pavimento dell’ufficio in bambù", "Bambu ofis zemini", "竹木办公地面", "बांस का कार्यालय फ़र्श"]) },
    { swatch: 7, at: [1080, 577] as [number, number], text: l(["Cork acoustic wall", "Mur acoustique en liège", "جدار صوتي من الفلين", "Pared acústica de corcho", "Parede acústica em cortiça", "Parete acustica in sughero", "Mantar akustik duvar", "软木吸音墙", "कॉर्क ध्वनिक दीवार"]) },
    { swatch: 8, at: [1077, 698] as [number, number], text: l(["Felt ceiling baffles", "Baffles de plafond en feutre", "حواجز سقف من اللباد", "Bafles de techo de fieltro", "Baffles de teto em feltro", "Baffle a soffitto in feltro", "Keçe tavan bafılları", "毛毡吊顶垂片", "फ़ेल्ट छत बैफ़ल"]) },
    { swatch: 10, at: [1200, 380] as [number, number], text: l(["Green glazed bathroom tiles", "Carreaux émaillés verts", "بلاط حمام أخضر مزجّج", "Azulejos verdes esmaltados", "Azulejos verdes vidrados", "Piastrelle verdi smaltate", "Yeşil sırlı banyo karoları", "绿色釉面卫浴砖", "हरे ग्लेज़्ड बाथरूम टाइल्स"]) },
    { swatch: 11, at: [1330, 330] as [number, number], text: l(["Full-height glazing", "Vitrage toute hauteur", "تزجيج بكامل الارتفاع", "Acristalamiento de suelo a techo", "Envidraçado de altura total", "Vetrate a tutta altezza", "Tam boy cam", "通高玻璃", "पूरी ऊँचाई की ग्लेज़िंग"]) },
  ],
};
