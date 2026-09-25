import { analyticsEvents } from "@/lib/analytics";
import { isEdition } from "@/lib/editions";
import { isLocale } from "@/lib/i18n";
import { rateLimited } from "@/lib/rate-limit";

const MAX_BODY = 4_000;
const MAX_PROPS = 20;

/** Keep only short primitive props so a public endpoint can't bloat the table. */
function cleanProps(e: Record<string, unknown>) {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(e).slice(0, MAX_PROPS)) {
    if (k.length > 40) continue;
    if (typeof v === "string") out[k] = v.slice(0, 200);
    else if ((typeof v === "number" && Number.isFinite(v)) || typeof v === "boolean") out[k] = v;
  }
  return out;
}

/**
 * First-party analytics sink for the material → exhibitor funnel.
 * Forwards to Supabase `events` when configured; otherwise accepts and drops.
 */
export async function POST(req: Request) {
  if (rateLimited(req, "events", 240, 60_000)) return new Response(null, { status: 429 });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return new Response(null, { status: 204 });
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return new Response(null, { status: 413 });
    const e = JSON.parse(text);
    if (typeof e !== "object" || e === null || !(analyticsEvents as readonly unknown[]).includes(e.event))
      return new Response(null, { status: 400 });
    await fetch(`${url}/rest/v1/events`, {
      method: "POST",
      headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", prefer: "return=minimal" },
      body: JSON.stringify({
        event: e.event,
        edition: typeof e.edition === "string" && isEdition(e.edition) ? e.edition : null,
        locale: typeof e.locale === "string" && isLocale(e.locale) ? e.locale : null,
        path: typeof e.path === "string" ? e.path.slice(0, 300) : null,
        props: cleanProps(e),
      }),
    });
  } catch {
    /* never fail the beacon */
  }
  return new Response(null, { status: 204 });
}
