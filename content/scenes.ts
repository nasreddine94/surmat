import { applications, type ApplicationId, type SurfaceId } from "./applications";
import type { MediaKey } from "./event-media";

export type Hotspot = { surface: SurfaceId; material: string; /** % of image width / height */ x: number; y: number };
export type Scene = { application: ApplicationId; media: MediaKey; hotspots: Hotspot[] };

/**
 * Interactive spaces for the applications explorer (PRD §12). Each image was generated from the
 * same reference render (one camera, one room layout), so every space shares these surface
 * positions: feature wall at the centre back, counter in front of it, side wall, floor, ceiling.
 * Replace `media` with real project photography and adjust the coordinates — no component changes.
 */
const layout: Record<SurfaceId, { x: number; y: number }> = {
  feature: { x: 50, y: 36 },
  counter: { x: 50, y: 63 },
  wall: { x: 9, y: 42 },
  floor: { x: 74, y: 88 },
  ceiling: { x: 68, y: 6 },
};

const media: Record<ApplicationId, MediaKey> = {
  hospitality: "spHospitality",
  residential: "spResidential",
  commercial: "spCommercial",
  healthcare: "spHealthcare",
  public: "spPublic",
  outdoor: "spOutdoor",
};

const order: SurfaceId[] = ["feature", "counter", "floor", "wall", "ceiling"];

export const scenes: Scene[] = applications.map((a) => ({
  application: a.id,
  media: media[a.id],
  hotspots: order.map((surface) => ({ surface, material: a.surfaces[surface], ...layout[surface] })),
}));

export const sceneFor = (id: ApplicationId) => scenes.find((s) => s.application === id)!;
