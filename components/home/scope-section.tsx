import Link from "next/link";
import { Reveal } from "../reveal";
import { EventImage } from "../event-image";
import { Arrow } from "../icons";
import { familyGroups, familyCount } from "@/content/families";
import { materials } from "@/content/materials";
import { href, type Ctx } from "@/lib/routing";
import { fmt, t, type Dict } from "@/lib/i18n";

/**
 * The exhibition's full scope. The material library shows examples; this shows everything the
 * floor accepts, so no exhibitor reads the site as a closed list of ten products.
 */
export function ScopeSection({ dict, c, compact = false }: { dict: Dict; c: Ctx; compact?: boolean }) {
  const s = dict.scope;
  return (
    <section className={compact ? "pt-20" : "shell pt-24 sm:pt-32"} aria-labelledby="h-scope">
      <div className="relative isolate overflow-hidden rounded-md border border-line">
        <div className="absolute inset-0 -z-10 opacity-25">
          <EventImage id="library" alt="" sizes="100vw" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/85 via-ink/92 to-ink" />

        <div className="p-6 sm:p-12">
          <Reveal>
            <p className="eyebrow">{s.eyebrow}</p>
            <h2 id="h-scope" className="display mt-5 max-w-3xl text-[clamp(2.25rem,4.5vw,4.25rem)]">
              {s.title}
            </h2>
            <p className="mt-5 max-w-2xl text-limestone/75">{s.lead}</p>
            <p className="mt-4 text-sm text-gold">{fmt(s.count, { m: materials.length, f: familyCount })}</p>
          </Reveal>

          <div className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {familyGroups.map((g, i) => (
              <Reveal key={g.id} delay={0.03 * i}>
                <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                  <h3 className="font-medium">{t(g.name, c.locale)}</h3>
                  <span className={`shrink-0 text-[0.62rem] uppercase tracking-[0.16em] ${g.core ? "text-gold" : "text-fog"}`}>
                    {g.core ? s.core : s.adjacent}
                  </span>
                </div>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {g.families.map((f) => (
                    <li key={f.en} className="rounded-xs border border-line bg-ink/50 px-2 py-1 text-xs text-limestone/80">
                      {t(f, c.locale)}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[0.7rem] text-fog">{fmt(s.families, { n: g.families.length })}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <div className="flex flex-col gap-5 rounded-md border border-gold/35 bg-gold/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="display text-2xl sm:text-3xl">{s.missing}</p>
                <p className="mt-2 max-w-2xl text-sm text-limestone/75">{s.missingText}</p>
              </div>
              <Link href={href(c, "exhibit")} className="btn btn-solid shrink-0 self-start sm:self-auto">
                {s.cta} <Arrow size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
