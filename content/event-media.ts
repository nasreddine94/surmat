/**
 * Event imagery (visualisations generated with Higgsfield), self-hosted in /public/media as WebP
 * so the site never depends on an external CDN. Served through next/image, which resizes and
 * converts them (AVIF / WebP) per screen. Replace `src` with real photography of the
 * editions as it becomes available; `visual: true` shows a small "Visualisation" label so these
 * are never mistaken for photos of a past edition.
 */
export type Media = { src: string; width: number; height: number; visual: boolean };

const img = (name: string, width: number, height: number): Media => ({ src: `/media/${name}.webp`, width, height, visual: true });

export const media = {
  hall: img("hall", 1344, 752),
  networking: img("networking", 1168, 880),
  conference: img("conference", 1344, 752),
  demo: img("demo", 1168, 880),
  stand: img("stand", 896, 1120),
  entrance: img("entrance", 1344, 752),
  oran: img("oran", 1344, 752),
  dakar: img("dakar", 1344, 752),
  lobby: img("lobby", 1344, 752),
  facade: img("facade", 1168, 880),
  library: img("library", 1344, 752),
  aerial: img("aerial", 1344, 752),
  // Exhibition scope — one per product group.
  gCeramic: img("gCeramic", 1168, 880),
  gStone: img("gStone", 1168, 880),
  gPaint: img("gPaint", 1168, 880),
  gInterior: img("gInterior", 1168, 880),
  gChemicals: img("gChemicals", 1168, 880),
  gMachinery: img("gMachinery", 1168, 880),
  gJoinery: img("gJoinery", 1168, 880),
  gBath: img("gBath", 1168, 880),
  samples: img("samples", 1344, 752),
  // Application scenes — one per space, same camera as the explorer's hotspot layout.
  spHospitality: img("spHospitality", 1344, 752),
  spResidential: img("spResidential", 1344, 752),
  spCommercial: img("spCommercial", 1344, 752),
  spHealthcare: img("spHealthcare", 1344, 752),
  spPublic: img("spPublic", 1344, 752),
  spOutdoor: img("spOutdoor", 1344, 752),
  // Building systems on site and production lines (paired with the technical sections).
  tFacade: img("tFacade", 1168, 880),
  tEtics: img("tEtics", 1168, 880),
  tWet: img("tWet", 1168, 880),
  tFloor: img("tFloor", 1168, 880),
  tPartition: img("tPartition", 1168, 880),
  tRoof: img("tRoof", 1168, 880),
  tCeramicLine: img("tCeramicLine", 1168, 880),
  tStoneLine: img("tStoneLine", 1168, 880),
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof media;
