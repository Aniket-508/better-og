import { ImageResponse } from "@takumi-rs/image-response/wasm";
import type { ImageResponseOptions } from "@takumi-rs/image-response/wasm";
import { getFontsForRequest, getOgContext } from "better-og";
import type { OgAdapterOptions, OgContext } from "better-og";
import type { ReactNode } from "react";

type EdgeModule = Extract<ImageResponseOptions, { module: unknown }>["module"];
type EdgeFonts = Extract<ImageResponseOptions, { module: unknown }>["fonts"];

export interface EdgeOgHandlerOptions extends OgAdapterOptions {
  component: ReactNode;
  module: EdgeModule;
}

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

export const createOgHandler =
  (options: EdgeOgHandlerOptions) =>
  async (request: Request): Promise<Response> => {
    const locale = options.localeFromRequest?.(request);
    const ogContext: OgContext = options.getOgContext
      ? await options.getOgContext(request)
      : getOgContext(request);
    const fonts = await getFontsForRequest({ locale, request }, options);

    const response = new ImageResponse(options.component, {
      fonts: fonts as EdgeFonts,
      format: options.format ?? "webp",
      height: ogContext.height,
      module: options.module,
      width: ogContext.width,
    });

    return applyStableCacheHeaders(response);
  };
