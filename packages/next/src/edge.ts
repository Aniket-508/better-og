import {
  createOgRouteHandler as createCoreOgRouteHandler,
  resolveLocaleFromParams,
} from "@better-og/core";
import type {
  CreateOgRouteHandlerOptions,
  Font,
  FontSource,
  LayoutStrategy,
  OgComponentFactory,
  ResolveOgRequestOptions,
} from "@better-og/core";
import { ImageResponse as NextImageResponse } from "next/og";
import type { ReactElement, ReactNode } from "react";

import { normalizeFontsForNextImageResponse } from "./utils";
import type { OgRouteHandlerContext } from "./utils";

type NextProviderImageResponseOptions = Omit<
  NonNullable<ConstructorParameters<typeof NextImageResponse>[1]>,
  "fonts" | "height" | "width"
>;
type SharedTextResolver = CreateOgRouteHandlerOptions<
  ReactNode,
  OgRouteHandlerContext,
  NextProviderImageResponseOptions
>["textFromComponent"];

interface SharedAdapterOptions {
  aspectRatio?: string;
  baseFonts?: Font[];
  fallbackLocales?: string[];
  layout?: LayoutStrategy;
  localeFromRequest?: (request: Request) => string | undefined;
  platform?: string;
  resolveRequestOptions?: ResolveOgRequestOptions;
  sources?: FontSource[];
  text?: string;
  textFromComponent?: SharedTextResolver;
}

export interface NextEdgeOgHandlerOptions
  extends SharedAdapterOptions, NextProviderImageResponseOptions {
  component: ReactNode | OgComponentFactory<ReactNode>;
  renderer?: "next" | "takumi";
}

export const createOgRouteHandler = (options: NextEdgeOgHandlerOptions) => {
  const {
    aspectRatio: _aspectRatio,
    component,
    fallbackLocales: _fallbackLocales,
    layout: _layout,
    localeFromRequest,
    platform: _platform,
    renderer = "next",
    resolveRequestOptions,
    sources: _sources,
    text,
    textFromComponent,
    ...imageResponseOptions
  } = options;

  if (renderer === "takumi") {
    throw new Error(
      "@better-og/next/edge currently only supports the `next` renderer. Use `@better-og/edge` with `module` from `@takumi-rs/wasm/next` if you need Takumi on Next Edge."
    );
  }

  return createCoreOgRouteHandler<
    ReactNode,
    OgRouteHandlerContext,
    NextProviderImageResponseOptions
  >({
    baseFonts: options.baseFonts,
    component,
    fallbackLocales: options.fallbackLocales,
    localeFromContext: async (context: OgRouteHandlerContext) =>
      resolveLocaleFromParams(
        context.params ? await context.params : undefined
      ),
    localeFromRequest,
    renderOptions: imageResponseOptions,
    renderer: ({
      component: renderComponent,
      fonts,
      options: renderOptions,
      resolvedRequest,
    }) => {
      const nextFonts = normalizeFontsForNextImageResponse(fonts);

      return new NextImageResponse(renderComponent as ReactElement, {
        ...renderOptions,
        ...(nextFonts ? { fonts: nextFonts } : {}),
        height: resolvedRequest.height,
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

export type { OgRouteHandlerContext };
