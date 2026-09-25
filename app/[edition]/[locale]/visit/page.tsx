import type { Metadata } from "next";
import { VisitForm } from "@/components/visit-form";
import { Swatch } from "@/components/swatch";
import { EventImage } from "@/components/event-image";
import { Calendar, Pin } from "@/components/icons";
import { alternates, resolve } from "@/lib/routing";
import { t } from "@/lib/i18n";

/** Which event pillar each image illustrates: the talks, then the live demonstrations. */
const PILLARS = [2, 3] as const;

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/visit">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.visit.title, description: dict.visit.lead, alternates: alternates({ edition, locale }, "visit") };
}

export default async function VisitPage({ params, searchParams }: PageProps<"/[edition]/[locale]/visit">) {
  const { locale, dict, ed } = await resolve(params);
  const sp = await searchParams;
  const meeting = typeof sp.meeting === "string" ? sp.meeting : null;
  const profiles = Object.values(dict.visit.profiles).slice(0, 6);

  return (
    <div className="shell grid gap-12 pt-32 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div>
        <p className="eyebrow">{t(ed.name, locale)}</p>
        <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.visit.title}</h1>
        <p className="mt-5 max-w-md text-limestone/75">{dict.visit.lead}</p>
        <dl className="mt-10 space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <Pin size={18} className="text-fog" />
            <dt className="sr-only">Venue</dt>
            <dd>
              {t(ed.city, locale)} · {ed.venue ? t(ed.venue, locale) : dict.edition.venueTBA}
            </dd>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-fog" />
            <dt className="sr-only">Dates</dt>
            <dd>{ed.dates ? t(ed.dates, locale) : dict.edition.datesTBA}</dd>
          </div>
        </dl>
        <div className="mt-10 grid grid-cols-2 gap-2">
          {(["conference", "demo"] as const).map((id, i) => (
            <div key={id} className="relative aspect-[4/3] overflow-hidden rounded-md border border-line">
              <EventImage id={id} alt={dict.event.pillars[PILLARS[i]].title} sizes="(min-width: 1024px) 18vw, 50vw" label={dict.event.visual} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 text-xs">{dict.event.pillars[PILLARS[i]].title}</span>
            </div>
          ))}
        </div>
        <h2 className="eyebrow mt-14">{dict.visit.who}</h2>
        <ul className="mt-5 grid grid-cols-2 gap-2">
          {profiles.map((p, i) => (
            <li key={p}>
              <Swatch
                tex={(["marble", "porcelain", "microcement", "woodSlats", "granite", "terrazzo"] as const)[i]}
                seed={i + 3}
                res={200}
                className="flex h-20 items-end rounded-md p-3"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
                <span className="relative text-xs leading-tight">{p}</span>
              </Swatch>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {ed.registrationUrl ? (
          <a href={ed.registrationUrl} className="btn btn-solid">
            {dict.visit.submit}
          </a>
        ) : (
          <VisitForm meeting={meeting} />
        )}
      </div>
    </div>
  );
}
