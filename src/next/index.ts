import type { ImageResponseOptions as TakumiImageResponseOptions } from "@takumi-rs/image-response";
import type { OgAdapterOptions } from "better-og";
import { ImageResponse as NextImageResponse } from "next/og";
import type { ReactElement, ReactNode } from "react";

import {
  applyStableCacheHeaders,
  loadGoogleFontForImageResponse,
  normalizeFontsForNextImageResponse,
  resolveOgRequestState,
  resolveLocaleFromParams,
  withOgRewrite,
} from "./utils";
import type { OgRewriteOptions, OgRouteHandlerContext } from "./utils";

type NextProviderImageResponseOptions = Omit<
  NonNullable<ConstructorParameters<typeof NextImageResponse>[1]>,
  "fonts" | "height" | "width"
>;
type TakumiProviderImageResponseOptions = Omit<
  TakumiImageResponseOptions,
  "fonts" | "format" | "height" | "loadDefaultFonts" | "renderer" | "width"
>;

interface TakumiImageResponseModule {
  ImageResponse: new (
    element: ReactNode,
    options?: TakumiImageResponseOptions
  ) => Response;
}

export interface NextOgHandlerOptions
  extends
    OgAdapterOptions,
    NextProviderImageResponseOptions,
    TakumiProviderImageResponseOptions {
  component: ReactNode;
  provider?: "next" | "takumi";
}

let takumiImageResponseModule: Promise<TakumiImageResponseModule> | undefined;

const loadTakumiImageResponseModule = (): Promise<TakumiImageResponseModule> =>
  import("@takumi-rs/image-response") as Promise<TakumiImageResponseModule>;

const getTakumiImageResponseModule = (): Promise<TakumiImageResponseModule> => {
  if (!takumiImageResponseModule) {
    takumiImageResponseModule = loadTakumiImageResponseModule();
  }

  return takumiImageResponseModule;
};

export const createOgRouteHandler =
  (options: NextOgHandlerOptions) =>
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
      provider = "next",
      ...imageResponseOptions
    } = options;
    const params = context?.params ? await context.params : undefined;
    const locale =
      localeFromRequest?.(request) ?? resolveLocaleFromParams(params);
    const { fonts, ogContext } = await resolveOgRequestState({
      configuredFonts,
      fallbackFonts,
      getFontsForLocale,
      getOgContextOverride,
      locale,
      request,
    });

    if (provider === "takumi") {
      const { ImageResponse } = await getTakumiImageResponseModule();

      return applyStableCacheHeaders(
        new ImageResponse(component, {
          ...imageResponseOptions,
          fonts,
          format: format ?? "webp",
          height: ogContext.height,
          loadDefaultFonts: loadDefaultFonts ?? true,
          width: ogContext.width,
        })
      );
    }

    const nextFonts = normalizeFontsForNextImageResponse(fonts);

    return applyStableCacheHeaders(
      new NextImageResponse(component as ReactElement, {
        ...imageResponseOptions,
        ...(nextFonts ? { fonts: nextFonts } : {}),
        height: ogContext.height,
        width: ogContext.width,
      })
    );
  };

export { loadGoogleFontForImageResponse, withOgRewrite };
export type {
  LoadGoogleFontForImageResponseOptions,
  NextImageResponseFont,
  OgRewriteOptions,
  OgRouteHandlerContext,
} from "./utils";
