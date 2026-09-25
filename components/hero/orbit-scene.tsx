"use client";
/* eslint-disable react-hooks/refs -- a map of three.js vectors (autofocus targets) are mutated imperatively in the frame loop, which is the intended react-three-fiber pattern. */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Html, Lightformer, PerformanceMonitor, RoundedBox } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Noise, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode, type DepthOfFieldEffect } from "postprocessing";
import * as THREE from "three";
import type { TexKind } from "@/lib/textures";
import { matKey, physicalProps, usePBRMaps } from "@/lib/three-pbr";
import Earth from "./earth";

export type Shape = "tile" | "slab" | "panel" | "plank";
export type OrbitItem = { key: string; slug: string; tex: TexKind; seed: number; shape: Shape; label: string; sub: string };

type Shared = {
  selected: string | null;
  matchIndex: Map<string, number> | null;
  hovered: string | null;
  drag: React.RefObject<{ offset: number; moved: number; tilt: number }>;
  rtl: boolean;
  /** World positions, written by each slab every frame (used for autofocus). */
  positions: Map<string, THREE.Vector3>;
};

/** Real proportions: width, height, thickness (metres ≈ units). */
const DIMS: Record<Shape, [number, number, number]> = {
  tile: [1.1, 1.1, 0.1],
  slab: [1.0, 1.75, 0.13],
  panel: [0.72, 1.9, 0.07],
  plank: [1.7, 0.72, 0.16],
};

/** Three tilted rings around the core. Fronts pass low and close, backs pass high and behind. */
const RINGS = [
  { r: 7.4, count: 15, center: [0, 0, 0], tilt: [0.32, 0, 0.1], speed: 0.07, jr: 0.6, jy: 0.5 },
  { r: 10.6, count: 17, center: [0, 0.6, -2], tilt: [0.22, 0, -0.16], speed: -0.04, jr: 1.1, jy: 1.2 },
  { r: 15, count: 99, center: [0, 1.5, -9], tilt: [0.12, 0, 0.06], speed: 0.022, jr: 2.2, jy: 2.6 },
] as const;

const CAM = new THREE.Vector3(0, 1.3, 17);
const damp = (dt: number, k: number) => 1 - Math.exp(-dt * k);

