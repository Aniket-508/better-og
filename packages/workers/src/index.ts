import {
  applyStableCacheHeaders,
  resolveOgComponent,
  resolveOgRequestState,
} from "@better-og/core";
import type {
  Font,
  OgAdapterOptions,
  OgComponentFactory,
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

export interface WorkersOgHandlerOptions
  extends OgAdapterOptions, WorkersImageResponseOptions {
  component: ReactNode | OgComponentFactory<ReactNode>;
  renderer?: WorkersRenderer;
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

export const createOgHandler =
  (options: WorkersOgHandlerOptions) =>
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
      renderer: configuredRenderer,
      ...imageResponseOptions
    } = options;
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
    const resolvedComponent = resolveOgComponent(component, ogContext);
    const renderer = resolveWorkersRenderer(configuredRenderer, fonts);

    const response = new ImageResponse(resolvedComponent, {
      ...imageResponseOptions,
      format: format ?? "webp",
      height: ogContext.height,
      renderer,
      width: ogContext.width,
    });

    return applyStableCacheHeaders(response);
  };
