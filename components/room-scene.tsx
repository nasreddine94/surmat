"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cachedTextureURL, texTone, textureURL, type TexKind } from "@/lib/textures";
import { enqueue } from "@/lib/idle";
import type { SurfaceId } from "@/content/applications";

export type SurfaceSpec = { tex: TexKind; seed: number; label: string };

const W = 1000, H = 560, D = 820, P = 760;
const COUNTER = { w: 500, h: 118, d: 96, z: -D / 2 + 250 };

type Face = {
  surface: SurfaceId;
  w: number;
  h: number;
  transform: string;
  tile: number; // background-size in px
  shade: string; // baked lighting
  primary?: boolean; // the focusable face for its surface
};

const faces: Face[] = [
  { surface: "ceiling", w: W, h: D, transform: `translateY(${-H / 2}px) rotateX(-90deg)`, tile: 300, shade: "linear-gradient(to top, rgba(0,0,0,.05), rgba(0,0,0,.55))", primary: true },
  { surface: "wall", w: D, h: H, transform: `translateX(${-W / 2}px) rotateY(90deg)`, tile: 320, shade: "linear-gradient(to left, rgba(0,0,0,.1), rgba(0,0,0,.6))", primary: true },
  { surface: "wall", w: D, h: H, transform: `translateX(${W / 2}px) rotateY(-90deg)`, tile: 320, shade: "linear-gradient(to right, rgba(0,0,0,.1), rgba(0,0,0,.6))" },
  { surface: "wall", w: W, h: H, transform: `translateZ(${-D / 2}px)`, tile: 320, shade: "linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,.05) 40%, rgba(0,0,0,.25))" },
  { surface: "floor", w: W, h: D, transform: `translateY(${H / 2}px) rotateX(90deg)`, tile: 360, shade: "linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,0) 40%, rgba(0,0,0,.35))", primary: true },
  { surface: "feature", w: 440, h: H, transform: `translateZ(${-D / 2 + 1}px)`, tile: 440, shade: "linear-gradient(to bottom, rgba(255,255,255,.12), rgba(0,0,0,.15))", primary: true },
  // Counter: front, top and two sides
  { surface: "counter", w: COUNTER.w, h: COUNTER.h, transform: `translate3d(0, ${H / 2 - COUNTER.h / 2}px, ${COUNTER.z + COUNTER.d / 2}px)`, tile: 260, shade: "linear-gradient(to bottom, rgba(0,0,0,.05), rgba(0,0,0,.4))", primary: true },
  { surface: "counter", w: COUNTER.w, h: COUNTER.d, transform: `translate3d(0, ${H / 2 - COUNTER.h}px, ${COUNTER.z}px) rotateX(90deg)`, tile: 260, shade: "linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0))" },
  { surface: "counter", w: COUNTER.d, h: COUNTER.h, transform: `translate3d(${-COUNTER.w / 2}px, ${H / 2 - COUNTER.h / 2}px, ${COUNTER.z}px) rotateY(90deg)`, tile: 260, shade: "linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55))" },
  { surface: "counter", w: COUNTER.d, h: COUNTER.h, transform: `translate3d(${COUNTER.w / 2}px, ${H / 2 - COUNTER.h / 2}px, ${COUNTER.z}px) rotateY(-90deg)`, tile: 260, shade: "linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55))" },
];

function useTexture(tex: TexKind, seed: number) {
  const key = `${tex}:${seed}`;
  const [loaded, setLoaded] = useState<{ key: string; url: string } | null>(null);
  useEffect(() => {
    if (cachedTextureURL(tex, 384, seed)) return;
    let live = true;
    enqueue(() => live && setLoaded({ key, url: textureURL(tex, 384, seed) }), true);
    return () => void (live = false);
  }, [key, tex, seed]);
  return cachedTextureURL(tex, 384, seed) ?? (loaded?.key === key ? loaded.url : undefined);
}

/** One layer of material on a face; new layers peel in over the previous one. */
function Layer({ spec, tile, peel, reduce }: { spec: SurfaceSpec; tile: number; peel: boolean; reduce: boolean | null }) {
  const url = useTexture(spec.tex, spec.seed);
  return (
    <motion.div
      className="absolute inset-0"
      initial={peel && !reduce ? { clipPath: "inset(0 100% 0 0)" } : false}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      style={{
        backgroundColor: texTone[spec.tex],
        backgroundImage: url ? `url(${url})` : undefined,
        backgroundSize: `${tile}px`,
      }}
    >
      {peel && !reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/35 to-black/30"
          initial={{ left: "-10%" }}
          animate={{ left: "105%" }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        />
      )}
    </motion.div>
  );
}

