import { materials, type Material } from "@/content/materials";
import { sectors, type Sector } from "@/content/sectors";
import { applications, type Application } from "@/content/applications";
import { exhibitors, type Exhibitor } from "@/content/exhibitors";
import type { EditionId } from "./editions";

/**
 * Lightweight multilingual "semantic" search. Queries like "marble hotel floor"
 * resolve across entities: materials match by name/keywords, and also inherit
 * relevance from the spaces and sectors the query mentions. Runs on the client
 * with no index service; swap for pgvector / Supabase full-text later.
 */

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ً-ْـ]/g, "") // Arabic diacritics, tatweel
    .replace(/[إأآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " "); // keep \p{M}: Devanagari vowel signs are marks

const stop = new Set([
  "and", "the", "for", "a", "of", "or", "with", // en
  "de", "la", "le", "les", "des", "du", "et", "pour", "en", // fr
  "في", "و", "من", // ar
  "el", "los", "las", "y", "para", "con", "do", "da", "dos", "das", "e", "com", "il", "di", "per", "ve", "ile", "için", "के", "की", "और", "में",
]);

const han = /\p{Script=Han}/u;

/** Chinese is written without spaces: index Han runs as overlapping character pairs too. */
const bigrams = (w: string) => (han.test(w) && w.length > 2 ? [...w].slice(1).map((c, i) => [...w][i] + c) : []);

const tokens = (s: string) =>
  normalize(s)
    .split(/\s+/)
    .map((w) => (w.startsWith("ال") && w.length > 4 ? w.slice(2) : w))
    .flatMap((w) => [w, ...bigrams(w)])
    .filter((w) => w.length > 1 && !stop.has(w));

/** Concept synonyms that bridge vocabulary between languages and trades. */
const synonyms: Record<string, string[]> = {
  floor: ["flooring", "sol", "sols", "ارضيه", "ارضيات", "paving", "suelo", "piso", "pavimento", "zemin", "地面", "地板", "फर्श"],
  wall: ["walls", "mur", "murs", "جدار", "جدران", "cladding", "pared", "parede", "parete", "duvar", "墙面", "墙", "दीवार"],
  ceiling: ["plafond", "سقف", "اسقف", "techo", "teto", "soffitto", "tavan", "吊顶", "天花", "छत"],
  stone: ["pierre", "حجر", "marble", "granite", "piedra", "pedra", "pietra", "taş", "石材", "पत्थर"],
  tile: ["tiles", "carrelage", "carreau", "carreaux", "بلاط", "baldosa", "azulejo", "ladrilho", "piastrella", "karo", "瓷砖", "टाइल"],
  bathroom: ["salle", "bain", "حمام", "wet", "baño", "casa de banho", "bagno", "banyo", "浴室", "卫生间", "बाथरूम"],
  kitchen: ["cuisine", "مطبخ", "worktop", "counter", "cocina", "cozinha", "cucina", "mutfak", "厨房", "रसोई"],
  hotel: ["hospitality", "hotellerie", "فندق", "ضيافه", "lobby", "hotel", "otel", "albergo", "酒店", "होटल"],
  waterproof: ["waterproofing", "etancheite", "عزل", "membrane", "impermeabilizacion", "impermeabilizacao", "impermeabilizzazione", "yalıtım", "防水", "वॉटरप्रूफ़िंग"],
  paint: ["peinture", "دهان", "coating", "colour", "color", "pintura", "tinta", "pittura", "boya", "涂料", "पेंट"],
  machine: ["machinery", "equipment", "technology", "machines", "آلات", "معدات", "maquinaria", "maquina", "macchinari", "makine", "设备", "मशीन"],
  durable: ["heavy", "traffic", "resistant", "hard"],
};

/** Each query word with its synonyms. A word scores once, by its best match, however many languages list it. */
const expand = (q: string[]) =>
  q.map((w) => {
    const group = new Set([w]);
    for (const [k, vs] of Object.entries(synonyms))
      if (w === k || vs.includes(w)) {
        group.add(k);
        vs.forEach((v) => group.add(v));
      }
    return [...group];
  });

/** `title`: the item’s own name in every language; `strong`: names and keywords; `weak`: descriptions. */
type Doc<T> = { item: T; title: string[]; strong: string[]; weak: string[] };

const score = (q: string[][], d: { title: string[]; strong: string[]; weak: string[] }) => {
  let s = 0;
  for (const group of q) {
    let best = 0;
    for (const w of group) {
      if (d.title.includes(w)) best = Math.max(best, 5); // the query names this item
      for (const t of d.strong) {
        if (t === w) best = Math.max(best, 4);
        else if (t.startsWith(w) && w.length >= 3) best = Math.max(best, 3);
        else if (w.length >= 4 && t.includes(w)) best = Math.max(best, 1.5);
      }
      for (const t of d.weak) {
        if (t === w) best = Math.max(best, 1.2);
        else if (t.startsWith(w) && w.length >= 3) best = Math.max(best, 0.8);
      }
    }
    s += best;
  }
  return s;
};

const all = (l: Record<string, string>) => Object.values(l).join(" ");

const sectorDocs: Doc<Sector>[] = sectors.map((s) => ({
  item: s,
  title: tokens(`${all(s.name)} ${all(s.short)}`),
  strong: tokens(`${all(s.name)} ${all(s.short)}`),
  weak: tokens(all(s.description)),
}));

const appDocs: Doc<Application>[] = applications.map((a) => ({
  item: a,
  title: tokens(all(a.name)),
  strong: tokens(`${all(a.name)} ${all(a.sub)} ${all(a.scene)} ${a.keywords.join(" ")}`),
  weak: tokens(all(a.description)),
}));

const materialDocs: Doc<Material>[] = materials.map((m) => {
  const sec = sectors.find((s) => s.id === m.sector)!;
  return {
    item: m,
    title: tokens(all(m.name)),
    strong: tokens(`${all(m.name)} ${(m.keywords ?? []).join(" ")} ${m.slug.replace(/-/g, " ")}`),
    weak: tokens(`${all(sec.name)} ${all(sec.short)} ${all(m.summary)}`),
  };
});

const exhibitorDocs: Doc<Exhibitor>[] = exhibitors.map((e) => ({
  item: e,
  title: tokens(e.name),
  strong: tokens(e.name),
  weak: tokens(`${all(e.blurb)}`),
}));

export type SearchResults = {
  materials: Material[];
  sectors: Sector[];
  applications: Application[];
  exhibitors: Exhibitor[];
};

export function search(query: string, edition?: EditionId): SearchResults {
  const q = expand(tokens(query));
  if (!q.length) return { materials: [], sectors: [], applications: [], exhibitors: [] };

  const rank = <T,>(docs: Doc<T>[], min = 1) =>
    docs
      .map((d) => ({ d, s: score(q, d) }))
      .filter((r) => r.s >= min)
      .sort((a, b) => b.s - a.s);

  const secHits = rank(sectorDocs, 2);
  const appHits = rank(appDocs, 2);
  const secIds = new Set(secHits.map((r) => r.d.item.id));
  const appIds = new Set(appHits.map((r) => r.d.item.id));

  const matHits = materialDocs
    .map((d) => {
      let s = score(q, d);
      if (secIds.has(d.item.sector)) s += 1.5;
      const appMatch = d.item.applications.some((a) => appIds.has(a));
      if (appMatch) s += s > 0 ? 2 : 0.9; // a material named in the query that fits the space rises highest
      return { d, s };
    })
    .filter((r) => r.s >= 1.2)
    .sort((a, b) => b.s - a.s);

  const matSlugs = new Set(matHits.slice(0, 8).map((r) => r.d.item.slug));
  const exHits = exhibitorDocs
    .filter((d) => !edition || d.item.editions.includes(edition))
    .map((d) => ({
      d,
      s: score(q, d) + d.item.materials.filter((m) => matSlugs.has(m)).length * 0.8 + (d.item.sectors.some((s) => secIds.has(s)) ? 1 : 0),
    }))
    .filter((r) => r.s >= 0.8)
    .sort((a, b) => b.s - a.s);

  return {
    materials: matHits.map((r) => r.d.item),
    sectors: secHits.map((r) => r.d.item),
    applications: appHits.map((r) => r.d.item),
    exhibitors: exHits.map((r) => r.d.item),
  };
}
