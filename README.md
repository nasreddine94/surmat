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
| `/` | PRD §7 order: hero (globe + material orbit), material universe, sector gallery, applications explorer (hotspots), experience, leading exhibitors, four markets, visit / exhibit split, editions |
| `/materials` | Searchable, filterable material library |
| `/materials/{sector}` | District page (e.g. `natural-engineered-stone`) |
| `/materials/{material}` | Indexable material page (e.g. `marble`, `microcement`, `waterproofing`) with material → space transition |
| `/applications`, `/applications/{id}` | The spaces materials end up in, their materials and suppliers |
| `/exhibitors`, `/exhibitors/{slug}` | Showroom-style profiles; filter by `?sector=`, `?material=`, `?materials=a,b` |
| `/experience` | 2.5D exhibition floor (six districts) |
| `/visit` | Visitor registration (`?meeting={exhibitor}` pre-fills a meeting request) |
| `/contact`, `/pro`, `/legal`, `/privacy` | Contact form (topic = CRM lead type), Professional Space announcement, legal notice (`lib/site.ts`), privacy |
| `/exhibit` | 5-step exhibitor application with stand-size recommendation (`?sector=`, `?stand=` pre-fill), then the four markets and ways to take part |

## Design system (PRD §22–35)

Tokens live in `app/globals.css` (`--surmat-*` and the Tailwind theme): ink / charcoal / graphite, warm white, mist,
gold and the mineral range; radii 2 / 4 / 8 px; 1440 px container. Cormorant Garamond for display, Plus Jakarta Sans for
UI (Archivo only for the SURMAT wordmark). Utilities: `glass`, `glass-header(-solid)`, `shadow-atmos`, `fade-cinematic`,
`overlay-image`, `gradient-mineral`.

## Where things live

- `content/` — sectors, materials, applications, exhibitors. Typed, localised, CMS-shaped. `supabase/migrations/0001_surmat_platform.sql` is the matching database schema.
- `lib/editions.ts` — everything market-specific (city, venue, dates, targets, external registration URLs). Components never hard-code a country.
- `lib/i18n.ts` + `lib/dict/*.ts` — one UI dictionary per language (`en.ts` is the reference shape; TypeScript rejects a missing key). Content strings in `content/` carry all nine languages. Arabic switches `dir="rtl"` with IBM Plex Sans Arabic + Amiri; Chinese and Hindi use the platform's CJK / Devanagari fonts (no extra download).
- `components/home/*` — homepage sections (material universe, sector gallery, applications explorer, experience, leading exhibitors, conversion split, editions). The applications explorer (`components/space-explorer.tsx`, on the home, applications and application pages) shows six generated spaces — hotel lobby, villa, showroom, clinic, public hall, terrace — all generated from one reference render, so they share the hotspot layout in `content/scenes.ts`. Swap in real project photography by changing `media` and the coordinates.
- `lib/attribution.ts` + `app/api/leads` — first-touch UTM / landing page on every lead, PRD lead types, rate limiting (`lib/rate-limit.ts`); run `supabase/migrations/0002_crm_fields.sql` for the new columns and exhibitor status.
- `components/json-ld.tsx` — Organization, ExhibitionEvent (once `startsOn` is set) and BreadcrumbList structured data.
- `components/why-exhibit.tsx` — the exhibitor case: four markets with outline maps (`lib/outlines.ts`), what exhibitors get, audience and ways to take part.
- `lib/textures.ts` — procedural, tileable material textures (marble, travertine, zellige, terrazzo, microcement, acoustic slats…). They are the default visuals for every material; add `hero_image_path` photography per material in the CMS to replace them.
- `lib/search.ts` — multilingual concept search ("marble hotel floor" → stone materials, hospitality, matching exhibitors).
- `lib/analytics.ts` — funnel events (`material_view`, `material_expand`, `exhibit_cta_click`, `application_completed`…) to `dataLayer` and `/api/events`.
- `lib/textures.ts` → `pbr` + `reliefMaps()` — per-material physical response (roughness, clearcoat, metalness, anisotropy, transmission/IOR for onyx and glass, emissive for kilns, real-world tile scale) and generated normal + roughness maps, so every surface has relief and correct gloss.
- `lib/three-pbr.tsx` — turns those into `MeshPhysicalMaterial` props and tiles them at true scale.
- `components/hero/orbit-scene.tsx` — the Material Universe: bevelled, thick samples on three tilted rings around the globe, studio reflections (local Lightformers, no HDR download), cursor-driven key light, autofocus depth of field, bloom, AgX tone mapping, film grain. Search reorganises the rings; selection brings a sample forward and focuses on it.
- `components/hero/earth.tsx` — the globe at the centre of the universe: NASA Blue Marble imagery, relief, clouds and an atmosphere halo (textures in `public/earth/`), graded down to a dim, desaturated backdrop (`SATURATION` / `EXPOSURE`). Africa always faces the viewer; the globe leans at most 15° towards the cursor or a drag and never spins. The outline of Africa is traced in light (`lib/africa.ts`, merged from Natural Earth 1:50m countries).
- The hero loads WebGL only on capable desktop GPUs without reduced motion, renders only while on screen, and drops to lower quality automatically if frame rate falls. It boots after the page has loaded, paces frames to 30 fps at rest (up to 60 fps for a few seconds after any input, never more on 120 Hz screens), caps pixel density at 1.5, uses SMAA instead of MSAA, runs depth of field at half resolution, and replaces real transmission (which re-renders the scene every frame) with a self-glow on onyx and glass. Phones and reduced-motion users get the static hero.
- `content/event-media.ts` + `components/event-image.tsx` — the event imagery (show floor, B2B networking, conferences, demonstrations, stands, Oran and Dakar, one image per exhibition district). They are AI visualisations served through `next/image` (AVIF/WebP) and carry a small "Visualisation" label; swap each `src` for real photography of past editions and set `visual: false`.
- `content/families.ts` — the full exhibition scope: 84 product families in nine districts (the six sectors plus facades & envelope, doors/windows/glass, bathroom/kitchen/fit-out), each with its image and exhibitor pitch. `components/home/scope-section.tsx` presents them as an interactive district explorer (home, materials, exhibit and experience pages).
- `content/systems.ts` + `components/systems-explorer.tsx` / `system-section.tsx` — "How it's built": eight systems (ventilated facade, ETICS, wet areas, floors, drywall, flat roofs, ceramic line, stone processing), each an on-site render beside a technical section drawn in SVG from data (hatched layers, numbered leaders, thickness / class / EN standard, and the exhibition district for each product). Shown on the home, materials, exhibit and sector pages (`systemsForSector`). Specifications are typical values — have them checked by the technical team.
- `components/exhibition-plan.tsx` — the top-down floor plan (entrance, registration, conference hall, B2B lounge, demo stage, national pavilions, districts A–I with numbered stands). Used on the home page and, with the stand inspector (`components/floor-map.tsx`), on the experience page. Adjust `blocks` when the real hall layout is confirmed.
- `components/event-band.tsx` / `components/page-banner.tsx` — the event on every page: a photo banner under each page title and a band with the four event pillars, venue, dates and the two CTAs.
- `components/contextual-cta.tsx` — the "Exhibit this product" CTA that follows the visitor with the current sector's pitch.

