"use client";

import Link from "next/link";
import { useSite } from "./site-context";
import { Swatch } from "./swatch";
import { Arrow } from "./icons";
import type { Material } from "@/content/materials";
import { sectorById } from "@/content/sectors";
import { applicationById } from "@/content/applications";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

/**
 * Material hover card (PRD §20): a museum label. At rest, the sample and its name; on hover
 * or focus, where it is used and the two ways forward — explore it, or exhibit it.
 */
export function MaterialTile({ material: m, showSector, className = "" }: { material: Material; showSector?: boolean; className?: string }) {
  const { dict, locale, link } = useSite();
  const sec = sectorById(m.sector)!;
  const used = m.applications
    .slice(0, 3)
    .map((a) => t(applicationById(a)!.name, locale))
    .join(" · ");
  return (
    <div className={`group relative overflow-hidden rounded-md ${className}`} onMouseEnter={() => track("material_hover", { material: m.slug, from: "tile" })}>
      <Swatch tex={m.tex} seed={m.seed} res={320} className="aspect-[4/5] transition-transform duration-[1200ms] ease-[var(--ease-material)] group-hover:scale-[1.08] group-focus-within:scale-[1.08]">
        <div className="sample-shade absolute inset-0" />
      </Swatch>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent transition-opacity duration-500" />
      {/* The whole card opens the material; the exhibit link sits above it. */}
      <Link href={link(`materials/${m.slug}`)} className="absolute inset-0" aria-label={t(m.name, locale)} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
        {showSector && <p className="text-[0.62rem] uppercase tracking-[0.16em] text-limestone/60">{t(sec.short, locale)}</p>}
        <p className="text-sm leading-tight">{t(m.name, locale)}</p>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[var(--ease-material)] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="pt-2 text-[0.7rem] leading-snug text-limestone/65">
              <span className="text-fog">{dict.material.usedIn} </span>
              {used}
            </p>
            <div className="pointer-events-auto mt-2 flex flex-col gap-1 border-t border-line pt-2 text-[0.72rem]">
              <Link href={link(`materials/${m.slug}`)} className="flex items-center justify-between hover:text-gold">
                {dict.universe.explore} <Arrow size={11} className="flip-rtl" />
              </Link>
              <Link
                href={link(`exhibit?sector=${sec.id}`)}
                onClick={() => track("exhibit_cta_click", { from: "material_card", material: m.slug })}
                className="flex items-center justify-between text-limestone/75 hover:text-gold"
              >
                {dict.universe.exhibitThis} <Arrow size={11} className="flip-rtl" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
