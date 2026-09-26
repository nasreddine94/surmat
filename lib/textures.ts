/**
 * Procedural, tileable material textures.
 *
 * Every surface on the site (DOM swatches, CSS 3D rooms, WebGL slabs) is drawn
 * from these generators, so the material library needs no stock photography
 * and every texture repeats seamlessly across walls and floors.
 * Real product photography from the CMS can replace any of them per material.
 */

export type TexKind =
  | "marble" | "calacatta" | "verde" | "nero" | "travertine" | "granite" | "graniteBlack"
  | "limestone" | "onyx" | "quartz" | "sintered"
  | "porcelain" | "glaze" | "zellige" | "mosaic" | "cementTile" | "terrazzo" | "outdoor"
  | "paint" | "facade" | "microcement" | "tadelakt" | "metallic" | "resin"
  | "gypsum" | "ceilingGrid" | "acoustic" | "woodSlats" | "partition" | "moulding" | "stretch"
  | "adhesive" | "grout" | "screed" | "membrane" | "powder"
  | "metal" | "kiln" | "inkjet" | "perforated" | "pigment";

type RGB = [number, number, number];

const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const shade = (a: RGB, f: number): RGB => [a[0] * f, a[1] * f, a[2] * f];
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const TAU = Math.PI * 2;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Periodic value noise: sampling u,v in [0,1) wraps seamlessly. */
class Noise {
  private tables = new Map<string, Float32Array>();
  constructor(private seed: number) {}
  private table(nx: number, ny: number) {
    const key = `${nx}x${ny}`;
    let t = this.tables.get(key);
    if (!t) {
      const r = mulberry32(this.seed * 7919 + nx * 131 + ny);
      t = new Float32Array(nx * ny);
      for (let i = 0; i < t.length; i++) t[i] = r();
      this.tables.set(key, t);
    }
    return t;
  }
  sample(u: number, v: number, nx: number, ny = nx) {
    const t = this.table(nx, ny);
    const x = u * nx, y = v * ny;
    const xi = Math.floor(x), yi = Math.floor(y);
    let fx = x - xi, fy = y - yi;
    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);
    const x0 = ((xi % nx) + nx) % nx, y0 = ((yi % ny) + ny) % ny;
    const x1 = (x0 + 1) % nx, y1 = (y0 + 1) % ny;
    const a = t[y0 * nx + x0], b = t[y0 * nx + x1], c = t[y1 * nx + x0], d = t[y1 * nx + x1];
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }
  fbm(u: number, v: number, nx: number, oct = 5, ny = nx) {
    let sum = 0, amp = 0.5, norm = 0;
    for (let i = 0; i < oct; i++) {
      const m = 1 << i;
      sum += this.sample(u, v, nx * m, ny * m) * amp;
      norm += amp;
      amp *= 0.5;
    }
    return sum / norm;
  }
}

type PixelFn = (u: number, v: number) => RGB;

function fill(ctx: CanvasRenderingContext2D, size: number, fn: PixelFn) {
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const c = fn(x / size, v);
      const i = (y * size + x) * 4;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** Draw a tile grid with joints; `joint` in px. */
function grid(ctx: CanvasRenderingContext2D, size: number, n: number, color: string, joint: number, bevel = 0) {
  const step = size / n;
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    ctx.fillRect(i * step - joint / 2, 0, joint, size);
    ctx.fillRect(0, i * step - joint / 2, size, joint);
  }
  ctx.fillRect(size - joint / 2, 0, joint, size);
  ctx.fillRect(0, size - joint / 2, size, joint);
  if (bevel > 0) {
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const x = i * step + joint / 2, y = j * step + joint / 2, s = step - joint;
        const g = ctx.createLinearGradient(x, y, x + s, y + s);
        g.addColorStop(0, `rgba(255,255,255,${bevel})`);
        g.addColorStop(0.5, "rgba(255,255,255,0)");
        g.addColorStop(1, `rgba(0,0,0,${bevel})`);
        ctx.fillStyle = g;
        ctx.fillRect(x, y, s, s);
      }
  }
}

