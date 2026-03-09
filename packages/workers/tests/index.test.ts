/* oxlint-disable typescript/consistent-type-imports */

const mocks = vi.hoisted(() => {
  const capturedOptions: unknown[] = [];
  const imageResponseCalls: { element: unknown; options: unknown }[] = [];
  const initSync = vi.fn();
  const rendererInstances: FakeRenderer[] = [];

  class FakeRenderer {
    loadFont = vi.fn();
    options: unknown;

    constructor(options?: unknown) {
      this.options = options;
      rendererInstances.push(this);
    }
  }

  return {
    Renderer: FakeRenderer,
    capturedOptions,
    createOgRouteHandler: vi.fn((options: unknown) => {
      capturedOptions.push(options);

      return () => new Response("handled");
    }),
    imageResponseCalls,
    initSync,
    rendererInstances,
  };
});

const mockWorkersImageResponse = function MockWorkersImageResponse(
  this: unknown,
  element: unknown,
  options: unknown
) {
  mocks.imageResponseCalls.push({ element, options });

  return new Response("workers");
};

vi.mock<typeof import("@better-og/core")>(import("@better-og/core"), () => ({
  createOgRouteHandler: mocks.createOgRouteHandler as never,
}));

vi.mock<typeof import("@takumi-rs/image-response/wasm")>(
  import("@takumi-rs/image-response/wasm"),
  () => ({
    ImageResponse: mockWorkersImageResponse as never,
  })
);

vi.mock<typeof import("@takumi-rs/wasm/no-bundler")>(
  import("@takumi-rs/wasm/no-bundler"),
  () => ({
    Renderer: mocks.Renderer as never,
    initSync: mocks.initSync as never,
  })
);

vi.mock<typeof import("@takumi-rs/wasm/takumi_wasm_bg.wasm")>(
  import("@takumi-rs/wasm/takumi_wasm_bg.wasm"),
  () =>
    ({
      default: { kind: "workers-wasm" },
    }) as never
);

const resolvedRequest = {
  aspectRatio: "1.91:1",
  capabilities: {
    emoji: true,
    maxResponseBytes: 8_000_000,
    preferredFormat: "webp",
    svg: true,
    webp: true,
  },
  confidence: 0.7,
  crawler: "Generic",
  height: 630,
  layout: {
    bleed: { height: 630, width: 1200, x: 0, y: 0 },
    canvas: { height: 630, width: 1200, x: 0, y: 0 },
    center: { height: 300, width: 900, x: 150, y: 120 },
    content: { height: 534, width: 1104, x: 48, y: 48 },
    safe: { height: 630, width: 1200, x: 0, y: 0 },
    strategy: "wide",
  },
  layoutStrategy: "wide",
  matchedSignals: [],
  normalizedQuery: {},
  platform: "generic",
  safeArea: { bottom: 0, left: 0, right: 0, top: 0 },
  width: 1200,
};

const resetWorkerTestState = () => {
  vi.resetModules();
  mocks.capturedOptions.length = 0;
  mocks.imageResponseCalls.length = 0;
  mocks.initSync.mockClear();
  mocks.rendererInstances.length = 0;
};

describe("createOgHandler (workers)", () => {
  it("initializes the wasm runtime once and creates a renderer per render", async () => {
    resetWorkerTestState();

    const { createOgHandler } = await import("@better-og/workers");
    createOgHandler({
      component: "card",
    });

    const options = mocks.capturedOptions[0] as {
      renderOptions: unknown;
      renderer: (context: {
        component: string;
        fonts: {
          data: Uint8Array;
          name: string;
          style?: string;
          weight?: number;
        }[];
        options: unknown;
        request: Request;
        resolvedRequest: typeof resolvedRequest;
      }) => Response;
    };

    options.renderer({
      component: "card",
      fonts: [
        {
          data: Uint8Array.from([1, 2, 3]),
          name: "Geist",
          style: "italic",
          weight: 400,
        },
      ],
      options: options.renderOptions,
      request: new Request("https://example.com/og"),
      resolvedRequest,
    });
    options.renderer({
      component: "card",
      fonts: [
        {
          data: Uint8Array.from([1, 2, 3]),
          name: "Geist",
          style: "italic",
          weight: 400,
        },
      ],
      options: options.renderOptions,
      request: new Request("https://example.com/og"),
      resolvedRequest,
    });

    expect(mocks.initSync).toHaveBeenCalledOnce();
    expect(mocks.rendererInstances).toHaveLength(2);
    expect(mocks.rendererInstances[0]?.options).toMatchObject({
      fonts: [
        {
          data: Uint8Array.from([1, 2, 3]),
          name: "Geist",
          style: "italic",
          weight: 400,
        },
      ],
    });
  });

  it("reuses a provided renderer and loads resolved fonts into it", async () => {
    resetWorkerTestState();

    const { createOgHandler } = await import("@better-og/workers");
    const renderer = new mocks.Renderer();
    createOgHandler({
      component: "card",
      takumiRenderer: renderer as never,
    });

    const options = mocks.capturedOptions[0] as {
      renderOptions: unknown;
      renderer: (context: {
        component: string;
        fonts: {
          data: Uint8Array;
          name: string;
          style?: string;
          weight?: number;
        }[];
        options: unknown;
        request: Request;
        resolvedRequest: typeof resolvedRequest;
      }) => Response;
    };

    options.renderer({
      component: "card",
      fonts: [
        {
          data: Uint8Array.from([1, 2, 3]),
          name: "Geist",
          style: "italic",
          weight: 400,
        },
      ],
      options: options.renderOptions,
      request: new Request("https://example.com/og"),
      resolvedRequest,
    });

    expect(mocks.initSync).not.toHaveBeenCalled();
    expect(renderer.loadFont).toHaveBeenCalledOnce();
    expect(mocks.imageResponseCalls[0]?.options).toMatchObject({
      renderer,
      width: 1200,
    });
  });
});
