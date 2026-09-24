"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSite } from "./site-context";
import { type SurfaceSpec } from "./room-scene";
import { Room } from "./room";
import { Swatch } from "./swatch";
import { Arrow } from "./icons";
import { applications, applicationById, surfaceIds, type ApplicationId, type SurfaceId } from "@/content/applications";
import { materialBySlug } from "@/content/materials";
import { sectorById } from "@/content/sectors";
import { t, type Locale } from "@/lib/i18n";
import { track } from "@/lib/analytics";

export const specFor = (slug: string, locale: Locale): SurfaceSpec => {
  const m = materialBySlug(slug)!;
  return { tex: m.tex, seed: m.seed, label: t(m.name, locale) };
};

export const toSpecs = (s: Record<SurfaceId, string>, locale: Locale) =>
  Object.fromEntries(surfaceIds.map((k) => [k, specFor(s[k], locale)])) as Record<SurfaceId, SurfaceSpec>;

/**
 * Project explorer + "Build your space". Select a surface in the room to see
 * its material; pick an alternative and the surface peels over to it.
 */
export function SpaceStudio({
  initialSpace,
  allowSpaceChange = false,
  showSpec = false,
}: {
  initialSpace: ApplicationId;
  allowSpaceChange?: boolean;
  showSpec?: boolean;
}) {
  const { dict, locale, link } = useSite();
  const [space, setSpace] = useState<ApplicationId>(initialSpace);
  const app = applicationById(space)!;
  const [chosen, setChosen] = useState<Record<SurfaceId, string>>(app.surfaces);
  const [surface, setSurface] = useState<SurfaceId>("feature");
  const specs = useMemo(() => toSpecs(chosen, locale), [chosen, locale]);

  const current = materialBySlug(chosen[surface])!;
  const sector = sectorById(current.sector)!;
  const options = useMemo(() => {
    if (!allowSpaceChange) return app.options[surface];
    // In build mode offer every material any space uses on this surface.
    const set = new Set<string>();
    applications.forEach((a) => a.options[surface].forEach((s) => set.add(s)));
    return [...set];
  }, [app, surface, allowSpaceChange]);

  const pickSpace = (id: ApplicationId) => {
    setSpace(id);
    setChosen(applicationById(id)!.surfaces);
  };
  const pickSurface = (s: SurfaceId) => {
    setSurface(s);
    track("surface_select", { space, surface: s, material: chosen[s] });
  };

  const unique = [...new Set(Object.values(chosen))];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10">
      <div>
        <Room
          surfaces={specs}
          light={app.light}
          active={surface}
          onSelect={pickSurface}
          label={t(app.scene, locale)}
          surfaceNames={dict.apps.surfaces}
          className="rounded-xl"
        />
        <p className="mt-3 text-xs text-fog">{dict.apps.selectSurface}</p>
      </div>

      <div className="flex flex-col gap-7">
        {allowSpaceChange && (
          <fieldset>
            <legend className="eyebrow mb-3">{dict.experience.space}</legend>
            <div className="flex flex-wrap gap-2">
              {applications.map((a) => (
                <button key={a.id} type="button" className="chip" aria-pressed={a.id === space} onClick={() => pickSpace(a.id)}>
                  {t(a.scene, locale)}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend className="eyebrow mb-3">{dict.experience.surface}</legend>
          <div className="flex flex-wrap gap-2">
            {surfaceIds.map((s) => (
              <button key={s} type="button" className="chip" aria-pressed={s === surface} onClick={() => pickSurface(s)}>
                {dict.apps.surfaces[s]}
              </button>
            ))}
          </div>
        </fieldset>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${surface}-${current.slug}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="border-t border-line pt-6"
            aria-live="polite"
          >
            <p className="eyebrow flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ background: sector.accent }} />
              {dict.apps.surfaces[surface]} · {t(sector.short, locale)}
            </p>
            <h3 className="display mt-3 text-3xl">{t(current.name, locale)}</h3>
            <p className="mt-3 text-sm leading-relaxed text-limestone/75">{t(current.summary, locale)}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href={link(`materials/${current.slug}`)} className="inline-flex items-center gap-1.5 text-limestone hover:text-travertine">
                {dict.hero.exploreMaterial} <Arrow size={13} />
              </Link>
              <Link href={link(`exhibitors?material=${current.slug}`)} className="inline-flex items-center gap-1.5 text-limestone/70 hover:text-limestone">
                {dict.hero.findExhibitors} <Arrow size={13} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <fieldset>
          <legend className="eyebrow mb-3">{dict.experience.material}</legend>
          <div className="grid grid-cols-4 gap-2">
            {options.map((slug) => {
              const m = materialBySlug(slug)!;
              const on = chosen[surface] === slug;
              return (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={on}
                  title={t(m.name, locale)}
                  onClick={() => setChosen((c) => ({ ...c, [surface]: slug }))}
                  className={`group text-start ${on ? "" : "opacity-80 hover:opacity-100"}`}
                >
                  <Swatch
                    tex={m.tex}
                    seed={m.seed}
                    res={160}
                    className={`aspect-square rounded-md ring-offset-2 ring-offset-basalt transition ${on ? "ring-2 ring-limestone" : "ring-1 ring-line"}`}
                  />
                  <span className="mt-1.5 line-clamp-2 block text-[0.68rem] leading-tight text-limestone/75">{t(m.name, locale)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {showSpec && (
          <div className="rounded-xl border border-line bg-graphite p-5">
            <h3 className="eyebrow">{dict.experience.spec}</h3>
            <dl className="mt-4 space-y-2.5 text-sm">
              {surfaceIds.map((s) => (
                <div key={s} className="flex justify-between gap-4">
                  <dt className="text-fog">{dict.apps.surfaces[s]}</dt>
                  <dd className="text-end">{t(materialBySlug(chosen[s])!.name, locale)}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={link(`exhibitors?materials=${unique.join(",")}`)}
              onClick={() => track("space_built", { space, materials: unique.join(",") })}
              className="btn btn-solid btn-sm mt-5 w-full justify-center whitespace-normal text-center"
            >
              {dict.experience.findSuppliers}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
