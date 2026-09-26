import Link from "next/link";
import { Hero } from "@/components/hero/hero";
import { Arrow, Badge, Calendar, GlobeIcon, Layers, People } from "@/components/icons";
import { Markets } from "@/components/why-exhibit";
import { ContextualCTA } from "@/components/contextual-cta";
import { MaterialUniverse } from "@/components/home/material-universe";
import { SectorGallery } from "@/components/home/sector-gallery";
import { ApplicationsExplorer } from "@/components/home/applications-explorer";
import { ExperienceTeaser } from "@/components/home/experience-teaser";
import { LeadingExhibitors } from "@/components/home/leading-exhibitors";
import { ConversionSplit } from "@/components/home/conversion-split";
import { EditionsSection } from "@/components/home/editions-section";
import { EventPillars } from "@/components/home/event-pillars";
import { ScopeSection } from "@/components/home/scope-section";
import { SystemsExplorer } from "@/components/systems-explorer";
import { JsonLd, absolute, eventJsonLd, organizationJsonLd, websiteJsonLd } from "@/components/json-ld";
import { AnswersSection } from "@/components/answers-section";
import { sectors } from "@/content/sectors";
import { editionIds } from "@/lib/editions";
import { href, resolve } from "@/lib/routing";
import { t } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[edition]/[locale]">) {
  const { edition, locale, dict, ed } = await resolve(params);
  const c = { edition, locale };

  const stats = [
    { icon: Layers, value: String(sectors.length), label: dict.stats.sectors },
    { icon: GlobeIcon, value: String(editionIds.length), label: dict.stats.editions },
    { icon: People, value: ed.targets.exhibitors, label: dict.stats.exhibitors },
    { icon: Badge, value: ed.targets.visitors, label: dict.stats.visitors },
  ];

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(locale, absolute(href(c))), ...eventJsonLd(ed, locale)]} />
      <Hero />

      {/* Stats */}
      <section aria-label="SURMAT" className="shell">
        <div className="grid grid-cols-2 border-y border-line lg:grid-cols-[repeat(4,1fr)_1.3fr]">
          {stats.map(({ icon: I, value, label }, i) => (
            <div key={i} className={`flex items-center gap-4 py-6 lg:py-7 ${i % 2 ? "ps-5" : ""} lg:px-6 lg:first:ps-0 ${i < 3 ? "lg:border-e lg:border-line" : ""}`}>
              <I size={26} className="shrink-0 text-fog" />
              <div>
                <p className="text-2xl font-medium tabular-nums">{value}</p>
                <p className="text-xs text-fog">{label}</p>
              </div>
            </div>
          ))}
          <Link
            href={href(c, "visit")}
            className="group col-span-2 flex items-center justify-between gap-4 border-t border-line py-6 lg:col-span-1 lg:border-s lg:border-t-0 lg:ps-6"
          >
            <span className="flex items-center gap-4">
              <Calendar size={26} className="shrink-0 text-fog" />
              <span className="text-sm text-limestone/85">
                {dict.stats.hub}
                <span className="block text-xs text-fog">
                  {t(ed.city, locale)} · {ed.dates ? t(ed.dates, locale) : dict.edition.datesTBA}
                </span>
              </span>
            </span>
            <span className="arrow-circle shrink-0">
              <Arrow size={14} />
            </span>
          </Link>
        </div>
      </section>

      {/* The exhibition: floor, meetings, talks, launches */}
      <EventPillars dict={dict} c={c} ed={ed} />

      {/* 03 — Material universe */}
      <MaterialUniverse />

      {/* 04 — Material sector gallery */}
      <SectorGallery dict={dict} c={c} />

      {/* The full exhibition scope — the library is a selection, the floor is open */}
      <ScopeSection />

      {/* How it is built: systems layer by layer, on site and in section */}
      {/* Dense technical sections: tablets and desktops. Phones get the district overview above. */}
      <div className="hidden md:block">
        <SystemsExplorer />
      </div>

      {/* 05 — Applications explorer */}
      <ApplicationsExplorer />

      {/* 06 — The exhibition experience */}
      <ExperienceTeaser dict={dict} c={c} ed={ed} />

      {/* 07 — Leading exhibitors */}
      <LeadingExhibitors dict={dict} c={c} />

      {/* Why exhibit: one stand, four markets */}
      <Markets dict={dict} c={c} />

      {/* 08 — Visit / Exhibit */}
      <ConversionSplit dict={dict} c={c} />

      {/* 09 — Country editions */}
      <EditionsSection dict={dict} c={c} />

      {/* 10 — Key facts and answers (AEO / GEO) */}
      <AnswersSection ed={ed} locale={locale} dict={dict} />

      <ContextualCTA context="home" />
    </>
  );
}