function tiles(
  ctx: CanvasRenderingContext2D,
  size: number,
  n: number,
  rnd: () => number,
  palette: string[],
  jointColor: string,
  joint: number,
  vary = 0.12,
  noise?: Noise,
) {
  const step = size / n;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const base = hex(palette[Math.floor(rnd() * palette.length)]);
      const f = 1 - vary / 2 + rnd() * vary;
      const x0 = i * step, y0 = j * step;
      const img = ctx.createImageData(Math.ceil(step), Math.ceil(step));
      for (let y = 0; y < img.height; y++)
        for (let x = 0; x < img.width; x++) {
          const u = (x0 + x) / size, v = (y0 + y) / size;
          const nz = noise ? noise.fbm(u, v, 16, 3) : 0.5;
          const ex = Math.min(x, img.width - x, y, img.height - y) / step;
          const edge = 0.82 + 0.18 * smooth(0, 0.18, ex);
          const c = shade(base, f * edge * (0.9 + nz * 0.2));
          const k = (y * img.width + x) * 4;
          img.data[k] = c[0];
          img.data[k + 1] = c[1];
          img.data[k + 2] = c[2];
          img.data[k + 3] = 255;
        }
      ctx.putImageData(img, x0, y0);
    }
  grid(ctx, size, n, jointColor, joint);
}

function slats(
  ctx: CanvasRenderingContext2D,
  size: number,
  n: number,
  wood: RGB,
  gap: string,
  gapW: number,
  noise: Noise,
) {
  fill(ctx, size, (u, v) => {
    const grain = noise.fbm(u, v, 3, 5, 48);
    const ring = 0.5 + 0.5 * Math.sin(TAU * (u * n * 3) + grain * 14);
    return shade(wood, 0.78 + grain * 0.3 + ring * 0.08);
  });
  const step = size / n;
  for (let i = 0; i < n; i++) {
    const x = i * step;
    ctx.fillStyle = gap;
    ctx.fillRect(x - gapW / 2, 0, gapW, size);
    const g = ctx.createLinearGradient(x + gapW / 2, 0, x + step - gapW / 2, 0);
    g.addColorStop(0, "rgba(255,255,255,0.10)");
    g.addColorStop(0.5, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.28)");
    ctx.fillStyle = g;
    ctx.fillRect(x + gapW / 2, 0, step - gapW, size);
  }
}

function marbleFn(n: Noise, base: RGB, cloud: RGB, vein: RGB, width: number, strength = 0.9): PixelFn {
  return (u, v) => {
    const w = n.fbm(u, v, 2, 6);
    const w2 = n.fbm(v, u, 4, 5);
    const s = Math.sin(TAU * (u + 2 * v) + w * 6.5);
    const s2 = Math.sin(TAU * (3 * u - v) + w2 * 9);
    // A sharp core with a soft mineral halo reads as stone rather than ink.
    const v1 = (1 - smooth(0, width, Math.abs(s))) * (0.55 + 0.45 * n.fbm(u, v, 8, 3));
    const halo = 1 - smooth(0, width * 5, Math.abs(s));
    const v2 = 1 - smooth(0, width * 0.35, Math.abs(s2));
    let c = mix(base, cloud, smooth(0.3, 0.8, n.fbm(u, v, 5, 5)) * 0.7);
    c = mix(c, cloud, halo * 0.45);
    c = mix(c, vein, v1 * strength);
    c = mix(c, vein, v2 * 0.3);
    return c;
  };
}

function specks(ctx: CanvasRenderingContext2D, size: number, rnd: () => number, count: number, colors: string[], rMin: number, rMax: number) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[Math.floor(rnd() * colors.length)];
    const r = rMin + rnd() * (rMax - rMin);
    const x = rnd() * size, y = rnd() * size;
    for (const ox of [-size, 0, size])
      for (const oy of [-size, 0, size]) {
        if (x + ox < -r || x + ox > size + r || y + oy < -r || y + oy > size + r) continue;
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, r, 0, TAU);
        ctx.fill();
      }
  }
}

