import nextWasmModule from "@takumi-rs/wasm/next";
import { createOgHandler } from "better-og/edge";
import type { EdgeOgHandlerOptions } from "better-og/edge";

import { resolveLocaleFromParams } from "./utils";
import type { OgRouteHandlerContext } from "./utils";

export interface NextEdgeOgHandlerOptions extends Omit<
  EdgeOgHandlerOptions,
  "module"
> {
  component: EdgeOgHandlerOptions["component"];
}

export const createOgRouteHandler =
  (options: NextEdgeOgHandlerOptions) =>
  async (
    request: Request,
    context?: OgRouteHandlerContext
  ): Promise<Response> => {
    const params = context?.params ? await context.params : undefined;
    const { localeFromRequest } = options;
    const handler = createOgHandler({
      ...options,
      localeFromRequest: (input) =>
        localeFromRequest?.(input) ?? resolveLocaleFromParams(params),
      module: nextWasmModule,
    });

    return handler(request);
  };

export type { OgRouteHandlerContext };
