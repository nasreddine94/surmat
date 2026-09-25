import Link from "next/link";
import { Reveal } from "./reveal";
import { Arrow } from "./icons";
import { outlines } from "@/lib/outlines";
import { editions, type EditionId } from "@/lib/editions";
import { href, type Ctx } from "@/lib/routing";
import { t, type Dict } from "@/lib/i18n";

type P = { dict: Dict; c: Ctx };

/** A small line map for each market; the world is drawn as a graticule globe. */
function MarketMap({ id }: { id: string }) {
  if (id === "world")
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.1">
        <circle cx="50" cy="50" r="42" />
        <ellipse cx="50" cy="50" rx="18" ry="42" />
        <ellipse cx="50" cy="50" rx="34" ry="42" opacity=".6" />
        <path d="M8 50h84M14 30h72M14 70h72" opacity=".6" />
        <path d={outlines.africa} transform="translate(38 36) scale(.28)" fill="currentColor" stroke="none" opacity=".9" />
      </svg>
    );
  const d = outlines[id as keyof typeof outlines];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <path d={d} fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Algeria, Senegal, Africa, the world: why a stand at SURMAT reaches four markets. */
export function Markets({ dict, c }: P) {
  const w = dict.why;
  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="h-why">
      <Reveal className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-end">
        <div>
          <p className="eyebrow">{w.eyebrow}</p>
          <h2 id="h-why" className="display mt-4 text-4xl sm:text-6xl">
            {w.title}
          </h2>
        </div>
        <p className="max-w-xl text-limestone/75 md:justify-self-end">{w.lead}</p>
      </Reveal>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {w.markets.map((m, i) => {
          const edition = (m.id === "dz" || m.id === "sn" ? m.id : null) as EditionId | null;
          const here = edition === c.edition;
          return (
            <li key={m.id}>
              <Reveal delay={i * 0.07} className={`flex h-full flex-col rounded-md border p-6 ${here ? "border-travertine/60 bg-travertine/[0.06]" : "border-line bg-graphite/40"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-travertine">{m.kicker}</p>
                    <h3 className="display mt-2 text-3xl">{m.name}</h3>
                  </div>
                  <div className={`size-16 shrink-0 ${here ? "text-travertine" : "text-limestone/70"}`}>
                    <MarketMap id={m.id} />
                  </div>
                </div>
                <ul className="mt-6 space-y-3 text-sm leading-relaxed text-limestone/75">
                  {m.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-travertine" />
                      {p}
                    </li>
                  ))}
                </ul>
                {edition && (
                  <div className="mt-auto pt-6">
                    <Link
                      href={href({ ...c, edition }, "")}
                      className="flex items-center justify-between gap-3 border-t border-line pt-4 text-sm text-limestone/80 hover:text-limestone"
                    >
                      {t(editions[edition].name, c.locale)} · {t(editions[edition].city, c.locale)}
                      <span className="arrow-circle size-7 shrink-0">
                        <Arrow size={12} />
                      </span>
                    </Link>
                  </div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Six concrete things an exhibitor gets. */
export function Offer({ dict }: P) {
  const w = dict.why;
  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="h-offer">
      <Reveal className="max-w-2xl">
        <h2 id="h-offer" className="display text-4xl sm:text-5xl">
          {w.offerTitle}
        </h2>
        <p className="mt-4 text-limestone/75">{w.offerLead}</p>
      </Reveal>
      <ol className="mt-12 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {w.offer.map((o, i) => (
          <li key={o.title} className="border-b border-line py-8 sm:odd:pe-8 sm:even:ps-8 lg:px-8 lg:[&:nth-child(3n+1)]:ps-0 lg:[&:nth-child(3n)]:pe-0 lg:[&:not(:nth-child(3n))]:border-e">
            <Reveal delay={(i % 3) * 0.06}>
              <span className="font-mono text-xs text-travertine">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{o.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Who exhibitors meet, and the ways to take part. */
export function Participate({ dict, c }: P) {
  const w = dict.why;
  const ed = editions[c.edition];
  return (
    <section className="shell grid gap-14 pt-24 sm:pt-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16" aria-labelledby="h-audience">
      <Reveal>
        <h2 id="h-audience" className="display text-4xl sm:text-5xl">
          {w.audienceTitle}
        </h2>
        <p className="mt-4 max-w-md text-limestone/75">{w.audienceLead}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {Object.entries(dict.visit.profiles)
            .filter(([k]) => k !== "other")
            .map(([k, v]) => (
              <li key={k} className="rounded-full border border-line px-4 py-2 text-sm text-limestone/85">
                {v}
              </li>
            ))}
        </ul>
        <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8">
          <div>
            <dt className="text-xs text-fog">{dict.stats.visitors}</dt>
            <dd className="display mt-1 text-4xl tabular-nums">{ed.targets.visitors}</dd>
          </div>
          <div>
            <dt className="text-xs text-fog">{dict.stats.exhibitors}</dt>
            <dd className="display mt-1 text-4xl tabular-nums">{ed.targets.exhibitors}</dd>
          </div>
        </dl>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="display text-4xl sm:text-5xl">{w.participateTitle}</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {w.participate.map((p) => (
            <li key={p.title} className="rounded-md border border-line bg-graphite/40 p-6">
              <h3 className="text-lg">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{p.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={href(c, "exhibit")} className="btn btn-solid">
            {w.cta} <Arrow size={16} />
          </Link>
          {ed.contactEmail && (
            <a href={`mailto:${ed.contactEmail}`} className="btn btn-ghost">
              {w.brochure}
            </a>
          )}
        </div>
      </Reveal>
    </section>
  );
}
