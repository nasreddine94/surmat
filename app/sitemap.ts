import type { MetadataRoute } from "next";
import { allCtx, href } from "@/lib/routing";
import { sectors } from "@/content/sectors";
import { materials } from "@/content/materials";
import { applications } from "@/content/applications";
import { exhibitors } from "@/content/exhibitors";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Every material, sector, application and (non-sample) exhibitor gets an indexable URL per edition and language. */
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
  return allCtx().flatMap((c) => paths.map((p) => ({ url: `${base}${href(c, p)}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })));
}
