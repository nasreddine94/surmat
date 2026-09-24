import { NextResponse } from "next/server";

const emailOk = (s: unknown) => typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length < 200;
const str = (s: unknown, max = 500) => (typeof s === "string" ? s.slice(0, max) : null);
const MAX_BODY = 32_000;

/**
 * Exhibitor applications and visitor registrations.
 * Writes to Supabase (`leads` table, see supabase/migrations) when
 * SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set; otherwise logs so the
 * flow works in development.
 */
export async function POST(req: Request) {
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

  const type = body.type === "exhibitor" || body.type === "visitor" ? body.type : null;
  if (!type) return NextResponse.json({ error: "Unknown lead type" }, { status: 400 });
  if (!emailOk(body.email)) return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  if (!str(body.name) || (str(body.name) ?? "").trim().length < 2) return NextResponse.json({ error: "Name required" }, { status: 422 });
  if (body.edition !== "dz" && body.edition !== "sn") return NextResponse.json({ error: "Unknown edition" }, { status: 422 });

  const row = {
    type,
    edition: body.edition,
    locale: str(body.locale, 5),
    email: (body.email as string).toLowerCase(),
    name: str(body.name, 200),
    company: str(body.company, 200),
    phone: str(body.phone, 50),
    country: str(body.country, 10),
    consent: body.consent === true,
    payload: { ...body, hp: undefined },
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
