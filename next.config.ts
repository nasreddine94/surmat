import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Event imagery generated with Higgsfield (content/event-media.ts). Only this account's folder is allowed.
    remotePatterns: [new URL("https://d8j0ntlcm91z4.cloudfront.net/user_39GebVBNf0LF9ZNbDOYTMnx1vfO/**")],
    formats: ["image/avif", "image/webp"],
    // Generated images never change at a given URL.
    minimumCacheTTL: 31_536_000,
  },
};

export default nextConfig;
