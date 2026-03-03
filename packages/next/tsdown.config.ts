import { defineConfig } from "tsdown";

const sharedConfig = {
  dts: true,
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
      edge: "./src/edge.ts",
    },
  },
]);
