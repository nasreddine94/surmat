"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSite } from "./site-context";
import { Swatch } from "./swatch";
import { Arrow } from "./icons";
import { ExhibitionPlan, HALLS, hallColor, hallName, standsIn } from "./exhibition-plan";
import { sectors } from "@/content/sectors";
import { familyGroups } from "@/content/families";
import { exhibitorsFor, type Exhibitor } from "@/content/exhibitors";
import { materialBySlug } from "@/content/materials";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

type Stand = { code: string; hall: number; exhibitor?: Exhibitor };

/**
 * The exhibition floor plan with a stand inspector: who is on the selected stand, or how to
 * book it if it is still open.
 */
export function FloorMap() {
  const { dict, locale, edition, link } = useSite();
  const list = exhibitorsFor(edition);
  const stands: Stand[] = useMemo(
    () =>
      HALLS.flatMap((h, hi) =>
        Array.from({ length: standsIn(hi) }, (_, i) => {
          const code = `${h}-${String(i + 1).padStart(2, "0")}`;
          return { code, hall: hi, exhibitor: list.find((e) => e.stands[edition] === code) };
        }),
      ),
    [list, edition],
  );
  const firstTaken = stands.find((s) => s.exhibitor)?.code ?? "A-01";
  const [focus, setFocus] = useState<string>(firstTaken);
  const cur = stands.find((s) => s.code === focus)!;
  const sec = cur.hall < 6 ? sectors[cur.hall] : null;
  const pitch = sec ? sec.pitch : familyGroups[cur.hall].pitch;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="overflow-hidden rounded-md border border-line bg-[#0d0e10] p-3 sm:p-5">
        {/* Phones: the plan keeps a legible size and scrolls sideways, so stands stay tappable. */}
        <div className="-mx-3 overflow-x-auto overscroll-x-contain px-3 pb-2 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
          <div className="min-w-[720px] sm:min-w-0">
            <ExhibitionPlan focus={focus} onFocus={setFocus} />
          </div>
        </div>
        <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 px-1 text-xs text-fog">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-[2px] bg-limestone/60" /> {dict.experience.legendTaken}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-[2px] border border-dashed border-limestone/50" /> {dict.experience.available}
          </span>
          <span>{dict.experience.mapHint}</span>
        </p>
      </div>

      <aside className="rounded-md border border-line bg-graphite p-6" aria-live="polite">
        <p className="eyebrow flex items-center gap-2">
          <span className="size-1.5 rounded-full" style={{ background: hallColor(cur.hall) }} />
          {dict.exhibitors.district} {HALLS[cur.hall]} · {hallName(cur.hall, locale)}
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
            <p className="mt-2 text-sm text-limestone/75">{t(pitch, locale)}</p>
            <Link
              href={link(sec ? `exhibit?sector=${sec.id}&stand=${cur.code}` : `exhibit?stand=${cur.code}`)}
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
