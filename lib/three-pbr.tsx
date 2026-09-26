"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { pbr, reliefMaps, texTone, type TexKind } from "./textures";
import { enqueue } from "./idle";
import { requestBitmaps, type Bitmaps } from "./texture-client";

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

/* ---------- textures are generated in parallel in workers (lib/texture-client.ts) ---------- */

const inflight = new Map<string, Promise<PBRMaps>>();

function fromBitmaps(b: Bitmaps): PBRMaps {
  const mk = (img: ImageBitmap, srgb: boolean) => {
    const t = new THREE.Texture(img);
    t.flipY = false; // already flipped in the worker
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.needsUpdate = true;
    return t;
  };
  return { map: mk(b.color, true), normalMap: mk(b.normal, false), roughnessMap: mk(b.rough, false) };
}

const onMainThread = (tex: TexKind, seed: number, size: number, priority: boolean) =>
  new Promise<PBRMaps>((resolve) => enqueue(() => resolve(build(tex, seed, size)), priority));

/** Maps for a material: cached, de-duplicated, and generated in a worker when possible. */
export function requestMaps(tex: TexKind, seed: number, size: number, priority = false): Promise<PBRMaps> {
  const key = `${tex}:${seed}:${size}`;
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  const busy = inflight.get(key);
  if (busy) return busy;
  const job = requestBitmaps(tex, seed, size)
        .then(fromBitmaps)
        .catch(() => onMainThread(tex, seed, size, priority));
  const done = job.then((maps) => {
    cache.set(key, maps);
    inflight.delete(key);
    return maps;
  });
  inflight.set(key, done);
  return done;
}

/**
 * Generate a set of maps ahead of time so a scene can mount with every surface
 * final instead of popping in texture by texture.
 */
export function preloadPBR(specs: { tex: TexKind; seed: number; size: number }[]) {
  const done = Promise.all(specs.map((s) => requestMaps(s.tex, s.seed, s.size, true))).then(() => undefined);
  return { done, cancel: () => undefined };
}

/** Colour, normal and roughness maps for a material, generated off the critical path. */
export function usePBRMaps(tex: TexKind, seed: number, size = 384, priority = false) {
  const key = `${tex}:${seed}:${size}`;
  const [loaded, setLoaded] = useState<{ key: string; maps: PBRMaps } | null>(null);
  useEffect(() => {
    if (cache.has(key)) return;
    let live = true;
    requestMaps(tex, seed, size, priority).then((maps) => live && setLoaded({ key, maps }));
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
export function physicalProps(tex: TexKind, maps: PBRMaps | null, cheapTransmission = false) {
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
  // Real transmission renders the whole scene a second time every frame. In a busy orbit the
  // look of backlit stone or glass is kept with a soft self-glow instead, at no extra pass.
  const glass = p.transmission && cheapTransmission
    ? {
        transparent: p.transmission > 0.6,
        opacity: p.transmission > 0.6 ? 0.55 : 1,
        ...(maps ? { emissive: p.attenuation ?? "#ffffff", emissiveMap: maps.map, emissiveIntensity: p.transmission * 0.9 } : {}),
      }
    : p.transmission
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
