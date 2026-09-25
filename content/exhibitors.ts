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
      es: "Extracción y elaboración de mármol y caliza de la región, del bloque al corte a medida.",
      pt: "Extração e transformação de mármore e calcário da região, do bloco ao corte à medida.",
      it: "Estrazione e lavorazione di marmo e calcare della regione, dal blocco al taglio su misura.",
      tr: "Bölgenin mermer ve kireç taşının ocaktan çıkarılması ve işlenmesi, bloktan ölçüye kesime kadar.",
      zh: "本地区大理石和石灰石的开采与加工，从荒料到定制切割。",
      hi: "क्षेत्र के मार्बल और लाइमस्टोन का खनन और प्रसंस्करण, ब्लॉक से लेकर माप के अनुसार कटाई तक।",
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
      es: "Zellige cortado a mano y baldosas hidráulicas para hoteles, riads y residencias.",
      pt: "Zellige cortado à mão e ladrilho hidráulico para hotéis, riads e residências.",
      it: "Zellige tagliato a mano e cementine per hotel, riad e residenze.",
      tr: "Oteller, riadlar ve konutlar için elde kesilmiş zellige ve hidrolik çini karolar.",
      zh: "为酒店、摩洛哥庭院式住宅和私宅提供手工切割 zellige 瓷砖与水泥花砖。",
      hi: "होटलों, रियाद और आवासों के लिए हाथ से कटी ज़ेलीज और सीमेंट टाइलें।",
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
      es: "Distribuidor de porcelánico y piedra sinterizada en toda África Occidental, con stock en Dakar.",
      pt: "Distribuidor de porcelânico e pedra sinterizada em toda a África Ocidental, com stock em Dacar.",
      it: "Distributore di gres porcellanato e lastre sinterizzate in tutta l’Africa occidentale, con magazzino a Dakar.",
      tr: "Batı Afrika genelinde porselen ve sinterlenmiş plaka distribütörü, Dakar’da stoklu.",
      zh: "西非地区瓷砖和岩板经销商，在达喀尔设有库存。",
      hi: "पूरे पश्चिम अफ्रीका में पोर्सिलेन और सिंटर्ड स्लैब के वितरक, डकार में स्टॉक के साथ।",
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
      es: "Revestimientos de fachada e interior formulados para el calor tropical, la humedad y la sal costera.",
      pt: "Revestimentos de fachada e interior formulados para o calor tropical, a humidade e o sal costeiro.",
      it: "Rivestimenti per facciate e interni formulati per il caldo tropicale, l’umidità e la salsedine.",
      tr: "Tropik sıcak, nem ve kıyı tuzu için formüle edilmiş cephe ve iç mekân kaplamaları.",
      zh: "针对热带高温、潮湿和沿海盐分配制的外墙及内墙涂料。",
      hi: "उष्णकटिबंधीय गर्मी, नमी और तटीय नमक के लिए बनाई गई बाहरी और भीतरी कोटिंग्स।",
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
      es: "Placas de yeso, perfilería metálica y sistemas de techo para oficinas, escuelas y hospitales.",
      pt: "Placas de gesso cartonado, estruturas metálicas e sistemas de teto para escritórios, escolas e hospitais.",
      it: "Lastre in cartongesso, orditure metalliche e sistemi di controsoffitto per uffici, scuole e ospedali.",
      tr: "Ofisler, okullar ve hastaneler için alçı levhalar, metal profiller ve tavan sistemleri.",
      zh: "为办公楼、学校和医院提供石膏板、轻钢龙骨和吊顶系统。",
      hi: "कार्यालयों, स्कूलों और अस्पतालों के लिए जिप्सम बोर्ड, धातु फ्रेमिंग और सीलिंग सिस्टम।",
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
      es: "Adhesivos, juntas y sistemas de impermeabilización con asistencia técnica en obra para instaladores.",
      pt: "Colas, argamassas de junta e sistemas de impermeabilização com apoio técnico em obra para aplicadores.",
      it: "Adesivi, stucchi e sistemi impermeabilizzanti con assistenza tecnica in cantiere per i posatori.",
      tr: "Uygulayıcılara şantiyede teknik destekle yapıştırıcılar, derz dolguları ve su yalıtım sistemleri.",
      zh: "瓷砖胶、填缝剂和防水系统，并为施工方提供现场技术支持。",
      hi: "इंस्टॉलरों के लिए साइट पर तकनीकी सहायता के साथ टाइल एडहेसिव, ग्राउट और वॉटरप्रूफ़िंग सिस्टम।",
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
      es: "Paneles murales de madera y revocos de cal para interiores de hostelería.",
      pt: "Painéis de parede em madeira e rebocos de cal para interiores de hotelaria.",
      it: "Pannelli murali in legno e intonaci a calce per interni dell’ospitalità.",
      tr: "Konaklama iç mekânları için ahşap duvar panelleri ve kireç sıvalar.",
      zh: "用于酒店室内的木质墙板和石灰灰泥。",
      hi: "आतिथ्य इंटीरियर के लिए लकड़ी के वॉल पैनल और चूने के प्लास्टर।",
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
      es: "Líneas de corte, pulido y decoración inkjet para fabricantes de piedra y cerámica.",
      pt: "Linhas de corte, polimento e decoração inkjet para fabricantes de pedra e cerâmica.",
      it: "Linee di taglio, lucidatura e decorazione inkjet per produttori di pietra e ceramica.",
      tr: "Doğal taş ve seramik üreticileri için kesme, parlatma ve inkjet dekorasyon hatları.",
      zh: "为石材和陶瓷制造商提供切割、抛光和喷墨装饰生产线。",
      hi: "पत्थर और सिरेमिक निर्माताओं के लिए कटिंग, पॉलिशिंग और इंकजेट सजावट लाइनें।",
    },
    founded: 1987,
    sample: true,
  },
];

export const exhibitorBySlug = (slug: string) => exhibitors.find((e) => e.slug === slug);
export const exhibitorsFor = (edition: EditionId) => exhibitors.filter((e) => e.editions.includes(edition));
