"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { pbr, reliefMaps, texTone, type TexKind } from "./textures";
import { enqueue } from "./idle";

export type PBRMaps = { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };

const cache = new Map<string, PBRMaps>();

function build(tex: TexKind, seed: number, size: number): PBRMaps {
  const key = `${tex}:${seed}:${size}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const r = reliefMaps(tex, size, seed);
  const mk = (c: HTMLCanvasElement, srgb: boolean) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    return t;
  };
  const maps = { map: mk(r.color, true), normalMap: mk(r.normal, false), roughnessMap: mk(r.rough, false) };
  cache.set(key, maps);
  return maps;
}

/** Colour, normal and roughness maps for a material, generated off the critical path. */
export function usePBRMaps(tex: TexKind, seed: number, size = 384, priority = false) {
  const key = `${tex}:${seed}:${size}`;
  const [loaded, setLoaded] = useState<{ key: string; maps: PBRMaps } | null>(null);
  useEffect(() => {
    if (cache.has(key)) return;
    let live = true;
    enqueue(() => {
      if (!live) return;
      const maps = build(tex, seed, size);
      setLoaded({ key, maps });
    }, priority);
    return () => void (live = false);
  }, [key, tex, seed, size, priority]);
  return cache.get(key) ?? (loaded?.key === key ? loaded.maps : null);
}

/** The same maps, repeated to cover `w × h` metres at the material's real-world scale. */
export function useTiledMaps(maps: PBRMaps | null, tex: TexKind, w: number, h: number) {
  return useMemo(() => {
    if (!maps) return null;
    const world = pbr[tex].world;
    const rep = (t: THREE.Texture) => {
      const c = t.clone(); // shares the uploaded image source
      c.repeat.set(w / world, h / world);
      c.needsUpdate = true;
      return c;
    };
    return { map: rep(maps.map), normalMap: rep(maps.normalMap), roughnessMap: rep(maps.roughnessMap) };
  }, [maps, tex, w, h]);
}

/** Physically based parameters for `<meshPhysicalMaterial>`. */
export function physicalProps(tex: TexKind, maps: PBRMaps | null) {
  const p = pbr[tex];
  const base = {
    color: maps ? "#ffffff" : texTone[tex],
    roughness: maps ? 1 : p.roughness, // roughnessMap carries the value
    metalness: p.metalness ?? 0,
    clearcoat: p.clearcoat ?? 0,
    clearcoatRoughness: p.clearcoatRoughness ?? 0.1,
    sheen: p.sheen ?? 0,
    sheenRoughness: 0.6,
    anisotropy: p.anisotropy ?? 0,
    envMapIntensity: 1,
    normalScale: new THREE.Vector2(1, 1),
  };
  const glass = p.transmission
    ? {
        transmission: p.transmission,
        ior: p.ior ?? 1.5,
        thickness: p.thickness ?? 0.2,
        attenuationColor: p.attenuation ?? "#ffffff",
        attenuationDistance: 0.6,
      }
    : {};
  const glow = p.emissive && maps ? { emissive: "#ffffff", emissiveMap: maps.map, emissiveIntensity: p.emissive } : {};
  return { ...base, ...glass, ...glow, ...(maps ?? {}) };
}

/** Stable key so a material recompiles when maps arrive (new shader defines). */
export const matKey = (tex: TexKind, maps: PBRMaps | null) => `${tex}-${maps ? "pbr" : "tone"}`;
