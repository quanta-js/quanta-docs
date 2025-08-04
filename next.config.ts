import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/docs/:path*.md',
        destination: '/docs/:path*?format=md',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com/**",
      },
    ],
  },
  transpilePackages: ["next-mdx-remote"],
  trailingSlash: false
};

export default nextConfig;