function FaceView({
  face,
  spec,
  active,
  hovered,
  interactive,
  onSelect,
  onHover,
  light,
  surfaceName,
}: {
  surfaceName: string;
  face: Face;
  spec: SurfaceSpec;
  active: boolean;
  hovered: boolean;
  interactive: boolean;
  onSelect?: (s: SurfaceId) => void;
  onHover: (s: SurfaceId | null) => void;
  light: string;
}) {
  const reduce = useReducedMotion();
  const [layers, setLayers] = useState([{ id: 0, spec }]);
  const idRef = useRef(0);

  useEffect(() => {
    setLayers((ls) => {
      const last = ls[ls.length - 1];
      if (last.spec.tex === spec.tex && last.spec.seed === spec.seed) return ls;
      return [...ls.slice(-1), { id: ++idRef.current, spec }];
    });
  }, [spec]);

  // Drop covered layers once the peel has finished.
  useEffect(() => {
    if (layers.length < 2) return;
    const id = setTimeout(() => setLayers((ls) => ls.slice(-1)), 1200);
    return () => clearTimeout(id);
  }, [layers]);

  const Tag = interactive ? "button" : "div";
  return (
    <Tag
      {...(interactive
        ? {
            type: "button" as const,
            "aria-label": `${surfaceName}: ${spec.label}`,
            "aria-pressed": active,
            tabIndex: face.primary ? 0 : -1,
            "aria-hidden": face.primary ? undefined : true,
            onClick: () => onSelect?.(face.surface),
            onFocus: () => onHover(face.surface),
            onBlur: () => onHover(null),
          }
        : { "aria-hidden": true })}
      onPointerEnter={() => interactive && onHover(face.surface)}
      onPointerLeave={() => interactive && onHover(null)}
      className="absolute left-1/2 top-1/2 overflow-hidden outline-none [backface-visibility:visible]"
      style={{
        width: face.w,
        height: face.h,
        marginLeft: -face.w / 2,
        marginTop: -face.h / 2,
        transform: face.transform,
      }}
    >
      {layers.map((l, i) => (
        <Layer key={l.id} spec={l.spec} tile={face.tile} peel={i > 0} reduce={reduce} />
      ))}
      <div className="pointer-events-none absolute inset-0" style={{ background: face.shade }} />
      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: `radial-gradient(80% 60% at 50% 0%, ${light}, transparent)` }} />
      <div
        className="pointer-events-none absolute inset-0 transition-[box-shadow,background-color] duration-300"
        style={{
          boxShadow: active || hovered ? `inset 0 0 0 4px ${active ? "#ebe6dc" : "rgba(235,230,220,.55)"}` : "none",
          backgroundColor: hovered && !active ? "rgba(235,230,220,.08)" : "transparent",
        }}
      />
    </Tag>
  );
}

export function RoomScene({
  surfaces,
  light = "#f3d7a8",
  active = null,
  onSelect,
  className = "",
  label,
  surfaceNames,
}: {
  surfaceNames?: Record<SurfaceId, string>;
  surfaces: Record<SurfaceId, SurfaceSpec>;
  light?: string;
  active?: SurfaceId | null;
  onSelect?: (s: SurfaceId) => void;
  className?: string;
  label: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 44 });
  const [hovered, setHovered] = useState<SurfaceId | null>(null);
  const reduce = useReducedMotion();
  const interactive = !!onSelect;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={box}
      role={interactive ? "group" : "img"}
      aria-label={label}
      className={`relative aspect-[1000/560] w-full overflow-hidden bg-black ${className}`}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        setOrigin({ x: 50 + ((e.clientX - r.left) / r.width - 0.5) * -14, y: 44 + ((e.clientY - r.top) / r.height - 0.5) * -10 });
      }}
      onPointerLeave={() => setOrigin({ x: 50, y: 44 })}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          perspective: `${P}px`,
          perspectiveOrigin: `${origin.x}% ${origin.y}%`,
          transition: "perspective-origin 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: `translateZ(${-D / 2}px)` }}>
          {faces.map((f, i) => (
            <FaceView
              key={i}
              face={f}
              spec={surfaces[f.surface]}
              active={active === f.surface}
              hovered={hovered === f.surface}
              interactive={interactive}
              onSelect={onSelect}
              onHover={setHovered}
              light={light}
              surfaceName={surfaceNames?.[f.surface] ?? f.surface}
            />
          ))}
          {/* Cove light along the ceiling line */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{
              width: W,
              height: 70,
              marginLeft: -W / 2,
              marginTop: -H / 2,
              transform: `translateZ(${-D / 2 + 2}px)`,
              background: `linear-gradient(${light}88, transparent)`,
            }}
          />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]" />
    </div>
  );
}
