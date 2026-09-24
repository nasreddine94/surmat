import Link from "next/link";
import { Swatch } from "./swatch";
import { Arrow } from "./icons";
import type { Edition } from "@/lib/editions";
import { t, type Dict, type Locale } from "@/lib/i18n";

/** Abstract landmark silhouettes: Maqam Echahid (Algiers), African Renaissance (Dakar). */
function Landmark({ kind }: { kind: Edition["landmark"] }) {
  if (kind === "maqam")
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <g fill="currentColor">
          <path d="M60 8c-6 20-14 54-26 104h10c7-40 12-70 16-104z" />
          <path d="M60 8c6 20 14 54 26 104H76C69 72 64 42 60 8z" />
          <path d="M60 8c-1.5 30-1.5 70 0 104h-3c-1-34-.5-74 3-104z" opacity=".7" />
          <ellipse cx="60" cy="46" rx="12" ry="3" />
          <rect x="20" y="110" width="80" height="4" rx="1" />
        </g>
      </svg>
    );
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <g fill="currentColor">
        <path d="M0 116c24-16 44-22 60-22s36 6 60 22z" />
        <path d="M56 96l2-34-8-16 6-4 4 8 6-22 5 2-5 24 8 10-5 4-6-8-2 36z" />
        <circle cx="72" cy="20" r="4" />
      </g>
    </svg>
  );
}

export function EditionCard({ edition: e, locale, dict, current }: { edition: Edition; locale: Locale; dict: Dict; current: boolean }) {
  return (
    <Link href={`/${e.id}/${locale}`} className="group relative block overflow-hidden rounded-lg border border-line">
      <Swatch tex={e.landmark === "maqam" ? "limestone" : "travertine"} seed={e.landmark === "maqam" ? 4 : 2} res={320} className="aspect-[4/3]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,12,13,0.15),rgba(11,12,13,0.92))]" />
        <div className="absolute bottom-0 end-4 h-[78%] w-[46%] text-basalt/70 transition-transform duration-700 group-hover:-translate-y-1">
          <Landmark kind={e.landmark} />
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
          <div>
            <p className="wordmark text-sm">SURMAT</p>
            <p className="text-sm">{t(e.name, locale).replace(/^SURMAT\s*/, "")}</p>
            <p className="mt-2 text-xs text-limestone/70">
              {t(e.city, locale)} · {e.dates ? t(e.dates, locale) : dict.edition.datesTBA}
            </p>
          </div>
          <span className="arrow-circle">
            <Arrow size={14} />
          </span>
        </div>
        {current && <span className="absolute start-3 top-3 rounded-full bg-limestone px-2 py-0.5 text-[0.62rem] text-basalt">{dict.home.current}</span>}
      </Swatch>
    </Link>
  );
}
