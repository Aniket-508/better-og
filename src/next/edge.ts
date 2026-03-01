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

type EdgeModule = Extract<ImageResponseOptions, { module: unknown }>["module"];
type EdgeFonts = Extract<ImageResponseOptions, { module: unknown }>["fonts"];
interface EdgeImageResponseModule {
  ImageResponse: new (
    element: ReactNode,
    options: ImageResponseOptions
  ) => Response;
}

let nextWasmModule: Promise<EdgeModule> | undefined;
let edgeImageResponseModule: Promise<EdgeImageResponseModule> | undefined;

const loadNextWasmModule = async (): Promise<EdgeModule> => {
  const nextModule = await import("@takumi-rs/wasm/next");

  return nextModule.default;
};

const getNextWasmModule = (): Promise<EdgeModule> => {
  if (!nextWasmModule) {
    nextWasmModule = loadNextWasmModule();
  }

  return nextWasmModule;
};

const loadEdgeImageResponseModule = (): Promise<EdgeImageResponseModule> =>
  import("@takumi-rs/image-response/wasm") as Promise<EdgeImageResponseModule>;

const getEdgeImageResponseModule = (): Promise<EdgeImageResponseModule> => {
  if (!edgeImageResponseModule) {
    edgeImageResponseModule = loadEdgeImageResponseModule();
  }

  return edgeImageResponseModule;
};

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
    const { ImageResponse } = await getEdgeImageResponseModule();

    const response = new ImageResponse(options.component, {
      fonts: fonts as EdgeFonts,
      format: options.format ?? "webp",
      height: ogContext.height,
      module: getNextWasmModule(),
      width: ogContext.width,
    });

    return applyStableCacheHeaders(response);
  };

export { withOgRewrite };
export type { OgRewriteOptions, OgRouteHandlerContext };
