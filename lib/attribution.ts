/**
 * First-touch attribution (PRD §55): UTM parameters, landing page and referrer are captured
 * on the first page of a visit and sent with every form, so a lead keeps its campaign even
 * after the visitor browses a dozen pages.
 */
export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
};

const KEY = "surmat_attribution";
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const fresh = UTM.some((k) => params.get(k));
    if (sessionStorage.getItem(KEY) && !fresh) return;
    const a: Attribution = { landing_page: window.location.pathname + window.location.search };
    for (const k of UTM) {
      const v = params.get(k);
      if (v) a[k] = v.slice(0, 120);
    }
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) a.referrer = document.referrer.slice(0, 300);
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* storage unavailable: attribution is best-effort */
  }
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}
