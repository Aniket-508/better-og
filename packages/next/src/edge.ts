import type { ImageResponseOptions as TakumiWasmImageResponseOptions } from "@takumi-rs/image-response/wasm";
import {
  applyStableCacheHeaders,
  resolveOgComponent,
  resolveLocaleFromParams,
  resolveOgRequestState,
} from "better-og";
import type { OgAdapterOptions, OgComponentFactory } from "better-og";
import { ImageResponse as NextImageResponse } from "next/og";
import type { ReactElement, ReactNode } from "react";

import { normalizeFontsForNextImageResponse } from "./utils";
import type { OgRouteHandlerContext } from "./utils";

type NextProviderImageResponseOptions = Omit<
  NonNullable<ConstructorParameters<typeof NextImageResponse>[1]>,
  "fonts" | "height" | "width"
>;
type TakumiProviderImageResponseOptions = Omit<
  TakumiWasmImageResponseOptions,
  "fonts" | "format" | "height" | "module" | "width"
>;

export interface NextEdgeOgHandlerOptions
  extends
    OgAdapterOptions,
    NextProviderImageResponseOptions,
    TakumiProviderImageResponseOptions {
  component: ReactNode | OgComponentFactory<ReactNode>;
  provider?: "next" | "takumi";
}

export const createOgRouteHandler =
  (options: NextEdgeOgHandlerOptions) =>
  async (
    request: Request,
    context?: OgRouteHandlerContext
  ): Promise<Response> => {
    const params = context?.params ? await context.params : undefined;
    const {
      component,
      fallbackFontLocales,
      fonts: configuredFonts,
      format: _format,
      getFallbackFontsForLocale,
      getFontsForLocale,
      getOgContext: getOgContextOverride,
      loadDefaultFonts: _loadDefaultFonts,
      localeFromRequest,
      provider = "next",
      ...imageResponseOptions
    } = options;
    const resolvedLocaleFromRequest = (input: Request): string | undefined =>
      localeFromRequest?.(input) ?? resolveLocaleFromParams(params);

    if (provider === "takumi") {
      throw new Error(
        "@better-og/next/edge currently only supports the `next` provider. Use `@better-og/edge` with `module` from `@takumi-rs/wasm/next` if you need Takumi on Next Edge before the Vercel duplicate-WASM fix lands."
      );
    }

    const locale = resolvedLocaleFromRequest(request);
    const { fonts, ogContext } = await resolveOgRequestState({
      configuredFonts,
      fallbackFontLocales,
      getFallbackFontsForLocale,
      getFontsForLocale,
      getOgContextOverride,
      locale,
      request,
    });
    const resolvedComponent = resolveOgComponent(component, ogContext);
    const nextFonts = normalizeFontsForNextImageResponse(fonts);

    return applyStableCacheHeaders(
      new NextImageResponse(resolvedComponent as ReactElement, {
        ...imageResponseOptions,
        ...(nextFonts ? { fonts: nextFonts } : {}),
        height: ogContext.height,
        width: ogContext.width,
      })
    );
  };

export type { OgRouteHandlerContext };
