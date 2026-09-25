import Link from "next/link";
import { Reveal } from "../reveal";
import { Swatch } from "../swatch";
import { Arrow } from "../icons";
import { sectors } from "@/content/sectors";
import { href, type Ctx } from "@/lib/routing";
import { t, type Dict } from "@/lib/i18n";

/**
 * Home §06 (PRD §13): the physical exhibition, made desirable. A cinematic hall seen from
 * above — six material districts around the central experience — under editorial copy.
 */
export function ExperienceTeaser({ dict, c }: { dict: Dict; c: Ctx }) {
  const e = dict.experience;
  // PRD §41 hall layout: two columns of districts, the central experience between them.
  const rows = [
    [sectors[0], sectors[1]],
    [sectors[2], sectors[3]],
    [sectors[4], sectors[5]],
  ];
  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="h-experience">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-md border border-line bg-[radial-gradient(80%_70%_at_65%_40%,#1b1c20,#08080a)]">
          {/* The hall */}
          <div className="pointer-events-none absolute inset-y-0 end-0 w-full lg:w-[68%]" aria-hidden dir="ltr">
            <div className="absolute inset-0 [perspective:1400px]">
              <div className="absolute inset-[16%_8%_6%_22%] grid grid-cols-[1fr_0.7fr_1fr] gap-4 [transform:rotateX(50deg)_rotateZ(-26deg)] [transform-style:preserve-3d]">
                {rows.map((row, r) => (
                  <div key={r} className="contents">
                    <District s={row[0]} i={r * 2} locale={c.locale} />
                    {r === 1 ? (
                      <div className="grid place-items-center rounded-sm border border-gold/40 bg-gold/10 text-center text-[0.6rem] uppercase tracking-[0.24em] text-gold">
                        {e.central}
                      </div>
                    ) : (
                      <div className="rounded-sm border border-dashed border-limestone/10" />
                    )}
                    <District s={row[1]} i={r * 2 + 1} locale={c.locale} />
                  </div>
                ))}
              </div>
            </div>
            {/* A slow light passing over the floor */}
            <div className="absolute inset-0 bg-[linear-gradient(100deg,transparent_35%,rgb(216_162_92/0.10)_50%,transparent_65%)] bg-[length:250%_100%] motion-safe:animate-[sweep_14s_linear_infinite]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#08080a_0%,rgb(8_8_10/0.7)_22%,transparent_48%)] rtl:bg-[linear-gradient(270deg,#08080a_0%,rgb(8_8_10/0.7)_22%,transparent_48%)]" />
          </div>

          {/* Copy */}
          <div className="relative flex min-h-[34rem] max-w-xl flex-col justify-end p-8 sm:min-h-[40rem] sm:p-12 lg:justify-center">
            <p className="eyebrow">{dict.nav.experience}</p>
            <h2 id="h-experience" className="display mt-5 text-[clamp(2.5rem,5vw,5rem)]">
              {e.teaserTitle}
            </h2>
            <p className="mt-6 max-w-md text-limestone/75">{e.teaserLead}</p>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.16em] text-fog">
              {e.branches.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-gold" />
                  {b}
                </li>
              ))}
            </ul>
            <Link href={href(c, "experience")} className="btn btn-solid mt-10 self-start">
              {dict.home.exploreExperience} <Arrow size={16} />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function District({ s, i, locale }: { s: (typeof sectors)[number]; i: number; locale: Ctx["locale"] }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-white/20 shadow-[0_30px_60px_rgb(0_0_0/0.45)]">
      <Swatch tex={s.tex} seed={s.seed} res={256} eager className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-ink/40" />
      <span className="absolute start-2 top-2 text-[0.55rem] uppercase tracking-[0.2em] text-limestone/85">
        {String.fromCharCode(65 + i)} · {t(s.short, locale)}
      </span>
    </div>
  );
}
