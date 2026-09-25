"use client";

import type { BuildingSystem, Pattern } from "@/content/systems";
import { t, type Locale } from "@/lib/i18n";

const W = 600, H = 400;
const X0 = 24, X1 = 300; // drawing
const Y0 = 36, Y1 = 364;
const LX = 348; // where leaders end (labels start at ~59 %)

/** Hatch fills in the conventions of a construction section drawing. */
function Defs() {
  return (
    <defs>
      <pattern id="p-concrete" width="18" height="18" patternUnits="userSpaceOnUse">
        <rect width="18" height="18" fill="#8d8a84" />
        <circle cx="4" cy="5" r="1.2" fill="#5f5c57" />
        <circle cx="13" cy="12" r="0.9" fill="#5f5c57" />
        <path d="M9 3l2 3h-4z M3 13l2.4 2.6-3.2.4z" fill="#6e6b66" />
      </pattern>
      <pattern id="p-masonry" width="24" height="12" patternUnits="userSpaceOnUse">
        <rect width="24" height="12" fill="#a4674b" />
        <path d="M0 0H24M0 6H24M6 0V6M18 6V12" stroke="#d9c7b5" strokeWidth="1" />
      </pattern>
      <pattern id="p-insulation" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#e9e2cf" />
        <path d="M0 6L3 2L6 6L9 10L12 6" fill="none" stroke="#b9ad8d" strokeWidth="0.9" />
      </pattern>
      <pattern id="p-wool" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#d9b85c" />
        <path d="M0 7C2 1 5 1 7 7S12 13 14 7" fill="none" stroke="#9f8338" strokeWidth="1" />
      </pattern>
      <pattern id="p-membrane" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#2c3a4c" />
      </pattern>
      <pattern id="p-mortar" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#c9c4bb" />
        <circle cx="1.5" cy="1.5" r="0.6" fill="#9c968c" />
        <circle cx="4.5" cy="4" r="0.5" fill="#9c968c" />
      </pattern>
      <pattern id="p-screed" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#a8a39b" />
        <circle cx="2" cy="2" r="0.7" fill="#7f7a72" />
        <circle cx="6" cy="5" r="0.6" fill="#7f7a72" />
      </pattern>
      <pattern id="p-pipes" width="30" height="40" patternUnits="userSpaceOnUse">
        <rect width="30" height="40" fill="#a8a39b" />
        <circle cx="15" cy="26" r="5" fill="#b7472a" stroke="#6b2a1a" strokeWidth="1" />
        <circle cx="4" cy="8" r="0.7" fill="#7f7a72" />
        <circle cx="24" cy="10" r="0.7" fill="#7f7a72" />
      </pattern>
      <pattern id="p-tile" width="46" height="46" patternUnits="userSpaceOnUse">
        <rect width="46" height="46" fill="#e8e3da" />
        <path d="M0 0V46M0 0H46" stroke="#8f8a82" strokeWidth="1.4" />
      </pattern>
      <pattern id="p-stone" width="80" height="40" patternUnits="userSpaceOnUse">
        <rect width="80" height="40" fill="#e5e0d6" />
        <path d="M0 30C20 22 30 34 50 20S72 12 80 16" fill="none" stroke="#a7a198" strokeWidth="0.8" />
      </pattern>
      <pattern id="p-air" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#0d0e10" />
        <path d="M8 13V4M5 7l3-3 3 3" fill="none" stroke="#5a6b7c" strokeWidth="0.9" />
      </pattern>
      <pattern id="p-metal" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="5" height="5" fill="#9aa3ab" />
        <path d="M0 0V5" stroke="#6b737b" strokeWidth="1.2" />
      </pattern>
      <pattern id="p-board" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#f1ede4" />
      </pattern>
      <pattern id="p-paint" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#d8a25c" />
      </pattern>
      <pattern id="p-render" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#ece5d6" />
        <circle cx="3" cy="3" r="0.5" fill="#c5bca9" />
      </pattern>
      <pattern id="p-pedestal" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill="#0d0e10" />
        <rect y="0" width="60" height="22" fill="#e8e3da" />
        <path d="M0 0V22" stroke="#8f8a82" strokeWidth="1.4" />
        <rect x="26" y="22" width="8" height="38" fill="#6e7780" />
      </pattern>
    </defs>
  );
}

const fill = (p: Pattern) => `url(#p-${p})`;

