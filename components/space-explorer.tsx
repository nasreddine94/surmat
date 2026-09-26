"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSite } from "./site-context";
import { EventImage } from "./event-image";
import { Swatch } from "./swatch";
import { Arrow } from "./icons";
import { ScrollRow } from "./scroll-row";
import { scenes, sceneFor, type Hotspot } from "@/content/scenes";
import { applicationById, type ApplicationId } from "@/content/applications";
import { materialBySlug } from "@/content/materials";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

/**
 * Spaces as interactive photographs. Pick a space (hotel lobby, villa, showroom, clinic, public
 * hall, terrace), then a point in it: the material on that surface, what else is specified
 * there, and the way to its exhibitors — or to a stand for those who make it.
 */
export function SpaceExplorer({ initial = "hospitality", tabs = true, priority = false }: { initial?: ApplicationId; tabs?: boolean; priority?: boolean }) {
  const { dict, locale } = useSite();
  const reduce = useReducedMotion();
  const d = dict.explorer;
  const [appId, setAppId] = useState<ApplicationId>(initial);
  const [active, setActive] = useState(0);
  const scene = sceneFor(appId);
  const app = applicationById(appId)!;
  const h = scene.hotspots[active];
  const alts = app.options[h.surface].filter((s) => s !== h.material).slice(0, 4);

  const pick = (n: number) => {
    setActive(n);
    track("application_hotspot_select", { application: appId, material: scene.hotspots[n].material, surface: scene.hotspots[n].surface });
  };
  const choose = (id: ApplicationId) => {
    setAppId(id);
    setActive(0);
    track("application_view", { application: id, from: "explorer" });
  };

  return (
    <div>
      {tabs && (
        <ScrollRow role="tablist" label={dict.nav.applications} wrapClassName="mb-4" className="gap-1 px-1 py-1" prevLabel={dict.universe.prev} nextLabel={dict.universe.next}>
          {scenes.map((s) => {
            const a = applicationById(s.application)!;
            const on = s.application === appId;
            return (
              <button
                key={s.application}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => choose(s.application)}
                className={`group flex shrink-0 items-center gap-2.5 rounded-full border py-1 pe-4 ps-1 text-sm transition-colors ${on ? "border-gold/60 bg-gold/10 text-limestone" : "border-line text-limestone/70 hover:border-line-strong hover:text-limestone"}`}
              >
                <span className="relative size-8 overflow-hidden rounded-full">
                  <EventImage id={s.media} alt="" sizes="32px" />
                </span>
                {t(a.name, locale)}
              </button>
            );
          })}
        </ScrollRow>
      )}

      <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-line bg-graphite shadow-atmos">
        <AnimatePresence initial={false}>
          <motion.div
            key={appId}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <EventImage
              id={scene.media}
              alt={`${t(app.scene, locale)} — ${scene.hotspots.map((x) => t(materialBySlug(x.material)!.name, locale)).join(", ")}`}
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority={priority}
              label={dict.event.visual}
            />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/20" />
        <p className="pointer-events-none absolute start-4 top-4 text-[0.65rem] uppercase tracking-[0.2em] text-limestone/85 sm:start-5 sm:top-5">
          {t(app.scene, locale)}
        </p>

        {scene.hotspots.map((x, n) => {
          const on = n === active;
          const mat = materialBySlug(x.material)!;
          return (
            <button
              key={`${appId}-${x.surface}`}
              type="button"
              onClick={() => pick(n)}
              onMouseEnter={() => pick(n)}
              aria-pressed={on}
              aria-label={`${t(mat.name, locale)} — ${d.surfaces[x.surface]}`}
              className="group absolute z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: `${x.x}%`, top: `${x.y}%` }}
            >
              <span className={`absolute size-8 rounded-full border backdrop-blur-sm transition-all duration-500 ${on ? "scale-110 border-gold bg-gold/25" : "scale-75 border-limestone/70 bg-ink/35 group-hover:scale-90"}`} />
              <span className={`relative size-2.5 rounded-full ${on ? "bg-gold" : "bg-limestone"}`} />
              {!on && <span className="absolute size-8 animate-ping rounded-full border border-limestone/40 motion-reduce:hidden" />}
            </button>
          );
        })}

        {/* Material card, anchored beside the selected point */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${appId}-${active}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass absolute z-20 hidden w-64 rounded-sm p-4 md:block"
            style={{
              left: h.x > 55 ? undefined : `calc(${h.x}% + 1.75rem)`,
              right: h.x > 55 ? `calc(${100 - h.x}% + 1.75rem)` : undefined,
              top: `clamp(0.75rem, calc(${h.y}% - 3rem), calc(100% - 15rem))`,
            }}
          >
            <MaterialCard h={h} alts={alts} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* On small screens the card sits under the image */}
      <div className="mt-3 rounded-md border border-line bg-graphite/60 p-4 md:hidden">
        <MaterialCard h={h} alts={alts} />
      </div>

      {/* Every surface in the space, as a strip of samples */}
      <ul className="mt-3 grid grid-cols-5 gap-2">
        {scene.hotspots.map((x, n) => {
          const mat = materialBySlug(x.material)!;
          const on = n === active;
          return (
            <li key={x.surface}>
              <button
                type="button"
                onClick={() => pick(n)}
                aria-pressed={on}
                className={`group flex w-full flex-col overflow-hidden rounded-sm border text-start transition-colors ${on ? "border-gold/60" : "border-line hover:border-line-strong"}`}
              >
                <Swatch tex={mat.tex} seed={mat.seed} res={160} className="h-10 w-full sm:h-14" />
                <span className="px-2 py-1.5">
                  <span className="block truncate text-[0.6rem] uppercase tracking-[0.14em] text-fog">{d.surfaces[x.surface]}</span>
                  <span className={`block truncate text-xs ${on ? "text-limestone" : "text-limestone/75"}`}>{t(mat.name, locale)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MaterialCard({ h, alts }: { h: Hotspot; alts: string[] }) {
  const { dict, locale, link } = useSite();
  const d = dict.explorer;
  const m = materialBySlug(h.material)!;
  return (
    <>
      <div className="flex items-center gap-3">
        <Swatch tex={m.tex} seed={m.seed} res={96} className="size-11 shrink-0 rounded-sm" />
        <div className="min-w-0">
          <p className="truncate text-[0.62rem] uppercase tracking-[0.2em] text-gold">{d.surfaces[h.surface]}</p>
          <p className="truncate text-lg leading-tight">{t(m.name, locale)}</p>
        </div>
      </div>
      {alts.length > 0 && (
        <div className="mt-3">
          <p className="text-[0.62rem] text-fog">{d.alternatives}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {alts.map((slug) => {
              const a = materialBySlug(slug);
              if (!a) return null;
              return (
                <Link key={slug} href={link(`materials/${slug}`)} title={t(a.name, locale)} className="flex items-center gap-1.5 rounded-full border border-line py-0.5 pe-2 ps-0.5 text-[0.68rem] text-limestone/80 hover:border-line-strong hover:text-limestone">
                  <Swatch tex={a.tex} seed={a.seed} res={48} className="size-4 rounded-full" />
                  {t(a.name, locale)}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <div className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3 text-xs">
        <Link href={link(`materials/${m.slug}`)} className="flex items-center justify-between hover:text-gold">
          {d.viewMaterial} <Arrow size={12} />
        </Link>
        <Link href={link(`exhibitors?material=${m.slug}`)} className="flex items-center justify-between text-limestone/80 hover:text-gold">
          {d.findExhibitors} <Arrow size={12} />
        </Link>
        <Link
          href={link(`exhibit?sector=${m.sector}`)}
          onClick={() => track("exhibit_cta_click", { from: "space_explorer", material: m.slug })}
          className="flex items-center justify-between text-gold hover:text-limestone"
        >
          {dict.universe.exhibitThis} <Arrow size={12} />
        </Link>
      </div>
    </>
  );
}