export function drawTexture(ctx: CanvasRenderingContext2D, kind: TexKind, size: number, seed = 1) {
  const n = new Noise(seed);
  const rnd = mulberry32(seed * 1013 + kind.length * 17);
  const S = size / 512; // scale constant for px-based details

  switch (kind) {
    case "marble":
      return fill(ctx, size, marbleFn(n, hex("#ebe7e0"), hex("#d6d1c8"), hex("#6f6a63"), 0.05));
    case "calacatta":
      return fill(ctx, size, marbleFn(n, hex("#f1eee8"), hex("#e2dcd1"), hex("#8b7552"), 0.09));
    case "verde":
      return fill(ctx, size, marbleFn(n, hex("#1d3a33"), hex("#2e5a4e"), hex("#cfe0d8"), 0.05));
    case "nero":
      return fill(ctx, size, marbleFn(n, hex("#141414"), hex("#262626"), hex("#e8e3da"), 0.035));
    case "travertine":
      fill(ctx, size, (u, v) => {
        // Sedimentary bands with fine, horizontally stretched voids.
        const w = n.fbm(u, v, 3, 5);
        const band = 0.5 + 0.5 * Math.sin(TAU * (v * 9) + w * 4);
        const fine = 0.5 + 0.5 * Math.sin(TAU * (v * 37) + w * 9);
        let c = mix(hex("#e0d0b3"), hex("#c9ae88"), band * 0.5 + n.fbm(u, v, 2, 4) * 0.35);
        c = shade(c, 0.96 + fine * 0.06);
        const pore = n.fbm(u, v, 6, 3, 90);
        if (pore < 0.3) c = mix(c, hex("#9c8462"), smooth(0.3, 0.2, pore) * 0.85);
        return c;
      });
      return;
    case "granite":
      fill(ctx, size, (u, v) => {
        const g = n.sample(u, v, 140);
        const h = n.sample(v, u, 90);
        let c = mix(hex("#b8ada4"), hex("#8e8580"), n.fbm(u, v, 6, 3));
        if (g < 0.32) c = mix(c, hex("#1d1b1a"), smooth(0.32, 0.22, g));
        if (h > 0.72) c = mix(c, hex("#ece6df"), smooth(0.72, 0.85, h));
        return c;
      });
      return;
    case "graniteBlack":
      fill(ctx, size, (u, v) => {
        const g = n.sample(u, v, 160);
        let c = shade(hex("#1a1a1b"), 0.85 + n.fbm(u, v, 8, 3) * 0.3);
        if (g > 0.8) c = mix(c, hex("#9aa0a6"), smooth(0.8, 0.92, g));
        return c;
      });
      specks(ctx, size, rnd, 90, ["rgba(230,220,200,0.8)"], 0.5 * S, 1.3 * S);
      return;
    case "limestone":
      fill(ctx, size, (u, v) =>
        mix(hex("#ddd4c3"), hex("#c8bca6"), smooth(0.35, 0.75, n.fbm(u, v, 4, 5)) * 0.8),
      );
      specks(ctx, size, rnd, 60, ["rgba(120,105,85,0.35)"], 0.6 * S, 2 * S);
      return;
    case "onyx":
      return fill(ctx, size, (u, v) => {
        const w = n.fbm(u, v, 3, 5);
        const b = 0.5 + 0.5 * Math.sin(TAU * (u + 3 * v) + w * 12);
        const b2 = 0.5 + 0.5 * Math.sin(TAU * (2 * u + 5 * v) + w * 20);
        let c = mix(hex("#f2dfb6"), hex("#c88a45"), b);
        c = mix(c, hex("#7a4a22"), smooth(0.85, 1, b2) * 0.6);
        return c;
      });
    case "quartz":
      fill(ctx, size, (u, v) => mix(hex("#ebe9e4"), hex("#d8d4cc"), n.fbm(u, v, 5, 4) * 0.6));
      specks(ctx, size, rnd, 900, ["rgba(90,88,84,0.55)", "rgba(160,150,138,0.5)", "rgba(255,255,255,0.8)"], 0.4 * S, 1.2 * S);
      return;
    case "sintered":
      return fill(ctx, size, (u, v) => {
        const c = mix(hex("#a39d95"), hex("#7f7a73"), smooth(0.3, 0.8, n.fbm(u, v, 3, 6)));
        return shade(c, 0.94 + n.sample(u, v, 200) * 0.1);
      });
    case "porcelain":
      fill(ctx, size, (u, v) => {
        const c = mix(hex("#b3afa8"), hex("#8f8a83"), smooth(0.3, 0.85, n.fbm(u, v, 4, 5)));
        return shade(c, 0.96 + n.sample(u, v, 180) * 0.08);
      });
      grid(ctx, size, 2, "rgba(60,58,55,0.55)", 2 * S, 0.05);
      return;
    case "glaze":
      tiles(ctx, size, 4, rnd, ["#dfe6e6", "#d6dfe0", "#e6ebea"], "#b9bdbb", 3 * S, 0.1, n);
      grid(ctx, size, 4, "rgba(0,0,0,0)", 0, 0.12);
      return;
    case "zellige":
      tiles(ctx, size, 8, rnd, ["#1e5d4c", "#23705b", "#194d40", "#2c7e68", "#17463a"], "#e8e2d6", 3 * S, 0.35, n);
      grid(ctx, size, 8, "rgba(0,0,0,0)", 0, 0.14);
      return;
    case "mosaic":
      tiles(ctx, size, 16, rnd, ["#e9e6df", "#cfd8d9", "#9fb3b8", "#6e8c95", "#ddd5c6"], "#f3f0ea", 2 * S, 0.12);
      return;
    case "cementTile": {
      ctx.fillStyle = "#e7dfd0";
      ctx.fillRect(0, 0, size, size);
      const t = size / 4;
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++) {
          const x = i * t, y = j * t;
          ctx.fillStyle = "#2f4a4a";
          for (const [cx, cy] of [[x, y], [x + t, y], [x, y + t], [x + t, y + t]]) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, t * 0.42, 0, TAU);
            ctx.fill();
          }
          ctx.fillStyle = "#b5694b";
          ctx.beginPath();
          ctx.moveTo(x + t / 2, y + t * 0.18);
          ctx.lineTo(x + t * 0.82, y + t / 2);
          ctx.lineTo(x + t / 2, y + t * 0.82);
          ctx.lineTo(x + t * 0.18, y + t / 2);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "#e7dfd0";
          ctx.beginPath();
          ctx.arc(x + t / 2, y + t / 2, t * 0.1, 0, TAU);
          ctx.fill();
        }
      // wear
      const img = ctx.getImageData(0, 0, size, size);
      for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++) {
          const f = 0.9 + n.fbm(x / size, y / size, 8, 4) * 0.18;
          const k = (y * size + x) * 4;
          img.data[k] *= f;
          img.data[k + 1] *= f;
          img.data[k + 2] *= f;
        }
      ctx.putImageData(img, 0, 0);
      grid(ctx, size, 4, "rgba(70,60,50,0.45)", 2 * S);
      return;
    }
    case "terrazzo": {
      fill(ctx, size, (u, v) => shade(hex("#e3dcd0"), 0.95 + n.fbm(u, v, 16, 3) * 0.1));
      const cols = ["#6b6660", "#b48a6a", "#2c2c2c", "#cfc5b4", "#8e9a8f", "#c9a57c", "#f4f1ea"];
      for (let i = 0; i < 260; i++) {
        const x = rnd() * size, y = rnd() * size;
        const r = (3 + rnd() * rnd() * 16) * S;
        const verts = 4 + Math.floor(rnd() * 3);
        const rot = rnd() * TAU;
        ctx.fillStyle = cols[Math.floor(rnd() * cols.length)];
        for (const ox of [-size, 0, size])
          for (const oy of [-size, 0, size]) {
            if (x + ox < -r * 2 || x + ox > size + r * 2 || y + oy < -r * 2 || y + oy > size + r * 2) continue;
            ctx.beginPath();
            for (let k = 0; k < verts; k++) {
              const a = rot + (k / verts) * TAU;
              const rr = r * (0.6 + rnd() * 0.5);
              ctx.lineTo(x + ox + Math.cos(a) * rr, y + oy + Math.sin(a) * rr);
            }
            ctx.closePath();
            ctx.fill();
          }
      }
      return;
    }
    case "outdoor":
      fill(ctx, size, (u, v) => {
        const c = mix(hex("#b9ac98"), hex("#968a78"), smooth(0.25, 0.8, n.fbm(u, v, 4, 5)));
        return shade(c, 0.88 + n.sample(u, v, 220) * 0.2);
      });
      grid(ctx, size, 2, "rgba(55,50,44,0.6)", 4 * S, 0.06);
      return;
    case "paint":
      return fill(ctx, size, (u, v) => {
        const stroke = n.fbm(u, v, 4, 5, 28);
        const c = mix(hex("#2f5a4e"), hex("#4f8474"), smooth(0.25, 0.8, stroke));
        return shade(c, 0.93 + n.sample(u, v, 256) * 0.1);
      });
    case "facade":
      return fill(ctx, size, (u, v) => {
        const c = mix(hex("#dcd1bf"), hex("#c6b89f"), n.fbm(u, v, 3, 4) * 0.6);
        return shade(c, 0.8 + n.sample(u, v, 256) * 0.3);
      });
    case "microcement":
      return fill(ctx, size, (u, v) => {
        const w = n.fbm(u, v, 3, 4);
        const trowel = n.fbm(u + w * 0.3, v + w * 0.15, 6, 5, 3);
        let c = mix(hex("#b8b0a5"), hex("#958c80"), smooth(0.3, 0.75, trowel));
        c = mix(c, hex("#cfc7bc"), smooth(0.7, 0.9, n.fbm(v, u, 5, 4)) * 0.5);
        return c;
      });
    case "tadelakt":
      return fill(ctx, size, (u, v) => {
        const w = n.fbm(u, v, 3, 6);
        return mix(hex("#c78a5e"), hex("#9c6440"), smooth(0.3, 0.8, n.fbm(u + w * 0.4, v, 5, 5)));
      });
    case "metallic":
      return fill(ctx, size, (u, v) => {
        const w = n.fbm(u, v, 3, 5);
        const s = 0.5 + 0.5 * Math.sin(TAU * (u + v) + w * 9);
        return mix(hex("#5b4b37"), hex("#d4b47e"), s * 0.8 + n.sample(u, v, 256) * 0.1);
      });
    case "resin":
      return fill(ctx, size, (u, v) => {
        const w1 = n.fbm(u, v, 2, 5);
        const w2 = n.fbm(u + w1 * 0.6, v + w1 * 0.6, 3, 5);
        const s = 0.5 + 0.5 * Math.sin(TAU * (u + v) + w2 * 16);
        let c = mix(hex("#15252c"), hex("#3c6a73"), s);
        c = mix(c, hex("#e0e6e3"), smooth(0.93, 1, s) * 0.8);
        return c;
      });
    case "gypsum":
      fill(ctx, size, (u, v) => shade(hex("#eceae5"), 0.97 + n.fbm(u, v, 8, 3) * 0.05));
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, 1.5 * S, size);
      return;
    case "ceilingGrid":
      fill(ctx, size, (u, v) => {
        const f = n.sample(u, v, 200);
        return shade(hex("#e8e6e1"), f < 0.15 ? 0.8 : 0.96 + n.fbm(u, v, 8, 2) * 0.05);
      });
      grid(ctx, size, 3, "#bfbab2", 5 * S, 0.06);
      return;
    case "acoustic":
      slats(ctx, size, 10, hex("#5b3f2b"), "#121212", 14 * S, n);
      return;
    case "woodSlats":
      slats(ctx, size, 7, hex("#b88d5e"), "#2a211a", 10 * S, n);
      return;
    case "partition": {
      fill(ctx, size, (u, v) => {
        const r = smooth(0.2, 0.9, 1 - Math.abs(((u + v * 0.6) % 1) - 0.5) * 2);
        return mix(hex("#1f2629"), hex("#4b575c"), r * 0.5 + n.fbm(u, v, 3, 3) * 0.2);
      });
      ctx.fillStyle = "#a3a8ab";
      for (const x of [0, size / 2]) ctx.fillRect(x - 5 * S, 0, 10 * S, size);
      ctx.fillRect(0, size * 0.75, size, 6 * S);
      return;
    }
    case "moulding": {
      fill(ctx, size, (u, v) => shade(hex("#e7e2d9"), 0.97 + n.fbm(u, v, 8, 2) * 0.04));
      const m = 40 * S;
      const frame = (x: number, y: number, w: number, h: number) => {
        ctx.lineWidth = 6 * S;
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.strokeRect(x, y, w, h);
        ctx.lineWidth = 2 * S;
        ctx.strokeStyle = "rgba(90,80,65,0.35)";
        ctx.strokeRect(x + 4 * S, y + 4 * S, w - 8 * S, h - 8 * S);
      };
      frame(m, m, size / 2 - m * 1.5, size - m * 2);
      frame(size / 2 + m / 2, m, size / 2 - m * 1.5, size - m * 2);
      return;
    }
    case "stretch":
      return fill(ctx, size, (u, v) => {
        const d = Math.hypot(u - 0.5, v - 0.5);
        return mix(hex("#f5f3ef"), hex("#cfccc6"), smooth(0.05, 0.7, d));
      });
    case "adhesive":
      return fill(ctx, size, (u, v) => {
        const ridge = 0.5 + 0.5 * Math.sin(TAU * ((u + v) * 16) + n.fbm(u, v, 4, 3) * 1.5);
        const c = mix(hex("#7f7c77"), hex("#b3afa8"), ridge);
        return shade(c, 0.9 + n.sample(u, v, 256) * 0.2);
      });
    case "grout":
      tiles(ctx, size, 6, rnd, ["#efece6", "#e9e6df"], "#8d8a85", 7 * S, 0.05);
      return;
    case "screed":
      fill(ctx, size, (u, v) => {
        const wave = 0.5 + 0.5 * Math.sin(TAU * (u * 2 + v) + n.fbm(u, v, 3, 4) * 6);
        return mix(hex("#8d8a85"), hex("#a29e97"), wave * 0.5 + n.fbm(u, v, 8, 3) * 0.3);
      });
      specks(ctx, size, rnd, 40, ["rgba(40,40,40,0.5)"], 0.6 * S, 1.4 * S);
      return;
    case "membrane":
      fill(ctx, size, (u, v) => {
        const g = n.sample(u, v, 220);
        return shade(hex("#26292c"), 0.75 + g * 0.5);
      });
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, size * 0.62, size, 3 * S);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(0, size * 0.62 + 3 * S, size, 10 * S);
      return;
    case "powder":
      return fill(ctx, size, (u, v) => {
        const g = n.sample(u, v, 256);
        const c = mix(hex("#cbc6bd"), hex("#a8a298"), n.fbm(u, v, 4, 4) * 0.7);
        return shade(c, 0.82 + g * 0.3);
      });
    case "metal":
      return fill(ctx, size, (u, v) => {
        const streak = n.fbm(u, v, 2, 3, 256);
        const c = mix(hex("#7d8387"), hex("#b9bec1"), streak * 0.7 + v * 0.2);
        return c;
      });
    case "kiln":
      return fill(ctx, size, (u, v) => {
        const w = n.fbm(u, v, 3, 5);
        const heat = smooth(0.2, 1, 1 - Math.abs(v - 0.5) * 1.6 + (w - 0.5) * 0.6);
        let c = mix(hex("#2a1a12"), hex("#c9531f"), heat);
        c = mix(c, hex("#f6c16a"), smooth(0.75, 1, heat) * 0.8);
        return c;
      });
    case "inkjet": {
      ctx.fillStyle = "#f2efe9";
      ctx.fillRect(0, 0, size, size);
      const step = size / 32;
      const layers: [string, number, number][] = [
        ["rgba(0,160,200,0.55)", 0, 0],
        ["rgba(210,40,120,0.5)", step / 3, step / 3],
        ["rgba(240,200,0,0.55)", (2 * step) / 3, step / 6],
      ];
      layers.forEach(([col, ox, oy], li) => {
        ctx.fillStyle = col;
        for (let i = 0; i < 33; i++)
          for (let j = 0; j < 33; j++) {
            const u = (i * step) / size, v = (j * step) / size;
            const r = step * 0.45 * n.fbm((u + li * 0.3) % 1, v, 3, 3);
            ctx.beginPath();
            ctx.arc(i * step + ox, j * step + oy, r, 0, TAU);
            ctx.fill();
          }
      });
      return;
    }
    case "perforated": {
      fill(ctx, size, (u, v) => mix(hex("#5d6368"), hex("#8a9095"), n.fbm(u, v, 2, 3, 128) * 0.7));
      const step = size / 16;
      ctx.fillStyle = "#101214";
      for (let i = 0; i < 16; i++)
        for (let j = 0; j < 16; j++) {
          ctx.beginPath();
          ctx.arc(i * step + step / 2 + (j % 2 ? step / 2 : 0), j * step + step / 2, step * 0.28, 0, TAU);
          ctx.fill();
        }
      return;
    }
    case "pigment":
      return fill(ctx, size, (u, v) => {
        const a = n.fbm(u, v, 3, 5);
        const cols = [hex("#b5562f"), hex("#d39a3c"), hex("#e8e1d4"), hex("#6d6a66")];
        const idx = Math.min(3, Math.floor(smooth(0.3, 0.7, a) * 4));
        return shade(cols[idx], 0.85 + n.sample(u, v, 256) * 0.25);
      });
  }
}

