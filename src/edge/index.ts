import type { ImageResponseOptions } from "@takumi-rs/image-response/wasm";
import { getFontsForRequest, getOgContext } from "better-og";
import type { OgAdapterOptions, OgContext } from "better-og";
import type { ReactNode } from "react";

type EdgeWasmImageResponseOptions = Extract<
  ImageResponseOptions,
  { module: unknown }
>;

type EdgeWasmModule = EdgeWasmImageResponseOptions["module"];
type EdgeImageResponseOptions = Omit<
  EdgeWasmImageResponseOptions,
  "fonts" | "format" | "height" | "module" | "width"
>;

interface EdgeImageResponseModule {
  ImageResponse: new (
    element: ReactNode,
    options: ImageResponseOptions
  ) => Response;
}

export interface EdgeOgHandlerOptions
  extends OgAdapterOptions, EdgeImageResponseOptions {
  component: ReactNode;
  module: EdgeWasmModule;
  provider?: "takumi";
}

let edgeImageResponseModule: Promise<EdgeImageResponseModule> | undefined;

const STABLE_CACHE_CONTROL =
  "public, immutable, no-transform, max-age=31536000";

const loadEdgeImageResponseModule = (): Promise<EdgeImageResponseModule> =>
  import("@takumi-rs/image-response/wasm") as Promise<EdgeImageResponseModule>;

const getEdgeImageResponseModule = (): Promise<EdgeImageResponseModule> => {
  if (!edgeImageResponseModule) {
    edgeImageResponseModule = loadEdgeImageResponseModule();
  }

  return edgeImageResponseModule;
};

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

export const createOgHandler =
  (options: EdgeOgHandlerOptions) =>
  async (request: Request): Promise<Response> => {
    const {
      component,
      fallbackFontLocales,
      fonts: configuredFonts,
      format,
      getFallbackFontsForLocale,
      getFontsForLocale,
      getOgContext: getOgContextOverride,
      localeFromRequest,
      module,
      provider: _provider,
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
        fallbackFontLocales,
        fonts: configuredFonts,
        getFallbackFontsForLocale,
        getFontsForLocale,
      }
    );
    const { ImageResponse } = await getEdgeImageResponseModule();
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
