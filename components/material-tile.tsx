"use client";

import Link from "next/link";
import { useSite } from "./site-context";
import { Swatch } from "./swatch";
import { Arrow } from "./icons";
import type { Material } from "@/content/materials";
import { sectorById } from "@/content/sectors";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

export function MaterialTile({ material: m, showSector, className = "" }: { material: Material; showSector?: boolean; className?: string }) {
  const { locale, link } = useSite();
  return (
    <Link
      href={link(`materials/${m.slug}`)}
      onMouseEnter={() => track("material_hover", { material: m.slug, from: "tile" })}
      className={`group block ${className}`}
    >
      <Swatch tex={m.tex} seed={m.seed} res={320} className="aspect-[4/5] rounded-md">
        <div className="sample-shade absolute inset-0 transition-opacity duration-500 group-hover:opacity-70" />
        <div className="absolute inset-0 scale-105 opacity-0 ring-1 ring-inset ring-limestone/0 transition duration-500 group-hover:scale-100 group-hover:opacity-100 group-hover:ring-limestone/40" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
          <div>
            {showSector && <p className="text-[0.62rem] uppercase tracking-[0.16em] text-limestone/60">{t(sectorById(m.sector)!.short, locale)}</p>}
            <p className="text-sm leading-tight">{t(m.name, locale)}</p>
          </div>
          <span className="arrow-circle size-7 shrink-0">
            <Arrow size={12} />
          </span>
        </div>
      </Swatch>
    </Link>
  );
}
