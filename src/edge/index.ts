import type { ImageResponseOptions } from "@takumi-rs/image-response/wasm";
import {
  applyStableCacheHeaders,
  createCachedModuleLoader,
  resolveOgRequestState,
} from "better-og";
import type { OgAdapterOptions } from "better-og";
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
}
const getEdgeImageResponseModule = createCachedModuleLoader(
  () =>
    import("@takumi-rs/image-response/wasm") as Promise<EdgeImageResponseModule>
);

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
      ...imageResponseOptions
    } = options;

    if (!module) {
      throw new Error(
        "better-og/edge requires `module`. Pass the runtime-specific Takumi WASM module, such as `@takumi-rs/wasm/next` in Next.js Edge."
      );
    }

    const locale = localeFromRequest?.(request);
    const { fonts, ogContext } = await resolveOgRequestState({
      configuredFonts,
      fallbackFontLocales,
      getFallbackFontsForLocale,
      getFontsForLocale,
      getOgContextOverride,
      locale,
      request,
    });
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
