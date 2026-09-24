"use client";

import dynamic from "next/dynamic";
import { RoomScene, type SurfaceSpec } from "./room-scene";
import { useCan3D } from "@/lib/capability";
import type { SurfaceId } from "@/content/applications";

type Props = {
  surfaces: Record<SurfaceId, SurfaceSpec>;
  light?: string;
  active?: SurfaceId | null;
  onSelect?: (s: SurfaceId) => void;
  className?: string;
  label: string;
  surfaceNames?: Record<SurfaceId, string>;
};

const Room3D = dynamic(() => import("./room-3d"), { ssr: false });

/**
 * A space that materials become. Real-time WebGL interior on capable devices;
 * the CSS-3D room on phones, reduced motion and as the server-rendered first paint.
 */
export function Room(props: Props) {
  const can3D = useCan3D();
  return can3D ? <Room3D {...props} /> : <RoomScene {...props} />;
}
