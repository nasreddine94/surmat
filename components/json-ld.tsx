import type { Edition } from "@/lib/editions";
import { t, type Locale } from "@/lib/i18n";

/** Structured data (PRD §53). Rendered server-side as JSON-LD. */
export function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  if (!list.length) return null;
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(list.length === 1 ? list[0] : list).replace(/</g, "\\u003c") }}
    />
  );
}

const base = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const absolute = (path: string) => `${base()}${path}`;

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${base()}/#organization`,
  name: "SURMAT",
  alternateName: ["SURMAT Algeria", "SURMAT Senegal", "Salon SURMAT"],
  url: base(),
  logo: `${base()}/icon-512.png`,
  description: "The International Exhibition for Surface Materials & Building Finishing Products, with editions in Oran (Algeria) and Dakar (Senegal).",
  knowsAbout: ["surface materials", "building finishing products", "ceramic tiles", "natural stone", "paints and coatings", "construction chemicals", "interior finishing systems"],
});

/** The site itself, per language. */
export const websiteJsonLd = (locale: Locale, url: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${base()}/#website`,
  name: "SURMAT",
  url,
  inLanguage: locale,
  publisher: { "@id": `${base()}/#organization` },
});

/** Visible FAQ mirrored as structured data (answer engines). */
export const faqJsonLd = (qa: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: qa.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

/** A material as a defined term of the SURMAT material library (generative engines cite definitions). */
export const materialJsonLd = (m: { name: string; description: string; path: string; sector: string }, locale: Locale) => ({
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: m.name,
  description: m.description,
  url: `${base()}${m.path}`,
  inLanguage: locale,
  termCode: m.path.split("/").pop(),
  inDefinedTermSet: { "@type": "DefinedTermSet", name: `SURMAT material library — ${m.sector}`, url: `${base()}${m.path.replace(/\/[^/]+$/, "")}` },
});

/** Only once an edition has confirmed dates: an Event without a start date is not valid. */
export function eventJsonLd(ed: Edition, locale: Locale) {
  if (!ed.startsOn) return [];
  return [
    {
      "@context": "https://schema.org",
      "@type": "ExhibitionEvent",
      name: t(ed.name, locale),
      startDate: ed.startsOn,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: ed.venue ? t(ed.venue, locale) : t(ed.city, locale),
        address: { "@type": "PostalAddress", addressLocality: t(ed.city, "en"), addressCountry: ed.country },
      },
      organizer: { "@type": "Organization", name: "SURMAT", url: base() },
      url: `${base()}/${ed.id}/${locale}`,
    },
  ];
}

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x.name, item: `${base()}${x.path}` })),
});
