import { ImageResponse } from "@takumi-rs/image-response";
import type { ImageResponseOptions } from "@takumi-rs/image-response";
import { getFontsForRequest, getOgContext } from "better-og";
import type { OgAdapterOptions, OgContext } from "better-og";
import type { ReactNode } from "react";

import {
  applyStableCacheHeaders,
  resolveLocaleFromParams,
  withOgRewrite,
} from "./shared";
import type { OgRewriteOptions, OgRouteHandlerContext } from "./shared";

type NextImageResponseOptions = Omit<
  ImageResponseOptions,
  "fonts" | "format" | "height" | "loadDefaultFonts" | "renderer" | "width"
>;

export interface NextOgHandlerOptions extends OgAdapterOptions {
  component: ReactNode;
}

export const createOgRouteHandler =
  (options: NextOgHandlerOptions & NextImageResponseOptions) =>
  async (
    request: Request,
    context?: OgRouteHandlerContext
  ): Promise<Response> => {
    const {
      component,
      fallbackFonts,
      fonts: configuredFonts,
      format,
      getFontsForLocale,
      getOgContext: getOgContextOverride,
      loadDefaultFonts,
      localeFromRequest,
      ...imageResponseOptions
    } = options;
    const params = context?.params ? await context.params : undefined;
    const locale =
      localeFromRequest?.(request) ?? resolveLocaleFromParams(params);
    const ogContext: OgContext = getOgContextOverride
      ? await getOgContextOverride(request)
      : getOgContext(request);
    const fonts = await getFontsForRequest(
      { locale, request },
      {
        fallbackFonts,
        fonts: configuredFonts,
        getFontsForLocale,
      }
    );

    const response = new ImageResponse(component, {
      ...imageResponseOptions,
      fonts,
      format: format ?? "webp",
      height: ogContext.height,
      loadDefaultFonts: loadDefaultFonts ?? true,
      width: ogContext.width,
    });

    return applyStableCacheHeaders(response);
  };

export { withOgRewrite };
export type { OgRewriteOptions, OgRouteHandlerContext };
