import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2400],
    imageSizes: [160, 320, 480, 640],
    qualities: [70, 80],
  },
  async headers() {
    return [
      // The page itself must always revalidate, so a normal refresh shows the latest build (hashed
      // scripts, styles and media stay immutable and cached).
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }],
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
