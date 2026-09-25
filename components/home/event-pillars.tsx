import Link from "next/link";
import { Reveal } from "../reveal";
import { EventImage } from "../event-image";
import { Arrow, Calendar, Pin } from "../icons";
import type { MediaKey } from "@/content/event-media";
import type { Edition } from "@/lib/editions";
import { href, type Ctx } from "@/lib/routing";
import { fmt, t, type Dict } from "@/lib/i18n";

const pillarMedia: MediaKey[] = ["stand", "networking", "conference", "demo"];

/**
 * "The exhibition": what actually happens at SURMAT — the floor, the meetings, the talks and
 * the launches — so the material library never reads as one company's showroom.
 */
export function EventPillars({ dict, c, ed }: { dict: Dict; c: Ctx; ed: Edition }) {
  const e = dict.event;
  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="h-event">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-end lg:gap-16">
        <Reveal>
          <p className="eyebrow">{e.eyebrow}</p>
          <h2 id="h-event" className="display mt-5 text-[clamp(2.5rem,5vw,4.75rem)]">
            {e.title}
          </h2>
          <p className="mt-6 max-w-lg text-limestone/75">{e.lead}</p>
          <ul className="mt-8 space-y-2 text-sm text-limestone/85">
            <li className="flex items-center gap-3">
              <Pin size={18} className="shrink-0 text-gold" />
              {ed.venue ? t(ed.venue, c.locale) : t(ed.city, c.locale)}
            </li>
            <li className="flex items-center gap-3">
              <Calendar size={18} className="shrink-0 text-gold" />
              {ed.dates ? t(ed.dates, c.locale) : dict.edition.datesTBA}
            </li>
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={href(c, "exhibit")} className="btn btn-solid">
              {e.bookStand} <Arrow size={16} />
            </Link>
            <Link href={href(c, "visit")} className="btn btn-ghost">
              {e.freeVisit} <Arrow size={16} />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-line">
            <EventImage id="hall" alt={e.pillars[0].title} sizes="(min-width: 1024px) 58vw, 100vw" label={e.visual} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-x-6 gap-y-1 p-5 text-sm sm:p-6">
              <span>
                <b className="text-xl font-medium tabular-nums text-limestone">{ed.targets.exhibitors}</b>{" "}
                <span className="text-limestone/70">{fmt(e.exhibitors, { n: "" }).trim()}</span>
              </span>
              <span>
                <b className="text-xl font-medium tabular-nums text-limestone">{ed.targets.visitors}</b>{" "}
                <span className="text-limestone/70">{fmt(e.visitors, { n: "" }).trim()}</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {e.pillars.map((p, i) => (
          <li key={p.title}>
            <Reveal delay={0.05 * i} className="group h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-md border border-line bg-graphite/40">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <EventImage
                    id={pillarMedia[i]}
                    alt={p.title}
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                    label={e.visual}
                    className="transition-transform duration-[1400ms] ease-[var(--ease-material)] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">0{i + 1}</p>
                  <h3 className="mt-2 text-lg font-medium">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-limestone/70">{p.text}</p>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
