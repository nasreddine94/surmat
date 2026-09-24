import { NextResponse, type NextRequest } from "next/server";

const locales = ["en", "fr", "ar"];
const editionsList = ["dz", "sn"];

function preferredLocale(req: NextRequest) {
  const saved = req.cookies.get("surmat_locale")?.value;
  if (saved && locales.includes(saved)) return saved;
  const header = req.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((p) => {
      const [tag, q] = p.trim().split(";q=");
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return ranked.find((r) => locales.includes(r.lang))?.lang ?? "en";
}

/** A segment that looks like a language code (e.g. "de", "pt-BR"). No route segment is two letters. */
const looksLikeLocale = (s: string | undefined) => !!s && /^[a-z]{2}(-[a-z]{2})?$/i.test(s);

/** Every page lives under /{edition}/{locale}. Anything else is redirected there. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/").slice(1).filter(Boolean);
  const [first, second] = segments;

  if (editionsList.includes(first) && locales.includes(second)) return;

  let edition: string;
  let locale: string | undefined;
  let rest: string[];
  if (editionsList.includes(first)) {
    // /dz, /dz/materials → /dz/{locale}/materials; /dz/de/materials → /dz/{locale}/materials
    edition = first;
    rest = segments.slice(looksLikeLocale(second) ? 2 : 1);
  } else {
    const saved = req.cookies.get("surmat_edition")?.value;
    edition = saved && editionsList.includes(saved) ? saved : "dz";
    // /fr/materials keeps French; /de/materials falls back to the preferred locale
    if (locales.includes(first)) locale = first;
    rest = segments.slice(looksLikeLocale(first) ? 1 : 0);
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${[edition, locale ?? preferredLocale(req), ...rest].join("/")}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.[\\w]+$).*)"],
};
