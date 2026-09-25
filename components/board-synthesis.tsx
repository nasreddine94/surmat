"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useSite } from "./site-context";
import { Arrow } from "./icons";
import { synthesis } from "@/content/board";
import { t } from "@/lib/i18n";

const src = (i: number) => `/images/board/s20-${i + 1}.webp`;

/**
 * "One building, every district": a palette of twelve samples beside a section through one
 * building. Pointing at a sample draws the line to where it is used, and back.
 */
export function BoardSynthesis({ bare = false }: { bare?: boolean }) {
  const { dict, locale, link } = useSite();
  const d = dict.board;
  const [x0, y0, cw, ch] = synthesis.crop;
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const [line, setLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const link0 = synthesis.links[active];

  const measure = useCallback(() => {
    const w = wrap.current, im = img.current, cell = cells.current[link0.swatch];
    if (!w || !im || !cell) return;
    const W = w.getBoundingClientRect(), I = im.getBoundingClientRect(), C = cell.getBoundingClientRect();
    const px = ((link0.at[0] - x0) / cw) * I.width + I.left - W.left;
    const py = ((link0.at[1] - y0) / ch) * I.height + I.top - W.top;
    setLine({ x1: C.left + C.width / 2 - W.left, y1: C.top + C.height / 2 - W.top, x2: px, y2: py });
  }, [link0, x0, y0, cw, ch]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const bySwatch = new Map(synthesis.links.map((l, i) => [l.swatch, i]));

  return (
    <section className={bare ? "pt-20" : "shell pt-24 sm:pt-32"} aria-labelledby="h-synth">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">{d.eyebrow}</p>
          <h2 id="h-synth" className="display mt-5 text-[clamp(2.4rem,4.6vw,4.4rem)]">
            {d.synthTitle}
          </h2>
        </div>
        <div className="lg:justify-self-end">
          <p className="max-w-lg text-limestone/75">{d.synthLead}</p>
          <Link href={link("board")} className="group mt-5 inline-flex items-center gap-3 text-sm">
            <span className="border-b border-gold/60 pb-1 transition-colors group-hover:border-gold">{d.open}</span>
            <Arrow size={14} />
          </Link>
        </div>
      </div>

      <div ref={wrap} className="relative mt-8 grid overflow-hidden rounded-md border border-line lg:grid-cols-[0.75fr_1.25fr]">
        <div className="bg-[#efeae1] p-6 sm:p-8">
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink/55">{d.palette}</p>
          <ul className="mt-5 grid grid-cols-4 gap-3 lg:grid-cols-3">
            {Array.from({ length: 12 }, (_, i) => {
              const li = bySwatch.get(i);
              const on = li === active;
              return (
                <li key={i}>
                  <button
                    ref={(el) => {
                      cells.current[i] = el;
                    }}
                    type="button"
                    disabled={li === undefined}
                    onMouseEnter={() => li !== undefined && setActive(li)}
                    onFocus={() => li !== undefined && setActive(li)}
                    onClick={() => li !== undefined && setActive(li)}
                    aria-pressed={on}
                    aria-label={li !== undefined ? t(synthesis.links[li].text, locale) : undefined}
                    className={`relative block aspect-square w-full overflow-hidden shadow-[0_14px_24px_-12px_rgb(0_0_0/0.45)] transition-transform duration-300 ${on ? "scale-105 ring-2 ring-gold ring-offset-2 ring-offset-[#efeae1]" : ""}`}
                  >
                    <Image src={src(i)} alt="" fill sizes="120px" className="object-cover" />
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 min-h-[3rem] border-t border-ink/15 pt-4 text-sm text-ink" aria-live="polite">
            {t(link0.text, locale)}
          </p>
        </div>

        <div ref={img} className="relative bg-[#f4f2ee]" style={{ aspectRatio: `${cw} / ${ch}` }}>
          <Image src={synthesis.render} alt={d.synthTitle} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" onLoad={measure} />
          <span className="pointer-events-none absolute end-2 top-2 z-[1] rounded-xs bg-ink/55 px-1.5 py-0.5 text-[0.58rem] uppercase tracking-[0.14em] text-limestone/70">
            {dict.event.visual}
          </span>
          {synthesis.links.map((l, i) => {
            const on = i === active;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-label={t(l.text, locale)}
                className="absolute z-10 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center"
                style={{ left: `${((l.at[0] - x0) / cw) * 100}%`, top: `${((l.at[1] - y0) / ch) * 100}%` }}
              >
                <span className={`absolute rounded-full border transition-all duration-300 ${on ? "size-6 border-gold bg-gold/40" : "size-4 border-ink/60 bg-white/70"}`} />
                {on && <span className="absolute size-6 animate-ping rounded-full border border-gold motion-reduce:hidden" />}
              </button>
            );
          })}
        </div>

        {/* The connecting line */}
        {line && (
          <svg className="pointer-events-none absolute inset-0 z-20 hidden h-full w-full lg:block" aria-hidden>
            <path
              d={`M${line.x1} ${line.y1} C${(line.x1 + line.x2) / 2} ${line.y1 - 60}, ${(line.x1 + line.x2) / 2} ${line.y2 + 60}, ${line.x2} ${line.y2}`}
              fill="none"
              stroke="#d8a25c"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle cx={line.x1} cy={line.y1} r="3.5" fill="#d8a25c" />
          </svg>
        )}
      </div>
    </section>
  );
}
