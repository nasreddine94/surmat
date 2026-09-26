import type { Metadata } from "next";
import { EventBand } from "@/components/event-band";
import { Catalogue } from "@/components/catalogue";
import { ContextualCTA } from "@/components/contextual-cta";
import { MaterialUniverse } from "@/components/home/material-universe";
import { SectorGallery } from "@/components/home/sector-gallery";
import { ScopeSection } from "@/components/home/scope-section";
import { alternates, resolve } from "@/lib/routing";
import { sectorById, type SectorId } from "@/content/sectors";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/materials">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.catalogue.title, description: dict.catalogue.lead, alternates: alternates({ edition, locale }, "materials") };
}

/**
 * The library: what is documented. Featured materials, the sectors, the searchable catalogue,
 * then the full scope of the floor. Technical depth (boards, systems) lives on /board.
 */
export default async function MaterialsPage({ params, searchParams }: PageProps<"/[edition]/[locale]/materials">) {
  const { dict, edition, locale, ed } = await resolve(params);
  const c = { edition, locale };
  const sp = await searchParams;
  const sector = typeof sp.sector === "string" && sectorById(sp.sector) ? (sp.sector as SectorId) : null;
  return (
    <>
      <div className="shell pt-32">
        <p className="eyebrow">{dict.nav.materials}</p>
        <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.catalogue.title}</h1>
        <p className="mt-5 max-w-xl text-limestone/75">{dict.catalogue.lead}</p>
      </div>
      <MaterialUniverse />
      <SectorGallery dict={dict} c={c} />
      <div className="shell pt-24">
        <Catalogue initialSector={sector} />
        <ScopeSection compact />
        <EventBand dict={dict} c={c} ed={ed} bare />
      </div>
      <ContextualCTA context="catalogue" sector={sector ?? undefined} />
    </>
  );
}
