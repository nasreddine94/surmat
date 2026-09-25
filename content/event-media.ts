/**
 * Event imagery (visualisations generated with Higgsfield). Served through next/image, which
 * resizes and converts them (AVIF / WebP) per screen. Replace `src` with real photography of the
 * editions as it becomes available; `visual: true` shows a small "Visualisation" label so these
 * are never mistaken for photos of a past edition.
 */
const HF = "https://d8j0ntlcm91z4.cloudfront.net/user_39GebVBNf0LF9ZNbDOYTMnx1vfO";

export type Media = { src: string; width: number; height: number; visual: boolean };

const img = (file: string, width: number, height: number): Media => ({ src: `${HF}/${file}`, width, height, visual: true });

export const media = {
  hall: img("hf_20260925_173036_1805952d-6711-498c-9a6b-04ca21b92b7b.png", 1344, 752),
  networking: img("hf_20260925_173036_8b928d35-2fc9-4a6d-96a1-f05834102183.png", 1168, 880),
  conference: img("hf_20260925_173105_58534f17-5a51-486d-9c79-89745c737d5f.png", 1344, 752),
  demo: img("hf_20260925_173037_0d68618a-f3bc-454f-8df6-16d32b77e93f.png", 1168, 880),
  stand: img("hf_20260925_173104_1f146f0f-d42c-49cb-96e0-db339bdd6752.png", 896, 1120),
  entrance: img("hf_20260925_173036_976da124-14a2-4491-9227-49c9026e3859.png", 1344, 752),
  algiers: img("hf_20260925_173037_9e1bb540-2fb0-4f43-9f41-077ed9786581.png", 1344, 752),
  dakar: img("hf_20260925_173036_2d6be3ba-4939-4c1f-91fe-dea711b98a1c.png", 1344, 752),
  lobby: img("hf_20260925_173036_0b08e9ba-cf4f-44b4-ad13-24a946382809.png", 1344, 752),
  facade: img("hf_20260925_173036_2683f2ac-1675-4175-8e66-9d28aaa30eee.png", 1168, 880),
  library: img("hf_20260925_173104_efb395a5-0597-4e97-9041-097aa067078a.png", 1344, 752),
  aerial: img("hf_20260925_173036_5ae86a23-926a-4f95-b2a0-68b5201bdc81.png", 1344, 752),
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof media;
