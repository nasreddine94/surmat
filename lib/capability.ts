"use client";

import { useSyncExternalStore } from "react";

/** WebGL experiences only on capable, fine-pointer devices without reduced motion. */
function detect() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches || innerWidth < 900;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowEnd = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
  if (reduce || coarse || lowEnd) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

let cached: boolean | undefined;
const noop = () => () => {};

/** false during SSR and on the first client render, so markup always hydrates. */
export function useCan3D() {
  return useSyncExternalStore(noop, () => (cached ??= detect()), () => false);
}

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
