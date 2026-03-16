import { createOgRouteHandler as createCoreOgRouteHandler } from "@better-og/core";
import type {
  CreateOgRouteHandlerOptions,
  Font,
  FontSource,
  LayoutStrategy,
  OgComponentFactory,
  ResolveOgRequestOptions,
} from "@better-og/core";
import { ImageResponse } from "@takumi-rs/image-response";
import type { ImageResponseOptions } from "@takumi-rs/image-response";
import type { ReactNode } from "react";

type NodeImageResponseOptions = Omit<
  ImageResponseOptions,
  "fonts" | "height" | "module" | "renderer" | "width"
>;

type SharedTextResolver = CreateOgRouteHandlerOptions<
  ReactNode,
  undefined,
  NodeImageResponseOptions
>["textFromComponent"];

export interface NodeOgHandlerOptions extends NodeImageResponseOptions {
  aspectRatio?: string;
  baseFonts?: Font[];
  component: ReactNode | OgComponentFactory<ReactNode>;
  fallbackLocales?: string[];
  format?: "png" | "webp";
  layout?: LayoutStrategy;
  localeFromRequest?: (request: Request) => string | undefined;
  platform?: string;
  resolveRequestOptions?: ResolveOgRequestOptions;
  sources?: FontSource[];
  text?: string;
  textFromComponent?: SharedTextResolver;
}

export const createOgHandler = (options: NodeOgHandlerOptions) => {
  const {
    aspectRatio: _aspectRatio,
    component,
    fallbackLocales: _fallbackLocales,
    format,
    layout: _layout,
    localeFromRequest,
    platform: _platform,
    resolveRequestOptions,
    sources: _sources,
    text,
    textFromComponent,
    ...imageResponseOptions
  } = options;

  return createCoreOgRouteHandler<
    ReactNode,
    undefined,
    NodeImageResponseOptions
  >({
    baseFonts: options.baseFonts,
    component,
    fallbackLocales: options.fallbackLocales,
    localeFromRequest,
    renderOptions: imageResponseOptions,
    renderer: ({
      component: renderComponent,
      fonts,
      options: renderOptions,
      resolvedRequest,
    }) =>
      new ImageResponse(renderComponent, {
        ...(renderOptions as ImageResponseOptions),
        fonts,
        format: format ?? resolvedRequest.capabilities.preferredFormat,
        height: resolvedRequest.height,
        width: resolvedRequest.width,
      }),
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
