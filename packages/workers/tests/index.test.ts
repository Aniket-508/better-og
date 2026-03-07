/* oxlint-disable typescript/consistent-type-imports */

const mocks = vi.hoisted(() => {
  const imageResponseCalls: { element: unknown; options: unknown }[] = [];
  const initSync = vi.fn();
  const resolveOgComponent = vi.fn((component: unknown) => component);
  const resolveOgRequestState = vi.fn(() => ({
    fonts: [
      {
        data: Uint8Array.from([1, 2, 3]),
        name: "Geist",
        style: "italic",
        weight: 400,
      },
    ],
    ogContext: {
      aspectRatio: "1.91:1",
      height: 630,
      platform: "generic",
      safeArea: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      },
      width: 1200,
    },
  }));
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
    applyStableCacheHeaders: vi.fn((response: Response) => response),
    imageResponseCalls,
    initSync,
    rendererInstances,
    resolveOgComponent,
    resolveOgRequestState,
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

vi.mock<typeof import("better-og")>(import("better-og"), () => ({
  applyStableCacheHeaders: mocks.applyStableCacheHeaders as never,
  resolveOgComponent: mocks.resolveOgComponent as never,
  resolveOgRequestState: mocks.resolveOgRequestState as never,
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

const resetWorkerTestState = () => {
  vi.resetModules();
  mocks.imageResponseCalls.length = 0;
  mocks.initSync.mockClear();
  mocks.rendererInstances.length = 0;
  mocks.resolveOgRequestState.mockClear();
};

describe("createOgHandler (workers)", () => {
  it("initializes the wasm runtime once and creates a renderer per request", async () => {
    resetWorkerTestState();

    const { createOgHandler } = await import("@better-og/workers");
    const handler = createOgHandler({
      component: "card",
    });

    await handler(new Request("https://example.com/og"));
    await handler(new Request("https://example.com/og"));

    // oxlint-disable-next-line vitest/prefer-called-once
    expect(mocks.initSync).toHaveBeenCalledTimes(1);
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
    const handler = createOgHandler({
      component: "card",
      renderer: renderer as never,
    });

    await handler(new Request("https://example.com/og"));

    expect(mocks.initSync).not.toHaveBeenCalled();
    // oxlint-disable-next-line vitest/prefer-called-once
    expect(renderer.loadFont).toHaveBeenCalledTimes(1);
    expect(mocks.imageResponseCalls[0]?.options).toMatchObject({
      renderer,
      width: 1200,
    });
  });
});
