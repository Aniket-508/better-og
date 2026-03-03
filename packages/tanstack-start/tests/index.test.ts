/* eslint-disable @typescript-eslint/consistent-type-imports */

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
  resolveLocaleFromParams: vi.fn(() => "params-locale"),
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

const mockTanstackImageResponse = function MockTanStackImageResponse(
  this: unknown,
  element: unknown,
  options: unknown
) {
  mocks.imageResponseCalls.push({ element, options });

  return new Response("tanstack-start");
};

vi.mock<typeof import("better-og")>(import("better-og"), () => ({
  applyStableCacheHeaders: mocks.applyStableCacheHeaders as never,
  createCachedModuleLoader: mocks.createCachedModuleLoader as never,
  resolveLocaleFromParams: mocks.resolveLocaleFromParams as never,
  resolveOgComponent: mocks.resolveOgComponent as never,
  resolveOgRequestState: mocks.resolveOgRequestState as never,
}));

vi.mock<typeof import("@takumi-rs/image-response")>(
  import("@takumi-rs/image-response"),
  () => ({
    ImageResponse: mockTanstackImageResponse as never,
  })
);

describe("createOgRouteHandler (tanstack-start)", () => {
  it("builds a Takumi response using route params as the locale source", async () => {
    const { createOgRouteHandler } = await import("@better-og/tanstack-start");
    const handler = createOgRouteHandler({
      component: "card",
    });

    await handler({
      params: Promise.resolve({ lang: "ar" }),
      request: new Request("https://example.com/og"),
    });

    expect(mocks.resolveLocaleFromParams).toHaveBeenCalledWith({ lang: "ar" });
    expect(mocks.resolveOgRequestState).toHaveBeenCalledWith({
      configuredFonts: undefined,
      fallbackFontLocales: undefined,
      getFallbackFontsForLocale: undefined,
      getFontsForLocale: undefined,
      getOgContextOverride: undefined,
      locale: "params-locale",
      request: expect.any(Request),
    });
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
      loadDefaultFonts: true,
      width: 1200,
    });
  });
});
