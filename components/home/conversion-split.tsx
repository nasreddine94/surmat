import Link from "next/link";
import { EventImage } from "../event-image";
import { Arrow, Check } from "../icons";
import { href, type Ctx } from "@/lib/routing";
import type { Dict } from "@/lib/i18n";

/**
 * Home §08 (PRD §15): one composition, two actions — the show's entrance for visitors,
 * a stand for exhibitors.
 */
export function ConversionSplit({ dict, c }: { dict: Dict; c: Ctx }) {
  const s = dict.split;
  const panels = [
    {
      key: "visit",
      img: "entrance" as const,
      eyebrow: dict.nav.visit,
      title: s.visitTitle,
      lead: s.visitLead,
      points: dict.event.visitPoints,
      cta: dict.event.freeVisit,
      path: "visit",
      solid: false,
    },
    {
      key: "exhibit",
      img: "stand" as const,
      eyebrow: dict.nav.exhibit,
      title: s.exhibitTitle,
      lead: s.exhibitLead,
      points: dict.event.exhibitPoints,
      cta: dict.event.bookStand,
      path: "exhibit",
      solid: true,
    },
  ];
  return (
    <section className="shell pt-24 sm:pt-32" aria-label={`${dict.nav.visit} · ${dict.nav.exhibit}`}>
      <div className="grid overflow-hidden rounded-md border border-line md:grid-cols-2">
        {panels.map((p, i) => (
          <Link key={p.key} href={href(c, p.path)} className={`group relative block ${i ? "border-t border-line md:border-s md:border-t-0" : ""}`}>
            <div className="relative min-h-[30rem] overflow-hidden sm:min-h-[34rem]">
              <EventImage
                id={p.img}
                alt={p.title}
                sizes="(min-width: 768px) 50vw, 100vw"
                label={dict.event.visual}
                className="transition-transform duration-[1400ms] ease-[var(--ease-material)] group-hover:scale-[1.04]"
              />
              <div className={`absolute inset-0 ${i ? "bg-gradient-to-tl" : "bg-gradient-to-tr"} from-ink via-ink/75 to-ink/10`} />
              <div className="relative flex h-full min-h-[30rem] flex-col justify-end p-8 sm:min-h-[34rem] sm:p-12">
                <p className="eyebrow text-limestone/70">{p.eyebrow}</p>
                <h2 className="display mt-4 text-[clamp(2.5rem,4.5vw,4.5rem)]">{p.title}</h2>
                <p className="mt-3 max-w-sm text-limestone/80">{p.lead}</p>
                <ul className="mt-5 space-y-1.5 text-sm text-limestone/85">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <span className={`btn mt-8 self-start ${p.solid ? "btn-solid" : "btn-ghost bg-ink/40 backdrop-blur"}`}>
                  {p.cta} <Arrow size={16} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