/* ---------- caching (browser only) ---------- */

const urlCache = new Map<string, string>();
const canvasCache = new Map<string, HTMLCanvasElement>();

export function textureCanvas(kind: TexKind, size = 320, seed = 1): HTMLCanvasElement {
  const key = `${kind}:${size}:${seed}`;
  let c = canvasCache.get(key);
  if (!c) {
    c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    drawTexture(ctx, kind, size, seed);
    canvasCache.set(key, c);
  }
  return c;
}

export function textureURL(kind: TexKind, size = 320, seed = 1): string {
  const key = `${kind}:${size}:${seed}`;
  let u = urlCache.get(key);
  if (!u) {
    u = textureCanvas(kind, size, seed).toDataURL("image/webp", 0.86);
    urlCache.set(key, u);
  }
  return u;
}

export function cachedTextureURL(kind: TexKind, size = 320, seed = 1) {
  return urlCache.get(`${kind}:${size}:${seed}`);
}

/** Average tone per kind, used as instant placeholder before generation. */
export const texTone: Record<TexKind, string> = {
  marble: "#e3ded6", calacatta: "#ebe6dd", verde: "#264a40", nero: "#1c1c1c", travertine: "#cfba96",
  granite: "#a39891", graniteBlack: "#1b1b1c", limestone: "#d5cbb8", onyx: "#dcae6c", quartz: "#e2dfd9",
  sintered: "#928c85", porcelain: "#a19d96", glaze: "#d9e0e0", zellige: "#1f5e4d", mosaic: "#c2cccd",
  cementTile: "#8a8272", terrazzo: "#d8d0c3", outdoor: "#a79a86", paint: "#3f6f61", facade: "#d2c6b1",
  microcement: "#a79f94", tadelakt: "#b1774e", metallic: "#9a8358", resin: "#2e4e56", gypsum: "#ebe9e4",
  ceilingGrid: "#dedbd5", acoustic: "#3e2c20", woodSlats: "#9c7650", partition: "#3a4448", moulding: "#e2ddd3",
  stretch: "#e6e3de", adhesive: "#99958f", grout: "#dcd8d1", screed: "#97938d", membrane: "#26292c",
  powder: "#bab4aa", metal: "#9aa0a3", kiln: "#8a3a1a", inkjet: "#c9c0c6", perforated: "#4a5054", pigment: "#b88a57",
};

