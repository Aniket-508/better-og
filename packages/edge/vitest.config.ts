import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@better-og/edge": fileURLToPath(
        new URL("src/index.ts", import.meta.url)
      ),
      "better-og": fileURLToPath(
        new URL("../better-og/src/index.ts", import.meta.url)
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
