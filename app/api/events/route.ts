/**
 * First-party analytics sink for the material → exhibitor funnel.
 * Forwards to Supabase `events` when configured; otherwise accepts and drops.
 */
export async function POST(req: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return new Response(null, { status: 204 });
  try {
    const e = JSON.parse(await req.text());
    if (typeof e?.event !== "string") return new Response(null, { status: 400 });
    await fetch(`${url}/rest/v1/events`, {
      method: "POST",
      headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", prefer: "return=minimal" },
      body: JSON.stringify({ event: e.event.slice(0, 64), edition: e.edition, locale: e.locale, path: e.path, props: e }),
    });
  } catch {
    /* never fail the beacon */
  }
  return new Response(null, { status: 204 });
}
