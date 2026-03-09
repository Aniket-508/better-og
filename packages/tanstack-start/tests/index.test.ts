/* oxlint-disable typescript/consistent-type-imports */

const mocks = vi.hoisted(() => ({
  capturedOptions: [] as unknown[],
  createCachedModuleLoader: <T>(loadModule: () => Promise<T>) => {
    let modulePromise: Promise<T> | undefined;

    return () => {
      if (!modulePromise) {
        modulePromise = loadModule();
      }

      return modulePromise;
    };
  },
  createOgRouteHandler: vi.fn((options: unknown) => {
    mocks.capturedOptions.push(options);

    return () => new Response("handled");
  }),
  imageResponseCalls: [] as { element: unknown; options: unknown }[],
  resolveLocaleFromParams: vi.fn(() => "params-locale"),
}));

const mockTanstackImageResponse = function MockTanStackImageResponse(
  this: unknown,
  element: unknown,
  options: unknown
) {
  mocks.imageResponseCalls.push({ element, options });

  return new Response("tanstack-start");
};

vi.mock<typeof import("@better-og/core")>(import("@better-og/core"), () => ({
  createCachedModuleLoader: mocks.createCachedModuleLoader as never,
  createOgRouteHandler: mocks.createOgRouteHandler as never,
  resolveLocaleFromParams: mocks.resolveLocaleFromParams as never,
}));

vi.mock<typeof import("@takumi-rs/image-response")>(
  import("@takumi-rs/image-response"),
  () => ({
    ImageResponse: mockTanstackImageResponse as never,
  })
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

describe("createOgRouteHandler (tanstack-start)", () => {
  it("builds a Takumi handler using route params as the locale source", async () => {
    const { createOgRouteHandler } = await import("@better-og/tanstack-start");
    createOgRouteHandler({
      component: "card",
    });

    const options = mocks.capturedOptions[0] as {
      localeFromContext: (context: {
        params: Promise<{ lang: string }>;
      }) => Promise<string>;
      renderOptions: unknown;
      renderer: (context: {
        component: string;
        fonts: {
          data: Uint8Array;
          name: string;
        }[];
        options: unknown;
        request: Request;
        resolvedRequest: typeof resolvedRequest;
      }) => Promise<Response>;
    };

    await expect(
      options.localeFromContext({
        params: Promise.resolve({ lang: "ar" }),
      })
    ).resolves.toBe("params-locale");
    expect(mocks.resolveLocaleFromParams).toHaveBeenCalledWith({ lang: "ar" });

    await options.renderer({
      component: "card",
      fonts: [
        {
          data: Uint8Array.from([1, 2, 3]),
          name: "Geist",
        },
      ],
      options: options.renderOptions,
      request: new Request("https://example.com/og"),
      resolvedRequest,
    });

    expect(mocks.imageResponseCalls[0]?.options).toMatchObject({
      fonts: [
        {
          data: Uint8Array.from([1, 2, 3]),
          name: "Geist",
        },
      ],
      format: "webp",
      height: 630,
      loadDefaultFonts: true,
      width: 1200,
    });
  });
});
