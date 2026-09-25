import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MaterialTile } from "@/components/material-tile";
import { ExhibitorCard } from "@/components/exhibitor-card";
import { ContextualCTA } from "@/components/contextual-cta";
import { TrackView } from "@/components/track-view";
import { applications, applicationById } from "@/content/applications";
import { materialBySlug } from "@/content/materials";
import { exhibitorsFor } from "@/content/exhibitors";
import { allCtx, alternates, href, resolve } from "@/lib/routing";
import { t } from "@/lib/i18n";

export const dynamicParams = false;
export function generateStaticParams() {
  return allCtx().flatMap((c) => applications.map((a) => ({ ...c, slug: a.id })));
}

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/applications/[slug]">): Promise<Metadata> {
  const { edition, locale } = await resolve(params);
  const a = applicationById((await params).slug);
  if (!a) return {};
  return { title: `${t(a.name, locale)} — ${t(a.sub, locale)}`, description: t(a.description, locale), alternates: alternates({ edition, locale }, `applications/${a.id}`) };
}

export default async function ApplicationPage({ params }: PageProps<"/[edition]/[locale]/applications/[slug]">) {
  const { edition, locale, dict } = await resolve(params);
  const a = applicationById((await params).slug);
  if (!a) notFound();
  const c = { edition, locale };
  const slugs = [...new Set(Object.values(a.options).flat())];
  const used = [...new Set(Object.values(a.surfaces))];
  const suppliers = exhibitorsFor(edition).filter((e) => e.materials.some((m) => slugs.includes(m)));

  return (
    <>
      <div className="shell pt-28 lg:pt-32">
        <nav aria-label="Breadcrumb" className="text-xs text-fog">
          <Link href={href(c, "applications")} className="hover:text-limestone">
            {dict.nav.applications}
          </Link>
        </nav>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="display text-5xl sm:text-7xl">{t(a.name, locale)}</h1>
            <p className="mt-2 text-fog">
              {t(a.sub, locale)} · {t(a.scene, locale)}
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-limestone/75">{t(a.description, locale)}</p>
        </div>
      </div>

      <section className="shell pt-24" aria-labelledby="h-used">
        <h2 id="h-used" className="eyebrow mb-6">
          {dict.apps.materialsUsed}
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {used.map((s) => (
            <li key={s}>
              <MaterialTile material={materialBySlug(s)!} showSector />
            </li>
          ))}
        </ul>
      </section>

      {suppliers.length > 0 && (
        <section className="shell pt-20" aria-labelledby="h-sup">
          <h2 id="h-sup" className="eyebrow mb-6">
            {dict.apps.suppliers}
          </h2>
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((e) => (
              <li key={e.slug}>
                <ExhibitorCard exhibitor={e} ctx={c} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContextualCTA context="application" sector={materialBySlug(a.surfaces.feature)!.sector} />
      <TrackView event="application_view" props={{ application: a.id }} />
    </>
  );
}
