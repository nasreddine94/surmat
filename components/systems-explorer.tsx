"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSite } from "./site-context";
import { EventImage } from "./event-image";
import { SystemSection } from "./system-section";
import { Arrow } from "./icons";
import { ScrollRow } from "./scroll-row";
import { systems, type BuildingSystem } from "@/content/systems";
import { familyGroups } from "@/content/families";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "How it's built": each building system as an on-site render beside its technical section.
 * Every layer names the product family, its typical specification and the district of the
 * exhibition where its manufacturers exhibit — facades, insulation, waterproofing, adhesives,
 * screeds, boards, finishes and the machines that make them.
 */
export function SystemsExplorer({ only, bare = false }: { only?: string[]; bare?: boolean }) {
  const { dict, locale, link } = useSite();
  const reduce = useReducedMotion();
  const s = dict.systems;
  const list: BuildingSystem[] = only ? systems.filter((x) => only.includes(x.id)) : systems;
  const [id, setId] = useState(list[0].id);
  const [active, setActive] = useState(0);
  const sys = list.find((x) => x.id === id) ?? list[0];
  const layer = sys.layers[Math.min(active, sys.layers.length - 1)];
  const group = layer.group ? familyGroups.find((g) => g.id === layer.group) : null;
  const gi = group ? familyGroups.indexOf(group) : -1;
  const sectorParam = group?.core ? `?sector=${group.id}` : "";

  const choose = (x: string) => {
    setId(x);
    setActive(0);
    track("system_view", { system: x });
  };

  return (
    <section className={bare ? "pt-20" : "shell pt-24 sm:pt-32"} aria-labelledby="h-systems">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 id="h-systems" className="display mt-5 text-[clamp(2.4rem,4.6vw,4.4rem)]">
            {s.title}
          </h2>
        </div>
        <p className="max-w-lg text-limestone/75 lg:justify-self-end">{s.lead}</p>
      </div>

      {list.length > 1 && (
        <ScrollRow role="tablist" label={s.eyebrow} wrapClassName="mt-8" className="gap-1.5 px-1 py-1" prevLabel={dict.universe.prev} nextLabel={dict.universe.next}>
          {list.map((x) => {
            const on = x.id === sys.id;
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => choose(x.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-full border py-1 pe-4 ps-1 text-sm transition-colors ${on ? "border-gold/60 bg-gold/10 text-limestone" : "border-line text-limestone/70 hover:border-line-strong hover:text-limestone"}`}
              >
                <span className="relative size-8 overflow-hidden rounded-full">
                  <EventImage id={x.media} alt="" sizes="32px" />
                </span>
                {t(x.name, locale)}
              </button>
            );
          })}
        </ScrollRow>
      )}

      <div className="mt-4 grid gap-3 lg:grid-cols-[0.85fr_1.15fr]">
        {/* On site */}
        <div className="relative isolate min-h-[20rem] overflow-hidden rounded-md border border-line">
          <AnimatePresence initial={false}>
            <motion.div
              key={sys.id}
              className="absolute inset-0 -z-10"
              initial={reduce ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <EventImage id={sys.media} alt={t(sys.name, locale)} sizes="(min-width: 1024px) 40vw, 100vw" label={dict.event.visual} />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="flex h-full min-h-[20rem] flex-col justify-end p-6">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-gold">{sys.kind === "process" ? s.process : s.onSite}</p>
            <h3 className="display mt-2 text-3xl sm:text-4xl">{t(sys.name, locale)}</h3>
            <p className="mt-2 max-w-md text-sm text-limestone/80">{t(sys.text, locale)}</p>
          </div>
        </div>

        {/* Technical view */}
        <div className="flex flex-col rounded-md border border-line bg-[#0d0e10] bg-[linear-gradient(rgb(244_240_232/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(244_240_232/0.035)_1px,transparent_1px)] bg-[size:20px_20px] p-4 sm:p-6">
          <p className="mb-3 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.2em] text-fog">
            <span>{sys.kind === "process" ? s.process : s.section}</span>
            <span>
              {pad(sys.layers.length)} {sys.kind === "process" ? s.steps : s.layers}
            </span>
          </p>

          {sys.kind === "process" ? (
            <ol className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4" aria-label={t(sys.name, locale)}>
              {sys.layers.map((x, i) => {
                const on = i === active;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`relative flex h-full w-full flex-col rounded-sm border p-3 text-start transition-colors ${on ? "border-gold/70 bg-gold/[0.08]" : "border-line bg-ink/40 hover:border-line-strong"}`}
                    >
                      <span className={`text-[0.62rem] tabular-nums ${on ? "text-gold" : "text-fog"}`}>{pad(i + 1)}</span>
                      <span className="mt-1 text-xs font-medium leading-tight sm:text-sm">{t(x.name, locale)}</span>
                      <span className="mt-1 text-[0.62rem] leading-snug text-fog">{x.spec}</span>
                      {i < sys.layers.length - 1 && <span aria-hidden className="absolute -end-2 top-1/2 z-10 hidden -translate-y-1/2 text-gold/60 sm:block rtl:rotate-180">›</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <>
              <SystemSection system={sys} locale={locale} active={Math.min(active, sys.layers.length - 1)} onActive={setActive} labels={{ outside: s.outside, inside: s.inside, top: s.top }} />
              {/* Legend for small screens, where the labels beside the drawing are hidden */}
              <ol className="mt-3 grid gap-1 text-xs sm:hidden">
                {sys.layers.map((x, i) => (
                  <li key={i}>
                    <button type="button" onClick={() => setActive(i)} className={`flex w-full gap-2 text-start ${i === active ? "text-limestone" : "text-limestone/60"}`}>
                      <span className="w-4 tabular-nums text-gold">{i + 1}</span>
                      {t(x.name, locale)}
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}

          {/* Selected layer */}
          <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-end sm:justify-between" aria-live="polite">
            <div className="min-w-0">
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-gold">
                {pad(Math.min(active, sys.layers.length - 1) + 1)} · {group ? `${s.district} ${String.fromCharCode(65 + gi)} — ${t(group.name, locale)}` : s.structure}
              </p>
              <p className="mt-1 text-lg">{t(layer.name, locale)}</p>
              <p className="text-sm text-fog">{layer.spec}</p>
            </div>
            {group && (
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link href={link(`exhibitors${sectorParam}`)} className="btn btn-ghost btn-sm">
                  {dict.hero.findExhibitors}
                </Link>
                <Link
                  href={link(`exhibit${sectorParam}`)}
                  onClick={() => track("exhibit_cta_click", { from: "systems", system: sys.id, district: group.id })}
                  className="btn btn-solid btn-sm"
                >
                  {dict.scope.bookHere} <Arrow size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[0.68rem] text-fog">{s.note}</p>
    </section>
  );
}