function Slab({
  item,
  index,
  shared,
  quality,
  onSelect,
  onHover,
}: {
  item: OrbitItem;
  index: number;
  shared: Shared;
  quality: number;
  onSelect: (k: string | null) => void;
  onHover: (k: string | null) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  // Near-ring samples get full-resolution relief; far ones sit in fog and bokeh.
  const maps = usePBRMaps(item.tex, item.seed, quality > 0 && index < RINGS[0].count ? 512 : 256, index < RINGS[0].count);
  const [w, h, d] = DIMS[item.shape];
  const far = index >= RINGS[0].count + RINGS[1].count;
  const props = physicalProps(item.tex, maps, true);
  // Distant samples sit in fog and bokeh: clearcoat, sheen and anisotropy are invisible there.
  if (far) Object.assign(props, { clearcoat: 0, sheen: 0, anisotropy: 0 });

  const orbit = useMemo(() => {
    let i = index, r = 0;
    while (r < RINGS.length - 1 && i >= RINGS[r].count) i -= RINGS[r++].count;
    const ring = RINGS[r];
    const inRing = r < RINGS.length - 1 ? ring.count : 20;
    const rnd = (n: number) => {
      const x = Math.sin(index * 127.1 + n * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    return {
      ring,
      q: new THREE.Quaternion().setFromEuler(new THREE.Euler(...ring.tilt)),
      c: new THREE.Vector3(...ring.center),
      a0: (i / inRing) * Math.PI * 2 + rnd(1) * 0.35,
      rr: ring.r + (rnd(7) - 0.5) * 2 * ring.jr,
      yy: (rnd(8) - 0.5) * 2 * ring.jy,
      tumble: new THREE.Vector3((rnd(3) - 0.5) * 0.25, (rnd(4) - 0.5) * 0.35, (rnd(5) - 0.5) * 0.18),
      base: new THREE.Euler((rnd(3) - 0.5) * 0.7, (rnd(4) - 0.5) * 1.1, (rnd(5) - 0.5) * 0.5),
    };
  }, [index]);

  const v = useMemo(
    () => ({ target: new THREE.Vector3(), world: new THREE.Vector3(), q: new THREE.Quaternion(), e: new THREE.Euler(), m: new THREE.Matrix4(), up: new THREE.Vector3(0, 1, 0), qq: new THREE.Quaternion() }),
    [],
  );

  useFrame(({ clock, camera }, dt) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const { ring, q, c, a0, rr, yy, tumble, base } = orbit;
    const a = a0 + ring.speed * t + (shared.drag.current?.offset ?? 0) * Math.sign(ring.speed);
    v.world.set(rr * Math.cos(a), yy, rr * Math.sin(a)).applyQuaternion(q).add(c);

    const me = shared.selected === item.key;
    const mi = shared.matchIndex?.get(item.key);
    let scale = 1, face = false;

    if (shared.selected) {
      if (me) {
        v.target.set(shared.rtl ? -3.3 : 3.3, 0.35, 9.2);
        scale = 1.45;
        face = true;
      } else {
        v.target.copy(v.world).multiplyScalar(1.12).add({ x: 0, y: 0, z: -3 } as THREE.Vector3);
        scale = 0.85;
      }
    } else if (shared.matchIndex) {
      if (mi !== undefined && mi < 14) {
        const k = Math.min(shared.matchIndex.size, 14);
        if (k === 1) v.target.set(shared.rtl ? -3.6 : 3.6, 0.3, 8.5);
        else {
          const aa = (mi / k) * Math.PI * 2 + t * 0.05 + Math.PI / 2;
          v.target.set(6.4 * Math.cos(aa), 3.3 * Math.sin(aa) + 0.3, 4 + Math.sin(aa) * 1.2);
        }
        scale = k === 1 ? 1.4 : 1.1;
        face = true;
      } else {
        v.target.copy(v.world).multiplyScalar(1.5).add({ x: 0, y: 0, z: -10 } as THREE.Vector3);
        scale = 0.45;
      }
    } else {
      v.target.copy(v.world);
    }
    if (shared.hovered === item.key && !me) scale *= 1.12;

    g.position.lerp(v.target, damp(dt, face ? 3.2 : 2.2));
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, scale, damp(dt, 4)));
    (shared.positions.get(item.key) ?? shared.positions.set(item.key, new THREE.Vector3()).get(item.key)!).copy(g.position);

    // Samples turn towards the viewer and sway, so faces, edges and reflections all read.
    v.m.lookAt(camera.position, g.position, v.up);
    v.q.setFromRotationMatrix(v.m);
    if (face) v.e.set(Math.sin(t * 0.6) * 0.08, Math.sin(t * 0.45) * 0.38 + (me ? (shared.rtl ? 0.25 : -0.25) : 0), 0);
    else
      v.e.set(
        base.x + Math.sin(t * tumble.x * 4 + a0) * 0.35,
        base.y + Math.sin(t * tumble.y * 4 + a0) * 0.5,
        base.z + Math.sin(t * tumble.z * 3) * 0.2,
      );
    v.q.multiply(v.qq.setFromEuler(v.e));
    g.quaternion.slerp(v.q, damp(dt, face ? 3 : 1.4));
  });

  const interactive = (e: ThreeEvent<PointerEvent | MouseEvent>) =>
    !(e.nativeEvent.target as HTMLElement | null)?.closest?.("a, button, input, [data-overlay]");

  return (
    <group ref={ref}>
      <RoundedBox
        args={[w, h, d]}
        radius={Math.min(0.025, d / 3)}
        smoothness={3}
        onPointerOver={(e) => {
          if (!interactive(e)) return;
          e.stopPropagation();
          onHover(item.key);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          if (!interactive(e) || (shared.drag.current?.moved ?? 0) > 6) return;
          e.stopPropagation();
          onSelect(shared.selected === item.key ? null : item.key);
        }}
      >
        <meshPhysicalMaterial key={matKey(item.tex, maps)} {...props} />
      </RoundedBox>
      {shared.hovered === item.key && !shared.selected && (
        <Html position={[0, -h / 2 - 0.22, 0]} center style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
          <div className="whitespace-nowrap rounded-md border border-white/10 bg-black/70 px-3 py-2 text-center backdrop-blur-md">
            <div className="text-[0.8rem] text-limestone">{item.label}</div>
            <div className="text-[0.65rem] text-fog">{item.sub}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 520, p = new Float32Array(n * 3);
    const r = (i: number, s: number) => {
      const x = Math.sin(i * s) * 43758.5453;
      return x - Math.floor(x) - 0.5;
    };
    for (let i = 0; i < n; i++) {
      p[i * 3] = r(i, 12.9898) * 44;
      p[i * 3 + 1] = r(i, 78.233) * 22;
      p[i * 3 + 2] = r(i, 39.425) * 36 - 6;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  useFrame((_, dt) => ref.current && (ref.current.rotation.y += dt * 0.008));
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.035} color="#e2cfae" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** Camera: cursor parallax, drag tilt, and a dolly into the universe as the page scrolls. */
function Rig({ rtl, selected, drag }: { rtl: boolean; selected: boolean; drag: Shared["drag"] }) {
  const spot = useRef<THREE.SpotLight>(null);
  const { scene } = useThree();
  useEffect(() => {
    if (spot.current) {
      scene.add(spot.current.target);
      spot.current.target.position.set(0, 0, 4);
    }
  }, [scene]);
  useFrame(({ camera, pointer }, dt) => {
    const k = damp(dt, 1.8);
    const scroll = Math.min(1, window.scrollY / window.innerHeight);
    const tilt = drag.current?.tilt ?? 0;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.4, k);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, CAM.y + pointer.y * 0.8 + tilt * 4 - scroll * 1.6, k);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, (selected ? 15.5 : CAM.z) - scroll * 7, k);
    camera.lookAt(0, -scroll * 0.8, 0);
    if (spot.current) {
      // A hand-held light: highlights slide across glossy samples with the cursor.
      spot.current.position.x = THREE.MathUtils.lerp(spot.current.position.x, pointer.x * 9 + (selected ? (rtl ? -3 : 3) : 0), k);
      spot.current.position.y = THREE.MathUtils.lerp(spot.current.position.y, pointer.y * 6 + 2, k);
    }
  });
  return (
    <spotLight ref={spot} position={[0, 2, 13]} angle={0.55} penumbra={1} intensity={110} distance={40} decay={1.6} color="#ffe2bd" />
  );
}

/**
 * Frame pacing. The universe drifts slowly, so it renders at 30 fps when nobody is touching it
 * and at up to 60 fps (never more, even on 120 Hz screens) for a few seconds after any input or
 * state change. This roughly halves GPU work at rest without visible difference.
 */
function Ticker({ source, bump }: { source: React.RefObject<HTMLElement | null>; bump: unknown }) {
  const { invalidate } = useThree();
  const last = useRef(0);
  useEffect(() => {
    last.current = performance.now();
  }, [bump]);
  useEffect(() => {
    const el = source.current;
    const wake = () => (last.current = performance.now());
    const evs = ["pointermove", "pointerdown", "wheel", "keydown"] as const;
    evs.forEach((e) => el?.addEventListener(e, wake, { passive: true }));
    window.addEventListener("scroll", wake, { passive: true });
    let raf = 0, prev = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const fps = now - last.current < 2500 ? 60 : 30;
      if (now - prev >= 1000 / fps - 2) {
        prev = now;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      evs.forEach((e) => el?.removeEventListener(e, wake));
      window.removeEventListener("scroll", wake);
    };
  }, [source, invalidate]);
  return null;
}

function Effects({ shared, quality }: { shared: Shared; quality: number }) {
  const dof = useRef<DepthOfFieldEffect>(null);
  const focus = useMemo(() => new THREE.Vector3(0, 0, 3), []);
  useFrame((_, dt) => {
    const key = shared.selected ?? shared.hovered;
    const p = key ? shared.positions.get(key) : undefined;
    focus.lerp(p ?? new THREE.Vector3(0, 0, 3), damp(dt, 3));
    if (dof.current?.target) dof.current.target.copy(focus);
  });
  const grade = [
    <Bloom key="b" luminanceThreshold={0.82} luminanceSmoothing={0.2} intensity={0.75} mipmapBlur radius={0.72} />,
    <ToneMapping key="t" mode={ToneMappingMode.AGX} />,
    <Vignette key="v" offset={0.28} darkness={0.72} />,
    <Noise key="n" opacity={0.035} premultiply />,
  ];
  // No MSAA: SMAA gives clean edges for a fraction of the cost, and depth of field runs at half
  // resolution (it is a blur, so it looks the same).
  if (quality === 0)
    return (
      <EffectComposer multisampling={0}>
        {grade}
        <SMAA />
      </EffectComposer>
    );
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField ref={dof} target={[0, 0, 3]} worldFocusRange={11} bokehScale={5} resolutionScale={0.5} />
      {grade}
      <SMAA />
    </EffectComposer>
  );
}

