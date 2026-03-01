import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/image-response"],
  turbopack: {
    resolveAlias: {
      "@takumi-rs/wasm/no-bundler": "@takumi-rs/wasm/next",
    },
  },
};

export default nextConfig;
