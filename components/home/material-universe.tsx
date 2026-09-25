"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSite } from "../site-context";
import { Swatch } from "../swatch";
import { Arrow, Chevron } from "../icons";
import { materialBySlug } from "@/content/materials";
import { sectorById } from "@/content/sectors";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

/** One signature material per sector, plus two crowd favourites. */
const ORBIT = ["marble", "porcelain", "microcement", "wall-panels", "zellige", "travertine", "terrazzo", "onyx"];

/**
 * Home §03 (PRD §10): the site as a material library. Discs orbit a large selected
 * sample; selecting one names it, gives its sector line and two ways forward —
 * explore the material or exhibit it.
 */
export function MaterialUniverse() {
  const { dict, locale, link } = useSite();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const m = materialBySlug(ORBIT[i])!;
  const sec = sectorById(m.sector)!;
  const u = dict.universe;

  // Slow auto-advance (PRD §35: material loops 8–30 s); stops on hover, focus and reduced motion.
  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % ORBIT.length), 9000);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const select = (n: number) => {
    setI((n + ORBIT.length) % ORBIT.length);
    track("material_select", { material: ORBIT[(n + ORBIT.length) % ORBIT.length], from: "universe" });
  };

  return (
    <section className="shell grid items-center gap-14 pt-24 sm:pt-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10" aria-labelledby="h-universe">
      <div>
        <p className="eyebrow">{dict.nav.materials}</p>
        <h2 id="h-universe" className="display mt-5 text-[clamp(2.5rem,5vw,5rem)]">
          {u.title}
        </h2>
        <p className="mt-6 max-w-md text-limestone/75">{u.lead}</p>
        <Link href={link("materials")} className="group mt-9 inline-flex items-center gap-3 text-sm">
          <span className="border-b border-gold/60 pb-1 transition-colors group-hover:border-gold">{u.browse}</span>
          <Arrow size={14} className="flip-rtl" />
        </Link>
      </div>

      <div
        className="relative mx-auto aspect-square w-full max-w-[36rem]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Orbit paths */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-limestone/15" aria-hidden fill="none" stroke="currentColor" strokeWidth=".15">
          <circle cx="50" cy="50" r="46" />
          <ellipse cx="50" cy="50" rx="46" ry="17" transform="rotate(-18 50 50)" opacity=".7" />
          <circle cx="50" cy="50" r="31" strokeDasharray=".6 1.4" opacity=".8" />
        </svg>

        {/* The selected sample */}
        <div className="absolute inset-[24%]">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={m.slug}
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full"
            >
              <Swatch tex={m.tex} seed={m.seed} res={512} eager className="h-full w-full rounded-full shadow-atmos">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.28),transparent_45%),radial-gradient(circle_at_70%_80%,rgb(0_0_0/0.45),transparent_55%)]" />
              </Swatch>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Orbiting discs */}
        <ul className="absolute inset-0" role="tablist" aria-label={u.title}>
          {ORBIT.map((slug, n) => {
            const x = materialBySlug(slug)!;
            const a = (n / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
            const on = n === i;
            return (
              <li key={slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + 46 * Math.cos(a)}%`, top: `${50 + 46 * Math.sin(a)}%` }}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-label={t(x.name, locale)}
                  title={t(x.name, locale)}
                  onClick={() => select(n)}
                  className={`block rounded-full transition-all duration-500 ${on ? "size-16 ring-2 ring-gold ring-offset-4 ring-offset-basalt sm:size-20" : "size-11 opacity-80 hover:opacity-100 sm:size-14"}`}
                >
                  <Swatch tex={x.tex} seed={x.seed} res={128} className="h-full w-full rounded-full" />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Museum label */}
        <div className="glass absolute -bottom-6 end-0 w-[min(18rem,80%)] rounded-sm p-5 sm:bottom-2" aria-live="polite">
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-gold">{t(sec.short, locale)}</p>
          <p className="display mt-2 text-3xl">{t(m.name, locale)}</p>
          <p className="mt-1 text-sm text-fog">{u.taglines[sec.id]}</p>
          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 text-sm">
            <Link href={link(`materials/${m.slug}`)} className="group flex items-center justify-between">
              {u.explore} <Arrow size={14} className="flip-rtl" />
            </Link>
            <Link
              href={link(`exhibit?sector=${sec.id}`)}
              onClick={() => track("exhibit_cta_click", { from: "universe", material: m.slug })}
              className="group flex items-center justify-between text-limestone/75 hover:text-limestone"
            >
              {u.exhibitThis} <Arrow size={14} className="flip-rtl" />
            </Link>
          </div>
        </div>

        {/* Pagination */}
        <div className="absolute -top-2 start-0 flex items-center gap-3 text-xs tabular-nums text-fog" dir="ltr">
          <button type="button" onClick={() => select(i - 1)} aria-label={u.prev} className="grid size-11 place-items-center rounded-full border border-line hover:border-line-strong">
            <Chevron size={14} className="rotate-90" />
          </button>
          <span>
            <span className="text-limestone">{String(i + 1).padStart(2, "0")}</span> / {String(ORBIT.length).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => select(i + 1)} aria-label={u.next} className="grid size-11 place-items-center rounded-full border border-line hover:border-line-strong">
            <Chevron size={14} className="-rotate-90" />
          </button>
        </div>
      </div>
    </section>
  );
}
