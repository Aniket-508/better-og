import { loadGoogleFonts, resolveFontSetup, resolveFonts } from "#core";

import {
  createFont,
  getMapValueOrFallback,
  getRequiredMapValue,
} from "./test-helpers";

describe("font resolution", () => {
  it("uses the provided base fonts and selects script-aware fallbacks", async () => {
    const localeFonts = new Map<string, ReturnType<typeof createFont>[]>([
      ["ja", [createFont("Noto Sans JP Custom")]],
      ["zh", [createFont("Noto Sans SC Custom")]],
    ]);
    const fonts = await resolveFonts({
      baseFonts: [createFont("Geist")],
      fallbackLocales: ["en"],
      sources: [
        {
          load: ({ locale }) => getMapValueOrFallback(localeFonts, locale, []),
          name: "locale-font-source",
        },
      ],
      text: "hello 世界 こんにちは",
    });

    expect(fonts.map((font) => font.name)).toStrictEqual([
      "Geist",
      "Noto Sans SC Custom",
      "Noto Sans JP Custom",
    ]);
  });

  it("can resolve fonts from static and callback sources", async () => {
    const fonts = await resolveFonts({
      locale: "ar",
      sources: [
        {
          load: () => [createFont("Brand Sans")],
          name: "static-font-source",
        },
        {
          load: ({ locale }) =>
            getMapValueOrFallback(
              new Map([["ar", [createFont("Noto Sans Arabic Custom")]]]),
              locale,
              []
            ),
          name: "locale-font-source",
        },
      ],
      text: "مرحبا",
    });

    expect(fonts.map((font) => font.name)).toStrictEqual([
      "Brand Sans",
      "Noto Sans Arabic Custom",
    ]);
  });
});

describe("font setup resolution", () => {
  it("returns the base family and fallback locale families", async () => {
    const fallbackFonts = new Map<string, ReturnType<typeof createFont>[]>([
      ["ar", [createFont("Noto Sans Arabic Custom")]],
      ["ja", [createFont("Noto Sans JP Custom")]],
    ]);
    const fontSetup = await resolveFontSetup({
      baseFonts: [createFont("Geist")],
      fallbackLocales: ["ja", "ar"],
      sources: [
        {
          load: ({ locale }) =>
            getMapValueOrFallback(fallbackFonts, locale, []),
          name: "fallback-font-source",
        },
      ],
    });

    expect(fontSetup.fonts.map((font) => font.name)).toStrictEqual([
      "Geist",
      "Noto Sans JP Custom",
      "Noto Sans Arabic Custom",
    ]);
    expect(fontSetup.families).toStrictEqual({
      base: "Geist",
      locales: {
        ar: "Noto Sans Arabic Custom",
        ja: "Noto Sans JP Custom",
      },
    });
  });
});

describe("google font loading", () => {
  it("deduplicates requested weights and reuses the cache until it is cleared", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      const responses = new Map<string, Response>([
        [
          "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400&display=swap",
          new Response(
            '@font-face { src: url("https://cdn.example.test/font.ttf") format("truetype"); }'
          ),
        ],
        [
          "https://cdn.example.test/font.ttf",
          new Response(Uint8Array.from([1, 2, 3])),
        ],
      ]);

      return Promise.resolve(getRequiredMapValue(responses, url));
    });

    vi.stubGlobal("fetch", fetchMock);

    const first = await loadGoogleFonts({
      family: "Noto Sans",
      weights: [400, 400],
    });
    const second = await loadGoogleFonts({
      family: "Noto Sans",
      weights: [400],
    });

    expect(first).toHaveLength(1);
    expect(first[0]?.name).toBe("Noto Sans");
    expect(second).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
