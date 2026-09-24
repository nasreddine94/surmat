"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSite } from "./site-context";
import { RoomScene } from "./room-scene";
import { Room } from "./room";
import { Swatch } from "./swatch";
import { Arrow } from "./icons";
import { toSpecs } from "./space-studio";
import { applications, applicationById, type ApplicationId } from "@/content/applications";
import { materialBySlug } from "@/content/materials";
import { sectorById } from "@/content/sectors";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const featured = ["marble", "travertine", "zellige", "onyx", "microcement", "wall-panels", "terrazzo", "decorative-plaster", "effect-coatings"];

/** Home section 03: pick a material and watch it become the room's feature wall. */
export function MaterialsBecomeSpaces() {
  const { dict, locale, link } = useSite();
  const [space, setSpace] = useState<ApplicationId>("hospitality");
  const [material, setMaterial] = useState("marble");
  const app = applicationById(space)!;
  const specs = useMemo(() => toSpecs({ ...app.surfaces, feature: material }, locale), [app, material, locale]);
  const m = materialBySlug(material)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
      <div className="relative self-start">
        <Room surfaces={specs} light={app.light} label={`${t(app.scene, locale)} — ${t(m.name, locale)}`} className="rounded-xl" />
        <div className="pointer-events-none absolute bottom-4 start-4 rounded-md bg-black/55 px-3 py-2 backdrop-blur-md">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-fog">{t(app.scene, locale)}</p>
          <p className="text-sm">{t(m.name, locale)}</p>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-wrap gap-2" role="group" aria-label={dict.experience.space}>
          {applications.slice(0, 5).map((a) => (
            <button key={a.id} type="button" className="chip" aria-pressed={a.id === space} onClick={() => setSpace(a.id)}>
              {t(a.name, locale)}
            </button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3" role="group" aria-label={dict.experience.material}>
          {featured.map((slug) => {
            const x = materialBySlug(slug)!;
            const on = slug === material;
            return (
              <button
                key={slug}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setMaterial(slug);
                  track("material_expand", { material: slug, from: "spaces", space });
                }}
                className="text-start"
              >
                <Swatch
                  tex={x.tex}
                  seed={x.seed}
                  res={200}
                  className={`aspect-square rounded-md ring-offset-2 ring-offset-basalt transition ${on ? "ring-2 ring-limestone" : "ring-1 ring-line hover:ring-fog"}`}
                />
                <span className={`mt-2 block text-xs leading-tight ${on ? "text-limestone" : "text-limestone/65"}`}>{t(x.name, locale)}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto flex flex-col gap-2 border-t border-line pt-6 text-sm">
          <Link href={link(`materials/${material}`)} className="group flex items-center justify-between">
            <span>
              {t(m.name, locale)} <span className="text-fog">· {t(sectorById(m.sector)!.short, locale)}</span>
            </span>
            <span className="arrow-circle">
              <Arrow size={14} />
            </span>
          </Link>
          <Link href={link(`applications/${space}`)} className="group flex items-center justify-between text-limestone/75">
            {t(app.scene, locale)}
            <span className="arrow-circle">
              <Arrow size={14} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Non-interactive room thumbnail for application cards. */
export function SpaceThumb({ id }: { id: ApplicationId }) {
  const { locale } = useSite();
  const app = applicationById(id)!;
  const specs = useMemo(() => toSpecs(app.surfaces, locale), [app, locale]);
  return <RoomScene surfaces={specs} light={app.light} label={t(app.scene, locale)} />;
}
