import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typedRoutes: false,
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
