import { en, type Dict } from "./dict/en";
import { fr } from "./dict/fr";
import { ar } from "./dict/ar";
import { es } from "./dict/es";
import { pt } from "./dict/pt";
import { it } from "./dict/it";
import { tr } from "./dict/tr";
import { zh } from "./dict/zh";
import { hi } from "./dict/hi";

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
export const dictionaries: Record<Locale, Dict> = { en, fr, ar, es, pt, it, tr, zh, hi };
export const getDict = (l: Locale) => dictionaries[l];
export type VocabKey = keyof Dict["vocab"];
