"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSite } from "../site-context";
import { Arrow } from "../icons";
import { explorerScene as scene } from "@/content/scenes";
import { applications, applicationById } from "@/content/applications";
import { materialBySlug } from "@/content/materials";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

/**
 * Home §05 (PRD §12): a space as an interactive canvas. Each hotspot names the material
 * on that surface, its application, and leads to the material and the exhibitors who make it.
 */
export function ApplicationsExplorer() {
  const { dict, locale, link } = useSite();
  const d = dict.explorer;
  const [active, setActive] = useState(0);
  const app = applicationById(scene.application)!;
  const h = scene.hotspots[active];
  const m = materialBySlug(h.material)!;

  const pick = (n: number) => {
    setActive(n);
    track("application_hotspot_select", { application: scene.application, material: scene.hotspots[n].material, surface: scene.hotspots[n].surface });
  };

  return (
    <section className="shell grid items-center gap-10 pt-24 sm:pt-32 lg:grid-cols-[1.4fr_0.6fr] lg:gap-14" aria-labelledby="h-explorer">
      <div className="relative overflow-hidden rounded-md bg-graphite shadow-atmos" style={{ aspectRatio: `${scene.width} / ${scene.height}` }}>
        <Image
          src={scene.image}
          alt={`${t(app.scene, locale)} — ${scene.hotspots.map((x) => t(materialBySlug(x.material)!.name, locale)).join(", ")}`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        <div className="overlay-image pointer-events-none absolute inset-0 opacity-60" />

        {scene.hotspots.map((x, n) => {
          const on = n === active;
          const mat = materialBySlug(x.material)!;
          return (
            <button
              key={x.surface}
              type="button"
              onClick={() => pick(n)}
              onMouseEnter={() => pick(n)}
              aria-pressed={on}
              aria-label={`${t(mat.name, locale)} — ${d.surfaces[x.surface]}`}
              className="group absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: `${x.x}%`, top: `${x.y}%` }}
            >
              <span className={`absolute size-8 rounded-full border transition-all duration-500 ${on ? "scale-100 border-gold bg-gold/20" : "scale-75 border-limestone/60 bg-ink/30 group-hover:scale-90"}`} />
              <span className={`relative size-2.5 rounded-full ${on ? "bg-gold" : "bg-limestone"}`} />
              {!on && <span className="absolute size-8 animate-ping rounded-full border border-limestone/40 motion-reduce:hidden" />}
            </button>
          );
        })}

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass pointer-events-auto absolute hidden w-60 rounded-sm p-4 sm:block"
            style={{
              left: h.x > 55 ? undefined : `calc(${h.x}% + 1.75rem)`,
              right: h.x > 55 ? `calc(${100 - h.x}% + 1.75rem)` : undefined,
              top: `clamp(0.75rem, calc(${h.y}% - 2.5rem), calc(100% - 9.5rem))`,
            }}
          >
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">{d.surfaces[h.surface]} · {t(app.scene, locale)}</p>
            <p className="mt-1.5 text-lg">{t(m.name, locale)}</p>
            <div className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3 text-xs">
              <Link href={link(`materials/${m.slug}`)} className="flex items-center justify-between hover:text-gold">
                {d.viewMaterial} <Arrow size={12} className="flip-rtl" />
              </Link>
              <Link href={link(`exhibitors?material=${m.slug}`)} className="flex items-center justify-between text-limestone/75 hover:text-gold">
                {d.findExhibitors} <Arrow size={12} className="flip-rtl" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div>
        <p className="eyebrow">{dict.nav.applications}</p>
        <h2 id="h-explorer" className="display mt-5 text-[clamp(2.5rem,5vw,5rem)]">
          {d.title}
        </h2>
        <p className="mt-6 max-w-md text-limestone/75">{d.lead}</p>

        {/* Selected hotspot, readable on phones where the floating label is hidden */}
        <div className="mt-8 border-y border-line py-5 sm:hidden">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">{d.surfaces[h.surface]}</p>
          <p className="mt-1 text-lg">{t(m.name, locale)}</p>
          <div className="mt-3 flex gap-5 text-sm">
            <Link href={link(`materials/${m.slug}`)} className="underline decoration-line underline-offset-4">{d.viewMaterial}</Link>
            <Link href={link(`exhibitors?material=${m.slug}`)} className="underline decoration-line underline-offset-4">{d.findExhibitors}</Link>
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {applications.map((a) => (
            <li key={a.id}>
              <Link href={link(`applications/${a.id}`)} className="chip">
                {t(a.name, locale)}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={link("applications")} className="group mt-8 inline-flex items-center gap-3 text-sm">
          <span className="border-b border-gold/60 pb-1 transition-colors group-hover:border-gold">{dict.home.exploreApps}</span>
          <Arrow size={14} className="flip-rtl" />
        </Link>
      </div>
    </section>
  );
}
