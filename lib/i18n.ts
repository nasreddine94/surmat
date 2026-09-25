import { en, type Dict } from "./dict/en";
import { fr } from "./dict/fr";
import { ar } from "./dict/ar";

export const locales = ["en", "fr", "ar"] as const;
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
};

/** Fill `{name}` placeholders. */
export const fmt = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));


export type { Dict };
export const dictionaries: Record<Locale, Dict> = { en, fr, ar };
export const getDict = (l: Locale) => dictionaries[l];
export type VocabKey = keyof Dict["vocab"];
