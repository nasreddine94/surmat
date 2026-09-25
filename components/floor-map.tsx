"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSite } from "./site-context";
import { Swatch } from "./swatch";
import { Arrow } from "./icons";
import { sectors } from "@/content/sectors";
import { exhibitorsFor, type Exhibitor } from "@/content/exhibitors";
import { materialBySlug } from "@/content/materials";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const HALLS = ["A", "B", "C", "D", "E", "F"];
const COLS = 4, ROWS = 3;

type Stand = { code: string; hall: number; exhibitor?: Exhibitor };

/**
 * 2.5D exhibition floor: six material districts laid out as halls, each with a
 * grid of stands. Occupied stands carry their district's material on top.
 */
export function FloorMap() {
  const { dict, locale, edition, link } = useSite();
  const list = exhibitorsFor(edition);
  const stands: Stand[] = useMemo(
    () =>
      HALLS.flatMap((h, hi) =>
        Array.from({ length: COLS * ROWS }, (_, i) => {
          const code = `${h}-${String(i + 1).padStart(2, "0")}`;
          return { code, hall: hi, exhibitor: list.find((e) => e.stands[edition] === code) };
        }),
      ),
    [list, edition],
  );
  const firstTaken = stands.find((s) => s.exhibitor)?.code ?? "A-01";
  const [focus, setFocus] = useState<string>(firstTaken);
  const cur = stands.find((s) => s.code === focus)!;
  const sec = sectors[cur.hall];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="relative overflow-hidden rounded-md border border-line bg-[radial-gradient(70%_60%_at_50%_40%,#17191c,#0b0c0d)] py-6 sm:py-10">
        <div className="mx-auto w-[min(56rem,100%)] [perspective:1600px]" dir="ltr">
          <div className="grid grid-cols-3 gap-3 px-6 [transform:rotateX(52deg)_rotateZ(-32deg)] [transform-style:preserve-3d] sm:gap-5 sm:px-12">
            {sectors.map((s, hi) => (
              <div key={s.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-2 [transform-style:preserve-3d] sm:p-3">
                <p className="mb-2 flex items-center gap-1.5 text-[0.55rem] uppercase tracking-[0.18em] text-fog sm:text-[0.62rem]">
                  <span className="font-semibold text-limestone">{HALLS[hi]}</span>
                  <span className="truncate">{t(s.short, locale)}</span>
                </p>
                <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                  {stands
                    .filter((x) => x.hall === hi)
                    .map((x) => {
                      const on = x.code === focus;
                      const taken = !!x.exhibitor;
                      return (
                        <button
                          key={x.code}
                          type="button"
                          aria-pressed={on}
                          aria-label={`${dict.exhibitors.stand} ${x.code}${x.exhibitor ? ` — ${x.exhibitor.name}` : ` — ${dict.experience.available}`}`}
                          onClick={() => setFocus(x.code)}
                          onMouseEnter={() => setFocus(x.code)}
                          onFocus={() => setFocus(x.code)}
                          className="relative aspect-square rounded-[3px] transition-transform duration-300 focus-visible:outline-2"
                          style={{
                            transform: on ? "translateZ(14px)" : taken ? "translateZ(6px)" : "none",
                            boxShadow: taken
                              ? `0 ${on ? 10 : 5}px 0 -1px ${s.accent}55, 0 ${on ? 18 : 8}px 14px rgba(0,0,0,.6)`
                              : "none",
                          }}
                        >
                          {taken ? (
                            <Swatch tex={s.tex} seed={s.seed} res={96} className={`h-full w-full rounded-[3px] ${on ? "ring-2 ring-limestone" : ""}`} />
                          ) : (
                            <span
                              className={`block h-full w-full rounded-[3px] border border-dashed ${on ? "border-limestone bg-white/10" : "border-white/15"}`}
                            />
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 px-6 text-xs text-fog">{dict.experience.mapHint}</p>
      </div>

      <aside className="rounded-md border border-line bg-graphite p-6" aria-live="polite">
        <p className="eyebrow flex items-center gap-2">
          <span className="size-1.5 rounded-full" style={{ background: sec.accent }} />
          {dict.exhibitors.district} {HALLS[cur.hall]} · {t(sec.short, locale)}
        </p>
        <p className="mt-2 text-sm text-fog">
          {dict.exhibitors.stand} {cur.code}
        </p>
        {cur.exhibitor ? (
          <>
            <h3 className="display mt-4 text-3xl">{cur.exhibitor.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-limestone/75">{t(cur.exhibitor.blurb, locale)}</p>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {cur.exhibitor.materials.slice(0, 4).map((slug) => {
                const m = materialBySlug(slug)!;
                return <Swatch key={slug} tex={m.tex} seed={m.seed} res={120} className="aspect-square rounded" />;
              })}
            </div>
            <p className="mt-2 text-xs text-fog">
              {cur.exhibitor.materials.map((s) => t(materialBySlug(s)!.name, locale)).join(" · ")}
            </p>
            {cur.exhibitor.sample && <p className="mt-4 text-[0.7rem] text-travertine">{dict.exhibitors.sample}</p>}
            <div className="mt-6 flex flex-col gap-2">
              <Link href={link(`exhibitors/${cur.exhibitor.slug}`)} className="btn btn-solid btn-sm justify-center">
                {dict.experience.open} <Arrow size={14} />
              </Link>
              <Link
                href={link(`visit?meeting=${cur.exhibitor.slug}`)}
                onClick={() => track("meeting_request", { exhibitor: cur.exhibitor!.slug, from: "map" })}
                className="btn btn-ghost btn-sm justify-center"
              >
                {dict.exhibitors.requestMeeting}
              </Link>
            </div>
          </>
        ) : (
          <>
            <h3 className="display mt-4 text-3xl">{dict.experience.available}</h3>
            <p className="mt-3 text-sm text-limestone/75">{dict.experience.availableLead}</p>
            <p className="mt-2 text-sm text-limestone/75">{t(sec.pitch, locale)}</p>
            <Link
              href={link(`exhibit?sector=${sec.id}&stand=${cur.code}`)}
              onClick={() => track("exhibit_cta_click", { from: "map", stand: cur.code })}
              className="btn btn-solid btn-sm mt-6 w-full justify-center"
            >
              {dict.experience.book} <Arrow size={14} />
            </Link>
          </>
        )}
      </aside>
    </div>
  );
}
