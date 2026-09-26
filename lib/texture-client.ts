"use client";

/**
 * Shared pool of texture workers (see texture-worker.ts). Kept free of three.js so
 * plain DOM swatches can use it without pulling the 3D bundle into the page.
 */
import type { TexKind } from "./textures";

export type Bitmaps = { color: ImageBitmap; normal: ImageBitmap; rough: ImageBitmap };
type Reply = Partial<Bitmaps> & { id: number; blob?: Blob; error?: string };

type Msg = { mode: "pbr" | "url"; tex: TexKind; seed: number; size: number };
type Job = Msg & { id: number; resolve: (r: Reply) => void; reject: (e: unknown) => void };

let pool: Worker[] | null = null;
const idle: Worker[] = [];
const running = new Map<number, Job>();
// Two lanes: what is on screen now (hero scene, first-paint swatches) jumps the queue.
const lanes: { high: Job[]; low: Job[] } = { high: [], low: [] };
let seq = 0;

function dispatch() {
  while (idle.length && (lanes.high.length || lanes.low.length)) {
    const job = (lanes.high.shift() ?? lanes.low.shift())!;
    const w = idle.pop()!;
    running.set(job.id, job);
    w.postMessage({ id: job.id, mode: job.mode, tex: job.tex, seed: job.seed, size: job.size });
  }
}

function failAll() {
  pool = [];
  idle.length = 0;
  for (const j of [...running.values(), ...lanes.high, ...lanes.low]) j.reject("worker failed");
  running.clear();
  lanes.high.length = lanes.low.length = 0;
}

function workers(): Worker[] {
  if (pool) return pool;
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined" || typeof createImageBitmap === "undefined") return (pool = []);
  try {
    const n = Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 4) - 1));
    pool = Array.from({ length: n }, () => {
      const w = new Worker(new URL("./texture-worker.ts", import.meta.url), { type: "module" });
      w.onmessage = (e: MessageEvent<Reply>) => {
        const job = running.get(e.data.id);
        running.delete(e.data.id);
        idle.push(w);
        if (job) {
          if (e.data.error) job.reject(e.data.error);
          else job.resolve(e.data);
        }
        dispatch();
      };
      // A worker that cannot start: fail everything so callers fall back to the main thread.
      w.onerror = failAll;
      idle.push(w);
      return w;
    });
  } catch {
    pool = [];
  }
  return pool;
}

export const workersAvailable = () => workers().length > 0;

function ask(msg: Msg, priority: boolean) {
  if (!workers().length) return Promise.reject("no workers");
  return new Promise<Reply>((resolve, reject) => {
    lanes[priority ? "high" : "low"].push({ ...msg, id: ++seq, resolve, reject });
    dispatch();
  });
}

const bitmapJobs = new Map<string, Promise<Bitmaps>>();

/**
 * Colour, normal and roughness bitmaps (flipped for upload with flipY = false).
 * De-duplicated, so the hero can start the work before the 3D bundle has loaded.
 */
export function requestBitmaps(tex: TexKind, seed: number, size: number, priority = true): Promise<Bitmaps> {
  const key = `${tex}:${seed}:${size}`;
  const busy = bitmapJobs.get(key);
  if (busy) return busy;
  const job = ask({ mode: "pbr", tex, seed, size }, priority).then((r) => r as Bitmaps);
  bitmapJobs.set(key, job);
  job.catch(() => bitmapJobs.delete(key));
  return job;
}

const urls = new Map<string, string>();
const urlJobs = new Map<string, Promise<string>>();

export const cachedSwatchURL = (tex: TexKind, size: number, seed: number) => urls.get(`${tex}:${size}:${seed}`);

/** A compressed image URL for a DOM swatch, generated in a worker. */
export function requestSwatchURL(tex: TexKind, size: number, seed: number, priority = false): Promise<string> {
  const key = `${tex}:${size}:${seed}`;
  const hit = urls.get(key);
  if (hit) return Promise.resolve(hit);
  const busy = urlJobs.get(key);
  if (busy) return busy;
  const job = ask({ mode: "url", tex, seed, size }, priority).then((r) => {
    const url = URL.createObjectURL(r.blob!);
    urls.set(key, url);
    urlJobs.delete(key);
    return url;
  });
  urlJobs.set(key, job);
  job.catch(() => urlJobs.delete(key));
  return job;
}
