"use client";
/* eslint-disable react-hooks/immutability -- shader uniforms are mutated in the frame loop, which is the intended react-three-fiber pattern. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Line2 } from "three-stdlib";
import { borders } from "@/lib/borders";

const R = 3.5;
/** The point of Africa that faces the camera at rest. */
const CENTER = { lat: 6, lon: 10 };
/** Largest tilt away from rest, in any direction. The globe never turns further. */
const MAX_TILT = THREE.MathUtils.degToRad(15);
/** Sun from the upper left and slightly in front: Africa in daylight, the terminator and city lights on the eastern limb. */
const SUN = new THREE.Vector3(-0.8, 0.22, 0.56).normalize();
const ATMOSPHERE = new THREE.Color("#5f97ff");
/** HDR stroke colours (above 1.0) so the borders catch the bloom pass. */
const STROKE = new THREE.Color(1.5, 1.05, 0.55);
const SPARK = new THREE.Color(2.6, 2.0, 1.2);

/** NASA Blue Marble, Black Marble and topography (public domain), served from /public. */
const TEXTURES = {
  day: "/earth/day.webp",
  night: "/earth/night.webp",
  relief: "/earth/relief.webp",
  water: "/earth/water.webp",
  clouds: "/earth/clouds.webp",
};
/** Runs before upload. drei types this as the keyed object but passes an array in TEXTURES order; accept both. */
function prepare(loaded: Record<keyof typeof TEXTURES, THREE.Texture> | THREE.Texture[]) {
  const all = Array.isArray(loaded) ? loaded : Object.values(loaded);
  for (const t of all) {
    t.anisotropy = 8; // three clamps to what the GPU supports
    t.wrapS = THREE.RepeatWrapping;
  }
  all[0].colorSpace = all[1].colorSpace = THREE.SRGBColorSpace; // day, night
  for (const t of all) t.needsUpdate = true;
}

const damp = (dt: number, k: number) => 1 - Math.exp(-dt * k);

/** lon/lat (degrees) → point on the sphere, matching three's SphereGeometry UV layout. */
function toVec(lon: number, lat: number, r: number) {
  const l = THREE.MathUtils.degToRad(lon), p = THREE.MathUtils.degToRad(lat);
  return new THREE.Vector3(r * Math.cos(p) * Math.cos(l), r * Math.sin(p), -r * Math.cos(p) * Math.sin(l));
}

/** Ring of lon/lat pairs → points on the sphere, with long straight borders subdivided so they follow the curvature. */
function ringPoints(flat: number[], r: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    const a = toVec(flat[i], flat[i + 1], r);
    const j = (i + 2) % flat.length;
    const b = toVec(flat[j], flat[j + 1], r);
    const steps = Math.max(1, Math.ceil(a.angleTo(b) / THREE.MathUtils.degToRad(0.4)));
    for (let s = 0; s < steps; s++) pts.push(a.clone().lerp(b, s / steps).setLength(r));
  }
  pts.push(pts[0].clone());
  return pts;
}

const perimeter = (pts: THREE.Vector3[]) => pts.reduce((d, p, i) => (i ? d + p.distanceTo(pts[i - 1]) : 0), 0);

