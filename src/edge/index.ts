import type { ImageResponseOptions } from "@takumi-rs/image-response/wasm";
import type {
  Font as TakumiFont,
  InitInput,
  Renderer as TakumiRenderer,
} from "@takumi-rs/wasm/no-bundler";
import { getFontsForRequest, getOgContext } from "better-og";
import type { OgAdapterOptions, OgContext } from "better-og";
import type { ReactNode } from "react";

type ResolvedEdgeModule = Extract<
  ImageResponseOptions,
  { module: unknown }
>["module"];
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
  Renderer: new (options?: { fonts?: TakumiFont[] }) => TakumiRenderer;
}

export interface EdgeOgHandlerOptions extends OgAdapterOptions {
  component: ReactNode;
  module?: EdgeModule;
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

export const createOgHandler =
  (options: EdgeOgHandlerOptions) =>
  async (request: Request): Promise<Response> => {
    const locale = options.localeFromRequest?.(request);
    const ogContext: OgContext = options.getOgContext
      ? await options.getOgContext(request)
      : getOgContext(request);
    const fonts = await getFontsForRequest({ locale, request }, options);
    const wasmBindings = await getEdgeWasmBindingsModule();

    edgeWasmReady ??= options.module
      ? wasmBindings.default({
          module_or_path: resolveEdgeModule(options.module),
        })
      : wasmBindings.default();

    await edgeWasmReady;

    const renderer = new wasmBindings.Renderer({
      fonts: fonts as TakumiFont[],
    });
    const { ImageResponse } = await getEdgeImageResponseModule();

    const response = new ImageResponse(options.component, {
      format: options.format ?? "webp",
      height: ogContext.height,
      renderer,
      width: ogContext.width,
    });

    return applyStableCacheHeaders(response);
  };
