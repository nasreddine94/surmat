import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Swatch } from "@/components/swatch";
import { Arrow } from "@/components/icons";
import { MaterialTile } from "@/components/material-tile";
import { ContextualCTA } from "@/components/contextual-cta";
import { TrackView } from "@/components/track-view";
import { ExhibitorCard } from "@/components/exhibitor-card";
import { materials, materialBySlug, materialsBySector } from "@/content/materials";
import { sectors, sectorById } from "@/content/sectors";
import { applicationById } from "@/content/applications";
import { exhibitorsFor } from "@/content/exhibitors";
import { allCtx, alternates, href, resolve } from "@/lib/routing";
import { fmt, t } from "@/lib/i18n";

export const dynamicParams = false;
export function generateStaticParams() {
  return allCtx().flatMap((c) => [...sectors.map((s) => s.id), ...materials.map((m) => m.slug)].map((slug) => ({ ...c, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/materials/[slug]">): Promise<Metadata> {
  const { edition, locale } = await resolve(params);
  const { slug } = await params;
  const s = sectorById(slug);
  const m = materialBySlug(slug);
  const name = s ? t(s.name, locale) : m ? t(m.name, locale) : "";
  const description = s ? t(s.description, locale) : m ? t(m.summary, locale) : undefined;
  return { title: name, description, alternates: alternates({ edition, locale }, `materials/${slug}`) };
}

export default async function MaterialOrSector({ params }: PageProps<"/[edition]/[locale]/materials/[slug]">) {
  const { edition, locale, dict } = await resolve(params);
  const { slug } = await params;
  const c = { edition, locale };
  const ex = exhibitorsFor(edition);

  /* ---------- Sector (district) page ---------- */
  const sector = sectorById(slug);
  if (sector) {
    const list = materialsBySector(sector.id);
    const sectorEx = ex.filter((e) => e.sectors.includes(sector.id));
    return (
      <>
        <section className="relative isolate min-h-[70vh] overflow-hidden">
          <Swatch tex={sector.tex} seed={sector.seed} res={768} tile="640px" className="absolute inset-0 -z-10" eager />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-basalt via-basalt/70 to-basalt/20" />
          <div className="shell flex min-h-[70vh] flex-col justify-end pb-16 pt-32">
            <p className="eyebrow text-limestone/70">
              {dict.sector.district} {String.fromCharCode(64 + sector.order)}
            </p>
            <h1 className="display mt-4 max-w-4xl text-5xl sm:text-7xl">{t(sector.name, locale)}</h1>
            <p className="mt-5 max-w-xl text-limestone/80">{t(sector.description, locale)}</p>
          </div>
        </section>
        <section className="shell pt-16" aria-labelledby="h-list">
          <h2 id="h-list" className="eyebrow mb-6">
            {dict.sector.materials}
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((m) => (
              <li key={m.slug}>
                <MaterialTile material={m} />
              </li>
            ))}
          </ul>
        </section>
        <section className="shell pt-20" aria-labelledby="h-ex">
          <h2 id="h-ex" className="eyebrow mb-6">
            {dict.sector.exhibitors}
          </h2>
          {sectorEx.length ? (
            <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {sectorEx.map((e) => (
                <li key={e.slug}>
                  <ExhibitorCard exhibitor={e} ctx={c} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-fog">{dict.exhibitors.empty}</p>
          )}
        </section>
        <PitchBand sectorId={sector.id} c={c} />
        <ContextualCTA context="sector" sector={sector.id} />
        <TrackView event="material_view" props={{ sector: sector.id }} />
      </>
    );
  }

  /* ---------- Material page ---------- */
  const m = materialBySlug(slug);
  if (!m) notFound();
  const sec = sectorById(m.sector)!;
  const matEx = ex.filter((e) => e.materials.includes(m.slug));
  const related = materials.filter((x) => x.sector === m.sector && x.slug !== m.slug).slice(0, 4);
  const name = t(m.name, locale);

  return (
    <>
      <section className="shell grid gap-10 pt-28 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:pt-32">
        <div className="[perspective:1400px]">
          <Swatch
            tex={m.tex}
            seed={m.seed}
            res={768}
            eager
            className="mx-auto aspect-[4/5] w-full max-w-[min(34rem,62vh)] rounded-sm shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] motion-safe:transition-transform motion-safe:duration-1000 lg:[transform:rotateY(8deg)_rotateX(2deg)] lg:hover:[transform:rotateY(0deg)]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.22),transparent_40%,rgba(0,0,0,0.3))]" />
          </Swatch>
        </div>
        <div>
          <nav aria-label="Breadcrumb" className="text-xs text-fog">
            <Link href={href(c, "materials")} className="hover:text-limestone">
              {dict.nav.materials}
            </Link>
            <span className="mx-2">/</span>
            <Link href={href(c, `materials/${sec.id}`)} className="hover:text-limestone">
              {t(sec.short, locale)}
            </Link>
          </nav>
          <h1 className="display mt-6 text-5xl sm:text-7xl">{name}</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-limestone/80">{t(m.summary, locale)}</p>
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-8 text-sm">
            <div>
              <dt className="eyebrow">{dict.material.sector}</dt>
              <dd className="mt-2">
                <Link href={href(c, `materials/${sec.id}`)} className="inline-flex items-center gap-2 hover:text-travertine">
                  <span className="size-2 rounded-full" style={{ background: sec.accent }} />
                  {t(sec.name, locale)}
                </Link>
              </dd>
            </div>
            {m.spec && (
              <div>
                <dt className="eyebrow">{dict.material.spec}</dt>
                <dd className="mt-2" dir="ltr">
                  {m.spec}
                </dd>
              </div>
            )}
            <div>
              <dt className="eyebrow">{dict.material.finishes}</dt>
              <dd className="mt-2 text-limestone/85">{m.finishes.map((f) => dict.vocab[f]).join(" · ")}</dd>
            </div>
            <div>
              <dt className="eyebrow">{dict.material.formats}</dt>
              <dd className="mt-2 text-limestone/85">{m.formats.map((f) => dict.vocab[f]).join(" · ")}</dd>
            </div>
            <div className="col-span-2">
              <dt className="eyebrow">{dict.material.applications}</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {m.applications.map((a) => (
                  <Link key={a} href={href(c, `applications/${a}`)} className="chip">
                    {t(applicationById(a)!.name, locale)}
                  </Link>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="shell pt-24" aria-labelledby="h-ex">
        <h2 id="h-ex" className="eyebrow mb-6">
          {dict.material.exhibitors}
        </h2>
        {matEx.length ? (
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {matEx.map((e) => (
              <li key={e.slug}>
                <ExhibitorCard exhibitor={e} ctx={c} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="max-w-md text-sm text-fog">{dict.material.noExhibitors}</p>
        )}
      </section>

      <PitchBand sectorId={sec.id} c={c} question={fmt(dict.material.manufacturerQ, { material: name })} />

      {related.length > 0 && (
        <section className="shell pt-24" aria-labelledby="h-rel">
          <h2 id="h-rel" className="eyebrow mb-6">
            {dict.material.related}
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((r) => (
              <li key={r.slug}>
                <MaterialTile material={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContextualCTA context="material" sector={sec.id} />
      <TrackView event="material_view" props={{ material: m.slug, sector: sec.id }} />
    </>
  );
}

/** The key commercial loop: every material page ends with a manufacturer pitch. */
function PitchBand({ sectorId, c, question }: { sectorId: string; c: { edition: "dz" | "sn"; locale: "en" | "fr" | "ar" }; question?: string }) {
  const s = sectorById(sectorId)!;
  return (
    <section className="shell pt-24">
      <div className="relative overflow-hidden rounded-xl border border-line">
        <Swatch tex={s.tex} seed={s.seed + 20} res={512} className="absolute inset-0" />
        <div className="relative flex flex-col gap-8 bg-gradient-to-r from-basalt via-basalt/90 to-basalt/50 p-8 sm:p-12 md:flex-row md:items-end md:justify-between rtl:bg-gradient-to-l">
          <div>
            {question && <p className="text-sm text-travertine">{question}</p>}
            <p className="display mt-3 max-w-xl text-3xl sm:text-4xl">{t(s.pitch, c.locale)}</p>
          </div>
          <Link href={href(c, `exhibit?sector=${s.id}`)} className="btn btn-solid shrink-0">
            {t(s.ctaLabel, c.locale)} <Arrow size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
