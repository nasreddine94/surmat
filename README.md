# SURMAT — Digital Experience Platform

The international exhibition for surface materials & building finishing products.
One codebase for **SURMAT Algeria** and **SURMAT Senegal**, in **nine languages**: English, French, Arabic (RTL), Spanish, Portuguese, Italian, Turkish, Chinese (Simplified) and Hindi.

The site sells the event to exhibitors — four markets in one stand: Algeria, Senegal, Africa and the world — and doubles as a
year-round material library. Every screen leads from **market → material → exhibitor → "Exhibit at SURMAT" / "Register to visit"**.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /dz/{your language}
npm run build        # ~1,200 statically generated pages
```

Optional environment (`.env.local`):

```
NEXT_PUBLIC_SITE_URL=https://surmat.example   # canonical URLs, sitemap, hreflang
SUPABASE_URL=...                               # leads + analytics storage
SUPABASE_SERVICE_ROLE_KEY=...                  # server-only; never expose to the client
```

Without Supabase, form submissions are validated and logged to the server console so the flows can be tested.

## Routes

`/{edition}/{locale}/…` — `edition` ∈ `dz | sn`, `locale` ∈ `en | fr | ar | es | pt | it | tr | zh | hi`. `proxy.ts` redirects any other path
using the `surmat_edition` / `surmat_locale` cookies, then `Accept-Language`.

| Path | What it is |
| --- | --- |
| `/` | Material Universe hero (WebGL globe + orbit search), why exhibit (four markets), what exhibitors get, sectors, who you meet / ways to take part, applications, industry, editions, visit/exhibit |
| `/materials` | Searchable, filterable material library |
| `/materials/{sector}` | District page (e.g. `natural-engineered-stone`) |
| `/materials/{material}` | Indexable material page (e.g. `marble`, `microcement`, `waterproofing`) with material → space transition |
| `/applications`, `/applications/{id}` | The spaces materials end up in, their materials and suppliers |
| `/exhibitors`, `/exhibitors/{slug}` | Showroom-style profiles; filter by `?sector=`, `?material=`, `?materials=a,b` |
| `/experience` | 2.5D exhibition floor (six districts) |
| `/visit` | Visitor registration (`?meeting={exhibitor}` pre-fills a meeting request) |
| `/exhibit` | 5-step exhibitor application with stand-size recommendation (`?sector=`, `?stand=` pre-fill), then the four markets and ways to take part |

## Where things live

- `content/` — sectors, materials, applications, exhibitors. Typed, localised, CMS-shaped. `supabase/migrations/0001_surmat_platform.sql` is the matching database schema.
- `lib/editions.ts` — everything market-specific (city, venue, dates, targets, external registration URLs). Components never hard-code a country.
- `lib/i18n.ts` + `lib/dict/*.ts` — one UI dictionary per language (`en.ts` is the reference shape; TypeScript rejects a missing key). Content strings in `content/` carry all nine languages. Arabic switches `dir="rtl"` with IBM Plex Sans Arabic + Amiri; Chinese and Hindi use the platform's CJK / Devanagari fonts (no extra download).
- `components/why-exhibit.tsx` — the exhibitor case: four markets with outline maps (`lib/outlines.ts`), what exhibitors get, audience and ways to take part.
- `lib/textures.ts` — procedural, tileable material textures (marble, travertine, zellige, terrazzo, microcement, acoustic slats…). They are the default visuals for every material; add `hero_image_path` photography per material in the CMS to replace them.
- `lib/search.ts` — multilingual concept search ("marble hotel floor" → stone materials, hospitality, matching exhibitors).
- `lib/analytics.ts` — funnel events (`material_view`, `material_expand`, `exhibit_cta_click`, `application_completed`…) to `dataLayer` and `/api/events`.
- `lib/textures.ts` → `pbr` + `reliefMaps()` — per-material physical response (roughness, clearcoat, metalness, anisotropy, transmission/IOR for onyx and glass, emissive for kilns, real-world tile scale) and generated normal + roughness maps, so every surface has relief and correct gloss.
- `lib/three-pbr.tsx` — turns those into `MeshPhysicalMaterial` props and tiles them at true scale.
- `components/hero/orbit-scene.tsx` — the Material Universe: bevelled, thick samples on three tilted rings around the globe, studio reflections (local Lightformers, no HDR download), cursor-driven key light, autofocus depth of field, bloom, AgX tone mapping, film grain. Search reorganises the rings; selection brings a sample forward and focuses on it.
- `components/hero/earth.tsx` — the globe at the centre of the universe: NASA Blue Marble imagery, relief, clouds and an atmosphere halo (textures in `public/earth/`), graded down to a dim, desaturated backdrop (`SATURATION` / `EXPOSURE`). Africa always faces the viewer; the globe leans at most 15° towards the cursor or a drag and never spins. The outline of Africa is traced in light (`lib/africa.ts`, merged from Natural Earth 1:50m countries).
- The hero loads WebGL only on capable desktop GPUs without reduced motion, renders only while on screen, and drops to lower quality automatically if frame rate falls. Phones and reduced-motion users get the static hero.
- `components/contextual-cta.tsx` — the "Exhibit this product" CTA that follows the visitor with the current sector's pitch.

## Before launch

- **Exhibitors are sample profiles** (fictional names, clearly labelled, `noindex`, excluded from the sitemap). Replace with real exhibitors.
- **Venue and dates** are `null` in `lib/editions.ts` and show "to be announced". Senegal's targets (300+ / 12,000+) are placeholders; Algeria's follow the design (500+ / 20,000+).
- Have native speakers review every language (Arabic, French, Spanish, Portuguese, Italian, Turkish, Chinese, Hindi).
- Confirm the exhibitor offer matches what SURMAT will actually provide: national pavilions, pre-booked B2B meetings, conference and live-demonstration programme, sponsorship and digital showroom (`why` in `lib/dict/*.ts`).
- Check the market figures before publishing (Algeria ≈47 M people, Africa >1.4 bn, AfCFTA 54 countries, ECOWAS 15 / WAEMU 8, urban population nearly doubling by 2050) and set `contactEmail` per edition to show the sales-team button.
- Connect Supabase (apply the migration) or set `registrationUrl` / `exhibitionUrl` per edition to hand off to existing event systems.
