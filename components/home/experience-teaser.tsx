import Link from "next/link";
import { Reveal } from "../reveal";
import { Arrow } from "../icons";
import { ExhibitionPlan } from "../exhibition-plan";
import type { Edition } from "@/lib/editions";
import { href, type Ctx } from "@/lib/routing";
import { t, type Dict } from "@/lib/i18n";

/**
 * Home §06 (PRD §13): the physical exhibition, as its floor plan — entrance, conference hall,
 * B2B lounge, demo stage and nine districts of numbered stands — beside the editorial copy.
 */
export function ExperienceTeaser({ dict, c, ed }: { dict: Dict; c: Ctx; ed: Edition }) {
  const e = dict.experience;
  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="h-experience">
      <Reveal>
        <div className="grid overflow-hidden rounded-md border border-line bg-[#0d0e10] lg:grid-cols-[0.8fr_1.4fr]">
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="eyebrow">{dict.nav.experience}</p>
            <h2 id="h-experience" className="display mt-5 text-[clamp(2.4rem,4.4vw,4.4rem)]">
              {e.teaserTitle}
            </h2>
            <p className="mt-6 max-w-md text-limestone/75">{e.teaserLead}</p>
            <p className="mt-4 text-sm text-gold">{ed.venue ? t(ed.venue, c.locale) : t(ed.city, c.locale)}</p>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.16em] text-fog">
              {e.branches.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-gold" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={href(c, "experience")} className="btn btn-solid">
                {dict.home.exploreExperience} <Arrow size={16} />
              </Link>
              <Link href={href(c, "exhibit")} className="btn btn-ghost">
                {dict.event.bookStand} <Arrow size={16} />
              </Link>
            </div>
          </div>
          {/* The plan thumbnail is unreadable at phone width; the text and buttons carry the section there. */}
          <Link href={href(c, "experience")} aria-label={e.mapTitle} className="group hidden border-t border-line p-3 sm:p-6 md:block lg:border-s lg:border-t-0">
            <ExhibitionPlan className="transition-opacity duration-500 group-hover:opacity-90" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
