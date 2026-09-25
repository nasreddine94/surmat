"use client";

import { useSite } from "./site-context";
import { sectors } from "@/content/sectors";
import { familyGroups } from "@/content/families";
import { exhibitorsFor } from "@/content/exhibitors";
import { t } from "@/lib/i18n";

/** Hall letters: A–F are the six core districts, G–I the adjacent ones (facades, joinery, bath & kitchen). */
export const HALLS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"] as const;
export const standsIn = (hall: number) => (hall < 6 ? 12 : 6);
const NEUTRAL = "#9a9489";

type Block = { x: number; y: number; w: number; h: number; cols: number; rows: number };

// Plan geometry, in plan units (1 unit ≈ 10 cm; the hall is ~100 × 70 m).
const W = 1000, H = 700;
const blocks: Block[] = [
  ...[0, 1, 2].map((c) => ({ x: 40 + c * 320, y: 158, w: 280, h: 142, cols: 6, rows: 2 })),
  ...[0, 1, 2].map((c) => ({ x: 40 + c * 320, y: 336, w: 280, h: 142, cols: 6, rows: 2 })),
  ...[0, 1, 2].map((c) => ({ x: 40 + c * 320, y: 512, w: 280, h: 78, cols: 6, rows: 1 })),
];

export const hallColor = (hall: number) => (hall < 6 ? sectors[hall].accent : NEUTRAL);
export const hallName = (hall: number, locale: Parameters<typeof t>[1]) =>
  hall < 6 ? t(sectors[hall].short, locale) : t(familyGroups[hall].name, locale);

/**
 * A top-down plan of the exhibition hall: entrance and registration, the conference hall,
 * B2B lounge and demo stage, and nine districts of numbered stands. Occupied stands are
 * filled with their district colour; the rest are open for booking.
 */
