import type { Metadata } from "next";
import { ExhibitFlow } from "@/components/exhibit-flow";
import { EventImage } from "@/components/event-image";
import { ScopeSection } from "@/components/home/scope-section";
import { SystemsExplorer } from "@/components/systems-explorer";
import { Check } from "@/components/icons";
import { Markets, Offer, Participate } from "@/components/why-exhibit";
import { sectorById, type SectorId } from "@/content/sectors";
import { alternates, resolve } from "@/lib/routing";
import { t } from "@/lib/i18n";
import { AnswersSection } from "@/components/answers-section";

/** Which event pillar each image illustrates: the stand, then B2B meetings. */
const PILLARS = [0, 1] as const;

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/exhibit">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.exhibit.title, description: dict.exhibit.lead, alternates: alternates({ edition, locale }, "exhibit") };
}

export default async function ExhibitPage({ params, searchParams }: PageProps<"/[edition]/[locale]/exhibit">) {
  const { edition, locale, dict, ed } = await resolve(params);
  const c = { edition, locale };
  const sp = await searchParams;
  const sector = typeof sp.sector === "string" && sectorById(sp.sector) ? (sp.sector as SectorId) : null;
  const stand = typeof sp.stand === "string" && /^[A-I]-\d{2}$/.test(sp.stand) ? sp.stand : null;
  const s = sector ? sectorById(sector) : null;

  return (
    <>
      <div className="shell grid gap-12 pt-32 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
        <div>
          <p className="eyebrow">{t(ed.name, locale)}</p>
          <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.exhibit.title}</h1>
          <p className="display mt-4 text-2xl text-travertine">{dict.exhibit.lead}</p>
          {s && <p className="mt-6 max-w-sm text-limestone/80">{t(s.pitch, locale)}</p>}
          <ul className="mt-10 space-y-4 text-sm text-limestone/80">
            {dict.exhibit.why.map((w) => (
              <li key={w} className="flex gap-3">
                <Check size={18} className="mt-0.5 shrink-0 text-travertine" />
                {w}
              </li>
            ))}
          </ul>
          <div className="mt-10 grid grid-cols-2 gap-2">
            {(["stand", "networking"] as const).map((id, i) => (
              <div key={id} className="relative aspect-[4/3] overflow-hidden rounded-md border border-line">
                <EventImage id={id} alt={dict.event.pillars[PILLARS[i]].title} sizes="(min-width: 1024px) 18vw, 50vw" label={dict.event.visual} />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 text-xs">{dict.event.pillars[PILLARS[i]].title}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          {ed.exhibitionUrl ? (
            <a href={ed.exhibitionUrl} className="btn btn-solid">
              {dict.exhibit.submit}
            </a>
          ) : (
            <ExhibitFlow initialSector={sector} stand={stand} />
          )}
        </div>
      </div>
      <Markets dict={dict} c={c} />
      <Offer dict={dict} c={c} />
      <Participate dict={dict} c={c} />
      <ScopeSection />
      <AnswersSection ed={ed} locale={locale} dict={dict} only={["exhibit", "scope", "scale", "when"]} facts={false} />
      {/* Dense technical sections: tablets and desktops. Phones get the district overview above. */}
      <div className="hidden md:block">
        <SystemsExplorer />
      </div>
    </>
  );
}
