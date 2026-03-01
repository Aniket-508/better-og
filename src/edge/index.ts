import type { ImageResponseOptions } from "@takumi-rs/image-response/wasm";
import { getFontsForRequest, getOgContext } from "better-og";
import type { OgAdapterOptions, OgContext } from "better-og";
import type { ReactNode } from "react";

type ResolvedEdgeModule = Extract<
  ImageResponseOptions,
  { module: unknown }
>["module"];
type EdgeModule = ResolvedEdgeModule | (() => ResolvedEdgeModule);
type EdgeFonts = Extract<ImageResponseOptions, { module: unknown }>["fonts"];
interface EdgeImageResponseModule {
  ImageResponse: new (
    element: ReactNode,
    options: ImageResponseOptions
  ) => Response;
}

export interface EdgeOgHandlerOptions extends OgAdapterOptions {
  component: ReactNode;
  module: EdgeModule;
}

let edgeImageResponseModule: Promise<EdgeImageResponseModule> | undefined;

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

const loadEdgeImageResponseModule = (): Promise<EdgeImageResponseModule> =>
  import("@takumi-rs/image-response/wasm") as Promise<EdgeImageResponseModule>;

const getEdgeImageResponseModule = (): Promise<EdgeImageResponseModule> => {
  if (!edgeImageResponseModule) {
    edgeImageResponseModule = loadEdgeImageResponseModule();
  }

  return edgeImageResponseModule;
};

const resolveEdgeModule = (module: EdgeModule): ResolvedEdgeModule =>
  typeof module === "function" ? module() : module;

export const createOgHandler =
  (options: EdgeOgHandlerOptions) =>
  async (request: Request): Promise<Response> => {
    const locale = options.localeFromRequest?.(request);
    const ogContext: OgContext = options.getOgContext
      ? await options.getOgContext(request)
      : getOgContext(request);
    const fonts = await getFontsForRequest({ locale, request }, options);
    const { ImageResponse } = await getEdgeImageResponseModule();

    const response = new ImageResponse(options.component, {
      fonts: fonts as EdgeFonts,
      format: options.format ?? "webp",
      height: ogContext.height,
      module: resolveEdgeModule(options.module),
      width: ogContext.width,
    });

    return applyStableCacheHeaders(response);
  };
