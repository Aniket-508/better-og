import fs from "node:fs";

import { defineConfig } from "tsdown";

const packageJson = JSON.parse(
  fs.readFileSync(new URL("package.json", import.meta.url), "utf8")
) as {
  version: string;
};

const sharedConfig = {
  dts: true,
  env: {
    VERSION: process.env.VERSION ?? packageJson.version,
  },
  fixedExtension: false,
  tsconfig: "./tsconfig.build.json",
};

export default defineConfig([
  {
    ...sharedConfig,
    clean: true,
    entry: {
      index: "./src/index.ts",
    },
  },
  {
    ...sharedConfig,
    entry: {
      "edge/index": "./src/edge/index.ts",
    },
  },
  {
    ...sharedConfig,
    entry: {
      "next/index": "./src/next/index.ts",
    },
  },
  {
    ...sharedConfig,
    entry: {
      "next/edge": "./src/next/edge.ts",
    },
  },
  {
    ...sharedConfig,
    entry: {
      "tanstack-start/index": "./src/tanstack-start/index.ts",
    },
  },
  {
    ...sharedConfig,
    entry: {
      "workers/index": "./src/workers/index.ts",
    },
  },
]);
