"use client";
/* eslint-disable react-hooks/immutability -- three.js clip planes and meshes are mutated imperatively in the frame loop, which is the intended react-three-fiber pattern. */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Environment, Lightformer, MeshReflectorMaterial, OrbitControls, PerformanceMonitor, RoundedBox } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import * as THREE from "three";
import { pbr, type TexKind } from "@/lib/textures";
import { physicalProps, usePBRMaps, useTiledMaps } from "@/lib/three-pbr";
import { observeActive } from "@/lib/capability";
import type { SurfaceId } from "@/content/applications";
import type { SurfaceSpec } from "./room-scene";

/* Room in metres: 9 wide, 3.8 high, back wall at z = -5, camera inside near the front. */
const W = 9, H = 3.8, BACK = -5, FRONT = 5;
const D = FRONT - BACK;
const COUNTER = { w: 3.8, h: 1.08, d: 0.9, z: -2.3 };
const FEATURE = { w: 3.6, h: H, d: 0.1 };

type Geo = {
  surface: SurfaceId;
  kind: "plane" | "box";
  size: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  /** World axis and extent the material change sweeps along. */
  axis: [number, number, number];
  span: [number, number];
  primary?: boolean;
};

const GEOS: Geo[] = [
  { surface: "floor", kind: "plane", size: [W, D, 0], position: [0, 0, (BACK + FRONT) / 2], rotation: [-Math.PI / 2, 0, 0], axis: [1, 0, 0], span: [-W / 2, W / 2], primary: true },
  { surface: "ceiling", kind: "plane", size: [W, D, 0], position: [0, H, (BACK + FRONT) / 2], rotation: [Math.PI / 2, 0, 0], axis: [1, 0, 0], span: [-W / 2, W / 2], primary: true },
  { surface: "wall", kind: "plane", size: [W, H, 0], position: [0, H / 2, BACK], rotation: [0, 0, 0], axis: [1, 0, 0], span: [-W / 2, W / 2], primary: true },
  { surface: "wall", kind: "plane", size: [D, H, 0], position: [-W / 2, H / 2, (BACK + FRONT) / 2], rotation: [0, Math.PI / 2, 0], axis: [0, 0, 1], span: [BACK, FRONT] },
  { surface: "wall", kind: "plane", size: [D, H, 0], position: [W / 2, H / 2, (BACK + FRONT) / 2], rotation: [0, -Math.PI / 2, 0], axis: [0, 0, 1], span: [BACK, FRONT] },
  { surface: "feature", kind: "box", size: [FEATURE.w, FEATURE.h, FEATURE.d], position: [0, H / 2, BACK + FEATURE.d / 2 + 0.01], rotation: [0, 0, 0], axis: [1, 0, 0], span: [-FEATURE.w / 2, FEATURE.w / 2], primary: true },
  { surface: "counter", kind: "box", size: [COUNTER.w, COUNTER.h, COUNTER.d], position: [0, COUNTER.h / 2, COUNTER.z], rotation: [0, 0, 0], axis: [1, 0, 0], span: [-COUNTER.w / 2, COUNTER.w / 2], primary: true },
];

const SWEEP = 1.15;

