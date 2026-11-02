import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Forces browser to load images directly, fixing local network timeouts
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;