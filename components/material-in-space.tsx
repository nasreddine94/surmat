"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSite } from "./site-context";
import { Room } from "./room";
import { toSpecs } from "./space-studio";
import { Arrow } from "./icons";
import { applications, applicationById, type ApplicationId, type SurfaceId } from "@/content/applications";
import { materialBySlug } from "@/content/materials";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const order: SurfaceId[] = ["feature", "floor", "wall", "counter", "ceiling"];

/** Material → application transition: the material becomes a surface of each space it serves. */
export function MaterialInSpace({ slug }: { slug: string }) {
  const { dict, locale, link } = useSite();
  const m = materialBySlug(slug)!;
  const spaces = m.applications.filter((a) => applicationById(a));
  const [space, setSpace] = useState<ApplicationId>(spaces[0] ?? "hospitality");
  const app = applicationById(space)!;

  const surface = useMemo(
    () => order.find((s) => app.options[s].includes(slug)) ?? order.find((s) => applications.some((a) => a.options[s].includes(slug))) ?? "feature",
    [app, slug],
  );
  const specs = useMemo(() => toSpecs({ ...app.surfaces, [surface]: slug }, locale), [app, surface, slug, locale]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <Room surfaces={specs} light={app.light} label={`${t(app.scene, locale)} — ${t(m.name, locale)}`} className="rounded-xl" />
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label={dict.experience.space}>
          {spaces.map((a) => (
            <button
              key={a}
              type="button"
              className="chip"
              aria-pressed={a === space}
              onClick={() => {
                setSpace(a);
                track("application_view", { application: a, material: slug, from: "material" });
              }}
            >
              {t(applicationById(a)!.name, locale)}
            </button>
          ))}
        </div>
        <p className="text-sm text-limestone/75">
          <span className="text-fog">{dict.apps.surfaces[surface]} · </span>
          {t(app.scene, locale)}
        </p>
        <p className="text-sm leading-relaxed text-fog">{t(app.description, locale)}</p>
        <Link href={link(`applications/${space}`)} className="group mt-auto flex items-center justify-between border-t border-line pt-5 text-sm">
          {t(app.name, locale)} — {t(app.sub, locale)}
          <span className="arrow-circle">
            <Arrow size={14} />
          </span>
        </Link>
      </div>
    </div>
  );
}