/** One material on one surface. While `clip` is set it is revealed by a moving clipping plane. */
function Layer({ geo, spec, quality, reveal, active, hovered, onSelect, onHover, onDone }: {
  onDone?: () => void;
  geo: Geo;
  spec: SurfaceSpec;
  quality: number;
  reveal: { start: number } | null;
  active: boolean;
  hovered: boolean;
  onSelect?: (s: SurfaceId) => void;
  onHover: (s: SurfaceId | null) => void;
}) {
  const maps = usePBRMaps(spec.tex, spec.seed, quality > 0 ? 512 : 256, true);
  const [w, h] = geo.size;
  const tiled = useTiledMaps(maps, spec.tex, w, h);
  const props = physicalProps(spec.tex, tiled);
  const axis = useMemo(() => new THREE.Vector3(...geo.axis), [geo.axis]);
  const base = useMemo(() => {
    const b = new THREE.Vector3(...geo.position);
    if (geo.kind === "box") b.z += geo.size[2] / 2 + 0.012;
    return b.sub(axis.clone().multiplyScalar(axis.dot(b)));
  }, [geo, axis]);
  // The clipping plane is mutated every frame, so it lives in a ref.
  const [clip] = useState(() => (reveal ? [new THREE.Plane(new THREE.Vector3(...geo.axis).negate(), geo.span[0])] : undefined));
  const edge = useRef<THREE.Mesh>(null);
  // Once settled, the layer is always fully visible, even if frames were paused mid-sweep.
  useEffect(() => {
    if (!reveal && clip) clip[0].constant = 1e6;
  }, [reveal, clip]);

  useFrame(({ clock }) => {
    if (!reveal || !clip) return;
    const k = Math.min(1, (clock.elapsedTime - reveal.start) / SWEEP);
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const at = THREE.MathUtils.lerp(geo.span[0] - 0.05, geo.span[1] + 0.05, e);
    clip[0].constant = at;
    if (k >= 1) onDone?.();
    if (edge.current) {
      edge.current.position.copy(base).addScaledVector(axis, at);
      (edge.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(k * Math.PI) * 0.9;
    }
  });

  const gloss = 1 - pbr[spec.tex].roughness;
  const reflect = geo.surface === "floor" && quality > 0 && gloss > 0.4 && !pbr[spec.tex].transmission;
  const events = onSelect
    ? {
        onClick: (e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          onSelect(geo.surface);
        },
        onPointerOver: (e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          onHover(geo.surface);
        },
        onPointerOut: () => onHover(null),
      }
    : {};
  const offset = reveal && geo.kind === "box" ? 0.002 : 0;
  // The incoming layer draws over the settled one without z-fighting.
  const layering = reveal ? { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 } : {};

  const material = reflect ? (
    <MeshReflectorMaterial
      key={`r-${spec.tex}-${!!tiled}`}
      {...(tiled ?? {})}
      color={props.color}
      roughness={1}
      metalness={0}
      mirror={0}
      mixStrength={0.6 + gloss * gloss * 4}
      mixBlur={1}
      blur={[500, 160]}
      resolution={1024}
      depthScale={0}
      clippingPlanes={clip}
      {...layering}
    />
  ) : (
    <meshPhysicalMaterial key={`p-${spec.tex}-${!!tiled}`} {...props} {...layering} clippingPlanes={clip} side={geo.kind === "plane" ? THREE.DoubleSide : THREE.FrontSide} />
  );

  const outline = (active || hovered) && !reveal && (
    <Edges threshold={20} color={active ? "#f2ede4" : "#a8a39a"} lineWidth={active ? 2.5 : 1.5} />
  );

  return (
    <>
      {geo.kind === "plane" ? (
        <mesh position={geo.position} rotation={geo.rotation} receiveShadow {...events} renderOrder={reveal ? 1 : 0}>
          <planeGeometry args={[w, h]} />
          {material}
          {outline}
        </mesh>
      ) : (
        <RoundedBox
          args={geo.size}
          radius={0.02}
          smoothness={3}
          position={[geo.position[0], geo.position[1], geo.position[2] + offset]}
          castShadow
          receiveShadow
          {...events}
        >
          {material}
          {outline}
        </RoundedBox>
      )}
      {reveal && (
        // A light sweep travels with the edge of the new material.
        <mesh ref={edge} rotation={geo.rotation}>
          <boxGeometry args={[0.03, geo.kind === "box" ? geo.size[1] + 0.04 : Math.min(h, H) + 0.02, 0.03]} />
          <meshBasicMaterial color="#fff4e0" transparent opacity={0} toneMapped={false} />
        </mesh>
      )}
    </>
  );
}

/** Keeps the settled material and sweeps a new one over it. */
function Surface({ geo, spec, ...rest }: { geo: Geo; spec: SurfaceSpec; quality: number; active: boolean; hovered: boolean; onSelect?: (s: SurfaceId) => void; onHover: (s: SurfaceId | null) => void }) {
  const { clock } = useThree();
  const [layers, setLayers] = useState([{ id: 0, spec, start: -1 }]);
  const last = layers[layers.length - 1];
  if (last.spec.tex !== spec.tex || last.spec.seed !== spec.seed) {
    setLayers((ls) => [...ls.slice(-1), { id: last.id + 1, spec, start: clock.elapsedTime }]);
  }
  // The sweep ends the transition from the frame loop, so paused frames never strand a half-revealed layer.
  const settle = () => setLayers((ls) => (ls.length > 1 ? ls.slice(-1) : ls));
  return (
    <>
      {layers.map((l, i) => (
        <Layer key={l.id} geo={geo} spec={l.spec} reveal={i > 0 ? { start: l.start } : null} onDone={i > 0 ? settle : undefined} {...rest} />
      ))}
    </>
  );
}

function Fixtures({ light }: { light: string }) {
  const lampColor = useMemo(() => new THREE.Color(light), [light]);
  useEffect(() => void RectAreaLightUniformsLib.init(), []);
  return (
    <>
      {/* Cove lines where the ceiling meets the walls */}
      {[
        { p: [0, H - 0.04, BACK + 0.05] as const, s: [W, 0.03, 0.03] as const },
        { p: [-W / 2 + 0.05, H - 0.04, 0] as const, s: [0.03, 0.03, D] as const },
        { p: [W / 2 - 0.05, H - 0.04, 0] as const, s: [0.03, 0.03, D] as const },
      ].map((c, i) => (
        <mesh key={i} position={c.p as unknown as THREE.Vector3Tuple}>
          <boxGeometry args={c.s as unknown as [number, number, number]} />
          <meshBasicMaterial color={lampColor} toneMapped={false} />
        </mesh>
      ))}
      <rectAreaLight position={[0, H - 0.1, BACK + 0.4]} rotation={[-Math.PI / 2.4, 0, 0]} width={W - 0.4} height={0.4} intensity={3.5} color={light} />
      <rectAreaLight position={[-W / 2 + 0.3, H - 0.1, -0.5]} rotation={[-Math.PI / 2, -0.6, 0]} width={0.4} height={D - 1} intensity={1.2} color={light} />
      <rectAreaLight position={[W / 2 - 0.3, H - 0.1, -0.5]} rotation={[-Math.PI / 2, 0.6, 0]} width={0.4} height={D - 1} intensity={1.2} color={light} />

      {/* Pendants above the counter */}
      {[-1.2, 0, 1.2].map((x) => (
        <group key={x} position={[x, H - 1.05, COUNTER.z]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 1, 6]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.09, 0.14, 0.26, 32, 1, true]} />
            <meshPhysicalMaterial color="#b58a55" metalness={1} roughness={0.25} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={lampColor} toneMapped={false} />
          </mesh>
          <pointLight position={[0, -0.15, 0]} intensity={3} distance={3.2} decay={2} color={light} />
        </group>
      ))}

      {/* Grazing spots on the feature wall reveal its relief; they also cast the counter's shadow. */}
      {[-1.1, 1.1].map((x) => (
        <Spot key={x} x={x} color={light} />
      ))}

      {/* A bench for scale */}
      <RoundedBox args={[1.6, 0.42, 0.55]} radius={0.06} smoothness={4} position={[-3.3, 0.21, -1.2]} rotation={[0, 0.5, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#2c2a28" roughness={0.85} sheen={1} sheenRoughness={0.5} sheenColor="#8a7a66" />
      </RoundedBox>
    </>
  );
}

function Spot({ x, color }: { x: number; color: string }) {
  const ref = useRef<THREE.SpotLight>(null);
  const { scene } = useThree();
  useEffect(() => {
    const s = ref.current;
    if (!s) return;
    s.target.position.set(x * 0.8, 0.6, BACK);
    scene.add(s.target);
    return () => void scene.remove(s.target);
  }, [scene, x]);
  return (
    <spotLight
      ref={ref}
      position={[x, H - 0.08, BACK + 1.1]}
      angle={0.62}
      penumbra={0.85}
      intensity={40}
      distance={9}
      decay={1.6}
      color={color}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.02}
    />
  );
}

