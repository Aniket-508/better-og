/* oxlint-disable typescript/consistent-type-imports */

import "vitest";

const mocks = vi.hoisted(() => ({
  capturedOptions: [] as unknown[],
  createOgRouteHandler: vi.fn((options: unknown) => {
    mocks.capturedOptions.push(options);

    return () => new Response("handled");
  }),
  nextImageResponseCalls: [] as { element: unknown; options: unknown }[],
  resolveLocaleFromParams: vi.fn(() => "params-locale"),
}));

vi.mock<typeof import("@better-og/core")>(import("@better-og/core"), () => ({
  createOgRouteHandler: mocks.createOgRouteHandler as never,
  resolveLocaleFromParams: mocks.resolveLocaleFromParams as never,
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

describe("createOgRouteHandler (next edge)", () => {
  it("rejects the Takumi renderer", async () => {
    const { createOgRouteHandler } = await import("#next-edge");

    expect(() =>
      createOgRouteHandler({
        component: "card",
        renderer: "takumi",
      })
    ).toThrow("currently only supports the `next` renderer");
  });

  it("prefers localeFromRequest over params and renders through next/og", async () => {
    const { createOgRouteHandler } = await import("#next-edge");
    createOgRouteHandler({
      component: "card",
      localeFromRequest: () => "request-locale",
    });

    const options = mocks.capturedOptions[0] as {
      localeFromContext: (context: {
        params: Promise<{ lang: string }>;
      }) => Promise<string>;
      localeFromRequest: (request: Request) => string;
      renderOptions: unknown;
      renderer: (context: {
        component: string;
        fonts: {
          data: Uint8Array;
          name: string;
          weight?: number;
        }[];
        options: unknown;
        request: Request;
        resolvedRequest: typeof resolvedRequest;
      }) => Response;
    };

    await expect(
      options.localeFromContext({
        params: Promise.resolve({ lang: "ja" }),
      })
    ).resolves.toBe("params-locale");
    expect(
      options.localeFromRequest(new Request("https://example.com/og"))
    ).toBe("request-locale");

    const response = options.renderer({
      component: "card",
      fonts: [
        {
          data: Uint8Array.from([1, 2, 3]),
          name: "Geist",
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
});
