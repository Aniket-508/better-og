import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "#next-edge": fileURLToPath(new URL("src/edge.ts", import.meta.url)),
      "#next-utils": fileURLToPath(new URL("src/utils.ts", import.meta.url)),
      "@better-og/core": fileURLToPath(
        new URL("../better-og/src/index.ts", import.meta.url)
      ),
      "@better-og/next": fileURLToPath(
        new URL("src/index.ts", import.meta.url)
      ),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
  },
});
