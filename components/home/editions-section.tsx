import Link from "next/link";
import { Reveal } from "../reveal";
import { EventImage } from "../event-image";
import { Arrow } from "../icons";
import { outlines, editionPins } from "@/lib/outlines";
import { editionIds, editions } from "@/lib/editions";
import { href, type Ctx } from "@/lib/routing";
import { t, type Dict } from "@/lib/i18n";

/**
 * Home §09 (PRD §16): two editions, one platform. The continent with both cities marked,
 * and an edition card for each.
 */
export function EditionsSection({ dict, c }: { dict: Dict; c: Ctx }) {
  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="h-editions">
      <div className="relative isolate overflow-hidden rounded-md border border-line">
        <div className="gradient-mineral absolute inset-0 -z-10 opacity-[0.18]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_75%_50%,transparent,#08080a_75%)]" />
        <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <p className="eyebrow">{dict.home.editionsTitle}</p>
            <h2 id="h-editions" className="display mt-5 text-[clamp(2.5rem,5vw,5rem)]">
              {dict.home.editionsHeadline}
            </h2>
            <p className="mt-5 max-w-md text-limestone/75">{dict.home.editionsLead}</p>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {editionIds.map((id) => {
                const e = editions[id];
                const here = id === c.edition;
                return (
                  <li key={id}>
                    <Link
                      href={href({ ...c, edition: id })}
                      aria-current={here ? "true" : undefined}
                      className={`group flex h-full flex-col overflow-hidden rounded-sm border transition-colors ${here ? "border-gold/55 bg-gold/[0.06]" : "border-line bg-ink/40 hover:border-line-strong"}`}
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <EventImage
                          id={id === "dz" ? "oran" : "dakar"}
                          alt={t(e.city, c.locale)}
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                          label={dict.event.visual}
                          className="transition-transform duration-[1400ms] ease-[var(--ease-material)] group-hover:scale-[1.05]"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="wordmark text-xs text-limestone/70">SURMAT</p>
                        <p className="display mt-1 text-3xl">{t(e.name, c.locale).replace(/^SURMAT\s*/, "")}</p>
                        <p className="mt-3 text-sm text-limestone/75">{t(e.city, c.locale)}</p>
                        <p className="text-xs text-fog">{e.dates ? t(e.dates, c.locale) : dict.edition.datesTBA}</p>
                        <span className="mt-auto flex items-center justify-between pt-6 text-sm">
                          {here ? dict.home.current : dict.home.exploreEdition}
                          <span className="arrow-circle size-7">
                            <Arrow size={12} />
                          </span>
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto w-full max-w-md">
            <svg viewBox="-4 -4 108 108" className="w-full text-limestone" role="img" aria-label={editionIds.map((id) => t(editions[id].city, c.locale)).join(" · ")}>
              <path d={outlines.africa} fill="currentColor" fillOpacity=".05" stroke="currentColor" strokeOpacity=".45" strokeWidth=".35" strokeLinejoin="round" />
              {editionIds.map((id) => {
                const [x, y] = editionPins[id];
                const here = id === c.edition;
                return (
                  <g key={id} className={here ? "text-gold" : "text-limestone"}>
                    <circle cx={x} cy={y} r="3.2" fill="currentColor" opacity=".18" className="motion-safe:animate-pulse" />
                    <circle cx={x} cy={y} r="1.1" fill="currentColor" />
                    <text x={x + 3} y={y + 1} fontSize="3.4" fill="currentColor" className="font-sans">
                      {t(editions[id].city, c.locale)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
