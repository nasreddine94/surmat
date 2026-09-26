import type { MetadataRoute } from "next";
import { alternates, allCtx, href } from "@/lib/routing";
import { sectors } from "@/content/sectors";
import { materials } from "@/content/materials";
import { applications } from "@/content/applications";
import { exhibitors } from "@/content/exhibitors";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
/** Set at build time, so crawlers see when the content last changed. */
const lastModified = new Date();

const PRIORITY: Record<string, number> = { "": 1, materials: 0.9, exhibit: 0.9, visit: 0.9, applications: 0.8, exhibitors: 0.8, experience: 0.8 };

/**
 * Every material, sector, application and (non-sample) exhibitor gets an indexable URL per edition
 * and language, each listing its language alternates (hreflang) so engines serve the right one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "materials",
    "applications",
    "exhibitors",
    "experience",
    "visit",
    "exhibit",
    "contact",
    "partners",
    "board",
    "legal",
    "privacy",
    ...sectors.map((s) => `materials/${s.id}`),
    ...materials.map((m) => `materials/${m.slug}`),
    ...applications.map((a) => `applications/${a.id}`),
    ...exhibitors.filter((e) => !e.sample).map((e) => `exhibitors/${e.slug}`),
  ];
  return allCtx().flatMap((c) =>
    paths.map((p) => {
      const { languages } = alternates(c, p);
      return {
        url: `${base}${href(c, p)}`,
        lastModified,
        changeFrequency: p === "legal" || p === "privacy" ? ("yearly" as const) : ("weekly" as const),
        priority: PRIORITY[p] ?? (p.startsWith("materials/") ? 0.7 : 0.6),
        alternates: { languages: Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, `${base}${v}`])) },
      };
    }),
  );
}
