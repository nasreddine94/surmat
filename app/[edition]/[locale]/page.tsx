import Link from "next/link";
import { Hero } from "@/components/hero/hero";
import { Swatch } from "@/components/swatch";
import { Reveal } from "@/components/reveal";
import { Arrow, Badge, Calendar, GlobeIcon, Layers, People } from "@/components/icons";
import { MaterialsBecomeSpaces, SpaceThumb } from "@/components/materials-become-spaces";
import { EditionCard } from "@/components/edition-card";
import { ContextualCTA } from "@/components/contextual-cta";
import { sectors } from "@/content/sectors";
import { applications } from "@/content/applications";
import { exhibitorsFor } from "@/content/exhibitors";
import { materialBySlug } from "@/content/materials";
import { editionIds, editions } from "@/lib/editions";
import { href, resolve } from "@/lib/routing";
import { t } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[edition]/[locale]">) {
  const { edition, locale, dict, ed } = await resolve(params);
  const c = { edition, locale };
  const ex = exhibitorsFor(edition);

  const stats = [
    { icon: Layers, value: String(sectors.length), label: dict.stats.sectors },
    { icon: GlobeIcon, value: String(editionIds.length), label: dict.stats.editions },
    { icon: People, value: ed.targets.exhibitors, label: dict.stats.exhibitors },
    { icon: Badge, value: ed.targets.visitors, label: dict.stats.visitors },
  ];

  return (
    <>
      <Hero />

      {/* Stats */}
      <section aria-label="SURMAT" className="shell">
        <div className="grid grid-cols-2 border-y border-line md:grid-cols-[repeat(4,1fr)_1.3fr]">
          {stats.map(({ icon: I, value, label }, i) => (
            <div key={i} className={`flex items-center gap-4 py-6 md:py-7 ${i % 2 ? "ps-5" : ""} md:px-6 md:first:ps-0 ${i < 3 ? "md:border-e md:border-line" : ""}`}>
              <I size={26} className="shrink-0 text-fog" />
              <div>
                <p className="text-2xl font-medium tabular-nums">{value}</p>
                <p className="text-xs text-fog">{label}</p>
              </div>
            </div>
          ))}
          <Link
            href={href(c, "visit")}
            className="group col-span-2 flex items-center justify-between gap-4 border-t border-line py-6 md:col-span-1 md:border-s md:border-t-0 md:ps-6"
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

      {/* 02 — Explore the world of materials */}
      <section className="shell pt-24 sm:pt-32" aria-labelledby="h-materials">
        <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-10">
            <h2 id="h-materials" className="display text-4xl sm:text-5xl">
              {dict.home.materialsTitle}
            </h2>
            <p className="max-w-sm text-sm text-fog">{dict.home.materialsLead}</p>
          </div>
          <Link href={href(c, "materials")} className="group flex shrink-0 items-center gap-2 text-sm text-limestone/80 hover:text-limestone">
            {dict.home.viewAll} <Arrow size={14} />
          </Link>
        </Reveal>
        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-6">
          {sectors.map((s, i) => (
            <li key={s.id} className="w-[70vw] shrink-0 snap-start md:w-auto">
              <Reveal delay={i * 0.06}>
                <Link href={href(c, `materials/${s.id}`)} className="group block">
                  <Swatch tex={s.tex} seed={s.seed} res={384} className="aspect-[4/3] rounded-md md:aspect-[5/4]">
                    <div className="sample-shade absolute inset-0" />
                    <div className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-black/60 to-transparent transition-transform duration-700 group-hover:scale-y-100" />
                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                      <span className="text-[0.85rem] leading-snug">{t(s.name, locale)}</span>
                      <span className="arrow-circle shrink-0">
                        <Arrow size={14} />
                      </span>
                    </div>
                  </Swatch>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* 03 — Materials become spaces */}
      <section className="shell pt-24 sm:pt-32" aria-labelledby="h-spaces">
        <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-10">
            <h2 id="h-spaces" className="display text-4xl sm:text-5xl">
              {dict.home.spacesTitle}
            </h2>
            <p className="max-w-sm text-sm text-fog">{dict.home.spacesLead}</p>
          </div>
          <Link href={href(c, "applications")} className="flex shrink-0 items-center gap-2 text-sm text-limestone/80 hover:text-limestone">
            {dict.home.exploreApps} <Arrow size={14} />
          </Link>
        </Reveal>
        <Reveal>
          <MaterialsBecomeSpaces />
        </Reveal>

        {/* 04 — Applications */}
        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-6">
          {applications.map((a) => (
            <li key={a.id} className="w-[70vw] shrink-0 snap-start md:w-auto">
              <Link href={href(c, `applications/${a.id}`)} className="group relative block overflow-hidden rounded-md">
                <div className="transition-transform duration-700 group-hover:scale-[1.04]">
                  <SpaceThumb id={a.id} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                  <span>
                    <span className="block text-sm">{t(a.name, locale)}</span>
                    <span className="block text-[0.7rem] text-limestone/60">{t(a.sub, locale)}</span>
                  </span>
                  <span className="arrow-circle size-7 shrink-0">
                    <Arrow size={12} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 05–08 — Industry, experience, editions */}
      <section className="shell grid gap-14 pt-24 sm:pt-32 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-line rtl:lg:divide-x-reverse">
        <Reveal className="lg:pe-10">
          <h2 className="display text-3xl sm:text-4xl">{dict.home.industryTitle}</h2>
          <p className="mt-3 max-w-sm text-sm text-fog">{dict.home.industryLead}</p>
          <ul className="mt-8 grid grid-cols-4 gap-2">
            {ex.slice(0, 8).map((e) => {
              const m = materialBySlug(e.materials[0])!;
              return (
                <li key={e.slug}>
                  <Link href={href(c, `exhibitors/${e.slug}`)} title={e.name} className="group block">
                    <Swatch tex={m.tex} seed={m.seed} res={120} className="aspect-square rounded">
                      <span className="absolute inset-0 grid place-items-center bg-black/55 p-1 text-center text-[0.6rem] leading-tight opacity-90 transition group-hover:bg-black/30">
                        {e.name}
                      </span>
                    </Swatch>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href={href(c, "exhibitors")} className="btn btn-ghost btn-sm mt-8">
            {dict.home.viewExhibitors} <Arrow size={14} />
          </Link>
        </Reveal>

        <Reveal delay={0.08} className="lg:px-10">
          <h2 className="display text-3xl sm:text-4xl">{dict.home.experienceTitle}</h2>
          <p className="mt-3 max-w-sm text-sm text-fog">{dict.home.experienceLead}</p>
          <ol className="mt-8 grid grid-cols-3 gap-2">
            {sectors.map((s) => (
              <li key={s.id} className="flex items-center gap-2 rounded border border-line px-2.5 py-2 text-[0.7rem] text-limestone/80">
                <span className="font-semibold text-limestone">{String.fromCharCode(64 + s.order)}</span>
                <span className="truncate">{t(s.short, locale)}</span>
              </li>
            ))}
          </ol>
          <Link href={href(c, "experience")} className="btn btn-ghost btn-sm mt-8">
            {dict.home.exploreExperience} <Arrow size={14} />
          </Link>
        </Reveal>

        <Reveal delay={0.16} className="lg:ps-10">
          <h2 className="display text-3xl sm:text-4xl">{dict.home.editionsTitle}</h2>
          <p className="mt-3 text-sm text-fog">{dict.home.editionsLead}</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {editionIds.map((id) => (
              <EditionCard key={id} edition={editions[id]} locale={locale} dict={dict} current={id === edition} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 09–10 — Visit / Exhibit */}
      <section className="shell mt-24 grid gap-3 sm:mt-32 md:grid-cols-2">
        <Link href={href(c, "visit")} className="group relative overflow-hidden rounded-xl">
          <Swatch tex="travertine" seed={5} res={512} className="min-h-[22rem]">
            <div className="absolute inset-0 bg-gradient-to-tr from-basalt via-basalt/75 to-transparent" />
            <div className="relative flex h-full min-h-[22rem] flex-col justify-end p-8 sm:p-10">
              <p className="eyebrow text-limestone/70">{dict.nav.visit}</p>
              <h2 className="display mt-3 text-4xl sm:text-5xl">{dict.home.visitTitle}</h2>
              <p className="mt-3 max-w-sm text-sm text-limestone/75">{dict.home.visitLead}</p>
              <span className="btn btn-solid mt-8 self-start">
                {dict.nav.register} <Arrow size={16} />
              </span>
            </div>
          </Swatch>
        </Link>
        <Link href={href(c, "exhibit")} className="group relative overflow-hidden rounded-xl">
          <Swatch tex="nero" seed={3} res={512} className="min-h-[22rem]">
            <div className="absolute inset-0 bg-gradient-to-tr from-basalt via-basalt/60 to-transparent" />
            <div className="relative flex h-full min-h-[22rem] flex-col justify-end p-8 sm:p-10">
              <p className="eyebrow text-limestone/70">{dict.nav.exhibit}</p>
              <h2 className="display mt-3 text-4xl sm:text-5xl">{dict.home.exhibitTitle}</h2>
              <p className="mt-3 max-w-sm text-sm text-limestone/75">{dict.home.exhibitLead}</p>
              <span className="btn btn-ghost mt-8 self-start bg-basalt/40 backdrop-blur">
                {dict.hero.exhibit} <Arrow size={16} />
              </span>
            </div>
          </Swatch>
        </Link>
      </section>

      <ContextualCTA context="home" />
    </>
  );
}
