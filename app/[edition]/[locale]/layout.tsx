import type { Metadata, Viewport } from "next";
import { Amiri, Archivo, Cormorant_Garamond, IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from "next/font/google";
import "../../globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SiteProvider } from "@/components/site-context";
import { AttributionCapture } from "@/components/attribution";
import { allCtx, alternates, resolve } from "@/lib/routing";
import { dirOf, langTag, t } from "@/lib/i18n";

/** Wide grotesk, kept only for the SURMAT wordmark. */
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
/** PRD §25: Cormorant Garamond for display, Plus Jakarta Sans for UI and body. */
const cormorant = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-jakarta", display: "swap" });
const plexAr = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600"], variable: "--font-plex-ar", display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });

export const dynamicParams = false;
export const generateStaticParams = allCtx;

export const viewport: Viewport = { themeColor: "#0b0c0d", colorScheme: "dark" };

export async function generateMetadata({ params }: LayoutProps<"/[edition]/[locale]">): Promise<Metadata> {
  const { edition, locale, dict, ed } = await resolve(params);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: `${t(ed.name, locale)} — ${dict.brand.descriptor}`, template: `%s · ${t(ed.name, locale)}` },
    description: dict.footer.tagline,
    alternates: alternates({ edition, locale }),
    openGraph: { siteName: "SURMAT", locale: `${locale}_${ed.country}`, type: "website" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[edition]/[locale]">) {
  const { edition, locale, dict } = await resolve(params);
  return (
    <html
      lang={langTag(locale)}
      dir={dirOf(locale)}
      className={`${archivo.variable} ${cormorant.variable} ${jakarta.variable} ${plexAr.variable} ${amiri.variable}`}
    >
      <body>
        <SiteProvider value={{ edition, locale, dict }}>
          <Nav />
          <main id="main">{children}</main>
          <Footer edition={edition} locale={locale} />
          <AttributionCapture />
        </SiteProvider>
      </body>
    </html>
  );
}
