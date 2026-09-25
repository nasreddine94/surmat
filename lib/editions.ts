import type { L, Locale } from "./i18n";

export const editionIds = ["dz", "sn"] as const;
export type EditionId = (typeof editionIds)[number];
export const defaultEdition: EditionId = "dz";
export const isEdition = (x: string): x is EditionId => (editionIds as readonly string[]).includes(x);

export type Edition = {
  id: EditionId;
  /** ISO 3166 code, used for flags and Intl display names. */
  country: string;
  name: L;
  city: L;
  /** null until confirmed — the UI shows "to be announced". */
  venue: L | null;
  dates: L | null;
  /** First day, ISO date, when confirmed. */
  startsOn: string | null;
  targets: { exhibitors: string; visitors: string };
  /** Locale shown first for this market. */
  primaryLocale: Locale;
  /** Optional external systems; when set, CTAs link out instead of the built-in forms. */
  registrationUrl: string | null;
  exhibitionUrl: string | null;
  contactEmail: string | null;
  /** Skyline silhouette used on edition cards. */
  landmark: "maqam" | "renaissance";
};

/**
 * Edition configuration. Components never hard-code a country: everything
 * market-specific comes from here (and later from the CMS `editions` table).
 */
export const editions: Record<EditionId, Edition> = {
  dz: {
    id: "dz",
    country: "DZ",
    name: { en: "SURMAT Algeria", fr: "SURMAT Algérie", ar: "سورمات الجزائر", es: "SURMAT Argelia", pt: "SURMAT Argélia", it: "SURMAT Algeria", tr: "SURMAT Cezayir", zh: "SURMAT 阿尔及利亚", hi: "SURMAT अल्जीरिया" },
    city: { en: "Oran", fr: "Oran", ar: "وهران", es: "Orán", pt: "Orão", it: "Orano", tr: "Oran", zh: "奥兰", hi: "ओरान" },
    venue: {
      en: "Mohammed Ben Ahmed Convention Centre (CCO), Oran",
      fr: "Centre des Conventions Mohammed Ben Ahmed (CCO), Oran",
      ar: "مركز الاتفاقيات محمد بن أحمد، وهران",
      es: "Centro de Convenciones Mohammed Ben Ahmed (CCO), Orán",
      pt: "Centro de Convenções Mohammed Ben Ahmed (CCO), Orão",
      it: "Centro Congressi Mohammed Ben Ahmed (CCO), Orano",
      tr: "Mohammed Ben Ahmed Kongre Merkezi (CCO), Oran",
      zh: "穆罕默德·本·艾哈迈德会议中心（CCO），奥兰",
      hi: "मोहम्मद बेन अहमद कन्वेंशन सेंटर (CCO), ओरान",
    },
    dates: null,
    startsOn: null,
    targets: { exhibitors: "500+", visitors: "20,000+" },
    primaryLocale: "fr",
    registrationUrl: null,
    exhibitionUrl: null,
    contactEmail: null,
    landmark: "maqam",
  },
  sn: {
    id: "sn",
    country: "SN",
    name: { en: "SURMAT Senegal", fr: "SURMAT Sénégal", ar: "سورمات السنغال", es: "SURMAT Senegal", pt: "SURMAT Senegal", it: "SURMAT Senegal", tr: "SURMAT Senegal", zh: "SURMAT 塞内加尔", hi: "SURMAT सेनेगल" },
    city: { en: "Dakar", fr: "Dakar", ar: "داكار", es: "Dakar", pt: "Dacar", it: "Dakar", tr: "Dakar", zh: "达喀尔", hi: "डकार" },
    venue: null,
    dates: null,
    startsOn: null,
    targets: { exhibitors: "300+", visitors: "12,000+" },
    primaryLocale: "fr",
    registrationUrl: null,
    exhibitionUrl: null,
    contactEmail: null,
    landmark: "renaissance",
  },
};

export const countryName = (code: string, locale: Locale) => {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
};

/** Countries offered in forms. ISO codes; names come from Intl. */
export const formCountries = [
  "DZ", "SN", "MA", "TN", "LY", "EG", "MR", "ML", "CI", "GN", "BF", "NE", "CM", "NG", "GH",
  "FR", "IT", "ES", "PT", "DE", "TR", "CN", "IN", "AE", "SA", "QA", "LB", "US", "GB", "BE",
];
