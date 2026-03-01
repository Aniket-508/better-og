import { ImageResponse } from "@takumi-rs/image-response/wasm";
import type { ImageResponseOptions } from "@takumi-rs/image-response/wasm";
import { getFontsForRequest, getOgContext } from "better-og";
import type { OgAdapterOptions, OgContext } from "better-og";
import type { ReactNode } from "react";

import {
  applyStableCacheHeaders,
  resolveLocaleFromParams,
  withOgRewrite,
} from "./shared";
import type { OgRewriteOptions, OgRouteHandlerContext } from "./shared";

export interface NextEdgeOgHandlerOptions extends OgAdapterOptions {
  component: ReactNode;
}

type EdgeFonts = Extract<ImageResponseOptions, { module: unknown }>["fonts"];

const nextWasmModule = (async () => {
  const nextModule = await import("@takumi-rs/wasm/next");

  return nextModule.default;
})();

export const createOgRouteHandler =
  (options: NextEdgeOgHandlerOptions) =>
  async (
    request: Request,
    context?: OgRouteHandlerContext
  ): Promise<Response> => {
    const params = context?.params ? await context.params : undefined;
    const locale =
      options.localeFromRequest?.(request) ?? resolveLocaleFromParams(params);
    const ogContext: OgContext = options.getOgContext
      ? await options.getOgContext(request)
      : getOgContext(request);
    const fonts = await getFontsForRequest({ locale, request }, options);

    const response = new ImageResponse(options.component, {
      fonts: fonts as EdgeFonts,
      format: options.format ?? "webp",
      height: ogContext.height,
      module: nextWasmModule,
      width: ogContext.width,
    });

    return applyStableCacheHeaders(response);
  };

export { withOgRewrite };
export type { OgRewriteOptions, OgRouteHandlerContext };
