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

const base = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SURMAT",
  url: base(),
  description: "The International Exhibition for Surface Materials & Building Finishing Products",
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
