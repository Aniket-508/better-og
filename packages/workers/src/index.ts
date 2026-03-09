import { createOgRouteHandler as createCoreOgRouteHandler } from "@better-og/core";
import type {
  CreateOgRouteHandlerOptions,
  Font,
  FontSource,
  LayoutStrategy,
  OgComponentFactory,
  ResolveOgRequestOptions,
} from "@better-og/core";
import { ImageResponse } from "@takumi-rs/image-response/wasm";
import type { ImageResponseOptions } from "@takumi-rs/image-response/wasm";
import { Renderer, initSync } from "@takumi-rs/wasm/no-bundler";
import workersWasmModule from "@takumi-rs/wasm/takumi_wasm_bg.wasm";
import type { ReactNode } from "react";

type WorkersRenderer = Renderer;
type WorkersFontInput = Parameters<WorkersRenderer["loadFont"]>[0];
type WorkersRendererOptions = Extract<
  ImageResponseOptions,
  { renderer: unknown }
>;
type WorkersImageResponseOptions = Omit<
  WorkersRendererOptions,
  "format" | "height" | "renderer" | "width"
>;
type SharedTextResolver = CreateOgRouteHandlerOptions<
  ReactNode,
  undefined,
  WorkersImageResponseOptions
>["textFromComponent"];

export interface WorkersOgHandlerOptions extends WorkersImageResponseOptions {
  aspectRatio?: string;
  baseFonts?: Font[];
  component: ReactNode | OgComponentFactory<ReactNode>;
  fallbackLocales?: string[];
  format?: "png" | "webp";
  layout?: LayoutStrategy;
  localeFromRequest?: (request: Request) => string | undefined;
  platform?: string;
  renderer?: WorkersRenderer;
  resolveRequestOptions?: ResolveOgRequestOptions;
  sources?: FontSource[];
  takumiRenderer?: WorkersRenderer;
  text?: string;
  textFromComponent?: SharedTextResolver;
}

let isWorkersWasmInitialized = false;

const ensureWorkersWasmRuntime = () => {
  if (!isWorkersWasmInitialized) {
    initSync(workersWasmModule);
    isWorkersWasmInitialized = true;
  }
};

const toWorkersFontInput = (font: Font): WorkersFontInput => {
  const data =
    font.data instanceof Uint8Array ? font.data : new Uint8Array(font.data);
  const style =
    font.style === "italic" ||
    font.style === "normal" ||
    font.style === "oblique"
      ? font.style
      : undefined;

  if (!font.name && !font.weight && !style) {
    return data;
  }

  return {
    ...(font.name ? { name: font.name } : {}),
    ...(typeof font.weight === "number" ? { weight: font.weight } : {}),
    ...(style ? { style } : {}),
    data,
  };
};

const loadFontsIntoRenderer = (renderer: WorkersRenderer, fonts: Font[]) => {
  for (const font of fonts) {
    renderer.loadFont(toWorkersFontInput(font));
  }
};

const resolveWorkersRenderer = (
  configuredRenderer: WorkersRenderer | undefined,
  fonts: Font[]
): WorkersRenderer => {
  if (!configuredRenderer) {
    ensureWorkersWasmRuntime();

    return new Renderer({
      fonts: fonts.map(toWorkersFontInput),
    });
  }

  if (fonts.length > 0) {
    loadFontsIntoRenderer(configuredRenderer, fonts);
  }

  return configuredRenderer;
};

export const createOgHandler = (options: WorkersOgHandlerOptions) => {
  const {
    aspectRatio: _aspectRatio,
    component,
    fallbackLocales: _fallbackLocales,
    format = "webp",
    layout: _layout,
    localeFromRequest,
    platform: _platform,
    renderer,
    resolveRequestOptions,
    sources: _sources,
    takumiRenderer,
    text,
    textFromComponent,
    ...imageResponseOptions
  } = options;

  return createCoreOgRouteHandler<
    ReactNode,
    undefined,
    WorkersImageResponseOptions
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
    }) => {
      const resolvedRenderer = resolveWorkersRenderer(
        takumiRenderer ?? renderer,
        fonts
      );

      return new ImageResponse(renderComponent, {
        ...renderOptions,
        format,
        height: resolvedRequest.height,
        renderer: resolvedRenderer,
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
