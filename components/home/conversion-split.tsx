import Link from "next/link";
import { Swatch } from "../swatch";
import { Arrow } from "../icons";
import { href, type Ctx } from "@/lib/routing";
import type { Dict } from "@/lib/i18n";

/**
 * Home §08 (PRD §15): one composition, two actions. Green stone for visitors,
 * warm timber for exhibitors.
 */
export function ConversionSplit({ dict, c }: { dict: Dict; c: Ctx }) {
  const s = dict.split;
  const panels = [
    { key: "visit", tex: "verde" as const, seed: 7, eyebrow: dict.nav.visit, title: s.visitTitle, lead: s.visitLead, cta: dict.nav.register, path: "visit", solid: true },
    { key: "exhibit", tex: "woodSlats" as const, seed: 3, eyebrow: dict.nav.exhibit, title: s.exhibitTitle, lead: s.exhibitLead, cta: dict.why.cta, path: "exhibit", solid: false },
  ];
  return (
    <section className="shell pt-24 sm:pt-32" aria-label={`${dict.nav.visit} · ${dict.nav.exhibit}`}>
      <div className="grid overflow-hidden rounded-md border border-line md:grid-cols-2">
        {panels.map((p, i) => (
          <Link key={p.key} href={href(c, p.path)} className={`group relative block ${i ? "border-t border-line md:border-s md:border-t-0" : ""}`}>
            <Swatch tex={p.tex} seed={p.seed} res={640} className="min-h-[26rem] transition-transform duration-[1400ms] ease-[var(--ease-material)] group-hover:scale-[1.04] sm:min-h-[30rem]">
              <div className={`absolute inset-0 ${i ? "bg-gradient-to-tl" : "bg-gradient-to-tr"} from-ink via-ink/70 to-ink/10`} />
              <div className="relative flex h-full min-h-[26rem] flex-col justify-end p-8 sm:min-h-[30rem] sm:p-12">
                <p className="eyebrow text-limestone/70">{p.eyebrow}</p>
                <h2 className="display mt-4 text-[clamp(2.5rem,4.5vw,4.5rem)]">{p.title}</h2>
                <p className="mt-3 max-w-sm text-limestone/80">{p.lead}</p>
                <span className={`btn mt-8 self-start ${p.solid ? "btn-solid" : "btn-ghost bg-ink/40 backdrop-blur"}`}>
                  {p.cta} <Arrow size={16} />
                </span>
              </div>
            </Swatch>
          </Link>
        ))}
      </div>
    </section>
  );
}
