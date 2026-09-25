import type { ApplicationId, SurfaceId } from "./applications";

export type Hotspot = { surface: SurfaceId; material: string; /** % of image width / height */ x: number; y: number };
export type Scene = { application: ApplicationId; image: string; width: number; height: number; hotspots: Hotspot[] };

/**
 * The interactive canvas of the home "Materials for every space" explorer (PRD §12).
 * The image is a still of the SURMAT lobby model; hotspot positions are its surfaces
 * projected through the render camera. Replace `image` and the coordinates with real
 * project photography as it becomes available — no component changes needed.
 */
export const explorerScene: Scene = {
  application: "hospitality",
  image: "/images/applications/hospitality-lobby.webp",
  width: 1600,
  height: 896,
  hotspots: [
    { surface: "feature", material: "marble", x: 50, y: 40 },
    { surface: "counter", material: "onyx", x: 50, y: 64 },
    { surface: "floor", material: "porcelain", x: 77, y: 86 },
    { surface: "wall", material: "travertine", x: 30, y: 40 },
    { surface: "ceiling", material: "acoustic-panels", x: 70, y: 7 },
  ],
};
