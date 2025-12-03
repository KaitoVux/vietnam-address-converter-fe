import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',              // Enable static HTML export
  trailingSlash: true,            // Better compatibility with static hosts
  images: {
    unoptimized: true,            // Required for static export
  },
};

export default nextConfig;
