/* oxlint-disable typescript/consistent-type-imports */
import "vitest";

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
  nextImageResponseCalls: [] as { element: unknown; options: unknown }[],
  resolveLocaleFromParams: vi.fn(() => "params-locale"),
  takumiImageResponseCalls: [] as { element: unknown; options: unknown }[],
}));

vi.mock<typeof import("@better-og/core")>(import("@better-og/core"), () => ({
  createCachedModuleLoader: mocks.createCachedModuleLoader as never,
  createOgRouteHandler: mocks.createOgRouteHandler as never,
  resolveLocaleFromParams: mocks.resolveLocaleFromParams as never,
}));

vi.mock<typeof import("next/og")>(import("next/og"), () => ({
  ImageResponse: function MockNextImageResponse(
    this: unknown,
    element: unknown,
    options: unknown
  ) {
    mocks.nextImageResponseCalls.push({ element, options });

    return new Response("next");
  } as never,
}));

vi.mock<typeof import("@takumi-rs/image-response")>(
  import("@takumi-rs/image-response"),
  () => ({
    ImageResponse: function MockTakumiImageResponse(
      this: unknown,
      element: unknown,
      options: unknown
    ) {
      mocks.takumiImageResponseCalls.push({ element, options });

      return new Response("takumi");
    } as never,
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

describe("createOgRouteHandler (next)", () => {
  it("builds a shared handler that resolves locale from route params", async () => {
    const { createOgRouteHandler } = await import("@better-og/next");
    const handler = createOgRouteHandler({
      component: "card",
    });

    expect(handler).toBeTypeOf("function");
    // oxlint-disable-next-line vitest/prefer-to-have-been-called-times
    expect(mocks.createOgRouteHandler).toHaveBeenCalledTimes(1);
    const options = mocks.capturedOptions[0] as {
      localeFromContext: (context: {
        params: Promise<{ lang: string }>;
      }) => Promise<string>;
    };

    await expect(
      options.localeFromContext({
        params: Promise.resolve({ lang: "ja" }),
      })
    ).resolves.toBe("params-locale");
    expect(mocks.resolveLocaleFromParams).toHaveBeenCalledWith({ lang: "ja" });
  });

  it("renders through next/og by default", async () => {
    const { createOgRouteHandler } = await import("@better-og/next");
    createOgRouteHandler({
      component: "card",
    });

    const options = mocks.capturedOptions.at(-1) as {
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

    const response = options.renderer({
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

    expect(response).toBeInstanceOf(Response);
    expect(mocks.nextImageResponseCalls[0]?.options).toMatchObject({
      height: 630,
      width: 1200,
    });
  });

  it("renders through Takumi when requested", async () => {
    const { createOgRouteHandler } = await import("@better-og/next");
    createOgRouteHandler({
      component: "card",
      loadDefaultFonts: true,
      renderer: "takumi",
    });

    const options = mocks.capturedOptions.at(-1) as {
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
      }) => Promise<Response>;
    };

    await options.renderer({
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

    expect(mocks.takumiImageResponseCalls[0]?.options).toMatchObject({
      fonts: [
        {
          data: Uint8Array.from([1, 2, 3]),
          name: "Geist",
          style: "italic",
          weight: 400,
        },
      ],
      format: "webp",
      height: 630,
      loadDefaultFonts: true,
      width: 1200,
    });
  });
});
