"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import universe from "@/assets/hero/material-universe.webp";
import { useDeferredValue, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSite } from "../site-context";
import { Arrow, Close, SearchIcon } from "../icons";
import type { OrbitItem, Shape } from "./orbit-scene";
import { materials, materialBySlug } from "@/content/materials";
import { sectors, sectorById, type SectorId } from "@/content/sectors";
import { applicationById } from "@/content/applications";
import { countryName, editions } from "@/lib/editions";
import { fmt, t } from "@/lib/i18n";
import { search } from "@/lib/search";
import { track } from "@/lib/analytics";
import { observeActive, useDeviceTier } from "@/lib/capability";
import { requestBitmaps } from "@/lib/texture-client";
import { mapSize } from "./orbit-config";
import type { TexKind } from "@/lib/textures";

const OrbitScene = dynamic(() => import("./orbit-scene"), { ssr: false });

const shapeOf: Record<SectorId, Shape> = {
  "ceramic-porcelain": "tile",
  "natural-engineered-stone": "slab",
  "paints-coatings": "tile",
  "interior-finishing-systems": "panel",
  "construction-chemicals": "tile",
  "surface-technologies": "plank",
};

/** Extra stone variants so the universe has the tonal range of a real sample library. */
const variants: { slug: string; tex: TexKind; seed: number }[] = [
  { slug: "marble", tex: "verde", seed: 2 },
  { slug: "marble", tex: "nero", seed: 3 },
  { slug: "granite", tex: "graniteBlack", seed: 4 },
  { slug: "large-format-slabs", tex: "marble", seed: 8 },
  { slug: "onyx", tex: "onyx", seed: 9 },
  { slug: "terrazzo", tex: "terrazzo", seed: 12 },
];




/* ---------- 2D / 3D preference, remembered across visits ---------- */
type View = "2d" | "3d";
const VIEW_KEY = "surmat:hero-view";
const viewListeners = new Set<() => void>();
let memoryView: View | null = null; // used when storage is unavailable (private mode)
/** The visitor's saved choice, or "auto" to follow the device tier. */
function readView(): View | "auto" {
  try {
    const v = localStorage.getItem(VIEW_KEY);
    if (v === "2d" || v === "3d") return v;
  } catch {}
  return memoryView ?? "auto";
}
function writeView(v: View) {
  memoryView = v;
  try {
    localStorage.setItem(VIEW_KEY, v);
  } catch {}
  viewListeners.forEach((l) => l());
}
const subscribeView = (cb: () => void) => {
  viewListeners.add(cb);
  return () => void viewListeners.delete(cb);
};

