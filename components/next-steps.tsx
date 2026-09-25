"use client";

import Link from "next/link";
import { useSite } from "./site-context";
import { Arrow, Calendar } from "./icons";
import { editions } from "@/lib/editions";
import { t } from "@/lib/i18n";

/** An .ics file for the edition, once its dates are confirmed. */
function icsHref(name: string, city: string, start: string) {
  const d = start.replace(/-/g, "");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SURMAT//EN", "BEGIN:VEVENT",
    `UID:${d}-surmat@surmat`, `DTSTART;VALUE=DATE:${d}`, `SUMMARY:${name}`, `LOCATION:${city}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

/**
 * PRD §45: a success screen is never only "thank you" — it says what happens next,
 * points to relevant materials / exhibitors and offers a calendar entry when dates exist.
 */
export function NextSteps({ steps }: { steps: string[] }) {
  const { dict, locale, edition, link } = useSite();
  const ed = editions[edition];
  return (
    <div className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-[1.2fr_1fr]">
      <div>
        <h3 className="eyebrow">{dict.success.next}</h3>
        <ol className="mt-4 space-y-3 text-sm text-limestone/80">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <Link href={link("materials")} className="flex items-center justify-between border-b border-line py-2 hover:text-gold">
          {dict.hero.explore} <Arrow size={14} className="flip-rtl" />
        </Link>
        <Link href={link("exhibitors")} className="flex items-center justify-between border-b border-line py-2 hover:text-gold">
          {dict.home.viewExhibitors} <Arrow size={14} className="flip-rtl" />
        </Link>
        {ed.startsOn && (
          <a
            href={icsHref(t(ed.name, locale), t(ed.city, locale), ed.startsOn)}
            download="surmat.ics"
            className="flex items-center justify-between border-b border-line py-2 hover:text-gold"
          >
            {dict.success.calendar} <Calendar size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
