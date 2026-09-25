import Link from "next/link";
import { Reveal } from "../reveal";
import { Swatch } from "../swatch";
import { Arrow } from "../icons";
import { sectors } from "@/content/sectors";
import { href, type Ctx } from "@/lib/routing";
import { t, type Dict } from "@/lib/i18n";

/** Home §04 (PRD §11): the six headline sectors as tall, tactile cards. */
export function SectorGallery({ dict, c }: { dict: Dict; c: Ctx }) {
  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="h-sectors">
      <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-10">
          <h2 id="h-sectors" className="display text-[clamp(2rem,3.5vw,3.75rem)]">
            {dict.home.materialsTitle}
          </h2>
          <p className="max-w-sm text-sm text-fog">{dict.home.materialsLead}</p>
        </div>
        <Link href={href(c, "materials")} className="flex shrink-0 items-center gap-2 text-sm text-limestone/80 hover:text-limestone">
          {dict.home.viewAll} <Arrow size={14} className="flip-rtl" />
        </Link>
      </Reveal>
      <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
        {sectors.map((s, i) => (
          <li key={s.id} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto">
            <Reveal delay={i * 0.06}>
              <Link href={href(c, `materials/${s.id}`)} className="group relative block overflow-hidden rounded-md">
                <Swatch tex={s.tex} seed={s.seed} res={512} className="aspect-[3/5] transition-transform duration-[1200ms] ease-[var(--ease-material)] group-hover:scale-[1.08]">
                  <div className="sample-shade absolute inset-0" />
                </Swatch>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute start-4 top-4 font-mono text-xs text-limestone/70">{String(i + 1).padStart(2, "0")}</span>
                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="text-base leading-snug">{t(s.name, c.locale)}</h3>
                  <p className="mt-1 text-xs text-limestone/60">{t(s.short, c.locale)}</p>
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[var(--ease-material)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="pt-3 text-xs leading-relaxed text-limestone/75">{t(s.description, c.locale)}</p>
                      <span className="mt-3 inline-flex items-center gap-2 text-xs text-gold">
                        {dict.common.explore} <Arrow size={12} className="flip-rtl" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