/** Surface response used by the WebGL scene. */
export const texFinish: Partial<Record<TexKind, { roughness: number; metalness?: number }>> = {
  marble: { roughness: 0.18 }, calacatta: { roughness: 0.15 }, verde: { roughness: 0.2 }, nero: { roughness: 0.12 },
  onyx: { roughness: 0.15 }, quartz: { roughness: 0.3 }, glaze: { roughness: 0.12 }, zellige: { roughness: 0.18 },
  resin: { roughness: 0.1 }, stretch: { roughness: 0.2 }, metallic: { roughness: 0.35, metalness: 0.6 },
  metal: { roughness: 0.35, metalness: 0.85 }, perforated: { roughness: 0.45, metalness: 0.7 },
  partition: { roughness: 0.15, metalness: 0.3 },
};

/* ---------- PBR: surface response + relief maps ---------- */

export type PBR = {
  /** Normal-map strength from the texture's relief. */
  bump: number;
  roughness: number;
  /** Extra roughness in the recesses (joints, pores, gaps). */
  roughVar: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  ior?: number;
  thickness?: number;
  attenuation?: string;
  sheen?: number;
  anisotropy?: number;
  emissive?: number;
  /** Real-world size (m) covered by one texture repeat. */
  world: number;
};

const P = (p: Partial<PBR> & { world: number }): PBR => ({ bump: 2, roughness: 0.6, roughVar: 0.25, ...p });
const polished = { roughness: 0.1, roughVar: 0.12, clearcoat: 1, clearcoatRoughness: 0.04 };

