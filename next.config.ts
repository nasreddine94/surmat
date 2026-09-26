import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 75 is the default; the hero backdrop is served at 85 to keep its fine material detail.
    qualities: [75, 85],
    // Generated images never change at a given URL.
    minimumCacheTTL: 31_536_000,
  },
};

export default nextConfig;
