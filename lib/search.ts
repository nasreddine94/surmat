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
    .replace(/[^\p{L}\p{N}\s]/gu, " ");

const stop = new Set(["and", "the", "for", "a", "of", "de", "la", "le", "les", "des", "du", "et", "pour", "en", "في", "و", "من", "or", "with"]);

const tokens = (s: string) =>
  normalize(s)
    .split(/\s+/)
    .map((w) => (w.startsWith("ال") && w.length > 4 ? w.slice(2) : w))
    .filter((w) => w.length > 1 && !stop.has(w));

/** Concept synonyms that bridge vocabulary between languages and trades. */
const synonyms: Record<string, string[]> = {
  floor: ["flooring", "sol", "sols", "ارضيه", "ارضيات", "paving"],
  wall: ["walls", "mur", "murs", "جدار", "جدران", "cladding"],
  ceiling: ["plafond", "سقف", "اسقف"],
  stone: ["pierre", "حجر", "marble", "granite"],
  tile: ["tiles", "carrelage", "carreau", "carreaux", "بلاط"],
  bathroom: ["salle", "bain", "حمام", "wet"],
  kitchen: ["cuisine", "مطبخ", "worktop", "counter"],
  hotel: ["hospitality", "hotellerie", "فندق", "ضيافه", "lobby"],
  waterproof: ["waterproofing", "etancheite", "عزل", "membrane"],
  paint: ["peinture", "دهان", "coating", "colour", "color"],
  machine: ["machinery", "equipment", "technology", "machines", "آلات", "معدات"],
  durable: ["heavy", "traffic", "resistant", "hard"],
};

const expand = (q: string[]) => {
  const out = new Set(q);
  for (const w of q)
    for (const [k, vs] of Object.entries(synonyms))
      if (w === k || vs.includes(w)) {
        out.add(k);
        vs.forEach((v) => out.add(v));
      }
  return [...out];
};

type Doc<T> = { item: T; strong: string[]; weak: string[] };

const score = (q: string[], d: { strong: string[]; weak: string[] }) => {
  let s = 0;
  for (const w of q) {
    let best = 0;
    for (const t of d.strong) {
      if (t === w) best = Math.max(best, 4);
      else if (t.startsWith(w) && w.length >= 3) best = Math.max(best, 3);
      else if (w.length >= 4 && t.includes(w)) best = Math.max(best, 1.5);
    }
    for (const t of d.weak) {
      if (t === w) best = Math.max(best, 1.2);
      else if (t.startsWith(w) && w.length >= 3) best = Math.max(best, 0.8);
    }
    s += best;
  }
  return s;
};

const all = (l: Record<string, string>) => Object.values(l).join(" ");

const sectorDocs: Doc<Sector>[] = sectors.map((s) => ({
  item: s,
  strong: tokens(`${all(s.name)} ${all(s.short)}`),
  weak: tokens(all(s.description)),
}));

const appDocs: Doc<Application>[] = applications.map((a) => ({
  item: a,
  strong: tokens(`${all(a.name)} ${all(a.sub)} ${all(a.scene)} ${a.keywords.join(" ")}`),
  weak: tokens(all(a.description)),
}));

const materialDocs: Doc<Material>[] = materials.map((m) => {
  const sec = sectors.find((s) => s.id === m.sector)!;
  return {
    item: m,
    strong: tokens(`${all(m.name)} ${(m.keywords ?? []).join(" ")} ${m.slug.replace(/-/g, " ")}`),
    weak: tokens(`${all(sec.name)} ${all(sec.short)} ${all(m.summary)}`),
  };
});

const exhibitorDocs: Doc<Exhibitor>[] = exhibitors.map((e) => ({
  item: e,
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
