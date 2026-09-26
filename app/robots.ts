import type { MetadataRoute } from "next";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Search engines and AI answer engines are welcome (SEO / AEO / GEO): being read and cited is the
 * point of the material library. APIs and the private professional area stay out of the index.
 */
const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", // OpenAI
  "ClaudeBot", "Claude-SearchBot", "Claude-User", // Anthropic
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot", "Amazonbot", "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/*/*/pro"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: AI_CRAWLERS, allow: "/", disallow },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
