import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@takumi-rs/image-response"],
  transpilePackages: ["@better-og/core", "@better-og/next"],
};

export default withMDX(config);
