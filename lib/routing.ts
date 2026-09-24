import { notFound } from "next/navigation";
import { editions, isEdition, type EditionId } from "./editions";
import { getDict, isLocale, locales, type Locale } from "./i18n";
import { editionIds } from "./editions";

export type Ctx = { edition: EditionId; locale: Locale };

/** Resolve and validate the `[edition]/[locale]` segments. */
export async function resolve(params: Promise<{ edition: string; locale: string }>) {
  const { edition, locale } = await params;
  if (!isEdition(edition) || !isLocale(locale)) notFound();
  return { edition, locale, dict: getDict(locale), ed: editions[edition] };
}

export const href = (c: Ctx, path = "") => `/${c.edition}/${c.locale}${path ? `/${path.replace(/^\//, "")}` : ""}`;

export const allCtx = () => editionIds.flatMap((edition) => locales.map((locale) => ({ edition, locale })));

/** hreflang alternates for a path within one edition. */
export function alternates(c: Ctx, path = "") {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[`${l}-${editions[c.edition].country}`] = href({ ...c, locale: l }, path);
  return { canonical: href(c, path), languages };
}
