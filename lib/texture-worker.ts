/// <reference lib="webworker" />
/**
 * Builds material textures off the main thread.
 * - "pbr": colour, normal and roughness bitmaps for WebGL. They are flipped here so the
 *   main thread uploads them with `flipY = false`, matching the canvas path pixel for pixel.
 * - "url": a compressed WebP for DOM swatches.
 */
import { drawTexture, reliefData, type TexKind } from "./textures";

type Job = { id: number; mode: "pbr" | "url"; tex: TexKind; seed: number; size: number };
const post = (self as unknown as { postMessage(m: unknown, transfer?: Transferable[]): void }).postMessage.bind(self);

self.onmessage = async (e: MessageEvent<Job>) => {
  const { id, mode, tex, seed, size } = e.data;
  try {
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    drawTexture(ctx as unknown as CanvasRenderingContext2D, tex, size, seed);
    if (mode === "url") {
      post({ id, blob: await canvas.convertToBlob({ type: "image/webp", quality: 0.86 }) });
      return;
    }
    const { normal, rough } = reliefData(tex, size, ctx.getImageData(0, 0, size, size).data);
    const flip = { imageOrientation: "flipY" as const };
    const [color, n, r] = await Promise.all([
      createImageBitmap(canvas, flip),
      createImageBitmap(normal, flip),
      createImageBitmap(rough, flip),
    ]);
    post({ id, color, normal: n, rough: r }, [color, n, r]);
  } catch (err) {
    post({ id, error: String(err) });
  }
};
