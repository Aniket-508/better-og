import workersWasmModule from "@takumi-rs/wasm/takumi_wasm_bg.wasm";

import { createOgHandler as createEdgeOgHandler } from "#edge";
import type { EdgeOgHandlerOptions } from "#edge";

export const createOgHandler = (
  options: Omit<EdgeOgHandlerOptions, "module">
) =>
  createEdgeOgHandler({
    ...options,
    module: workersWasmModule,
  });
