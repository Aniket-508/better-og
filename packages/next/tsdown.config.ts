import { defineConfig } from "tsdown";

const sharedConfig = {
  dts: true,
  fixedExtension: false,
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
