/* oxlint-disable typescript/consistent-type-imports */

import "vitest";

const mocks = vi.hoisted(() => ({
  loadGoogleFonts: vi.fn(),
  next: vi.fn(() => ({ kind: "next" })),
  resolveOgRequest: vi.fn(),
  rewrite: vi.fn((url: URL) => ({ kind: "rewrite", url: url.toString() })),
}));

vi.mock<typeof import("@better-og/core")>(import("@better-og/core"), () => ({
  loadGoogleFonts: mocks.loadGoogleFonts as never,
  resolveOgRequest: mocks.resolveOgRequest as never,
}));

vi.mock<typeof import("next/server")>(import("next/server"), () => ({
  NextResponse: {
    next: mocks.next,
    rewrite: mocks.rewrite,
  } as never,
}));

describe("normalizeFontsForNextImageResponse", () => {
  it("normalizes font buffers and clamps unsupported weights", async () => {
    const { normalizeFontsForNextImageResponse } = await import("#next-utils");
    const fonts = normalizeFontsForNextImageResponse([
      {
        data: Uint8Array.from([1, 2, 3]),
        name: "Geist",
        style: "italic",
        weight: 400,
      },
      {
        data: Uint8Array.from([4, 5, 6]),
        weight: 950,
      },
    ]);

    expect(fonts).toHaveLength(2);
    expect(fonts?.[0]).toMatchObject({
      name: "Geist",
      style: "italic",
      weight: 400,
    });
    expect(fonts?.[0]?.data).toBeInstanceOf(ArrayBuffer);
    expect(fonts?.[1]).toMatchObject({
      name: "sans serif",
      style: "normal",
      weight: undefined,
    });
  });
});

describe("loadGoogleFontForImageResponse", () => {
  it("reuses the shared google font loader and normalizes weights", async () => {
    const { loadGoogleFontForImageResponse } = await import("#next-utils");

    mocks.loadGoogleFonts.mockResolvedValue([
      {
        data: Uint8Array.from([1, 2, 3]),
        name: "Geist",
        style: "italic",
        weight: 700,
      },
    ]);

    const fonts = await loadGoogleFontForImageResponse({
      family: "Geist",
      weights: [700, 1200, 700],
    });

    expect(mocks.loadGoogleFonts).toHaveBeenCalledWith({
      family: "Geist",
      style: undefined,
      weights: [700],
    });
    expect(fonts).toHaveLength(1);
    expect(fonts[0]).toMatchObject({
      name: "Geist",
      style: "italic",
      weight: 700,
    });
  });
});

describe("withOgRewrite", () => {
  it("skips non-matching paths", async () => {
    const { withOgRewrite } = await import("#next-utils");
    const response = await withOgRewrite(
      new Request("https://example.com/docs")
    );

    expect(response).toStrictEqual({ kind: "next" });
    // oxlint-disable-next-line vitest/prefer-called-once
    expect(mocks.next).toHaveBeenCalledTimes(1);
    expect(mocks.resolveOgRequest).not.toHaveBeenCalled();
  });

  it("rewrites matching paths with the resolved request metadata", async () => {
    const { withOgRewrite } = await import("#next-utils");

    mocks.resolveOgRequest.mockResolvedValue({
      aspectRatio: "4:5",
      layoutStrategy: "portrait",
      platform: "instagram",
    });

    const response = await withOgRewrite(
      new Request("https://example.com/og/docs/image.png")
    );

    expect(response).toStrictEqual({
      kind: "rewrite",
      url: "https://example.com/og/docs/image.png?aspect_ratio=4%3A5&layout=portrait&platform=instagram",
    });
    // oxlint-disable-next-line vitest/prefer-called-once
    expect(mocks.rewrite).toHaveBeenCalledTimes(1);
  });
});
