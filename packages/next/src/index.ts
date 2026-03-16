import {
  createCachedModuleLoader,
  createOgRouteHandler as createCoreOgRouteHandler,
  resolveLocaleFromParams,
} from "@better-og/core";
import type {
  CreateOgRouteHandlerOptions,
  Font,
  FontSource,
  LayoutStrategy,
  OgComponentFactory,
  ResolvedOgRequest,
  ResolveOgRequestOptions,
} from "@better-og/core";
import type { ImageResponseOptions as TakumiImageResponseOptions } from "@takumi-rs/image-response";
import { ImageResponse as NextImageResponse } from "next/og";
import type { ReactElement, ReactNode } from "react";

import {
  loadGoogleFontForImageResponse,
  normalizeFontsForNextImageResponse,
  withOgRewrite,
} from "./utils";
import type { OgRouteHandlerContext } from "./utils";

type NextProviderImageResponseOptions = Omit<
  NonNullable<ConstructorParameters<typeof NextImageResponse>[1]>,
  "fonts" | "height" | "width"
>;
type TakumiProviderImageResponseOptions = Omit<
  TakumiImageResponseOptions,
  "fonts" | "format" | "height" | "loadDefaultFonts" | "renderer" | "width"
>;
type SharedTextResolver = CreateOgRouteHandlerOptions<
  ReactNode,
  OgRouteHandlerContext,
  NextProviderImageResponseOptions
>["textFromComponent"];

interface TakumiImageResponseModule {
  ImageResponse: new (
    element: ReactNode,
    options?: TakumiImageResponseOptions
  ) => Response;
}

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

export interface NextOgHandlerOptions
  extends
    SharedAdapterOptions,
    NextProviderImageResponseOptions,
    TakumiProviderImageResponseOptions {
  component: ReactNode | OgComponentFactory<ReactNode>;
  loadDefaultFonts?: boolean;
  renderer?: "next" | "takumi";
}

const getTakumiImageResponseModule = createCachedModuleLoader(
  () =>
    import("@takumi-rs/image-response") as Promise<TakumiImageResponseModule>
);

const resolveSharedRouteHandlerOptions = (options: NextOgHandlerOptions) => ({
  baseFonts: options.baseFonts,
  component: options.component,
  fallbackLocales: options.fallbackLocales,
  localeFromContext: async (context: OgRouteHandlerContext) =>
    resolveLocaleFromParams(context.params ? await context.params : undefined),
  localeFromRequest: options.localeFromRequest,
  resolveRequestOptions: {
    ...options.resolveRequestOptions,
    ...(options.aspectRatio ? { aspectRatio: options.aspectRatio } : {}),
    ...(options.layout ? { layout: options.layout } : {}),
    ...(options.platform ? { platform: options.platform } : {}),
  },
  sources: options.sources,
  text: options.text,
  textFromComponent: options.textFromComponent,
});

const renderWithNext = ({
  component,
  fonts,
  options,
  resolvedRequest,
}: {
  component: ReactNode;
  fonts: Font[];
  options: NextProviderImageResponseOptions | undefined;
  resolvedRequest: ResolvedOgRequest;
}): Response => {
  const nextFonts = normalizeFontsForNextImageResponse(fonts);

  return new NextImageResponse(component as ReactElement, {
    ...options,
    ...(nextFonts ? { fonts: nextFonts } : {}),
    height: resolvedRequest.height,
    width: resolvedRequest.width,
  });
};

const renderWithTakumi = async ({
  component,
  fonts,
  options,
  resolvedRequest,
}: {
  component: ReactNode;
  fonts: Font[];
  options:
    | (TakumiProviderImageResponseOptions & {
        format?: "png" | "webp";
        loadDefaultFonts?: boolean;
      })
    | undefined;
  resolvedRequest: ResolvedOgRequest;
}): Promise<Response> => {
  const { ImageResponse } = await getTakumiImageResponseModule();

  return new ImageResponse(component, {
    ...options,
    fonts,
    format: options?.format ?? resolvedRequest.capabilities.preferredFormat,
    height: resolvedRequest.height,
    loadDefaultFonts: options?.loadDefaultFonts ?? true,
    width: resolvedRequest.width,
  });
};

export const createOgRouteHandler = (options: NextOgHandlerOptions) => {
  const {
    aspectRatio: _aspectRatio,
    component: _component,
    fallbackLocales: _fallbackLocales,
    layout: _layout,
    loadDefaultFonts,
    localeFromRequest: _localeFromRequest,
    platform: _platform,
    renderer = "next",
    resolveRequestOptions: _resolveRequestOptions,
    sources: _sources,
    text: _text,
    textFromComponent: _textFromComponent,
    ...imageResponseOptions
  } = options;
  const sharedOptions = resolveSharedRouteHandlerOptions(options);

  if (renderer === "takumi") {
    return createCoreOgRouteHandler<
      ReactNode,
      OgRouteHandlerContext,
      TakumiProviderImageResponseOptions & {
        format?: "png" | "webp";
        loadDefaultFonts?: boolean;
      }
    >({
      ...sharedOptions,
      renderOptions: {
        ...imageResponseOptions,
        loadDefaultFonts,
      },
      renderer: async ({
        component,
        fonts,
        options: renderOptions,
        resolvedRequest,
      }) =>
        await renderWithTakumi({
          component,
          fonts,
          options: renderOptions,
          resolvedRequest,
        }),
    });
  }

  return createCoreOgRouteHandler<
    ReactNode,
    OgRouteHandlerContext,
    NextProviderImageResponseOptions
  >({
    ...sharedOptions,
    renderOptions: imageResponseOptions,
    renderer: ({ component, fonts, options: renderOptions, resolvedRequest }) =>
      renderWithNext({
        component,
        fonts,
        options: renderOptions,
        resolvedRequest,
      }),
  });
};

export { loadGoogleFontForImageResponse, withOgRewrite };
export type {
  LoadGoogleFontForImageResponseOptions,
  NextImageResponseFont,
  OgRewriteOptions,
  OgRouteHandlerContext,
} from "./utils";