/**
 * A construction section, drawn from data: layers as hatched bands (floor build-ups read top to
 * bottom, walls outside to inside), each with a numbered leader to its label. Hovering or
 * focusing a layer selects it.
 */
export function SystemSection({
  system,
  locale,
  active,
  onActive,
  labels,
}: {
  system: BuildingSystem;
  locale: Locale;
  active: number;
  onActive: (n: number) => void;
  labels: { outside: string; inside: string; top: string };
}) {
  const n = system.layers.length;
  const total = system.layers.reduce((s, x) => s + x.w, 0);
  const wall = system.kind === "wall";
  const span = wall ? X1 - X0 : Y1 - Y0;
  const ends = system.layers.map((_, i) => system.layers.slice(0, i + 1).reduce((sum, x) => sum + x.w, 0));
  const bands = system.layers.map((x, i) => {
    const a = ((ends[i] - x.w) / total) * span;
    const b = (ends[i] / total) * span;
    return wall ? { x: X0 + a, y: Y0, w: b - a, h: Y1 - Y0 } : { x: X0, y: Y0 + a, w: X1 - X0, h: b - a };
  });
  // Labels spread evenly down the right side.
  const ly = (i: number) => Y0 + 18 + (i * (Y1 - Y0 - 36)) / Math.max(1, n - 1);

  return (
    <div className="relative" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={t(system.name, locale)}>
        <Defs />
        {bands.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill={fill(system.layers[i].pattern)}
            stroke="#0b0c0d"
            strokeWidth="1"
            opacity={active === i ? 1 : 0.55}
            className="cursor-pointer transition-opacity duration-300"
            onMouseEnter={() => onActive(i)}
            onClick={() => onActive(i)}
          />
        ))}
        {/* Highlight outline of the selected layer */}
        <rect x={bands[active].x} y={bands[active].y} width={bands[active].w} height={bands[active].h} fill="none" stroke="#d8a25c" strokeWidth="2.5" pointerEvents="none" />

        {/* Leaders */}
        {bands.map((b, i) => {
          const y = ly(i);
          const on = active === i;
          const sx = wall ? b.x + b.w / 2 : X1;
          const sy = wall ? y : b.y + b.h / 2;
          const d = wall ? `M${sx} ${sy}H${LX}` : `M${sx} ${sy}H${X1 + 18}L${X1 + 38} ${y}H${LX}`;
          return (
            <g key={i} pointerEvents="none">
              <path d={d} fill="none" stroke="#0b0c0d" strokeWidth="3.5" opacity=".6" />
              <path d={d} fill="none" stroke={on ? "#d8a25c" : "#8b8578"} strokeWidth={on ? 1.4 : 0.9} />
              <circle cx={sx} cy={sy} r={on ? 5.5 : 4.5} fill={on ? "#d8a25c" : "#f4f0e8"} stroke="#0b0c0d" strokeWidth="1" />
              <text x={sx} y={sy + 2.6} textAnchor="middle" fontSize="7" fontWeight="600" fill="#0b0c0d">
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Orientation captions */}
        {wall ? (
          <g fontSize="10" fill="#8b8578" letterSpacing="1.5">
            <text x={X0} y={Y1 + 22}>← {labels.outside.toUpperCase()}</text>
            <text x={X1} y={Y1 + 22} textAnchor="end">
              {labels.inside.toUpperCase()} →
            </text>
          </g>
        ) : (
          <text x={X0} y={Y0 - 12} fontSize="10" fill="#8b8578" letterSpacing="1.5">
            ↑ {labels.top.toUpperCase()}
          </text>
        )}
      </svg>

      {/* Labels (HTML so they wrap and translate cleanly) */}
      <ol className="absolute inset-y-0 end-0 hidden w-[41%] sm:block">
        {system.layers.map((x, i) => (
          <li key={i} className="absolute inset-x-0 -translate-y-1/2" style={{ top: `${(ly(i) / H) * 100}%` }}>
            <button
              type="button"
              onMouseEnter={() => onActive(i)}
              onFocus={() => onActive(i)}
              onClick={() => onActive(i)}
              className={`block w-full text-start leading-tight transition-colors ${active === i ? "text-limestone" : "text-limestone/60 hover:text-limestone/90"}`}
            >
              <span className="block text-[0.72rem] font-medium lg:text-[0.8rem]" dir="auto">
                {t(x.name, locale)}
              </span>
              <span className="mt-0.5 block truncate text-[0.62rem] text-fog" dir="auto">
                {x.spec}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
