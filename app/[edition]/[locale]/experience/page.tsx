import type { Metadata } from "next";
import { EventBand } from "@/components/event-band";
import { PageBanner } from "@/components/page-banner";
import { ScopeSection } from "@/components/home/scope-section";
import { FloorMap } from "@/components/floor-map";
import { ContextualCTA } from "@/components/contextual-cta";
import { alternates, resolve } from "@/lib/routing";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/experience">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.experience.title, description: dict.experience.lead, alternates: alternates({ edition, locale }, "experience") };
}

export default async function ExperiencePage({ params }: PageProps<"/[edition]/[locale]/experience">) {
  const { dict, edition, locale, ed } = await resolve(params);
  const c = { edition, locale };
  return (
    <div className="shell pt-32">
      <p className="eyebrow">{dict.nav.experience}</p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.experience.title}</h1>
      <p className="mt-5 max-w-xl text-limestone/75">{dict.experience.lead}</p>
      <PageBanner id="aerial" alt={dict.experience.mapTitle} dict={dict} c={c} ed={ed} />

      <section id="floor" className="scroll-mt-24 pt-16" aria-labelledby="h-floor">
        <h2 id="h-floor" className="display mb-8 text-3xl sm:text-4xl">
          {dict.experience.mapTitle}
        </h2>
        <FloorMap />
      </section>

      <EventBand dict={dict} c={c} ed={ed} bare />
      <ScopeSection compact />
      <ContextualCTA context="experience" />
    </div>
  );
}
