import Link from "next/link";
import { Reveal } from "../reveal";
import { Swatch } from "../swatch";
import { Arrow } from "../icons";
import { exhibitorsFor } from "@/content/exhibitors";
import { materialBySlug } from "@/content/materials";
import { sectorById } from "@/content/sectors";
import { countryName } from "@/lib/editions";
import { href, type Ctx } from "@/lib/routing";
import { t, type Dict } from "@/lib/i18n";

/**
 * Home §07 (PRD §14): four exhibitors as miniature showrooms, not a logo wall.
 * Confirmed exhibitors come first; sample profiles are always labelled as such.
 */
export function LeadingExhibitors({ dict, c }: { dict: Dict; c: Ctx }) {
  const list = exhibitorsFor(c.edition)
    .slice()
    .sort((a, b) => Number(a.sample) - Number(b.sample))
    .slice(0, 4);
  if (!list.length) return null;
  const onlySamples = list.every((e) => e.sample);
  const l = dict.leading;

  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="h-leading">
      <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-10">
          <h2 id="h-leading" className="display text-[clamp(2rem,3.5vw,3.75rem)]">
            {l.title}
          </h2>
          <p className="max-w-sm text-sm text-fog">{l.lead}</p>
        </div>
        <Link href={href(c, "exhibitors")} className="flex shrink-0 items-center gap-2 text-sm text-limestone/80 hover:text-limestone">
          {dict.home.viewExhibitors} <Arrow size={14} className="flip-rtl" />
        </Link>
      </Reveal>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((e, i) => {
          const hero = materialBySlug(e.materials[0])!;
          const sec = sectorById(e.sectors[0])!;
          return (
            <li key={e.slug}>
              <Reveal delay={i * 0.07}>
                <Link href={href(c, `exhibitors/${e.slug}`)} className="group block">
                  <div className="relative overflow-hidden rounded-md">
                    <Swatch tex={hero.tex} seed={hero.seed} res={512} className="aspect-[4/5] transition-transform duration-[1200ms] ease-[var(--ease-material)] group-hover:scale-105">
                      <div className="sample-shade absolute inset-0" />
                    </Swatch>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                    {e.sample && (
                      <span className="glass absolute start-3 top-3 rounded-xs px-2 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-gold">{dict.exhibitors.sample}</span>
                    )}
                    {/* Hover: the product wall */}
                    <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <p className="mb-2 text-[0.62rem] uppercase tracking-[0.18em] text-limestone/70">{l.featured}</p>
                      <div className="grid grid-cols-4 gap-1">
                        {e.materials.slice(0, 4).map((s) => {
                          const m = materialBySlug(s)!;
                          return <Swatch key={s} tex={m.tex} seed={m.seed} res={96} className="aspect-square rounded-xs ring-1 ring-white/15" />;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg">{e.name}</h3>
                      <p className="mt-1 text-xs text-fog">
                        {t(sec.short, c.locale)} · {countryName(e.country, c.locale)}
                      </p>
                    </div>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm text-limestone/80 group-hover:text-gold">
                    {l.discover} <Arrow size={14} className="flip-rtl" />
                  </span>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
      {onlySamples && <p className="mt-6 max-w-2xl text-xs text-fog">{dict.exhibitors.sampleNote}</p>}
    </section>
  );
}
