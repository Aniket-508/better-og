/* oxlint-disable typescript/consistent-type-imports */

const mocks = vi.hoisted(() => ({
  applyStableCacheHeaders: vi.fn((response: Response) => response),
  createCachedModuleLoader: <T>(loadModule: () => Promise<T>) => {
    let modulePromise: Promise<T> | undefined;

    return () => {
      if (!modulePromise) {
        modulePromise = loadModule();
      }

      return modulePromise;
    };
  },
  imageResponseCalls: [] as { element: unknown; options: unknown }[],
  resolveOgComponent: vi.fn((component: unknown) => component),
  resolveOgRequestState: vi.fn(() => ({
    fonts: [
      {
        data: Uint8Array.from([1, 2, 3]),
        name: "Geist",
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
  })),
}));

const mockEdgeImageResponse = function MockEdgeImageResponse(
  this: unknown,
  element: unknown,
  options: unknown
) {
  mocks.imageResponseCalls.push({ element, options });

  return new Response("edge");
};

vi.mock<typeof import("better-og")>(import("better-og"), () => ({
  applyStableCacheHeaders: mocks.applyStableCacheHeaders as never,
  createCachedModuleLoader: mocks.createCachedModuleLoader as never,
  resolveOgComponent: mocks.resolveOgComponent as never,
  resolveOgRequestState: mocks.resolveOgRequestState as never,
}));

vi.mock<typeof import("@takumi-rs/image-response/wasm")>(
  import("@takumi-rs/image-response/wasm"),
  () => ({
    ImageResponse: mockEdgeImageResponse as never,
  })
);

describe("createOgHandler (edge)", () => {
  it("requires a runtime-specific wasm module", async () => {
    const { createOgHandler } = await import("@better-og/edge");
    const handler = createOgHandler({
      component: "card",
      module: undefined as never,
    });

    await expect(
      handler(new Request("https://example.com/og"))
    ).rejects.toThrow("@better-og/edge requires `module`");
  });

  it("passes the module and resolved fonts to the wasm image response", async () => {
    const { createOgHandler } = await import("@better-og/edge");
    const wasmModule = { default: "wasm-module" } as const;
    const handler = createOgHandler({
      component: "card",
      module: wasmModule,
    });

    await handler(new Request("https://example.com/og"));

    expect(mocks.imageResponseCalls).toHaveLength(1);
    expect(mocks.imageResponseCalls[0]?.options).toMatchObject({
      fonts: [
        {
          data: Uint8Array.from([1, 2, 3]),
          name: "Geist",
        },
      ],
      format: "webp",
      height: 630,
      module: wasmModule,
      width: 1200,
    });
  });
});
