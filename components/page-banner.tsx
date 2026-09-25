import { EventImage } from "./event-image";
import type { MediaKey } from "@/content/event-media";
import type { Edition } from "@/lib/editions";
import type { Ctx } from "@/lib/routing";
import { t, type Dict } from "@/lib/i18n";

/** A wide event photograph under a page title, captioned with the edition, venue and dates. */
export function PageBanner({ id, alt, dict, c, ed, priority = true }: { id: MediaKey; alt: string; dict: Dict; c: Ctx; ed: Edition; priority?: boolean }) {
  return (
    <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-md border border-line sm:aspect-[21/7] lg:aspect-[21/6]">
      <EventImage id={id} alt={alt} sizes="(min-width: 1440px) 1360px, 100vw" label={dict.event.visual} priority={priority} />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
      <p className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-3 gap-y-1 p-4 text-xs text-limestone/85 sm:p-6 sm:text-sm">
        <span className="size-1.5 rounded-full bg-gold" />
        <span className="uppercase tracking-[0.16em] text-gold">{dict.event.bar}</span>
        <span className="text-fog">·</span>
        <span>{ed.venue ? t(ed.venue, c.locale) : t(ed.city, c.locale)}</span>
        <span className="text-fog">·</span>
        <span>{ed.dates ? t(ed.dates, c.locale) : dict.edition.datesTBA}</span>
      </p>
    </div>
  );
}
