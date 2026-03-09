import {
  createCachedModuleLoader,
  createOgRouteHandler as createCoreOgRouteHandler,
} from "@better-og/core";
import type {
  CreateOgRouteHandlerOptions,
  Font,
  FontSource,
  LayoutStrategy,
  OgComponentFactory,
  ResolveOgRequestOptions,
} from "@better-og/core";
import type { ImageResponseOptions } from "@takumi-rs/image-response/wasm";
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
type SharedTextResolver = CreateOgRouteHandlerOptions<
  ReactNode,
  undefined,
  EdgeImageResponseOptions
>["textFromComponent"];

interface EdgeImageResponseModule {
  ImageResponse: new (
    element: ReactNode,
    options: ImageResponseOptions
  ) => Response;
}

export interface EdgeOgHandlerOptions extends EdgeImageResponseOptions {
  aspectRatio?: string;
  baseFonts?: Font[];
  component: ReactNode | OgComponentFactory<ReactNode>;
  fallbackLocales?: string[];
  format?: "png" | "webp";
  layout?: LayoutStrategy;
  localeFromRequest?: (request: Request) => string | undefined;
  module: EdgeWasmModule;
  platform?: string;
  resolveRequestOptions?: ResolveOgRequestOptions;
  sources?: FontSource[];
  text?: string;
  textFromComponent?: SharedTextResolver;
}

const getEdgeImageResponseModule = createCachedModuleLoader(
  () =>
    import("@takumi-rs/image-response/wasm") as Promise<EdgeImageResponseModule>
);

export const createOgHandler = (options: EdgeOgHandlerOptions) => {
  const {
    aspectRatio: _aspectRatio,
    component,
    fallbackLocales: _fallbackLocales,
    layout: _layout,
    localeFromRequest,
    module,
    platform: _platform,
    resolveRequestOptions,
    sources: _sources,
    text,
    textFromComponent,
    ...imageResponseOptions
  } = options;

  if (!module) {
    throw new Error(
      "@better-og/edge requires `module`. Pass the runtime-specific Takumi WASM module, such as `@takumi-rs/wasm/next` in Next.js Edge."
    );
  }

  return createCoreOgRouteHandler<
    ReactNode,
    undefined,
    EdgeImageResponseOptions
  >({
    baseFonts: options.baseFonts,
    component,
    fallbackLocales: options.fallbackLocales,
    localeFromRequest,
    renderOptions: imageResponseOptions,
    renderer: async ({
      component: renderComponent,
      fonts,
      options: renderOptions,
      resolvedRequest,
    }) => {
      const { ImageResponse } = await getEdgeImageResponseModule();

      return new ImageResponse(renderComponent, {
        ...renderOptions,
        fonts: fonts as EdgeWasmImageResponseOptions["fonts"],
        height: resolvedRequest.height,
        module,
        width: resolvedRequest.width,
      });
    },
    resolveRequestOptions: {
      ...resolveRequestOptions,
      ...(options.aspectRatio ? { aspectRatio: options.aspectRatio } : {}),
      ...(options.layout ? { layout: options.layout } : {}),
      ...(options.platform ? { platform: options.platform } : {}),
    },
    sources: options.sources,
    text,
    textFromComponent,
  });
};
