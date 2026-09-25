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
