/**
 * Best-effort, per-instance sliding-window limiter for public form endpoints (PRD §71).
 * It stops a single client hammering one server instance; on multi-instance hosting,
 * pair it with the platform's firewall / rate-limit rules for a global limit.
 */
const hits = new Map<string, number[]>();

const clientIp = (req: Request) =>
  req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

export function rateLimited(req: Request, bucket: string, limit: number, windowMs: number) {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  // Keep the map from growing without bound.
  if (hits.size > 5_000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return recent.length > limit;
}
