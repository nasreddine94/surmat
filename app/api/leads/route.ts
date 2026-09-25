import { NextResponse } from "next/server";
import { rateLimited } from "@/lib/rate-limit";

const emailOk = (s: unknown) => typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length < 200;
const str = (s: unknown, max = 500) => (typeof s === "string" && s.trim() ? s.slice(0, max) : null);
const MAX_BODY = 32_000;

/** PRD §55 lead types. */
const LEAD_TYPES = ["visitor", "exhibitor", "buyer", "partner", "media", "speaker", "other"] as const;
type LeadType = (typeof LEAD_TYPES)[number];

/**
 * Every website form: visitor registration, exhibitor application, contact.
 * Writes one row to Supabase `leads` (see supabase/migrations) when SUPABASE_URL +
 * SUPABASE_SERVICE_ROLE_KEY are set; otherwise logs so the flows work in development.
 */
export async function POST(req: Request) {
  if (rateLimited(req, "leads", 8, 10 * 60_000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const text = await req.text();
  if (text.length > MAX_BODY) return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body))
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  // Honeypot: bots fill hidden fields. Pretend success.
  if (body.hp) return NextResponse.json({ ok: true });

  const type = (LEAD_TYPES as readonly unknown[]).includes(body.type) ? (body.type as LeadType) : null;
  if (!type) return NextResponse.json({ error: "Unknown lead type" }, { status: 400 });
  if (!emailOk(body.email)) return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  if ((str(body.name) ?? "").trim().length < 2) return NextResponse.json({ error: "Name required" }, { status: 422 });
  if (body.edition !== "dz" && body.edition !== "sn") return NextResponse.json({ error: "Unknown edition" }, { status: 422 });

  const a = typeof body.attribution === "object" && body.attribution !== null ? (body.attribution as Record<string, unknown>) : {};
  const sectors = Array.isArray(body.sectors) ? body.sectors.filter((x): x is string => typeof x === "string") : [];

  const row = {
    type,
    edition: body.edition,
    locale: str(body.locale, 5),
    email: (body.email as string).toLowerCase(),
    name: str(body.name, 200),
    company: str(body.company, 200),
    job_title: str(body.role, 120),
    phone: str(body.phone, 50),
    country: str(body.country, 10),
    sector: str(body.sector, 60) ?? sectors[0] ?? null,
    source: str(a.utm_source, 120) ?? (str(a.referrer, 300) ? "referral" : "direct"),
    campaign: str(a.utm_campaign, 120),
    landing_page: str(a.landing_page, 300),
    utm: {
      source: str(a.utm_source, 120),
      medium: str(a.utm_medium, 120),
      campaign: str(a.utm_campaign, 120),
      term: str(a.utm_term, 120),
      content: str(a.utm_content, 120),
      referrer: str(a.referrer, 300),
    },
    consent: body.consent === true,
    payload: { ...body, hp: undefined, attribution: undefined },
  };

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    const res = await fetch(`${url}/rest/v1/leads`, {
      method: "POST",
      headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", prefer: "return=minimal" },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      console.error("[leads] supabase insert failed", res.status, await res.text());
      return NextResponse.json({ error: "Storage failed" }, { status: 502 });
    }
  } else {
    console.info("[leads] (no Supabase configured)", JSON.stringify({ ...row, payload: undefined }));
  }

  return NextResponse.json({ ok: true });
}