export const pbr: Record<TexKind, PBR> = {
  marble: P({ ...polished, bump: 0.8, world: 3.2 }),
  calacatta: P({ ...polished, bump: 0.8, world: 3.2 }),
  verde: P({ ...polished, bump: 0.8, world: 3 }),
  nero: P({ ...polished, bump: 0.6, world: 3 }),
  onyx: P({ ...polished, bump: 0.5, transmission: 0.45, ior: 1.57, thickness: 0.35, attenuation: "#b86a28", world: 2.5 }),
  quartz: P({ ...polished, roughness: 0.2, clearcoat: 0.6, bump: 0.8, world: 1.5 }),
  granite: P({ ...polished, roughness: 0.22, bump: 1.4, world: 1.5 }),
  graniteBlack: P({ ...polished, bump: 1, world: 1.5 }),
  travertine: P({ bump: 3, roughness: 0.5, roughVar: 0.35, world: 1.8 }),
  limestone: P({ bump: 3, roughness: 0.72, world: 2 }),
  sintered: P({ bump: 1.5, roughness: 0.45, world: 3 }),
  porcelain: P({ bump: 5, roughness: 0.42, roughVar: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.3, world: 1.2 }),
  glaze: P({ bump: 6, roughness: 0.05, roughVar: 0.85, clearcoat: 1, clearcoatRoughness: 0.03, world: 0.8 }),
  zellige: P({ bump: 7, roughness: 0.05, roughVar: 0.85, clearcoat: 1, clearcoatRoughness: 0.06, world: 0.8 }),
  mosaic: P({ bump: 6, roughness: 0.08, roughVar: 0.8, clearcoat: 0.8, clearcoatRoughness: 0.05, world: 0.5 }),
  cementTile: P({ bump: 2.5, roughness: 0.7, world: 0.8 }),
  terrazzo: P({ ...polished, roughness: 0.16, clearcoat: 0.9, bump: 1.5, world: 1 }),
  outdoor: P({ bump: 7, roughness: 0.85, world: 1.2 }),
  paint: P({ bump: 2.5, roughness: 0.82, sheen: 0.3, world: 2 }),
  facade: P({ bump: 8, roughness: 0.95, world: 1.5 }),
  microcement: P({ bump: 2, roughness: 0.45, clearcoat: 0.35, clearcoatRoughness: 0.35, world: 2.5 }),
  tadelakt: P({ bump: 1.5, roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.15, world: 2 }),
  metallic: P({ bump: 1.5, roughness: 0.3, metalness: 0.75, world: 2 }),
  resin: P({ bump: 0.4, roughness: 0.03, roughVar: 0.02, clearcoat: 1, clearcoatRoughness: 0.01, world: 3 }),
  gypsum: P({ bump: 1, roughness: 0.92, world: 1.2 }),
  ceilingGrid: P({ bump: 6, roughness: 0.9, world: 1.8 }),
  acoustic: P({ bump: 9, roughness: 0.62, roughVar: 0.35, world: 1.2 }),
  woodSlats: P({ bump: 9, roughness: 0.48, roughVar: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.3, world: 1 }),
  partition: P({ bump: 1, roughness: 0.04, roughVar: 0.2, transmission: 0.75, ior: 1.5, thickness: 0.05, world: 2.4 }),
  moulding: P({ bump: 7, roughness: 0.6, world: 2 }),
  stretch: P({ bump: 0.2, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.02, world: 4 }),
  adhesive: P({ bump: 9, roughness: 0.9, world: 1 }),
  grout: P({ bump: 6, roughness: 0.65, world: 0.9 }),
  screed: P({ bump: 2, roughness: 0.75, world: 2 }),
  membrane: P({ bump: 6, roughness: 0.78, world: 2 }),
  powder: P({ bump: 5, roughness: 0.96, world: 1 }),
  metal: P({ bump: 1.2, roughness: 0.32, roughVar: 0.1, metalness: 1, anisotropy: 0.8, world: 2 }),
  kiln: P({ bump: 2, roughness: 0.7, emissive: 2.2, world: 2 }),
  inkjet: P({ bump: 1, roughness: 0.4, world: 1 }),
  perforated: P({ bump: 10, roughness: 0.38, metalness: 0.9, world: 1 }),
  pigment: P({ bump: 4, roughness: 1, world: 2 }),
};

