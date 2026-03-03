import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: ["@takumi-rs/image-response"],
  transpilePackages: ["better-og", "@better-og/next"],
};

export default withMDX(config);
