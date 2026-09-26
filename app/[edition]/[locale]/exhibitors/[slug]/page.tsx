import type { Metadata } from "next";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { EventBand } from "@/components/event-band";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Swatch } from "@/components/swatch";
import { Arrow, Pin } from "@/components/icons";
import { MaterialTile } from "@/components/material-tile";
import { ContextualCTA } from "@/components/contextual-cta";
import { TrackView } from "@/components/track-view";
import { exhibitors, exhibitorBySlug } from "@/content/exhibitors";
import { materialBySlug } from "@/content/materials";
import { sectorById } from "@/content/sectors";
import { countryName } from "@/lib/editions";
import { allCtx, alternates, href, resolve } from "@/lib/routing";
import { t } from "@/lib/i18n";

export const dynamicParams = false;
export function generateStaticParams() {
  return allCtx().flatMap((c) => exhibitors.map((e) => ({ ...c, slug: e.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/exhibitors/[slug]">): Promise<Metadata> {
  const { edition, locale } = await resolve(params);
  const e = exhibitorBySlug((await params).slug);
  if (!e) return {};
  return {
    title: e.name,
    description: t(e.blurb, locale),
    alternates: alternates({ edition, locale }, `exhibitors/${e.slug}`),
    robots: e.sample ? { index: false } : undefined,
  };
}

export default async function ExhibitorPage({ params }: PageProps<"/[edition]/[locale]/exhibitors/[slug]">) {
  const { edition, locale, dict, ed } = await resolve(params);
  const e = exhibitorBySlug((await params).slug);
  if (!e) notFound();
  const c = { edition, locale };
  const mats = e.materials.map((s) => materialBySlug(s)!);
  const sec = sectorById(e.sectors[0])!;
  const stand = e.stands[edition];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.nav.exhibitors, path: href(c, "exhibitors") },
          { name: e.name, path: href(c, `exhibitors/${e.slug}`) },
        ])}
      />
      {/* Product wall */}
      <section className="relative isolate overflow-hidden pt-16">
        <div className="grid h-[52vh] min-h-[22rem] grid-cols-2 gap-px bg-line sm:grid-cols-4" aria-hidden>
          {mats.slice(0, 4).map((m, i) => (
            <Swatch key={m.slug} tex={m.tex} seed={m.seed} res={512} eager className={i > 1 ? "hidden sm:block" : ""} />
          ))}
        </div>
        <div className="absolute inset-0 -z-0 bg-gradient-to-t from-basalt via-basalt/40 to-transparent" />
        <div className="shell absolute inset-x-0 bottom-0 pb-10">
          {e.sample && <p className="mb-3 inline-flex rounded-full border border-travertine/40 bg-basalt/60 px-3 py-1 text-xs text-travertine backdrop-blur">{dict.exhibitors.sample}</p>}
          <p className="eyebrow text-limestone/75">
            {dict.exhibitors.district} {String.fromCharCode(64 + sec.order)} · {t(sec.name, locale)}
          </p>
          <h1 className="display mt-3 text-5xl sm:text-7xl">{e.name}</h1>
        </div>
      </section>

      <section className="shell grid gap-12 pt-12 lg:grid-cols-[1fr_22rem]">
        <div>
          <p className="max-w-2xl text-lg leading-relaxed text-limestone/85">{t(e.blurb, locale)}</p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <div>
              <dt className="eyebrow">{dict.form.country}</dt>
              <dd className="mt-1.5">{countryName(e.country, locale)}</dd>
            </div>
            {e.founded && (
              <div>
                <dt className="eyebrow">{dict.exhibitors.founded}</dt>
                <dd className="mt-1.5 tabular-nums">{e.founded}</dd>
              </div>
            )}
            <div>
              <dt className="eyebrow">{dict.exhibitors.markets}</dt>
              <dd className="mt-1.5">{e.editions.map((x) => countryName(x.toUpperCase(), locale)).join(" · ")}</dd>
            </div>
          </dl>

          <h2 className="eyebrow mb-6 mt-16">{dict.exhibitors.products}</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {mats.map((m) => (
              <li key={m.slug}>
                <MaterialTile material={m} />
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-md border border-line bg-graphite p-6 lg:sticky lg:top-24">
          {stand ? (
            <p className="flex items-center gap-2 text-sm">
              <Pin size={16} className="text-travertine" />
              {dict.exhibitors.stand} <span className="font-medium">{stand}</span>
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-2">
            <Link href={href(c, `visit?meeting=${e.slug}`)} className="btn btn-solid justify-center">
              {dict.exhibitors.requestMeeting} <Arrow size={14} />
            </Link>
            {stand && (
              <Link href={href(c, "experience#floor")} className="btn btn-ghost justify-center">
                {dict.exhibitors.visitStand}
              </Link>
            )}
          </div>
        </aside>
      </section>

      <EventBand dict={dict} c={c} ed={ed} />
      <ContextualCTA context="exhibitor" sector={sec.id} />
      <TrackView event="exhibitor_view" props={{ exhibitor: e.slug }} />
    </>
  );
}
