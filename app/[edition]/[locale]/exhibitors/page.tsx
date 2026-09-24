import type { Metadata } from "next";
import Link from "next/link";
import { ExhibitorCard } from "@/components/exhibitor-card";
import { ContextualCTA } from "@/components/contextual-cta";
import { sectors, sectorById, type SectorId } from "@/content/sectors";
import { exhibitorsFor } from "@/content/exhibitors";
import { materialBySlug } from "@/content/materials";
import { alternates, href, resolve } from "@/lib/routing";
import { t } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/exhibitors">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.exhibitors.title, description: dict.exhibitors.lead, alternates: alternates({ edition, locale }, "exhibitors") };
}

export default async function ExhibitorsPage({ params, searchParams }: PageProps<"/[edition]/[locale]/exhibitors">) {
  const { edition, locale, dict } = await resolve(params);
  const sp = await searchParams;
  const c = { edition, locale };
  const sector = typeof sp.sector === "string" && sectorById(sp.sector) ? (sp.sector as SectorId) : null;
  // ?material=marble or ?materials=marble,porcelain (from Build your space)
  const raw = [sp.material, sp.materials].flat().filter((x): x is string => typeof x === "string").join(",");
  const mats = raw.split(",").filter((s) => materialBySlug(s));

  let list = exhibitorsFor(edition);
  if (sector) list = list.filter((e) => e.sectors.includes(sector));
  if (mats.length) list = list.filter((e) => e.materials.some((m) => mats.includes(m)));

  return (
    <div className="shell pt-32">
      <p className="eyebrow">{dict.nav.exhibitors}</p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.exhibitors.title}</h1>
      <p className="mt-5 max-w-xl text-limestone/75">{dict.exhibitors.lead}</p>

      <nav className="mt-10 flex gap-2 overflow-x-auto pb-1" aria-label={dict.material.sector}>
        <Link href={href(c, "exhibitors")} className="chip shrink-0" aria-current={!sector && !mats.length ? "true" : undefined}>
          {dict.exhibitors.all}
        </Link>
        {sectors.map((s) => (
          <Link key={s.id} href={href(c, `exhibitors?sector=${s.id}`)} className="chip shrink-0" aria-current={sector === s.id ? "true" : undefined}>
            <span className="size-2 rounded-full" style={{ background: s.accent }} />
            {t(s.short, locale)}
          </Link>
        ))}
      </nav>
      {mats.length > 0 && (
        <p className="mt-4 text-sm text-fog">
          {dict.exhibitors.materials}: <span className="text-limestone">{mats.map((m) => t(materialBySlug(m)!.name, locale)).join(" · ")}</span>
        </p>
      )}

      {list.length ? (
        <ul className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <li key={e.slug}>
              <ExhibitorCard exhibitor={e} ctx={c} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-16 text-fog">{dict.exhibitors.empty}</p>
      )}
      <p className="mt-10 max-w-xl text-xs text-fog">{dict.exhibitors.sampleNote}</p>
      <ContextualCTA context="exhibitors" sector={sector ?? undefined} />
    </div>
  );
}
