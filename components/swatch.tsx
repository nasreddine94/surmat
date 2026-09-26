"use client";

import { useEffect, useRef, useState } from "react";
import { cachedTextureURL, texTone, textureURL, type TexKind } from "@/lib/textures";
import { enqueue } from "@/lib/idle";
import { cachedSwatchURL, requestSwatchURL } from "@/lib/texture-client";

type Props = {
  tex: TexKind;
  seed?: number;
  /** Generated texture resolution. */
  res?: number;
  /** CSS background-size for tiling, e.g. "180px". Defaults to cover. */
  tile?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Generate immediately instead of waiting for visibility. */
  eager?: boolean;
};

/**
 * A material surface. Shows the material's average tone instantly, then fades
 * in the procedural texture once the element is near the viewport.
 */
export function Swatch({ tex, seed = 1, res = 320, tile, className = "", style, children, eager }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const key = `${tex}:${res}:${seed}`;
  const [loaded, setLoaded] = useState<{ key: string; url: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  // Cache lookups only after mount so server and first client render match.
  const cached = () => cachedSwatchURL(tex, res, seed) ?? cachedTextureURL(tex, res, seed);
  const url = mounted ? (cached() ?? (loaded?.key === key ? loaded.url : undefined)) : undefined;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe mount flag
    setMounted(true);
    if (cachedSwatchURL(tex, res, seed) ?? cachedTextureURL(tex, res, seed)) return;
    let cancelled = false;
    // Drawn in a worker; the main thread only fills in if workers are unavailable.
    const run = () =>
      requestSwatchURL(tex, res, seed, !!eager)
        .then((u) => !cancelled && setLoaded({ key, url: u }))
        .catch(() => enqueue(() => !cancelled && setLoaded({ key, url: textureURL(tex, res, seed) }), eager));
    if (eager) {
      run();
      return () => void (cancelled = true);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [key, tex, seed, res, eager]);

  return (
    <div ref={ref} className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative "}overflow-hidden ${className}`} style={{ backgroundColor: texTone[tex], ...style }}>
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: url ? 1 : 0,
          backgroundImage: url ? `url(${url})` : undefined,
          backgroundSize: tile ?? "cover",
          backgroundRepeat: tile ? "repeat" : "no-repeat",
          backgroundPosition: "center",
        }}
      />
      {children}
    </div>
  );
}
