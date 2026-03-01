import type { ImageResponseOptions } from "@takumi-rs/image-response/wasm";
import { getFontsForRequest, getOgContext } from "better-og";
import type { OgAdapterOptions, OgContext } from "better-og";
import type { ReactNode } from "react";

type EdgeWasmImageResponseOptions = Extract<
  ImageResponseOptions,
  { module: unknown }
>;

const STABLE_CACHE_CONTROL =
  "public, immutable, no-transform, max-age=31536000";

const applyStableCacheHeaders = (response: Response): Response => {
  const headers = new Headers(response.headers);

  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", STABLE_CACHE_CONTROL);
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
};

export interface EdgeOgHandlerOptions
  extends
    OgAdapterOptions,
    Omit<
      ImageResponseOptions,
      "fonts" | "format" | "height" | "module" | "width"
    > {
  component: ReactNode;
  ImageResponse: new (
    element: ReactNode,
    options: ImageResponseOptions
  ) => Response;
  module: unknown;
}

export const createOgHandler =
  (options: EdgeOgHandlerOptions) =>
  async (request: Request): Promise<Response> => {
    const {
      component,
      fallbackFonts,
      fonts: configuredFonts,
      format,
      getFontsForLocale,
      getOgContext: getOgContextOverride,
      ImageResponse,
      localeFromRequest,
      module,
      ...imageResponseOptions
    } = options;

    if (!module) {
      throw new Error(
        "better-og/edge requires `module`. Pass the runtime-specific Takumi WASM module, such as `@takumi-rs/wasm/next` in Next.js Edge."
      );
    }

    const locale = localeFromRequest?.(request);
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
      fonts: fonts as EdgeWasmImageResponseOptions["fonts"],
      format: format ?? "webp",
      height: ogContext.height,
      module,
      width: ogContext.width,
    });

    return applyStableCacheHeaders(response);
  };
