import { ImageResponse } from "@takumi-rs/image-response";
import { getFontsForRequest, getOgContext } from "better-og";
import type { OgAdapterOptions, OgContext } from "better-og";
import type { ReactNode } from "react";

import {
  applyStableCacheHeaders,
  resolveLocaleFromParams,
  withOgRewrite,
} from "./shared";
import type { OgRewriteOptions, OgRouteHandlerContext } from "./shared";

export interface NextOgHandlerOptions extends OgAdapterOptions {
  component: ReactNode;
}

export const createOgRouteHandler =
  (options: NextOgHandlerOptions) =>
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
      fonts,
      format: options.format ?? "webp",
      height: ogContext.height,
      loadDefaultFonts: options.loadDefaultFonts ?? true,
      width: ogContext.width,
    });

    return applyStableCacheHeaders(response);
  };

export { withOgRewrite };
export type { OgRewriteOptions, OgRouteHandlerContext };
