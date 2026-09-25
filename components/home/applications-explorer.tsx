"use client";

import Link from "next/link";
import { useSite } from "../site-context";
import { Arrow } from "../icons";
import { SpaceExplorer } from "../space-explorer";

/**
 * Home §05 (PRD §12): spaces as interactive photographs. Pick a space, then a point in it, to
 * reach the material on that surface and the exhibitors who make it.
 */
export function ApplicationsExplorer() {
  const { dict, link } = useSite();
  const d = dict.explorer;
  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="h-explorer">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">{dict.nav.applications}</p>
          <h2 id="h-explorer" className="display mt-5 text-[clamp(2.5rem,5vw,4.75rem)]">
            {d.title}
          </h2>
        </div>
        <div className="lg:justify-self-end">
          <p className="max-w-md text-limestone/75">{d.lead}</p>
          <Link href={link("applications")} className="group mt-5 inline-flex items-center gap-3 text-sm">
            <span className="border-b border-gold/60 pb-1 transition-colors group-hover:border-gold">{dict.home.exploreApps}</span>
            <Arrow size={14} />
          </Link>
        </div>
      </div>
      <SpaceExplorer />
    </section>
  );
}
