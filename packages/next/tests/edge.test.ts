/* oxlint-disable typescript/consistent-type-imports */

import "vitest";

const mocks = vi.hoisted(() => ({
  applyStableCacheHeaders: vi.fn((response: Response) => response),
  nextImageResponseCalls: [] as { element: unknown; options: unknown }[],
  resolveLocaleFromParams: vi.fn(() => "params-locale"),
  resolveOgComponent: vi.fn((component: unknown) => component),
  resolveOgRequestState: vi.fn(() => ({
    fonts: [
      {
        data: Uint8Array.from([1, 2, 3]),
        name: "Geist",
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
}));

vi.mock<typeof import("better-og")>(import("better-og"), () => ({
  applyStableCacheHeaders: mocks.applyStableCacheHeaders as never,
  resolveLocaleFromParams: mocks.resolveLocaleFromParams as never,
  resolveOgComponent: mocks.resolveOgComponent as never,
  resolveOgRequestState: mocks.resolveOgRequestState as never,
}));

vi.mock<typeof import("next/og")>(import("next/og"), () => ({
  ImageResponse: function MockNextEdgeImageResponse(
    this: unknown,
    element: unknown,
    options: unknown
  ) {
    mocks.nextImageResponseCalls.push({ element, options });

    return new Response("next-edge");
  } as never,
}));

describe("createOgRouteHandler (next edge)", () => {
  it("rejects the Takumi provider", async () => {
    const { createOgRouteHandler } = await import("#next-edge");
    const handler = createOgRouteHandler({
      component: "card",
      provider: "takumi",
    });

    await expect(
      handler(new Request("https://example.com/og"))
    ).rejects.toThrow("currently only supports the `next` provider");
  });

  it("uses next/og and prefers localeFromRequest over params", async () => {
    const { createOgRouteHandler } = await import("#next-edge");
    const handler = createOgRouteHandler({
      component: "card",
      localeFromRequest: () => "request-locale",
    });

    await handler(new Request("https://example.com/og"), {
      params: Promise.resolve({ lang: "ja" }),
    });

    expect(mocks.resolveOgRequestState).toHaveBeenCalledWith({
      configuredFonts: undefined,
      fallbackFontLocales: undefined,
      getFallbackFontsForLocale: undefined,
      getFontsForLocale: undefined,
      getOgContextOverride: undefined,
      locale: "request-locale",
      request: expect.any(Request),
    });
    expect(mocks.nextImageResponseCalls).toHaveLength(1);
    expect(mocks.nextImageResponseCalls[0]?.options).toMatchObject({
      height: 630,
      width: 1200,
    });
  });
});
