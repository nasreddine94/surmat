"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSite } from "../site-context";
import { Swatch } from "../swatch";
import { Arrow, Close, SearchIcon } from "../icons";
import type { OrbitItem, Shape } from "./orbit-scene";
import { materials, materialBySlug } from "@/content/materials";
import { sectors, sectorById, type SectorId } from "@/content/sectors";
import { applicationById } from "@/content/applications";
import { countryName, editions } from "@/lib/editions";
import { fmt, localeLabel, locales, t } from "@/lib/i18n";
import { search } from "@/lib/search";
import { track } from "@/lib/analytics";
import { observeActive, useCan3D } from "@/lib/capability";
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

/** Static composition — the first paint, the reduced-motion hero and the mobile hero. */
const staticSamples: { tex: TexKind; seed: number; cls: string; tr: string; slug: string }[] = [
  { tex: "calacatta", seed: 7, slug: "marble", cls: "start-[6%] top-[12%] w-[17vw] max-w-64 aspect-[3/4] hidden sm:block", tr: "rotateY(24deg) rotateZ(-6deg)" },
  { tex: "woodSlats", seed: 2, slug: "wall-panels", cls: "start-[22%] top-[8%] w-[6vw] aspect-[1/2] hidden md:block", tr: "rotateY(-18deg) rotateX(8deg)" },
  { tex: "granite", seed: 3, slug: "granite", cls: "start-[25%] top-[30%] w-[9vw] aspect-square hidden sm:block", tr: "rotateY(-30deg) rotateZ(4deg)" },
  { tex: "verde", seed: 2, slug: "marble", cls: "start-[20%] top-[58%] w-[9vw] aspect-[3/4] hidden sm:block", tr: "rotateY(30deg) rotateX(-8deg)" },
  { tex: "nero", seed: 3, slug: "marble", cls: "start-[2%] top-[66%] w-[10vw] aspect-square hidden md:block", tr: "rotateY(40deg) rotateZ(10deg)" },
  { tex: "travertine", seed: 2, slug: "travertine", cls: "end-[18%] top-[16%] w-[15vw] max-w-56 aspect-[3/4] hidden sm:block", tr: "rotateY(-26deg) rotateZ(5deg)" },
  { tex: "graniteBlack", seed: 4, slug: "granite", cls: "end-[4%] top-[10%] w-[11vw] aspect-[4/3] hidden sm:block", tr: "rotateY(-34deg) rotateX(10deg)" },
  { tex: "porcelain", seed: 3, slug: "porcelain", cls: "end-[3%] top-[44%] w-[12vw] aspect-[3/4] hidden md:block", tr: "rotateY(-40deg) rotateZ(-4deg)" },
  { tex: "quartz", seed: 6, slug: "quartz", cls: "end-[22%] top-[62%] w-[7vw] aspect-[3/4] hidden md:block", tr: "rotateY(22deg) rotateZ(-10deg)" },
  { tex: "zellige", seed: 4, slug: "zellige", cls: "end-[8%] top-[74%] w-[9vw] aspect-square hidden sm:block", tr: "rotateY(-20deg) rotateX(-14deg)" },
];



export function Hero() {
  const { dict, locale, edition, link } = useSite();
  const rtl = locale === "ar";
  const section = useRef<HTMLElement>(null);
  const drag = useRef({ offset: 0, moved: 0, tilt: 0 });
  const mode = useCan3D() ? "3d" : "static";
  const [ready, setReady] = useState(false);
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

  const deck = useMemo(() => {
    const seen = new Set<string>();
    return items.filter((it) => !seen.has(it.slug) && seen.add(it.slug)).slice(0, 12);
  }, [items]);

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
    setHovered(k);
    const slug = k && items.find((i) => i.key === k)?.slug;
    if (slug && !hoverSeen.current.has(slug)) {
      hoverSeen.current.add(slug);
      track("material_hover", { material: slug, from: "orbit" });
    }
  };
  const onSelect = (k: string | null) => {
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
  const show3D = mode === "3d";

  return (
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
        className="absolute inset-0 transition-opacity duration-1000 [perspective:1100px]"
        style={{ opacity: show3D && ready ? 0 : 1 }}
      >
        {staticSamples.map((s, i) => (
          <div
            key={i}
            className={`absolute ${s.cls} motion-safe:animate-[float-slow_9s_ease-in-out_infinite]`}
            style={{ animationDelay: `${i * -0.9}s` }}
          >
            <Swatch
              tex={s.tex}
              seed={s.seed}
              res={384}
              eager={i < 6}
              className="h-full w-full rounded-[3px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
              style={{ transform: s.tr }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_45%,rgba(0,0,0,0.35))]" />
            </Swatch>
          </div>
        ))}
      </div>

      {show3D && (
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }}>
          <OrbitScene
            items={items}
            selected={selected}
            matchIndex={matchIndex}
            onSelect={onSelect}
            onHover={onHover}
            hovered={hovered}
            drag={drag}
            active={active}
            rtl={rtl}
            eventSource={section}
            onReady={() => setTimeout(() => setReady(true), 250)}
          />
        </div>
      )}

      {/* Readability vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(34%_34%_at_50%_42%,rgba(11,12,13,0.78),rgba(11,12,13,0.35)_60%,transparent_85%)]" />
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
            className="pointer-events-none absolute inset-x-0 top-[13%] z-10 flex flex-col items-center px-4 text-center sm:top-[20%]"
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
            <p className="mt-1.5 text-xs text-fog">
              {locales.map((l) => localeLabel[l].name).join(" · ")}
            </p>
            <div className="pointer-events-auto mt-9 flex flex-wrap justify-center gap-3" data-overlay>
              <Link href={link("materials")} className="btn btn-solid">
                {dict.hero.explore} <Arrow size={16} />
              </Link>
              <Link
                href={link("exhibit")}
                className="btn btn-ghost"
                onClick={() => track("exhibit_cta_click", { from: "hero" })}
              >
                {dict.hero.exhibit} <Arrow size={16} />
              </Link>
            </div>
            <Link
              href={link("visit")}
              data-overlay
              onClick={() => track("visit_cta_click", { from: "hero" })}
              className="pointer-events-auto mt-4 text-sm text-limestone/70 underline decoration-line underline-offset-4 hover:text-limestone"
            >
              {dict.hero.visit}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected material — brought forward */}
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

      {/* Mobile: a swipeable deck of samples instead of the orbit */}
      {!sel && (
        <div className="absolute inset-x-0 bottom-[7.75rem] z-10 sm:hidden" data-overlay>
          <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [perspective:800px] [scrollbar-width:none]">
            {deck.map((it, i) => (
              <li key={it.key} className="shrink-0 snap-center">
                <Link href={link(`materials/${it.slug}`)} className="block w-[5.5rem]">
                  <Swatch
                    tex={it.tex}
                    seed={it.seed}
                    res={200}
                    eager={i < 4}
                    className="aspect-[3/4] rounded-[3px] shadow-[0_20px_30px_-12px_rgba(0,0,0,0.9)]"
                    style={{ transform: `rotateY(${i % 2 ? -14 : 14}deg)` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_45%,rgba(0,0,0,0.3))]" />
                  </Swatch>
                  <span className="mt-2 block truncate text-[0.68rem] text-limestone/75">{it.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Material Galaxy search */}
      <div className="absolute inset-x-0 bottom-6 z-20 px-4 sm:bottom-10" data-overlay>
        <div className="mx-auto w-full max-w-xl">
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
              show3D && <span className="text-xs text-fog/80">{dict.hero.hint}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
