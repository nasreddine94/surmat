import type { Metadata } from "next";
import Link from "next/link";
import { EventBand } from "@/components/event-band";
import { EventImage } from "@/components/event-image";
import { SpaceExplorer } from "@/components/space-explorer";
import { Swatch } from "@/components/swatch";
import { Reveal } from "@/components/reveal";
import { Arrow } from "@/components/icons";
import { ContextualCTA } from "@/components/contextual-cta";
import { applications, surfaceIds } from "@/content/applications";
import { materialBySlug } from "@/content/materials";
import { exhibitorsFor } from "@/content/exhibitors";
import { sceneFor } from "@/content/scenes";
import { alternates, href, resolve } from "@/lib/routing";
import { fmt, t } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/applications">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.apps.title, description: dict.apps.lead, alternates: alternates({ edition, locale }, "applications") };
}

export default async function ApplicationsPage({ params }: PageProps<"/[edition]/[locale]/applications">) {
  const { edition, locale, dict, ed } = await resolve(params);
  const c = { edition, locale };
  const list = exhibitorsFor(edition);
  return (
    <div className="shell pt-32">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">{dict.nav.applications}</p>
          <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.home.spacesTitle}</h1>
        </div>
        <p className="max-w-md text-limestone/75 lg:justify-self-end">{dict.apps.lead}</p>
      </div>

      {/* Explore a space */}
      <div className="mt-10">
        <SpaceExplorer priority />
      </div>

      {/* Every space */}
      <section className="pt-24" aria-labelledby="h-spaces">
        <h2 id="h-spaces" className="display text-4xl sm:text-5xl">
          {dict.apps.allSpaces}
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((a, i) => {
            const slugs = [...new Set(Object.values(a.options).flat())];
            const suppliers = list.filter((e) => e.materials.some((m) => slugs.includes(m))).length;
            return (
              <li key={a.id}>
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <Link href={href(c, `applications/${a.id}`)} className="group relative isolate flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-md border border-line">
                    <EventImage
                      id={sceneFor(a.id).media}
                      alt={t(a.scene, locale)}
                      sizes="(min-width: 1024px) 32vw, (min-width: 768px) 48vw, 100vw"
                      label={dict.event.visual}
                      className="-z-10 transition-transform duration-[1400ms] ease-[var(--ease-material)] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/5" />
                    <div className="p-6">
                      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">{t(a.scene, locale)}</p>
                      <h3 className="display mt-2 text-4xl">{t(a.name, locale)}</h3>
                      <p className="mt-1 text-sm text-fog">{t(a.sub, locale)}</p>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-limestone/75">{t(a.description, locale)}</p>
                      <ul className="mt-5 flex -space-x-1.5 rtl:space-x-reverse">
                        {surfaceIds.map((s) => {
                          const m = materialBySlug(a.surfaces[s])!;
                          return (
                            <li key={s} title={`${dict.explorer.surfaces[s]} — ${t(m.name, locale)}`}>
                              <Swatch tex={m.tex} seed={m.seed} res={64} className="size-8 rounded-full ring-2 ring-ink" />
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-limestone/80">
                        <span>
                          {fmt(dict.apps.stats, { m: slugs.length, e: suppliers })}
                        </span>
                        <span className="arrow-circle size-8 transition-colors group-hover:border-gold group-hover:text-gold">
                          <Arrow size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <EventBand dict={dict} c={c} ed={ed} bare />
      <ContextualCTA context="applications" />
    </div>
  );
}
