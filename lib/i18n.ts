import { en, type Dict } from "./dict/en";
import { fr } from "./dict/fr";
import { ar } from "./dict/ar";
import { es } from "./dict/es";
import { pt } from "./dict/pt";
import { it } from "./dict/it";
import { tr } from "./dict/tr";
import { zh } from "./dict/zh";
import { hi } from "./dict/hi";
import { districtCount } from "./site";

export const locales = ["en", "fr", "ar", "es", "pt", "it", "tr", "zh", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type L = Record<Locale, string>;

export const isLocale = (x: string): x is Locale => (locales as readonly string[]).includes(x);
export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");
export const t = (v: L, l: Locale) => v[l] ?? v.en;

export const localeLabel: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  fr: { short: "FR", name: "Français" },
  ar: { short: "ع", name: "العربية" },
  es: { short: "ES", name: "Español" },
  pt: { short: "PT", name: "Português" },
  it: { short: "IT", name: "Italiano" },
  tr: { short: "TR", name: "Türkçe" },
  zh: { short: "中", name: "中文" },
  hi: { short: "हि", name: "हिन्दी" },
};

/** BCP 47 tag for `lang` and hreflang (Chinese is published in Simplified script). */
export const langTag = (l: Locale) => (l === "zh" ? "zh-Hans" : l);

/** Fill `{name}` placeholders. */
export const fmt = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));


export type { Dict };
/**
 * The copy says "nine districts"; when adjacent districts are hidden (lib/site.ts) the number is
 * rewritten per language so the text matches the floor. Only "<nine> district" phrases change,
 * never "nine languages". Row: [pattern, number words for 6, 7, 8 districts].
 */
const DISTRICT_WORDS: Record<Locale, [RegExp, string[]][]> = {
  en: [[/\bnine(?=[ -]district)/gi, ["six", "seven", "eight"]]],
  fr: [[/\bneuf(?= quartiers)/gi, ["six", "sept", "huit"]]],
  ar: [
    [/تسعة(?= أحياء)/g, ["ستة", "سبعة", "ثمانية"]],
    [/(?<=الأحياء )التسعة/g, ["الستة", "السبعة", "الثمانية"]],
  ],
  es: [[/\bnueve(?= distritos)/gi, ["seis", "siete", "ocho"]]],
  pt: [[/\bnove(?= distritos)/gi, ["seis", "sete", "oito"]]],
  it: [[/\bnove(?= distretti)/gi, ["sei", "sette", "otto"]]],
  tr: [[/\bdokuz(?= bölge)/gi, ["altı", "yedi", "sekiz"]]],
  zh: [[/九(?=大展区)/g, ["六", "七", "八"]]],
  hi: [[/नौ(?= ज़)/g, ["छह", "सात", "आठ"]]],
};

const mapStrings = <T,>(v: T, fn: (s: string) => string): T =>
  typeof v === "string"
    ? (fn(v) as T)
    : Array.isArray(v)
      ? (v.map((x) => mapStrings(x, fn)) as T)
      : v && typeof v === "object"
        ? (Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mapStrings(x, fn)])) as T)
        : v;

const forDistricts = (l: Locale, d: Dict): Dict => {
  if (districtCount >= 9) return d;
  const word = (i: number) => (m: string, w: string[]) => (m[0] !== m[0].toLowerCase() ? w[i][0].toUpperCase() + w[i].slice(1) : w[i]);
  return mapStrings(d, (s) => DISTRICT_WORDS[l].reduce((out, [re, w]) => out.replace(re, (m) => word(districtCount - 6)(m, w)), s));
};

export const dictionaries: Record<Locale, Dict> = {
  en: forDistricts("en", en),
  fr: forDistricts("fr", fr),
  ar: forDistricts("ar", ar),
  es: forDistricts("es", es),
  pt: forDistricts("pt", pt),
  it: forDistricts("it", it),
  tr: forDistricts("tr", tr),
  zh: forDistricts("zh", zh),
  hi: forDistricts("hi", hi),
};
export const getDict = (l: Locale) => dictionaries[l];
export type VocabKey = keyof Dict["vocab"];
