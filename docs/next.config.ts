import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
  rewrites() {
    return {
      beforeFiles: [
        {
          destination: "/llms.txt",
          has: [
            {
              key: "accept",
              type: "header",
              value: "(.*)text/markdown(.*)",
            },
          ],
          source: "/",
        },
        {
          destination: "/llms.txt",
          source: "/llm.txt",
        },
        {
          destination: "/llms.mdx/docs/:path*",
          has: [
            {
              key: "accept",
              type: "header",
              value: "(.*)text/markdown(.*)",
            },
          ],
          source: "/docs/:path*",
        },
        {
          destination: "/llms.mdx/docs/:path*",
          source: "/docs/:path*\\.mdx",
        },
      ],
    };
  },
  serverExternalPackages: ["@takumi-rs/image-response"],
  transpilePackages: ["@better-og/core", "@better-og/next"],
};

export default withMDX(config);
