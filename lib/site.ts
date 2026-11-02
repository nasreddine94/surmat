/**
 * Organisation-wide settings shared by both editions. Edition-specific values live in
 * lib/editions.ts. Links left null are simply not rendered.
 */
export const site = {
  social: {
    linkedin: null as string | null,
    instagram: null as string | null,
    youtube: null as string | null,
  },
  /** Legal publisher shown on the legal notice page; fill in before launch. */
  organiser: {
    name: null as string | null,
    address: null as string | null,
    registration: null as string | null,
    email: null as string | null,
  },
};

/** Canonical origin for canonicals, hreflang, sitemap and JSON-LD. NEXT_PUBLIC_SITE_URL overrides it (e.g. a preview). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.surmatexpo.com").replace(/\/$/, "");

/**
 * Adjacent districts that overlap a partner event's niches (doors, windows, PVC joinery, facades,
 * kitchens, bathrooms). They are hidden from the site while the partnership is sensitive; the
 * content stays in the repo. Show them again by setting NEXT_PUBLIC_HIDDEN_GROUPS to an empty
 * value (or a comma list of the ids to keep hidden) and redeploying. Core sectors are never hidden.
 */
const ADJACENT_GROUPS = ["facades-envelope", "joinery-glazing", "bath-kitchen"];
export const hiddenGroups: string[] = (process.env.NEXT_PUBLIC_HIDDEN_GROUPS ?? ADJACENT_GROUPS.join(","))
  .split(",")
  .map((g) => g.trim())
  .filter((g) => ADJACENT_GROUPS.includes(g));
/** Districts on the floor: the six core sectors plus whichever adjacent groups are not hidden. */
export const districtCount = 6 + ADJACENT_GROUPS.length - hiddenGroups.length;
