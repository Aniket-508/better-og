import type { ImageResponseOptions } from "@takumi-rs/image-response/wasm";
import type {
  Font as TakumiFont,
  ImageSource as TakumiImageSource,
  InitInput,
  Renderer as TakumiRenderer,
} from "@takumi-rs/wasm/no-bundler";
import { getFontsForRequest, getOgContext } from "better-og";
import type { OgAdapterOptions, OgContext } from "better-og";
import type { ReactNode } from "react";

type EdgeImageResponseOptions = Omit<
  ImageResponseOptions,
  | "fonts"
  | "format"
  | "height"
  | "module"
  | "persistentImages"
  | "renderer"
  | "width"
>;
type ResolvedEdgeModule = Extract<
  ImageResponseOptions,
  { module: unknown }
>["module"];
type EdgeRenderer =
  | TakumiRenderer
  | (() => TakumiRenderer | Promise<TakumiRenderer>);
type EdgeModule =
  | ResolvedEdgeModule
  | (() => ResolvedEdgeModule)
  | InitInput
  | Promise<InitInput>
  | (() => InitInput | Promise<InitInput>);
interface EdgeImageResponseModule {
  ImageResponse: new (
    element: ReactNode,
    options: ImageResponseOptions
  ) => Response;
}
interface EdgeWasmBindingsModule {
  default: (
    options?:
      | { module_or_path: InitInput | Promise<InitInput> }
      | InitInput
      | Promise<InitInput>
  ) => Promise<unknown>;
}

export interface EdgeOgHandlerOptions extends OgAdapterOptions {
  component: ReactNode;
  module?: EdgeModule;
  persistentImages?: TakumiImageSource[];
  renderer?: EdgeRenderer;
}

let edgeImageResponseModule: Promise<EdgeImageResponseModule> | undefined;
let edgeWasmBindingsModule: Promise<EdgeWasmBindingsModule> | undefined;
let edgeWasmReady: Promise<unknown> | undefined;

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

const loadEdgeWasmBindingsModule = (): Promise<EdgeWasmBindingsModule> =>
  import("@takumi-rs/wasm/no-bundler") as Promise<EdgeWasmBindingsModule>;

const getEdgeWasmBindingsModule = (): Promise<EdgeWasmBindingsModule> => {
  if (!edgeWasmBindingsModule) {
    edgeWasmBindingsModule = loadEdgeWasmBindingsModule();
  }

  return edgeWasmBindingsModule;
};

const resolveEdgeModule = (
  module: EdgeModule
): ResolvedEdgeModule | InitInput | Promise<InitInput> =>
  typeof module === "function" ? module() : module;

const ensureEdgeWasmInitialized = async (
  module: EdgeModule | undefined
): Promise<void> => {
  const wasmBindings = await getEdgeWasmBindingsModule();

  edgeWasmReady ??= module
    ? wasmBindings.default({
        module_or_path: resolveEdgeModule(module),
      })
    : wasmBindings.default();

  await edgeWasmReady;
};

const resolveEdgeRenderer = async (
  renderer: EdgeRenderer,
  fonts: TakumiFont[],
  persistentImages: TakumiImageSource[]
): Promise<TakumiRenderer> => {
  const resolvedRenderer =
    typeof renderer === "function" ? await renderer() : renderer;

  for (const font of fonts) {
    resolvedRenderer.loadFont(font);
  }

  for (const image of persistentImages) {
    resolvedRenderer.putPersistentImage(image);
  }

  return resolvedRenderer;
};

export const createOgHandler =
  (options: EdgeOgHandlerOptions & EdgeImageResponseOptions) =>
  async (request: Request): Promise<Response> => {
    const {
      component,
      fallbackFonts,
      fonts: configuredFonts,
      format,
      getFontsForLocale,
      getOgContext: getOgContextOverride,
      localeFromRequest,
      module,
      persistentImages = [],
      renderer: configuredRenderer,
      ...imageResponseOptions
    } = options;
    const locale = localeFromRequest?.(request);
    const ogContext: OgContext = getOgContextOverride
      ? await getOgContextOverride(request)
      : getOgContext(request);
    const fonts = await getFontsForRequest(
      { locale, request },
      {
        fallbackFonts,
        fonts: configuredFonts,
        getFontsForLocale,
      }
    );
    const { ImageResponse } = await getEdgeImageResponseModule();
    const response = configuredRenderer
      ? new ImageResponse(component, {
          ...imageResponseOptions,
          format: format ?? "webp",
          height: ogContext.height,
          renderer: await resolveEdgeRenderer(
            configuredRenderer,
            fonts as TakumiFont[],
            persistentImages
          ),
          width: ogContext.width,
        })
      : await (async () => {
          await ensureEdgeWasmInitialized(module);

          return new ImageResponse(component, {
            ...imageResponseOptions,
            fonts: fonts as TakumiFont[],
            format: format ?? "webp",
            height: ogContext.height,
            persistentImages,
            width: ogContext.width,
          } as ImageResponseOptions);
        })();

    return applyStableCacheHeaders(response);
  };
