import workersWasmModule from "@takumi-rs/wasm/takumi_wasm_bg.wasm";
import { createOgHandler as createEdgeOgHandler } from "better-og/edge";
import type { EdgeOgHandlerOptions } from "better-og/edge";

export const createOgHandler = (
  options: Omit<EdgeOgHandlerOptions, "module">
) =>
  createEdgeOgHandler({
    ...options,
    module: workersWasmModule,
  });
