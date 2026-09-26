"use client";

import { useSyncExternalStore } from "react";

/**
 * Device tiers for the WebGL hero:
 * - "none":   phones, tablets, or no usable WebGL — 2D only, no switch.
 * - "weak":   a desktop that could run 3D but may struggle — starts in 2D, 3D on request.
 * - "strong": a capable desktop or laptop — 3D loads by default.
 * The scene's own ready-check still drops to 2D if frames are not smooth in practice.
 */
export type DeviceTier = "none" | "weak" | "strong";

type Nav = Navigator & {
  deviceMemory?: number;
  userAgentData?: { mobile?: boolean };
  connection?: { saveData?: boolean };
};

/** Phones and tablets, including iPads that report a desktop Mac user agent. */
function isTouchDevice(nav: Nav) {
  if (nav.userAgentData?.mobile) return true;
  if (/Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|PlayBook|BlackBerry/i.test(nav.userAgent)) return true;
  if (nav.platform === "MacIntel" && nav.maxTouchPoints > 1) return true;
  // Touch is the primary input (touch laptops keep a fine pointer with hover).
  return matchMedia("(hover: none) and (pointer: coarse)").matches;
}

function gpu() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) return null;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    gl.getExtension("WEBGL_lose_context")?.loseContext(); // free the probe context right away
    return { renderer, maxTexture };
  } catch {
    return null;
  }
}

function detectTier(): DeviceTier {
  const override = new URLSearchParams(location.search).get("gpu");
  if (override === "none" || override === "weak" || override === "strong") return override;

  const nav = navigator as Nav;
  if (isTouchDevice(nav)) return "none";
  const g = gpu();
  if (!g) return "none"; // no WebGL2, or only a slow fallback (failIfMajorPerformanceCaveat)
  const r = g.renderer.toLowerCase();
  if (/swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/.test(r)) return "none";

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8; // Chrome only; others are not penalised
  const weakGpu =
    /intel.*\b(hd|uhd)\b|intel.*gma|mali|adreno|powervr|videocore/.test(r) ||
    (/intel.*iris/.test(r) && cores < 8) ||
    g.maxTexture < 8192;
  const constrained =
    cores < 4 ||
    memory < 4 ||
    nav.connection?.saveData === true ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    innerWidth < 900;
  return weakGpu || constrained ? "weak" : "strong";
}

let cached: DeviceTier | undefined;
const noop = () => () => {};

/** "none" during SSR and the first client render, so markup always hydrates. */
export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(noop, () => (cached ??= detectTier()), () => "none" as const);
}

/** WebGL is possible at all on this device (it may still start in 2D). */
export const useCan3D = () => useDeviceTier() !== "none";

/** True while the element is on screen and the tab is visible — pause rendering otherwise. */
export function observeActive(el: Element, set: (v: boolean) => void) {
  let inView = true;
  const io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    set(inView && document.visibilityState === "visible");
  });
  io.observe(el);
  const vis = () => set(inView && document.visibilityState === "visible");
  document.addEventListener("visibilitychange", vis);
  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", vis);
  };
}
