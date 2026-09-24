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

/** Every page lives under /{edition}/{locale}. Anything else is redirected there. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const [, first, second] = pathname.split("/");

  if (editionsList.includes(first) && locales.includes(second)) return;

  const url = req.nextUrl.clone();
  if (editionsList.includes(first)) {
    // /dz or /dz/materials → /dz/{locale}/materials
    const rest = pathname.split("/").slice(2).join("/");
    url.pathname = `/${first}/${preferredLocale(req)}${rest ? `/${rest}` : ""}`;
  } else {
    const edition = req.cookies.get("surmat_edition")?.value;
    url.pathname = `/${edition && editionsList.includes(edition) ? edition : "dz"}/${preferredLocale(req)}${pathname === "/" ? "" : pathname}`;
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.[\\w]+$).*)"],
};
