"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSite } from "./site-context";
import { Arrow } from "./icons";
import { ScrollRow } from "./scroll-row";
import { boards, pos, swatchSrc, type Board } from "@/content/board";
import { familyGroups } from "@/content/families";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The material board & render studio: pick a product family; on the left its samples on a
 * physical board, on the right the family in use with numbered technical callouts, and the
 * district of the exhibition where its manufacturers exhibit.
 */
export function MaterialBoard({ only, bare = false }: { only?: string[]; bare?: boolean }) {
  const { dict, locale, link } = useSite();
  const reduce = useReducedMotion();
  const d = dict.board;
  const list: Board[] = only ? boards.filter((x) => only.includes(x.group)) : boards;
  const [id, setId] = useState(list[0]?.id);
  const [active, setActive] = useState(0);
  if (!list.length) return null;
  const board = list.find((x) => x.id === id) ?? list[0];
  const group = familyGroups.find((g) => g.id === board.group)!;
  const gi = familyGroups.indexOf(group);
  const sectorParam = group.core ? `?sector=${group.id}` : "";
  const [, , cw, ch] = board.crop;

  const choose = (x: string) => {
    setId(x);
    setActive(0);
    track("board_view", { board: x });
  };

  return (
    <section className={bare ? "pt-20" : "shell pt-24 sm:pt-32"} aria-labelledby="h-board">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">{d.eyebrow}</p>
          <h2 id="h-board" className="display mt-5 text-[clamp(2.4rem,4.6vw,4.4rem)]">
            {d.title}
          </h2>
        </div>
        <p className="max-w-lg text-limestone/75 lg:justify-self-end">{d.lead}</p>
      </div>

      {list.length > 1 && (
        <ScrollRow role="tablist" label={d.eyebrow} wrapClassName="mt-8" className="gap-1.5 px-1 py-1" prevLabel={dict.universe.prev} nextLabel={dict.universe.next}>
          {list.map((x) => {
            const on = x.id === board.id;
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => choose(x.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-full border py-1 pe-4 ps-1 text-sm transition-colors ${on ? "border-gold/60 bg-gold/10 text-limestone" : "border-line text-limestone/70 hover:border-line-strong hover:text-limestone"}`}
              >
                <span className="grid size-8 grid-cols-2 overflow-hidden rounded-full">
                  {[0, 1, 2, 3].map((i) => (
                    <Image key={i} src={swatchSrc(x, i)} alt="" width={16} height={16} className="size-4 object-cover" />
                  ))}
                </span>
                {t(x.title, locale)}
              </button>
            );
          })}
        </ScrollRow>
      )}

      <div className="mt-4 grid overflow-hidden rounded-md border border-line lg:grid-cols-[0.8fr_1.2fr]">
        {/* The board */}
        <div className="bg-[#efeae1] p-6 text-ink sm:p-8">
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink/55">{d.sampleBoard}</p>
          <h3 className="display mt-2 text-3xl text-ink sm:text-4xl">{t(board.title, locale)}</h3>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6">
            {board.swatches.map((s, i) => (
              <li key={`${board.id}-${i}`}>
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                >
                  <div className="relative aspect-square overflow-hidden shadow-[0_18px_30px_-12px_rgb(0_0_0/0.45)]">
                    <Image src={swatchSrc(board, i)} alt={t(s, locale)} fill sizes="(min-width: 1024px) 14vw, 40vw" className="object-cover" />
                  </div>
                  <p className="mt-2.5 text-center text-xs leading-snug text-ink/80 sm:text-sm">{t(s, locale)}</p>
                </motion.div>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-ink/15 pt-4 text-xs text-ink/65">
            {d.exhibitedIn} <b className="font-medium text-ink">
              {d.district} {String.fromCharCode(65 + gi)} — {t(group.name, locale)}
            </b>
          </p>
        </div>

        {/* The render with callouts */}
        <div className="flex flex-col bg-graphite/40">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${cw} / ${ch}` }}>
            <AnimatePresence initial={false}>
              <motion.div
                key={board.id}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Image src={board.render} alt={t(board.title, locale)} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <span className="pointer-events-none absolute end-2 top-2 z-[1] rounded-xs bg-ink/55 px-1.5 py-0.5 text-[0.58rem] uppercase tracking-[0.14em] text-limestone/60 backdrop-blur-sm">
              {dict.event.visual}
            </span>
            {board.callouts.map((c, i) => {
              const p = pos(board, c);
              const on = i === active;
              return (
                <button
                  key={`${board.id}-${i}`}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  aria-label={t(c.text, locale)}
                  className="absolute z-10 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <span className={`absolute size-7 rounded-full border backdrop-blur-sm transition-all duration-300 ${on ? "scale-110 border-gold bg-gold/30" : "border-limestone/80 bg-ink/40"}`} />
                  <span className={`relative text-[0.65rem] font-semibold tabular-nums ${on ? "text-limestone" : "text-limestone/90"}`}>{i + 1}</span>
                  {!on && <span className="absolute size-7 animate-ping rounded-full border border-limestone/40 motion-reduce:hidden" />}
                </button>
              );
            })}
            {/* Label beside the active callout */}
            <AnimatePresence mode="wait">
              {board.callouts[active] &&
                (() => {
                  const c = board.callouts[active];
                  const p = pos(board, c);
                  const right = p.x > 55;
                  return (
                    <motion.p
                      key={`${board.id}-${active}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="glass pointer-events-none absolute z-20 hidden max-w-[16rem] rounded-sm px-3 py-2 text-sm leading-snug md:block"
                      style={{
                        left: right ? undefined : `calc(${p.x}% + 1.6rem)`,
                        right: right ? `calc(${100 - p.x}% + 1.6rem)` : undefined,
                        top: `clamp(0.5rem, calc(${p.y}% - 1.2rem), calc(100% - 4rem))`,
                      }}
                    >
                      {t(c.text, locale)}
                    </motion.p>
                  );
                })()}
            </AnimatePresence>
          </div>

          <ol className="grid gap-px border-t border-line bg-line sm:grid-cols-3">
            {board.callouts.map((c, i) => (
              <li key={i} className="bg-basalt">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`flex h-full w-full gap-3 p-4 text-start text-sm transition-colors ${i === active ? "text-limestone" : "text-limestone/60 hover:text-limestone/90"}`}
                >
                  <span className={`text-xs tabular-nums ${i === active ? "text-gold" : "text-fog"}`}>{pad(i + 1)}</span>
                  {t(c.text, locale)}
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-auto flex flex-wrap items-center justify-end gap-2 border-t border-line p-4">
            <Link href={link(`exhibitors${sectorParam}`)} className="btn btn-ghost btn-sm">
              {dict.hero.findExhibitors}
            </Link>
            <Link
              href={link(`exhibit${sectorParam}`)}
              onClick={() => track("exhibit_cta_click", { from: "board", board: board.id })}
              className="btn btn-solid btn-sm"
            >
              {dict.scope.bookHere} <Arrow size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
