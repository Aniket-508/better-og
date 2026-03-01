import workersWasmModule from "@takumi-rs/wasm/takumi_wasm_bg.wasm";
import { createOgHandler as createEdgeOgHandler } from "better-og/edge";
import type { EdgeOgHandlerOptions } from "better-og/edge";

export interface WorkersOgHandlerOptions extends Omit<
  EdgeOgHandlerOptions,
  "module"
> {
  component: EdgeOgHandlerOptions["component"];
}

export const createOgHandler = (options: WorkersOgHandlerOptions) =>
  createEdgeOgHandler({
    ...options,
    module: workersWasmModule,
  });