export function ExhibitionPlan({
  focus,
  onFocus,
  className = "",
}: {
  focus?: string | null;
  onFocus?: (code: string) => void;
  className?: string;
}) {
  const { dict, locale, edition } = useSite();
  const z = dict.experience.zones;
  const list = exhibitorsFor(edition);
  const taken = new Set(list.map((e) => e.stands[edition]).filter(Boolean));

  const room = (x: number, y: number, w: number, h: number, label: string, sub?: string) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" className="fill-white/[0.035] stroke-limestone/35" strokeWidth="1.2" />
      <text x={x + 12} y={y + 22} className="fill-limestone text-[13px] font-medium">
        {label}
      </text>
      {sub && (
        <text x={x + 12} y={y + 40} className="fill-fog text-[10.5px]">
          {sub}
        </text>
      )}
    </g>
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`h-auto w-full select-none ${className}`} role="img" aria-label={dict.experience.mapTitle}>
      <defs>
        <pattern id="plan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeWidth=".4" className="text-limestone/[0.06]" />
        </pattern>
        <pattern id="plan-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V6" stroke="currentColor" strokeWidth="1" className="text-limestone/15" />
        </pattern>
      </defs>

      {/* Hall shell with the entrance opening in the south wall */}
      <rect x="0" y="0" width={W} height={H} fill="url(#plan-grid)" />
      <path d={`M430 ${H - 20}H20V20H980V${H - 20}H570`} fill="none" className="stroke-limestone/70" strokeWidth="5" />
      {/* Structural columns */}
      {[340, 660].flatMap((x) => [318, 496].map((y) => <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width="10" height="10" className="fill-limestone/40" />))}

      {/* Programme along the north wall */}
      {room(40, 36, 300, 96, z.conference, z.conferenceSub)}
      {room(360, 36, 280, 96, z.b2b, z.b2bSub)}
      {room(660, 36, 300, 96, z.demo, z.demoSub)}
      {/* Seating rows in the conference hall, meeting tables in the lounge */}
      {Array.from({ length: 4 }, (_, r) => (
        <line key={r} x1="56" x2="324" y1={92 + r * 10} y2={92 + r * 10} className="stroke-limestone/25" strokeWidth="3" strokeDasharray="7 3" />
      ))}
      {Array.from({ length: 6 }, (_, k) => (
        <circle key={k} cx={392 + k * 43} cy="110" r="10" className="fill-none stroke-limestone/30" strokeWidth="1.2" />
      ))}
      <rect x="676" y="90" width="268" height="32" rx="2" fill="url(#plan-hatch)" className="stroke-limestone/30" />

      {/* Aisles */}
      <text x="500" y="150" textAnchor="middle" className="fill-fog text-[9px] uppercase tracking-[0.3em]">
        {z.aisle}
      </text>

      {/* Districts */}
      {blocks.map((b, hall) => {
        const color = hallColor(hall);
        const n = standsIn(hall);
        const sw = (b.w - 20 - (b.cols - 1) * 5) / b.cols;
        const sh = (b.h - 34 - (b.rows - 1) * 5) / b.rows;
        return (
          <g key={hall}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={color} fillOpacity=".05" stroke={color} strokeOpacity=".45" strokeWidth="1" />
            <text x={b.x + 10} y={b.y + 18} className="text-[12px] font-semibold" fill={color}>
              {HALLS[hall]}
            </text>
            <text x={b.x + 26} y={b.y + 18} className="fill-limestone/85 text-[11px]">
              {hallName(hall, locale)}
            </text>
            {Array.from({ length: n }, (_, k) => {
              const code = `${HALLS[hall]}-${String(k + 1).padStart(2, "0")}`;
              const occ = taken.has(code);
              const on = focus === code;
              const x = b.x + 10 + (k % b.cols) * (sw + 5);
              const y = b.y + 26 + Math.floor(k / b.cols) * (sh + 5);
              return (
                <g
                  key={code}
                  role={onFocus ? "button" : undefined}
                  tabIndex={onFocus ? 0 : undefined}
                  aria-label={`${dict.exhibitors.stand} ${code}${occ ? "" : ` — ${dict.experience.available}`}`}
                  onMouseEnter={() => onFocus?.(code)}
                  onFocus={() => onFocus?.(code)}
                  onClick={() => onFocus?.(code)}
                  className={onFocus ? "cursor-pointer outline-none" : undefined}
                >
                  <rect
                    x={x}
                    y={y}
                    width={sw}
                    height={sh}
                    rx="1.5"
                    fill={occ ? color : "transparent"}
                    fillOpacity={occ ? (on ? 0.95 : 0.6) : 0}
                    stroke={on ? "#f4f0e8" : color}
                    strokeOpacity={on ? 1 : occ ? 0.9 : 0.45}
                    strokeWidth={on ? 2.2 : 1}
                    strokeDasharray={occ || on ? undefined : "3 2"}
                    className="transition-[fill-opacity,stroke-width] duration-200"
                  />
                  <text x={x + sw / 2} y={y + sh / 2 + 3} textAnchor="middle" className={`pointer-events-none text-[8.5px] tabular-nums ${occ ? "fill-ink" : "fill-limestone/45"}`}>
                    {String(k + 1).padStart(2, "0")}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Foyer: registration, lounge and pavilions around the entrance */}
      <line x1="20" x2="980" y1="608" y2="608" className="stroke-limestone/20" strokeDasharray="8 6" />
      {room(40, 616, 250, 58, z.pavilions)}
      {room(710, 616, 250, 58, z.lounge)}
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={350 + k * 78} y="626" width="60" height="14" rx="2" className="fill-gold/40" />
      ))}
      <text x="500" y="660" textAnchor="middle" className="fill-gold text-[11px] uppercase tracking-[0.2em]">
        {z.registration}
      </text>
      <path d={`M500 ${H}V${H - 30}M491 ${H - 20}L500 ${H - 31}L509 ${H - 20}`} fill="none" className="stroke-gold" strokeWidth="2" />
      <text x="516" y={H - 6} className="fill-limestone text-[10px] font-medium uppercase tracking-[0.25em]">
        {z.entrance}
      </text>

      {/* North arrow and scale */}
      <g transform="translate(958 150)" className="text-limestone/60">
        <path d="M0 -12L6 6L0 2L-6 6Z" fill="currentColor" />
        <text y="20" textAnchor="middle" className="fill-current text-[9px]">
          N
        </text>
      </g>
    </svg>
  );
}
