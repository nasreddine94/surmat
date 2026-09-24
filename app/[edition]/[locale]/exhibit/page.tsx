import type { Metadata } from "next";
import { ExhibitFlow } from "@/components/exhibit-flow";
import { Check } from "@/components/icons";
import { sectorById, type SectorId } from "@/content/sectors";
import { alternates, resolve } from "@/lib/routing";
import { t } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/exhibit">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.exhibit.title, description: dict.exhibit.lead, alternates: alternates({ edition, locale }, "exhibit") };
}

export default async function ExhibitPage({ params, searchParams }: PageProps<"/[edition]/[locale]/exhibit">) {
  const { locale, dict, ed } = await resolve(params);
  const sp = await searchParams;
  const sector = typeof sp.sector === "string" && sectorById(sp.sector) ? (sp.sector as SectorId) : null;
  const stand = typeof sp.stand === "string" && /^[A-F]-\d{2}$/.test(sp.stand) ? sp.stand : null;
  const s = sector ? sectorById(sector) : null;

  return (
    <div className="shell grid gap-12 pt-32 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
      <div>
        <p className="eyebrow">{t(ed.name, locale)}</p>
        <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.exhibit.title}</h1>
        <p className="display mt-4 text-2xl text-travertine">{dict.exhibit.lead}</p>
        {s && <p className="mt-6 max-w-sm text-limestone/80">{t(s.pitch, locale)}</p>}
        <ul className="mt-10 space-y-4 text-sm text-limestone/80">
          {dict.exhibit.why.map((w) => (
            <li key={w} className="flex gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-travertine" />
              {w}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {ed.exhibitionUrl ? (
          <a href={ed.exhibitionUrl} className="btn btn-solid">
            {dict.exhibit.submit}
          </a>
        ) : (
          <ExhibitFlow initialSector={sector} stand={stand} />
        )}
      </div>
    </div>
  );
}
