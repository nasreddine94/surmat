import Link from "next/link";
import { EventImage } from "./event-image";
import { Arrow, Calendar, Pin } from "./icons";
import type { MediaKey } from "@/content/event-media";
import type { Edition } from "@/lib/editions";
import { href, type Ctx } from "@/lib/routing";
import { fmt, t, type Dict } from "@/lib/i18n";

const tiles: MediaKey[] = ["stand", "networking", "conference", "demo"];

/**
 * The event, on every page: the four things that happen on the floor, where and when, and the
 * two ways in. Keeps inner pages (a material, an exhibitor, an application) anchored to the show.
 */
export function EventBand({ dict, c, ed, bare = false }: { dict: Dict; c: Ctx; ed: Edition; bare?: boolean }) {
  const e = dict.event;
  return (
    <section className={bare ? "pt-20" : "shell pt-20 sm:pt-24"} aria-labelledby="h-band">
      <div className="grid overflow-hidden rounded-md border border-line bg-graphite/40 lg:grid-cols-[1.1fr_1fr]">
        <ul className="grid grid-cols-2 gap-px bg-line">
          {tiles.map((id, i) => (
            <li key={id} className="relative aspect-[4/3] overflow-hidden bg-ink">
              <EventImage id={id} alt={e.pillars[i].title} sizes="(min-width: 1024px) 26vw, 50vw" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent p-3 pt-8 text-xs font-medium sm:text-sm">
                <span className="me-1.5 text-[0.62rem] tabular-nums text-gold">0{i + 1}</span>
                {e.pillars[i].title}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <p className="eyebrow flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-gold motion-safe:animate-pulse" />
            {e.bar}
          </p>
          <h2 id="h-band" className="display mt-4 text-[clamp(2rem,3.4vw,3.2rem)]">
            {e.bandTitle}
          </h2>
          <p className="mt-3 text-limestone/75">{t(ed.name, c.locale)}</p>
          <ul className="mt-5 space-y-2 text-sm text-limestone/85">
            <li className="flex items-center gap-3">
              <Pin size={17} className="shrink-0 text-gold" />
              {ed.venue ? t(ed.venue, c.locale) : t(ed.city, c.locale)}
            </li>
            <li className="flex items-center gap-3">
              <Calendar size={17} className="shrink-0 text-gold" />
              {ed.dates ? t(ed.dates, c.locale) : dict.edition.datesTBA}
            </li>
          </ul>
          <p className="mt-5 text-sm text-fog">
            {fmt(e.exhibitors, { n: ed.targets.exhibitors })} · {fmt(e.visitors, { n: ed.targets.visitors })}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={href(c, "exhibit")} className="btn btn-solid">
              {e.bookStand} <Arrow size={16} />
            </Link>
            <Link href={href(c, "visit")} className="btn btn-ghost">
              {e.freeVisit} <Arrow size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