export default function Room3D({
  surfaces,
  light = "#f3d7a8",
  active = null,
  onSelect,
  className = "",
  label,
}: {
  surfaces: Record<SurfaceId, SurfaceSpec>;
  light?: string;
  active?: SurfaceId | null;
  onSelect?: (s: SurfaceId) => void;
  className?: string;
  label: string;
  surfaceNames?: Record<SurfaceId, string>;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(true);
  const [quality, setQuality] = useState(1);
  const [hovered, setHovered] = useState<SurfaceId | null>(null);

  useEffect(() => (box.current ? observeActive(box.current, setOn) : undefined), []);
  useEffect(() => {
    if (!onSelect) return;
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => void (document.body.style.cursor = "");
  }, [hovered, onSelect]);

  return (
    <div ref={box} role="img" aria-label={label} className={`relative aspect-[1000/560] w-full overflow-hidden bg-black ${className}`}>
      <Canvas
        shadows="soft"
        frameloop={on ? "always" : "never"}
        dpr={[1, quality > 0 ? 1.75 : 1]}
        camera={{ position: [0, 1.6, 4.3], fov: 50, near: 0.05, far: 40 }}
        gl={{ antialias: false, toneMapping: THREE.NoToneMapping, powerPreference: "high-performance" }}
        onCreated={({ gl }) => void (gl.localClippingEnabled = true)}
      >
        <PerformanceMonitor onDecline={() => setQuality(0)} flipflops={2} onFallback={() => setQuality(0)} />
        <color attach="background" args={["#0b0c0d"]} />
        <ambientLight intensity={0.04} />
        <hemisphereLight args={["#fff6ea", "#2a2622", 0.1]} />

        <Environment resolution={256} frames={1} environmentIntensity={0.45}>
          <Lightformer form="rect" intensity={3} color={light} position={[0, 5, -1]} rotation-x={Math.PI / 2} scale={[8, 6, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[0, 2, 6]} rotation-y={Math.PI} scale={[9, 3, 1]} />
          <Lightformer form="rect" intensity={1} color={light} position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={1} color={light} position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        </Environment>

        {GEOS.map((g, i) => (
          <Surface
            key={i}
            geo={g}
            spec={surfaces[g.surface]}
            quality={quality}
            active={active === g.surface}
            hovered={hovered === g.surface}
            onSelect={onSelect}
            onHover={setHovered}
          />
        ))}
        <Fixtures light={light} />

        <OrbitControls
          target={[0, 1.35, -2]}
          enablePan={false}
          enableZoom
          minDistance={3.5}
          maxDistance={6.8}
          minAzimuthAngle={-0.5}
          maxAzimuthAngle={0.5}
          minPolarAngle={1.2}
          maxPolarAngle={1.72}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.5}
          autoRotate={!hovered && !active}
          autoRotateSpeed={0.25}
        />

        {quality > 0 ? (
          <EffectComposer multisampling={0}>
            <N8AO aoRadius={0.9} intensity={3.2} distanceFalloff={0.7} quality="medium" />
            <Bloom luminanceThreshold={0.9} intensity={0.55} mipmapBlur radius={0.6} />
            <ToneMapping mode={ToneMappingMode.AGX} />
            <Vignette offset={0.3} darkness={0.55} />
            <SMAA />
          </EffectComposer>
        ) : (
          <EffectComposer multisampling={0}>
            <ToneMapping mode={ToneMappingMode.AGX} />
            <SMAA />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}

export type { TexKind };
