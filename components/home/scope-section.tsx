"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSite } from "../site-context";
import { EventImage } from "../event-image";
import { Arrow } from "../icons";
import { familyGroups, familyCount } from "@/content/families";
import { materials } from "@/content/materials";
import { editions } from "@/lib/editions";
import { fmt, t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The exhibition's full scope as nine districts. A large district view (event image, pitch,
 * every product family, two ways in) beside a mosaic of all nine, then a moving wall of all
 * product families — so no exhibitor reads the site as a closed list of ten materials.
 */
export function ScopeSection({ compact = false }: { compact?: boolean }) {
  const { dict, locale, edition, link } = useSite();
  const reduce = useReducedMotion();
  const s = dict.scope;
  const ed = editions[edition];
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const g = familyGroups[i];
  const sectorParam = g.core ? `?sector=${g.id}` : "";

  // Walk the districts slowly until the visitor takes over.
  useEffect(() => {
    if (reduce || hold) return;
    const id = setInterval(() => setI((x) => (x + 1) % familyGroups.length), 7000);
    return () => clearInterval(id);
  }, [reduce, hold]);

  const pick = (n: number, click = false) => {
    setI(n);
    setHold(true);
    if (click) track("scope_district", { district: familyGroups[n].id });
  };

  const stats = [
    { v: String(familyGroups.length), l: s.statDistricts },
    { v: String(familyCount), l: s.statFamilies },
    { v: ed.targets.exhibitors, l: dict.stats.exhibitors },
    { v: ed.targets.visitors, l: dict.stats.visitors },
  ];
  const all = familyGroups.flatMap((x) => x.families.map((f) => t(f, locale)));
  const half = Math.ceil(all.length / 2);

  return (
    <section className={compact ? "pt-20" : "shell pt-24 sm:pt-32"} aria-labelledby="h-scope">
      {/* Header + key numbers */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 id="h-scope" className="display mt-5 text-[clamp(2.4rem,4.8vw,4.5rem)]">
            {s.title}
          </h2>
          <p className="mt-5 max-w-xl text-limestone/75">{s.lead}</p>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4 lg:grid-cols-2">
          {stats.map((x) => (
            <div key={x.l} className="flex flex-col-reverse bg-basalt p-4 sm:p-5">
              <dt className="mt-1 text-xs text-fog">{x.l}</dt>
              <dd className="display text-4xl tabular-nums text-limestone sm:text-5xl">{x.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* District explorer */}
      <div className="mt-10 grid gap-3 lg:grid-cols-[1.55fr_1fr]" onMouseLeave={() => setHold(false)}>
        {/* Selected district */}
        <div className="relative isolate min-h-[34rem] overflow-hidden rounded-md border border-line sm:min-h-[38rem]" aria-live="polite">
          <AnimatePresence initial={false}>
            <motion.div
              key={g.id}
              className="absolute inset-0 -z-10"
              initial={reduce ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <EventImage id={g.media} alt={t(g.name, locale)} sizes="(min-width: 1024px) 60vw, 100vw" label={dict.event.visual} />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/80 to-ink/10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 to-transparent rtl:bg-gradient-to-l" />

          <div className="flex h-full min-h-[34rem] flex-col justify-end p-6 sm:min-h-[38rem] sm:p-10">
            <p className="flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.22em]">
              <span className="text-gold">
                {s.district} {pad(i + 1)}
              </span>
              <span className="h-px w-8 bg-line-strong" />
              <span className={g.core ? "text-limestone/80" : "text-fog"}>{g.core ? s.core : s.adjacent}</span>
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={g.id}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="display mt-3 text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.02]">{t(g.name, locale)}</h3>
                <p className="mt-3 max-w-lg text-limestone/80">{t(g.pitch, locale)}</p>
                <ol className="mt-6 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                  {g.families.map((f, n) => (
                    <motion.li
                      key={f.en}
                      className="flex items-baseline gap-3 border-b border-white/10 pb-1.5"
                      initial={reduce ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * n, duration: 0.35 }}
                    >
                      <span className="w-5 shrink-0 text-[0.65rem] tabular-nums text-gold/80">{pad(n + 1)}</span>
                      <span className="text-limestone/90">{t(f, locale)}</span>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={link(`exhibit${sectorParam}`)}
                onClick={() => track("exhibit_cta_click", { from: "scope", district: g.id })}
                className="btn btn-solid"
              >
                {s.bookHere} <Arrow size={16} />
              </Link>
              <Link href={link(`exhibitors${sectorParam}`)} className="btn btn-ghost bg-ink/40 backdrop-blur">
                {dict.hero.findExhibitors} <Arrow size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* All nine districts */}
        <ul className="grid grid-cols-3 gap-2 sm:gap-3" role="tablist" aria-label={s.eyebrow}>
          {familyGroups.map((x, n) => {
            const on = n === i;
            return (
              <li key={x.id} className="contents">
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(n, true)}
                  onMouseEnter={() => pick(n)}
                  onFocus={() => pick(n)}
                  className={`group relative isolate aspect-square overflow-hidden rounded-sm border text-start transition-[border-color,box-shadow] duration-300 ${
                    on ? "border-gold/70 shadow-[0_0_0_1px_rgb(216_162_92/0.5)]" : "border-line hover:border-line-strong"
                  }`}
                >
                  <EventImage
                    id={x.media}
                    alt=""
                    sizes="(min-width: 1024px) 12vw, 30vw"
                    className={`-z-10 transition-[transform,filter] duration-700 ${on ? "scale-105" : "grayscale-[60%] group-hover:scale-105 group-hover:grayscale-0"}`}
                  />
                  <span className={`absolute inset-0 -z-10 transition-colors duration-500 ${on ? "bg-ink/35" : "bg-ink/60 group-hover:bg-ink/45"}`} />
                  <span className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink to-transparent" />
                  <span className="absolute start-2 top-2 text-[0.6rem] tabular-nums text-gold">{pad(n + 1)}</span>
                  {!x.core && <span className="absolute end-2 top-2 size-1.5 rounded-full bg-limestone/50" aria-hidden />}
                  <span className="absolute inset-x-2 bottom-2">
                    <span className="line-clamp-2 text-[0.7rem] font-medium leading-tight text-limestone sm:text-xs">{t(x.name, locale)}</span>
                    <span className="mt-0.5 block text-[0.6rem] text-fog">{fmt(s.families, { n: x.families.length })}</span>
                  </span>
                  {on && !reduce && !hold && (
                    <motion.span
                      key={`p-${i}`}
                      className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gold rtl:origin-right"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 7, ease: "linear" }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Every family, moving */}
      <div dir="ltr" className="relative mt-3 overflow-hidden rounded-md border border-line bg-graphite/30 py-5" aria-label={fmt(s.count, { m: materials.length, f: familyCount })}>
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-24 bg-gradient-to-r from-basalt to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-24 bg-gradient-to-l from-basalt to-transparent" />
        {[all.slice(0, half), all.slice(half)].map((row, r) => (
          <div key={r} className={`flex w-max gap-2 ${r ? "mt-2" : ""} motion-safe:animate-[marquee_linear_infinite] hover:[animation-play-state:paused]`} style={{ animationDuration: `${r ? 110 : 90}s`, animationDirection: r ? "reverse" : "normal" }} aria-hidden>
            {[...row, ...row].map((f, n) => (
              <span key={n} className="whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs text-limestone/75">
                {f}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Not listed? */}
      <div className="mt-3 flex flex-col gap-5 rounded-md border border-gold/35 bg-gold/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-xs text-gold">{fmt(s.count, { m: materials.length, f: familyCount })}</p>
          <p className="display mt-2 text-2xl sm:text-3xl">{s.missing}</p>
          <p className="mt-2 max-w-2xl text-sm text-limestone/75">{s.missingText}</p>
        </div>
        <Link href={link("exhibit")} className="btn btn-solid shrink-0 self-start sm:self-auto">
          {s.cta} <Arrow size={16} />
        </Link>
      </div>
    </section>
  );
}
