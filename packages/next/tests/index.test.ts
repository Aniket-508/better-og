/* eslint-disable @typescript-eslint/consistent-type-imports */

import "vitest";

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
  nextImageResponseCalls: [] as { element: unknown; options: unknown }[],
  resolveLocaleFromParams: vi.fn(() => "params-locale"),
  resolveOgComponent: vi.fn((component: unknown) => component),
  resolveOgRequestState: vi.fn(() => ({
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
  })),
  rewrite: vi.fn(),
  takumiImageResponseCalls: [] as { element: unknown; options: unknown }[],
}));

vi.mock<typeof import("better-og")>(import("better-og"), () => ({
  applyStableCacheHeaders: mocks.applyStableCacheHeaders as never,
  createCachedModuleLoader: mocks.createCachedModuleLoader as never,
  getOgContext: vi.fn() as never,
  loadGoogleFonts: vi.fn() as never,
  resolveLocaleFromParams: mocks.resolveLocaleFromParams as never,
  resolveOgComponent: mocks.resolveOgComponent as never,
  resolveOgRequestState: mocks.resolveOgRequestState as never,
}));

vi.mock<typeof import("next/server")>(import("next/server"), () => ({
  NextResponse: {
    next: vi.fn(),
    rewrite: mocks.rewrite,
  } as never,
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

describe("createOgRouteHandler (next)", () => {
  it("uses the next/og provider by default", async () => {
    const { createOgRouteHandler } = await import("@better-og/next");
    const handler = createOgRouteHandler({
      component: "card",
    });

    const response = await handler(new Request("https://example.com/og"), {
      params: Promise.resolve({ lang: "ja" }),
    });

    expect(response).toBeInstanceOf(Response);
    expect(mocks.resolveLocaleFromParams).toHaveBeenCalledWith({ lang: "ja" });
    expect(mocks.resolveOgRequestState).toHaveBeenCalledWith({
      configuredFonts: undefined,
      fallbackFontLocales: undefined,
      getFallbackFontsForLocale: undefined,
      getFontsForLocale: undefined,
      getOgContextOverride: undefined,
      locale: "params-locale",
      request: expect.any(Request),
    });
    expect(mocks.nextImageResponseCalls).toHaveLength(1);
    expect(mocks.nextImageResponseCalls[0]?.options).toMatchObject({
      height: 630,
      width: 1200,
    });
  });

  it("uses Takumi when requested", async () => {
    const { createOgRouteHandler } = await import("@better-og/next");
    const handler = createOgRouteHandler({
      component: "card",
      provider: "takumi",
    });

    await handler(new Request("https://example.com/og"));

    expect(mocks.takumiImageResponseCalls).toHaveLength(1);
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
