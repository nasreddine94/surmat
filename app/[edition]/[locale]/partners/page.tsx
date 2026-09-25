import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { EventImage } from "@/components/event-image";
import { Reveal } from "@/components/reveal";
import { Arrow, Check } from "@/components/icons";
import { outlines, editionPins } from "@/lib/outlines";
import { editionIds, editions } from "@/lib/editions";
import { alternates, resolve } from "@/lib/routing";
import { t } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/partners">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.partners.title, description: dict.partners.lead, alternates: alternates({ edition, locale }, "partners") };
}

/**
 * Partnership: event agencies, trade associations and chambers in other countries can take the
 * SURMAT format to their market — as a licensed edition, a co-organised edition or as SURMAT's
 * sales agent and national pavilion organiser.
 */
export default async function PartnersPage({ params }: PageProps<"/[edition]/[locale]/partners">) {
  const { locale, dict } = await resolve(params);
  const p = dict.partners;
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-28 lg:pt-32">
        <div className="absolute inset-0 -z-10 opacity-40">
          <EventImage id="hall" alt="" sizes="100vw" priority />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-basalt/70 via-basalt/85 to-basalt" />
        <div className="shell grid gap-12 pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="eyebrow">{p.eyebrow}</p>
            <h1 className="display mt-4 text-5xl sm:text-7xl">{p.title}</h1>
            <p className="mt-6 max-w-xl text-lg text-limestone/80">{p.lead}</p>
            <a href="#apply" className="btn btn-solid mt-9">
              {p.cta} <Arrow size={16} />
            </a>
          </div>
          <Reveal className="mx-auto w-full max-w-sm">
            <svg viewBox="-4 -4 108 108" className="w-full text-limestone" role="img" aria-label={p.mapLabel}>
              <path d={outlines.africa} fill="currentColor" fillOpacity=".05" stroke="currentColor" strokeOpacity=".45" strokeWidth=".35" strokeLinejoin="round" />
              {editionIds.map((id) => {
                const [x, y] = editionPins[id];
                return (
                  <g key={id} className="text-gold">
                    <circle cx={x} cy={y} r="3.2" fill="currentColor" opacity=".2" />
                    <circle cx={x} cy={y} r="1.1" fill="currentColor" />
                    <text x={x + 3} y={y + 1} fontSize="3.4" fill="currentColor">
                      {t(editions[id].city, locale)}
                    </text>
                  </g>
                );
              })}
              {/* Open markets: the next editions */}
              {[
                [60, 22],
                [50, 44],
                [62, 60],
                [48, 80],
                [30, 40],
                [76, 36],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="1.6" fill="none" stroke="currentColor" strokeOpacity=".55" strokeWidth=".4" strokeDasharray="1 .8" className="motion-safe:animate-pulse" />
              ))}
              <text x="50" y="104" textAnchor="middle" fontSize="3.2" fill="currentColor" opacity=".7">
                {p.mapLabel}
              </text>
            </svg>
          </Reveal>
        </div>
      </section>

      {/* Formats */}
      <section className="shell pt-16" aria-labelledby="h-formats">
        <h2 id="h-formats" className="display text-4xl sm:text-5xl">
          {p.formatsTitle}
        </h2>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {p.formats.map((f, i) => (
            <li key={f.title}>
              <Reveal delay={i * 0.06} className="h-full">
                <article className={`flex h-full flex-col rounded-md border p-7 ${i === 0 ? "border-gold/50 bg-gold/[0.06]" : "border-line bg-graphite/40"}`}>
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">0{i + 1}</p>
                  <h3 className="display mt-3 text-3xl">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-limestone/75">{f.text}</p>
                  <ul className="mt-5 space-y-2 text-sm text-limestone/85">
                    {f.points.map((x) => (
                      <li key={x} className="flex gap-2.5">
                        <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* What each side brings */}
      <section className="shell grid gap-4 pt-16 md:grid-cols-2" aria-label={p.formatsTitle}>
        {[
          { title: p.weBringTitle, items: p.weBring },
          { title: p.youBringTitle, items: p.youBring },
        ].map((col) => (
          <div key={col.title} className="rounded-md border border-line p-7">
            <h2 className="eyebrow">{col.title}</h2>
            <ul className="mt-5 grid gap-3 text-sm text-limestone/85">
              {col.items.map((x) => (
                <li key={x} className="flex gap-3 border-b border-line pb-3 last:border-0">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Process */}
      <section className="shell pt-16" aria-labelledby="h-steps">
        <h2 id="h-steps" className="display text-4xl sm:text-5xl">
          {p.stepsTitle}
        </h2>
        <ol className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {p.steps.map((s, i) => (
            <li key={s.title} className="bg-basalt p-6">
              <p className="display text-5xl text-gold/80">{i + 1}</p>
              <h3 className="mt-3 font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-limestone/70">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-fog">{p.who}</p>
      </section>

      {/* Apply */}
      <section id="apply" className="shell grid scroll-mt-24 gap-10 pt-20 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="h-apply">
        <div>
          <h2 id="h-apply" className="display text-4xl sm:text-5xl">
            {p.applyTitle}
          </h2>
          <p className="mt-4 max-w-md text-limestone/75">{p.applyLead}</p>
        </div>
        <ContactForm initialTopic="partner" />
      </section>
    </>
  );
}