export function Hero() {
  const { dict, locale, edition, link } = useSite();
  const rtl = locale === "ar";
  const section = useRef<HTMLElement>(null);
  const drag = useRef({ offset: 0, moved: 0, tilt: 0 });
  const edInfo = editions[edition];
  // Phones and tablets get the 2D hero only; weak desktops start in 2D; strong ones in 3D.
  const tier = useDeviceTier();
  const mode = tier === "none" ? "static" : "3d";
  const saved = useSyncExternalStore<View | "auto">(subscribeView, readView, () => "auto");
  const view: View = saved === "auto" ? (tier === "strong" ? "3d" : "2d") : saved;
  // `ready` flips only when the WebGL scene reports smooth, fully textured frames.
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mountedAt] = useState(() => (typeof performance === "undefined" ? 0 : performance.now()));
  const [active, setActive] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);

  // Only render frames while the hero is on screen.
  useEffect(() => (section.current ? observeActive(section.current, setActive) : undefined), []);

  // Drag to turn the universe.
  useEffect(() => {
    if (mode !== "3d") return;
    const el = section.current!;
    let down = false, lastX = 0, lastY = 0, vel = 0, raf = 0;
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a, button, input, [data-overlay]")) return;
      down = true;
      lastX = e.clientX;
      lastY = e.clientY;
      drag.current.moved = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      drag.current.moved += Math.abs(dx) + Math.abs(dy);
      drag.current.tilt = Math.max(-0.2, Math.min(0.25, drag.current.tilt + dy * 0.0015));
      vel = dx * 0.004;
      drag.current.offset += vel;
    };
    const onUp = () => {
      down = false;
      const coast = () => {
        vel *= 0.94;
        drag.current.offset += vel;
        drag.current.tilt *= 0.97;
        if (Math.abs(vel) > 0.0002 || Math.abs(drag.current.tilt) > 0.002) raf = requestAnimationFrame(coast);
      };
      raf = requestAnimationFrame(coast);
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [mode]);

  const items: OrbitItem[] = useMemo(() => {
    // Interleave sectors so every ring mixes materials.
    const bySector = sectors.map((s) => materials.filter((m) => m.sector === s.id));
    const order: typeof materials = [];
    for (let i = 0; order.length < materials.length; i++) bySector.forEach((list) => list[i] && order.push(list[i]));
    const base = order.map((m) => ({ slug: m.slug, tex: m.tex, seed: m.seed }));
    return [...base.slice(0, 6), ...variants, ...base.slice(6)].map((v, i) => {
      const m = materialBySlug(v.slug)!;
      return {
        key: `${v.slug}-${i}`,
        slug: v.slug,
        tex: v.tex,
        seed: v.seed,
        shape: shapeOf[m.sector],
        label: t(m.name, locale),
        sub: m.spec ?? t(sectorById(m.sector)!.short, locale),
      };
    });
  }, [locale]);

  // Start the 3D scene's texture work in workers now, while the three.js bundle is still
  // downloading; the scene later picks up the same jobs instead of starting its own.
  useEffect(() => {
    if (mode !== "3d" || view !== "3d") return;
    items.forEach((it, i) => void requestBitmaps(it.tex, it.seed, mapSize(i)).catch(() => undefined));
  }, [mode, view, items]);


  const results = useMemo(() => (dq.trim().length > 1 ? search(dq, edition) : null), [dq, edition]);
  const matchIndex = useMemo(() => {
    if (!results) return null;
    const slugs = results.materials.map((m) => m.slug);
    const map = new Map<string, number>();
    let n = 0;
    for (const s of slugs) for (const it of items) if (it.slug === s) map.set(it.key, n++);
    return map;
  }, [results, items]);

  useEffect(() => {
    if (!dq.trim()) return;
    const id = setTimeout(() => track("search", { q: dq, from: "hero", results: results?.materials.length ?? 0 }), 900);
    return () => clearTimeout(id);
  }, [dq, results]);

  const hoverSeen = useRef(new Set<string>());
  const onHover = (k: string | null) => {
    if (!ready || view !== "3d") return; // the scene is warming up, or the visitor chose 2D
    setHovered(k);
    const slug = k && items.find((i) => i.key === k)?.slug;
    if (slug && !hoverSeen.current.has(slug)) {
      hoverSeen.current.add(slug);
      track("material_hover", { material: slug, from: "orbit" });
    }
  };
  const onSelect = (k: string | null) => {
    if (!ready || view !== "3d") return;
    setSelected(k);
    const slug = k && items.find((i) => i.key === k)?.slug;
    if (slug) track("material_expand", { material: slug, from: "orbit" });
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const sel = selected ? items.find((i) => i.key === selected) : null;
  const selMat = sel ? materialBySlug(sel.slug) : null;
  const selSector = selMat ? sectorById(selMat.sector) : null;
  // Start WebGL only once the page has loaded and the browser is idle: the static composition
  // paints instantly and the first interaction is never blocked by shader compilation.
  const [boot, setBoot] = useState(false);
  useEffect(() => {
    if (mode !== "3d") return;
    let id = 0;
    const start = () => {
      performance.mark("surmat:hero-boot");
      setBoot(true);
    };
    const go = () => (id = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 300));
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      window.removeEventListener("load", go);
      if (window.cancelIdleCallback) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, [mode]);
  // The scene mounts the first time 3D is wanted and then stays mounted (paused while 2D is
  // shown), so switching back is instant. Choosing 2D first means it never loads at all.
  const [kept, setKept] = useState(false);
  const can3D = mode === "3d" && !failed;
  if (can3D && boot && view === "3d" && !kept) setKept(true);
  const show3D = can3D && boot && kept;
  const live3D = show3D && ready && view === "3d";
  const preparing = can3D && view === "3d" && !ready;
  // A lost WebGL context renders as a dead (white) canvas. Drop back to the image at once,
  // then rebuild the scene on a fresh canvas; it fades in again only once it is ready.
  const [sceneKey, setSceneKey] = useState(0);
  const onLost = () => {
    setReady(false);
    setSelected(null);
    setHovered(null);
    if (sceneKey >= 3) setFailed(true);
    else setSceneKey((k) => k + 1);
  };
  const switchView = (v: View) => {
    if (v === "2d") {
      setSelected(null);
      setHovered(null);
    }
    writeView(v);
  };
  // Keep the static composition up for a moment even on fast machines, so it never flashes.
  const reveal = () => {
    const wait = Math.max(0, 1400 - (performance.now() - mountedAt));
    window.setTimeout(() => setReady(true), wait);
  };

  return (
    <>
    <section
      ref={section}
      aria-label="SURMAT"
      className="relative isolate h-[100svh] min-h-[680px] overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(60% 55% at 50% 45%, #1a1c1f 0%, #0f1112 55%, #0b0c0d 100%)",
      }}
    >
      {/* Static composition: instant first paint; stays when WebGL is not used. */}
      <div
        aria-hidden
        className="absolute inset-0 transition-[opacity,visibility] delay-300 duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: live3D ? 0 : 1, visibility: live3D ? "hidden" : "visible" }}
      >
        {/* The picture starts below the header bar, so none of it hides behind the navigation. */}
        <div className="absolute inset-x-0 bottom-0 top-24 lg:top-[6.75rem]">
          <Image
            src={universe}
            alt=""
            fill
            preload
            quality={85}
            sizes="100vw"
            placeholder="blur"
            className="object-cover object-top"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-basalt to-transparent" />
        </div>
        {/* The photograph is busier than the 3D scene: settle the area behind the text. */}
        <div className="absolute inset-0 bg-[radial-gradient(36%_40%_at_50%_46%,rgba(11,12,13,0.72),rgba(11,12,13,0.35)_65%,transparent_100%)]" />
      </div>

      {show3D && (
        <div
          aria-hidden={!live3D}
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: live3D ? 1 : 0 }}
        >
          <OrbitScene
            key={sceneKey}
            items={items}
            selected={selected}
            matchIndex={matchIndex}
            onSelect={onSelect}
            onHover={onHover}
            hovered={hovered}
            drag={drag}
            active={active && view === "3d"}
            rtl={rtl}
            eventSource={section}
            onReady={reveal}
            onFail={() => setFailed(true)}
            onLost={onLost}
          />
        </div>
      )}

      {/* Readability vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(34%_34%_at_50%_42%,rgba(11,12,13,0.5),rgba(11,12,13,0.2)_60%,transparent_85%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-basalt to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-basalt/90 to-transparent" />

      {/* Statement */}
      <AnimatePresence>
        {!sel && (
          <motion.div
            key="statement"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.35 } }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="pointer-events-none absolute inset-x-0 top-28 z-10 flex flex-col items-center px-4 text-center sm:top-[20%]"
          >
            <p className="eyebrow">{dict.brand.eyebrow}</p>
            <h1 className="wordmark mt-5 text-[clamp(3.6rem,11vw,9.5rem)] leading-[0.85] tracking-[0.01em]">SURMAT</h1>
            <p className="display mt-5 max-w-[22ch] text-[clamp(1.25rem,2.2vw,1.9rem)] text-limestone/90">
              {dict.brand.descriptor}
            </p>
            <p className="mt-6 flex items-center gap-3 text-sm text-limestone/80">
              {(["dz", "sn"] as const).map((id, i) => (
                <span key={id} className="flex items-center gap-3">
                  {i > 0 && <span className="text-fog">·</span>}
                  <span className={id === edition ? "text-limestone" : "text-limestone/60"}>
                    {countryName(editions[id].country, locale)}
                  </span>
                </span>
              ))}
            </p>
            <p className="mt-2 max-w-[34rem] text-[0.68rem] uppercase tracking-[0.1em] text-fog sm:text-xs sm:tracking-[0.18em]">
              {edInfo.venue ? t(edInfo.venue, locale) : t(edInfo.city, locale)} · {edInfo.dates ? t(edInfo.dates, locale) : dict.edition.datesTBA}
            </p>
            <div className="pointer-events-auto mt-9 flex flex-wrap justify-center gap-3" data-overlay>
              <Link
                href={link("exhibit")}
                className="btn btn-solid"
                onClick={() => track("exhibit_cta_click", { from: "hero" })}
              >
                {dict.event.bookStand} <Arrow size={16} />
              </Link>
              <Link
                href={link("visit")}
                className="btn btn-ghost"
                onClick={() => track("visit_cta_click", { from: "hero" })}
              >
                {dict.event.freeVisit} <Arrow size={16} />
              </Link>
            </div>
            <p className="mt-4 text-xs text-fog">
              {fmt(dict.event.exhibitors, { n: edInfo.targets.exhibitors })} · {fmt(dict.event.visitors, { n: edInfo.targets.visitors })} ·{" "}
              <Link
                href={link("materials")}
                data-overlay
                className="pointer-events-auto text-limestone/75 underline decoration-line underline-offset-4 hover:text-limestone"
              >
                {dict.hero.explore}
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected material — brought forward, its text on a dark fade that separates it from the scene */}
      <AnimatePresence>
        {sel && (
          <motion.div
            key="fade"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-y-0 start-0 z-[15] w-full bg-gradient-to-r from-basalt/90 via-basalt/60 to-transparent sm:w-[62%] rtl:bg-gradient-to-l"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sel && selMat && selSector && (
          <motion.aside
            key={sel.key}
            data-overlay
            initial={{ opacity: 0, x: rtl ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: rtl ? 20 : -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute start-4 top-1/2 z-20 w-[min(26rem,calc(100%-2rem))] -translate-y-1/2 sm:start-10 lg:start-[8%]"
            aria-live="polite"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mb-8 flex items-center gap-2 text-xs text-fog hover:text-limestone"
            >
              <Close size={14} /> {dict.hero.close}
            </button>
            <p className="eyebrow flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ background: selSector.accent }} />
              {t(selSector.name, locale)}
            </p>
            <h2 className="display mt-4 text-[clamp(2.6rem,4.5vw,4.2rem)]">{t(selMat.name, locale)}</h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-limestone/80">{t(selMat.summary, locale)}</p>
            <dl className="mt-7 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
              {selMat.spec && (
                <div>
                  <dt className="eyebrow">{dict.hero.format}</dt>
                  <dd className="mt-2">{selMat.spec}</dd>
                </div>
              )}
              <div>
                <dt className="eyebrow">{dict.hero.usedIn}</dt>
                <dd className="mt-2 text-limestone/85">
                  {selMat.applications.slice(0, 4).map((a) => t(applicationById(a)!.name, locale)).join(" · ")}
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={link(`materials/${selMat.slug}`)} className="btn btn-solid btn-sm">
                {dict.hero.exploreMaterial} <Arrow size={14} />
              </Link>
              <Link href={link(`exhibitors?material=${selMat.slug}`)} className="btn btn-ghost btn-sm">
                {dict.hero.findExhibitors}
              </Link>
            </div>
            <Link
              href={link(`exhibit?sector=${selSector.id}`)}
              onClick={() => track("exhibit_cta_click", { from: "orbit", material: selMat.slug })}
              className="mt-6 inline-flex items-center gap-2 text-sm text-travertine hover:text-limestone"
            >
              {t(selSector.ctaLabel, locale)} <Arrow size={14} />
            </Link>
          </motion.aside>
        )}
      </AnimatePresence>


      {/* 2D / 3D view switch — only where the 3D scene can run */}
      {can3D && (
        <div className="absolute bottom-12 start-6 z-20 flex items-center gap-3 lg:start-10" data-overlay>
          <div
            role="radiogroup"
            aria-label={dict.hero.viewSwitch}
            className="flex rounded-full border border-white/15 bg-black/45 p-0.5 text-[0.68rem] font-medium tracking-[0.14em] backdrop-blur-md"
          >
            {(["2d", "3d"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={view === v}
                onClick={() => switchView(v)}
                className={`relative flex h-7 min-w-10 items-center justify-center gap-1.5 rounded-full px-3 transition-colors duration-300 ${
                  view === v ? "bg-limestone text-basalt" : "text-limestone/70 hover:text-limestone"
                }`}
              >
                {v === "3d" && preparing && (
                  <span aria-hidden className="size-1.5 rounded-full bg-current motion-safe:animate-pulse" />
                )}
                {v.toUpperCase()}
              </button>
            ))}
          </div>
          <span aria-live="polite" className={`text-[0.7rem] text-fog transition-opacity duration-500 ${preparing ? "opacity-100" : "opacity-0"}`}>
            {preparing ? dict.hero.preparing3d : ""}
          </span>
        </div>
      )}

      {/* Material Galaxy search */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 px-4 sm:bottom-10" data-overlay>
        <div className="pointer-events-auto mx-auto w-full max-w-xl">
          <label className="group flex h-12 items-center gap-3 rounded-full border border-line bg-black/40 px-4 backdrop-blur-md focus-within:border-travertine">
            <SearchIcon size={16} className="shrink-0 text-fog" />
            <span className="sr-only">{dict.hero.searchLabel}</span>
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSelected(null);
              }}
              placeholder={dict.hero.searchPlaceholder}
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-fog/80"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label={dict.hero.clear} className="text-fog hover:text-limestone">
                <Close size={14} />
              </button>
            )}
          </label>
          <div className="mt-3 min-h-[2.25rem] text-center" aria-live="polite">
            {results ? (
              results.materials.length ? (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs text-fog">{fmt(dict.hero.matches, { n: results.materials.length })}</span>
                  {results.materials.slice(0, 4).map((m) => (
                    <Link
                      key={m.slug}
                      href={link(`materials/${m.slug}`)}
                      className="rounded-full border border-line bg-black/40 px-3 py-1 text-xs hover:border-fog"
                    >
                      {t(m.name, locale)}
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-fog">{fmt(dict.hero.noMatch, { q: dq })}</span>
              )
            ) : (
              live3D && <span className="text-xs text-fog/80">{dict.hero.hint}</span>
            )}
          </div>
        </div>
      </div>

      {/* Editorial line and scroll cue (PRD §9) */}
      {!sel && (
        <div aria-hidden className="pointer-events-none absolute bottom-40 end-8 z-10 hidden max-w-[11rem] lg:block xl:end-12">
          <p className="display text-2xl leading-tight text-limestone/85">{dict.hero.tagline}</p>
          <span className="mt-3 block h-px w-16 bg-gold/60" />
        </div>
      )}
      <a
        href="#after-hero"
        className="group absolute end-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 text-[0.62rem] uppercase tracking-[0.3em] text-fog hover:text-limestone lg:flex xl:end-10"
        data-overlay
      >
        <span className="[writing-mode:vertical-rl]">{dict.hero.scroll}</span>
        <span className="grid size-9 place-items-center rounded-full border border-line-strong">
          <span className="block h-3 w-px bg-limestone motion-safe:animate-[scrollcue_2.4s_ease-in-out_infinite]" />
        </span>
      </a>
    </section>
    <div id="after-hero" />
    </>
  );
}