/**
 * Normal and roughness maps derived from the colour texture's relief:
 * joints, pores, slat gaps and holes are darker, so luminance works as height.
 * Roughness is packed in the green channel as three.js expects.
 */
export function reliefMaps(kind: TexKind, size: number, seed = 1) {
  const key = `${kind}:${size}:${seed}:relief`;
  const hit = reliefCache.get(key);
  if (hit) return hit;
  const src = textureCanvas(kind, size, seed);
  const data = src.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, size, size).data;
  const { normal: nImg, rough: rImg } = reliefData(kind, size, data);
  const normal = document.createElement("canvas");
  const rough = document.createElement("canvas");
  normal.width = normal.height = rough.width = rough.height = size;
  normal.getContext("2d")!.putImageData(nImg, 0, 0);
  rough.getContext("2d")!.putImageData(rImg, 0, 0);
  const out = { color: src, normal, rough };
  reliefCache.set(key, out);
  return out;
}

/**
 * Pure pixel work behind `reliefMaps`: normal and roughness from the colour's
 * luminance. No DOM, so it also runs inside the texture worker.
 */
export function reliefData(kind: TexKind, size: number, data: Uint8ClampedArray) {
  const h = new Float32Array(size * size);
  let lo = 1, hi = 0;
  for (let i = 0; i < h.length; i++) {
    const v = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) / 255;
    h[i] = v;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  const span = Math.max(1e-3, hi - lo);
  for (let i = 0; i < h.length; i++) h[i] = (h[i] - lo) / span;

  const p = pbr[kind];
  const nImg = new ImageData(size, size);
  const rImg = new ImageData(size, size);
  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)];
  const k = p.bump * (size / 512);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      // Sobel gradient, wrapped so the maps tile like the colour texture.
      const dx =
        at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1);
      const dy =
        at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1);
      let nx = -dx * k, ny = dy * k;
      const nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len;
      ny /= len;
      const i = (y * size + x) * 4;
      nImg.data[i] = (nx * 0.5 + 0.5) * 255;
      nImg.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      nImg.data[i + 2] = (nz / len) * 255;
      nImg.data[i + 3] = 255;
      const r = clamp01(p.roughness + p.roughVar * Math.pow(1 - h[y * size + x], 2.2));
      rImg.data[i] = 0;
      rImg.data[i + 1] = r * 255;
      rImg.data[i + 2] = 0;
      rImg.data[i + 3] = 255;
    }
  return { normal: nImg, rough: rImg };
}
const reliefCache = new Map<string, { color: HTMLCanvasElement; normal: HTMLCanvasElement; rough: HTMLCanvasElement }>();
