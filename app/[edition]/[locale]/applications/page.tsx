import type { Metadata } from "next";
import Link from "next/link";
import { SpaceThumb } from "@/components/materials-become-spaces";
import { Reveal } from "@/components/reveal";
import { Arrow } from "@/components/icons";
import { ContextualCTA } from "@/components/contextual-cta";
import { applications } from "@/content/applications";
import { materialBySlug } from "@/content/materials";
import { alternates, href, resolve } from "@/lib/routing";
import { t } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/applications">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.apps.title, description: dict.apps.lead, alternates: alternates({ edition, locale }, "applications") };
}

export default async function ApplicationsPage({ params }: PageProps<"/[edition]/[locale]/applications">) {
  const { edition, locale, dict } = await resolve(params);
  const c = { edition, locale };
  return (
    <div className="shell pt-32">
      <p className="eyebrow">{dict.nav.applications}</p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.home.spacesTitle}</h1>
      <p className="mt-5 max-w-xl text-limestone/75">{dict.apps.lead}</p>
      <ul className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2">
        {applications.map((a, i) => (
          <li key={a.id}>
            <Reveal delay={(i % 2) * 0.08}>
              <Link href={href(c, `applications/${a.id}`)} className="group block">
                <div className="overflow-hidden rounded-lg">
                  <div className="transition-transform duration-1000 group-hover:scale-[1.03]">
                    <SpaceThumb id={a.id} />
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <h2 className="display text-3xl">{t(a.name, locale)}</h2>
                    <p className="mt-1 text-sm text-fog">{t(a.sub, locale)}</p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-limestone/70">{t(a.description, locale)}</p>
                    <p className="mt-3 text-xs text-fog">
                      {[...new Set(Object.values(a.surfaces))].map((s) => t(materialBySlug(s)!.name, locale)).join(" · ")}
                    </p>
                  </div>
                  <span className="arrow-circle mt-2 shrink-0">
                    <Arrow size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
      <ContextualCTA context="applications" />
    </div>
  );
}
