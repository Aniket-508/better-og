import type { ImageResponseOptions } from "@takumi-rs/image-response";
import {
  applyStableCacheHeaders,
  createCachedModuleLoader,
  resolveOgComponent,
  resolveLocaleFromParams,
  resolveOgRequestState,
} from "better-og";
import type {
  OgAdapterOptions,
  OgComponentFactory,
  RouteParams,
} from "better-og";
import type { ReactNode } from "react";

type TanStackStartImageResponseOptions = Omit<
  ImageResponseOptions,
  "fonts" | "format" | "height" | "loadDefaultFonts" | "renderer" | "width"
>;

interface TanStackImageResponseModule {
  ImageResponse: new (
    element: ReactNode,
    options?: ImageResponseOptions
  ) => Response;
}

export interface TanStackStartRouteHandlerContext {
  params?: Promise<RouteParams> | RouteParams;
  request: Request;
}

export interface TanStackStartOgHandlerOptions
  extends OgAdapterOptions, TanStackStartImageResponseOptions {
  component: ReactNode | OgComponentFactory<ReactNode>;
}
const getImageResponseModule = createCachedModuleLoader(
  () =>
    import("@takumi-rs/image-response") as Promise<TanStackImageResponseModule>
);

export const createOgRouteHandler =
  (options: TanStackStartOgHandlerOptions) =>
  async ({
    params: paramsInput,
    request,
  }: TanStackStartRouteHandlerContext): Promise<Response> => {
    const {
      component,
      fallbackFontLocales,
      fonts: configuredFonts,
      format,
      getFallbackFontsForLocale,
      getFontsForLocale,
      getOgContext: getOgContextOverride,
      loadDefaultFonts,
      localeFromRequest,
      ...imageResponseOptions
    } = options;
    const params = paramsInput ? await paramsInput : undefined;
    const locale =
      localeFromRequest?.(request) ?? resolveLocaleFromParams(params);
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
    const { ImageResponse } = await getImageResponseModule();

    return applyStableCacheHeaders(
      new ImageResponse(resolvedComponent, {
        ...imageResponseOptions,
        fonts,
        format: format ?? "webp",
        height: ogContext.height,
        loadDefaultFonts: loadDefaultFonts ?? true,
        width: ogContext.width,
      })
    );
  };