export default function OrbitScene({
  items,
  selected,
  matchIndex,
  onSelect,
  onHover,
  hovered,
  drag,
  active,
  rtl,
  eventSource,
  onReady,
}: {
  items: OrbitItem[];
  selected: string | null;
  matchIndex: Map<string, number> | null;
  onSelect: (k: string | null) => void;
  onHover: (k: string | null) => void;
  hovered: string | null;
  drag: Shared["drag"];
  active: boolean;
  rtl: boolean;
  eventSource: React.RefObject<HTMLElement | null>;
  onReady: () => void;
}) {
  const positions = useRef(new Map<string, THREE.Vector3>()).current;
  const shared: Shared = { selected, matchIndex, hovered, drag, rtl, positions };
  const [dpr, setDpr] = useState(1.25);
  const [quality, setQuality] = useState(1);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => void (document.body.style.cursor = "");
  }, [hovered]);

  return (
    <Canvas
      className="!absolute inset-0"
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix="client"
      frameloop={active ? "demand" : "never"}
      dpr={dpr}
      camera={{ position: CAM.toArray(), fov: 32, near: 0.1, far: 80 }}
      gl={{ antialias: false, powerPreference: "high-performance", toneMapping: THREE.NoToneMapping, stencil: false }}
      onCreated={() => onReady()}
      onPointerMissed={() => selected && onSelect(null)}
    >
      {active && <Ticker source={eventSource} bump={[selected, hovered, matchIndex]} />}
      <PerformanceMonitor
        onIncline={() => setDpr(Math.min(1.5, window.devicePixelRatio))}
        onDecline={() => {
          setDpr(1);
          setQuality(0);
        }}
        flipflops={3}
        // Frames are paced to 30 fps at rest, so "declining" means the GPU cannot hold even that.
        bounds={() => [18, 26]}
        onFallback={() => setQuality(0)}
      />
      <color attach="background" args={["#0b0c0d"]} />
      <fog attach="fog" args={["#0b0c0d", 18, 44]} />

      <ambientLight intensity={0.08} />
      <directionalLight position={[-7, 9, 8]} intensity={1.3} color="#fff0db" />
      <directionalLight position={[6, 5, -14]} intensity={3.2} color="#bcd3ff" />
      <Rig rtl={rtl} selected={!!selected} drag={drag} />

      {/* Studio lighting for reflections: softboxes and strips, generated locally (no HDR download). */}
      <Environment resolution={quality > 0 ? 512 : 256} frames={1}>
        <color attach="background" args={["#050506"]} />
        <Lightformer form="rect" intensity={5} position={[0, 9, 2]} rotation-x={Math.PI / 2} scale={[14, 5, 1]} />
        <Lightformer form="rect" intensity={3.5} color="#ffd6a8" position={[-10, 2, 3]} rotation-y={Math.PI / 2} scale={[2.5, 12, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#d6e6ff" position={[10, 1, 2]} rotation-y={-Math.PI / 2} scale={[2.5, 12, 1]} />
        <Lightformer form="ring" intensity={2.5} position={[0, 3, -12]} scale={7} />
        <Lightformer form="rect" intensity={1.2} position={[0, -2, 14]} rotation-y={Math.PI} scale={[16, 3, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Earth drag={drag} />
      </Suspense>
      <Dust />
      {items.map((it, i) => (
        <Slab key={it.key} item={it} index={i} shared={shared} quality={quality} onSelect={onSelect} onHover={onHover} />
      ))}
      <Effects shared={shared} quality={quality} />
    </Canvas>
  );
}