const earthVertex = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vNorth; varying vec3 vPos;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    vNorth = normalize(mat3(modelMatrix) * vec3(0.0, 1.0, 0.0));
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`;

const earthFragment = /* glsl */ `
  uniform sampler2D day; uniform sampler2D night; uniform sampler2D relief; uniform sampler2D water; uniform sampler2D clouds;
  uniform vec3 sun; uniform vec3 atmosphere; uniform float cloudShift; uniform float fade;
  varying vec2 vUv; varying vec3 vN; varying vec3 vNorth; varying vec3 vPos;
  void main() {
    vec3 n = normalize(vN);
    vec3 V = normalize(cameraPosition - vPos);
    float sea = texture2D(water, vUv).r;

    // Relief: perturb the normal along east/north from the height map (land only).
    vec3 east = normalize(cross(vNorth, n));
    vec3 north = cross(n, east);
    vec2 px = vec2(1.0 / 2048.0, 1.0 / 1024.0);
    float h = texture2D(relief, vUv).r;
    float hx = texture2D(relief, vUv + vec2(px.x, 0.0)).r - h;
    float hy = texture2D(relief, vUv + vec2(0.0, px.y)).r - h;
    vec3 nb = normalize(n - 7.0 * (1.0 - sea) * (hx * east + hy * north));

    float ndl = dot(n, sun);
    float light = smoothstep(-0.18, 0.3, ndl);

    vec3 albedo = texture2D(day, vUv).rgb;
    albedo = mix(vec3(dot(albedo, vec3(0.2126, 0.7152, 0.0722))), albedo, 1.12); // a touch of saturation
    float shadow = 1.0 - 0.38 * texture2D(clouds, vUv + vec2(cloudShift - 0.0015, 0.001)).r;
    vec3 col = albedo * (max(dot(nb, sun), 0.0) * 1.35 + 0.025) * shadow;

    // Oceans: tight sun glint plus a broad sheen.
    vec3 H = normalize(sun + V);
    float nh = max(dot(n, H), 0.0);
    col += vec3(1.0, 0.84, 0.62) * sea * (pow(nh, 60.0) * 0.2 + pow(nh, 8.0) * 0.04) * light;

    // City lights on the night side.
    vec3 lights = texture2D(night, vUv).rgb;
    col += lights * lights * vec3(1.0, 0.72, 0.42) * 2.2 * (1.0 - smoothstep(-0.25, 0.08, ndl));

    // Atmospheric scattering towards the limb.
    float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);
    col += atmosphere * fres * (0.08 + 0.9 * smoothstep(-0.35, 0.6, ndl));

    gl_FragColor = vec4(col * fade, 1.0);
    #include <colorspace_fragment>
  }`;

const cloudFragment = /* glsl */ `
  uniform sampler2D clouds; uniform vec3 sun; uniform float cloudShift; uniform float fade;
  varying vec2 vUv; varying vec3 vN; varying vec3 vNorth; varying vec3 vPos;
  void main() {
    vec3 n = normalize(vN);
    float a = texture2D(clouds, vUv + vec2(cloudShift, 0.0)).r;
    float lit = max(dot(n, sun), 0.0);
    gl_FragColor = vec4(vec3(0.78) * (lit * 0.95 + 0.02), a * 0.82 * fade * smoothstep(-0.2, 0.15, dot(n, sun) + 0.1));
    #include <colorspace_fragment>
  }`;

const haloFragment = /* glsl */ `
  uniform vec3 sun; uniform vec3 atmosphere; uniform vec3 center; uniform float fade;
  varying vec2 vUv; varying vec3 vN; varying vec3 vNorth; varying vec3 vPos;
  void main() {
    vec3 V = normalize(cameraPosition - vPos);
    // Back faces of a larger shell: 0 at its silhouette, 1 where it meets the planet's limb.
    float g = pow(clamp(-dot(normalize(vN), V) / 0.47, 0.0, 1.0), 2.4);
    float day = smoothstep(-0.45, 0.7, dot(normalize(vPos - center), sun));
    gl_FragColor = vec4(atmosphere * g * (0.12 + 1.35 * day) * fade, 1.0);
    #include <colorspace_fragment>
  }`;

function Border({ ring, sparks, phase }: { ring: number[]; sparks: number; phase: number }) {
  const pts = useMemo(() => ringPoints(ring, R * 1.004), [ring]);
  const len = useMemo(() => perimeter(pts), [pts]);
  const spark = useRef<Line2>(null);
  const glow = useRef<Line2>(null);
  useFrame(({ clock }, dt) => {
    // A short bright dash travels around the border; the halo breathes.
    if (spark.current) spark.current.material.dashOffset -= dt * 0.55;
    if (glow.current) glow.current.material.opacity = 0.16 + 0.07 * Math.sin(clock.elapsedTime * 1.6 + phase);
  });
  const period = len / sparks;
  return (
    <group>
      <Line ref={glow} renderOrder={10} points={pts} color={STROKE} lineWidth={4.5} transparent opacity={0.18} depthWrite={false} toneMapped={false} />
      <Line renderOrder={11} points={pts} color={STROKE} lineWidth={1.3} transparent depthWrite={false} toneMapped={false} />
      <Line
        ref={spark}
        renderOrder={12}
        points={pts}
        color={SPARK}
        lineWidth={2}
        dashed
        dashSize={Math.min(0.32, period * 0.3)}
        gapSize={period - Math.min(0.32, period * 0.3)}
        dashOffset={phase}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </group>
  );
}

/**
 * The SURMAT globe: Africa faces the viewer and stays there. The planet leans up to
 * MAX_TILT towards the cursor, a drag or a slow idle drift, and springs back — it never spins.
 * Algeria and Senegal, the two editions, are traced in light.
 */
export default function Earth({ drag }: { drag: React.RefObject<{ offset: number; moved: number; tilt: number }> }) {
  const tex = useTexture(TEXTURES, prepare);

  const uniforms = useMemo(
    () => ({
      ...Object.fromEntries(Object.entries(tex).map(([k, t]) => [k, { value: t }])),
      sun: { value: SUN },
      atmosphere: { value: ATMOSPHERE },
      center: { value: new THREE.Vector3() },
      cloudShift: { value: 0 },
      fade: { value: 0 },
    }),
    [tex],
  );
  const materials = useMemo(
    () => ({
      earth: new THREE.ShaderMaterial({ uniforms, vertexShader: earthVertex, fragmentShader: earthFragment }),
      clouds: new THREE.ShaderMaterial({ uniforms, vertexShader: earthVertex, fragmentShader: cloudFragment, transparent: true, depthWrite: false }),
      halo: new THREE.ShaderMaterial({
        uniforms,
        vertexShader: earthVertex,
        fragmentShader: haloFragment,
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    }),
    [uniforms],
  );

  const root = useRef<THREE.Group>(null);
  const lean = useRef<THREE.Group>(null);
  const nudge = useRef({ last: 0, x: 0 });
  const rest = useMemo(
    () => new THREE.Euler(THREE.MathUtils.degToRad(CENTER.lat), -Math.PI / 2 - THREE.MathUtils.degToRad(CENTER.lon), 0),
    [],
  );

  useFrame(({ clock, pointer }, dt) => {
    const t = clock.elapsedTime;
    uniforms.fade.value = Math.min(1, uniforms.fade.value + dt * 0.8);
    uniforms.cloudShift.value = (t * 0.0012) % 1;
    root.current?.getWorldPosition(uniforms.center.value);

    // Drag velocity nudges the globe; the nudge decays so it always returns to Africa.
    const d = drag.current;
    if (d) {
      nudge.current.x = THREE.MathUtils.clamp(nudge.current.x + (d.offset - nudge.current.last) * 2.2, -1, 1);
      nudge.current.last = d.offset;
    }
    nudge.current.x *= 1 - damp(dt, 1.4);

    const g = lean.current;
    if (!g) return;
    const yaw = THREE.MathUtils.clamp(0.28 * Math.sin(t * 0.11) + 0.55 * pointer.x + nudge.current.x, -1, 1) * MAX_TILT;
    const pitch = THREE.MathUtils.clamp(0.25 * Math.sin(t * 0.083 + 1.3) - 0.5 * pointer.y - (d?.tilt ?? 0) * 3, -1, 1) * MAX_TILT;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, yaw, damp(dt, 1.6));
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pitch, damp(dt, 1.6));
  });

  return (
    <group ref={root} position={[0, -0.4, -4]}>
      <group ref={lean}>
        <group rotation={rest}>
          <mesh material={materials.earth}>
            <sphereGeometry args={[R, 160, 160]} />
          </mesh>
          <mesh material={materials.clouds} scale={1.006}>
            <sphereGeometry args={[R, 128, 128]} />
          </mesh>
          {borders.dz.map((ring, i) => (
            <Border key={`dz${i}`} ring={ring} sparks={2} phase={0} />
          ))}
          {borders.sn.map((ring, i) => (
            <Border key={`sn${i}`} ring={ring} sparks={1} phase={1.7} />
          ))}
        </group>
      </group>
      <mesh material={materials.halo} scale={1.12}>
        <sphereGeometry args={[R, 96, 96]} />
      </mesh>
    </group>
  );
}