- `proxy.ts` — every page lives under `/{edition}/{locale}`. Visitors arriving without an edition go to SURMAT Senegal from West Africa (ECOWAS + Mauritania, via Vercel's `x-vercel-ip-country`) and to SURMAT Algeria from everywhere else; the header shows both editions side by side and a visitor's choice is remembered in a cookie.
- `app/[edition]/[locale]/partners` — the partnership / franchise offer (licensed edition, co-organised edition, agent & national pavilion) with an application form that creates a `partner` lead.

## Before launch

- **Exhibitors are sample profiles** (fictional names, clearly labelled, `noindex`, excluded from the sitemap). Replace with real exhibitors.
- **Algeria's venue** is the Mohammed Ben Ahmed Convention Centre (CCO), Oran. **Dates** and Senegal's venue are `null` in `lib/editions.ts` and show "to be announced". Senegal's targets (300+ / 12,000+) are placeholders; Algeria's follow the design (500+ / 20,000+).
- Have native speakers review every language (Arabic, French, Spanish, Portuguese, Italian, Turkish, Chinese, Hindi).
- Confirm the exhibitor offer matches what SURMAT will actually provide: national pavilions, pre-booked B2B meetings, conference and live-demonstration programme, sponsorship and digital showroom (`why` in `lib/dict/*.ts`).
- Check the market figures before publishing (Algeria ≈47 M people, Africa >1.4 bn, AfCFTA 54 countries, ECOWAS 15 / WAEMU 8, urban population nearly doubling by 2050) and set `contactEmail` per edition to show the sales-team button.
- Fill in `lib/site.ts` (publisher details for the legal notice, social links) and `contactEmail` per edition.
- Replace the AI event visualisations (`content/event-media.ts`) with real photography; they are hosted on the Higgsfield CDN — copy them into `public/images/event/` for full control.
- Replace the six application scenes (`spHospitality`… in `content/event-media.ts`) with real project photography and re-check the hotspot coordinates in `content/scenes.ts`.
- Connect Supabase (apply both migrations) or set `registrationUrl` / `exhibitionUrl` per edition to hand off to existing event systems.
