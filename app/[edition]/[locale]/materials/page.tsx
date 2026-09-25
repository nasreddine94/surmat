import type { Metadata } from "next";
import { Catalogue } from "@/components/catalogue";
import { ContextualCTA } from "@/components/contextual-cta";
import { ScopeSection } from "@/components/home/scope-section";
import { alternates, resolve } from "@/lib/routing";
import { sectorById, type SectorId } from "@/content/sectors";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/materials">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.catalogue.title, description: dict.catalogue.lead, alternates: alternates({ edition, locale }, "materials") };
}

export default async function MaterialsPage({ params, searchParams }: PageProps<"/[edition]/[locale]/materials">) {
  const { dict, edition, locale } = await resolve(params);
  const sp = await searchParams;
  const sector = typeof sp.sector === "string" && sectorById(sp.sector) ? (sp.sector as SectorId) : null;
  return (
    <div className="shell pt-32">
      <p className="eyebrow">{dict.nav.materials}</p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.catalogue.title}</h1>
      <p className="mt-5 max-w-xl text-limestone/75">{dict.catalogue.lead}</p>
      <div className="mt-12">
        <Catalogue initialSector={sector} />
      </div>
      <ScopeSection dict={dict} c={{ edition, locale }} compact />
      <ContextualCTA context="catalogue" sector={sector ?? undefined} />
    </div>
  );
}
