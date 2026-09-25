/**
 * Funnel analytics: material interaction → product → exhibitor → exhibit CTA → application.
 * Events go to `window.dataLayer` (GTM / GA4 / Plausible bridges read it) and to
 * `/api/events` via sendBeacon so SURMAT keeps its own first-party market data.
 */
export const analyticsEvents = [
  "material_view",
  "material_hover",
  "material_expand",
  "material_select",
  "scope_district",
  "system_view",
  "material_filter",
  "application_view",
  "application_hotspot_select",
  "surface_select",
  "exhibitor_view",
  "exhibit_cta_click",
  "visit_cta_click",
  "application_started",
  "application_step",
  "application_completed",
  "registration_started",
  "registration_completed",
  "country_switch",
  "language_switch",
  "meeting_request",
  "search",
  "search_open",
  "search_submit",
  "contact_submitted",
  "space_built",
] as const;
export type AnalyticsEvent = (typeof analyticsEvents)[number];

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  const [, edition, locale] = window.location.pathname.split("/");
  const payload = { event, edition, locale, path: window.location.pathname, ts: Date.now(), ...props };
  (window.dataLayer ??= []).push(payload);
  try {
    navigator.sendBeacon?.("/api/events", JSON.stringify(payload));
  } catch {
    /* analytics must never break the page */
  }
}
