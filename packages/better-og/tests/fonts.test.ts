import { getFontsForRequest, loadGoogleFonts, resolveFontSetup } from "#core";

import {
  createFont,
  getMapValueOrFallback,
  getRequiredMapValue,
} from "./test-helpers";

describe("request font resolution", () => {
  it("uses locale-specific base fonts and normalized fallback locales", async () => {
    const baseFont = createFont("Base JA");
    const fallbackFontsByLocale = new Map<
      string,
      ReturnType<typeof createFont>[]
    >([
      ["ar", [createFont("Fallback AR")]],
      ["en", [createFont("Fallback EN")]],
    ]);
    const fontsByLocale = new Map<string, ReturnType<typeof createFont>[]>([
      ["ja", [baseFont]],
    ]);
    const getFontsForLocale = vi.fn(
      async (locale: string) =>
        await Promise.resolve(getMapValueOrFallback(fontsByLocale, locale, []))
    );
    const getFallbackFontsForLocale = vi.fn(
      async (locale: string) =>
        await Promise.resolve(
          getMapValueOrFallback(fallbackFontsByLocale, locale, [])
        )
    );

    const fonts = await getFontsForRequest(
      { locale: "ja" },
      {
        fallbackFontLocales: ["EN", "ar-JO", "en"],
        getFallbackFontsForLocale,
        getFontsForLocale,
      }
    );

    expect(getFontsForLocale).toHaveBeenCalledWith("ja");
    expect(getFallbackFontsForLocale).toHaveBeenNthCalledWith(1, "en");
    expect(getFallbackFontsForLocale).toHaveBeenNthCalledWith(2, "ar");
    expect(fonts.map((font) => font.name)).toStrictEqual([
      "Base JA",
      "Fallback EN",
      "Fallback AR",
    ]);
  });
});

describe("font setup resolution", () => {
  it("returns the base family and fallback locale families", async () => {
    const baseFont = createFont("Geist");
    const fallbackFonts = {
      ar: [createFont("Noto Sans Arabic Custom")],
      ja: [createFont("Noto Sans JP Custom")],
    };
    const getFallbackFontsForLocale = vi.fn(
      async (locale: keyof typeof fallbackFonts | string) =>
        await Promise.resolve(
          getMapValueOrFallback(
            new Map<string, ReturnType<typeof createFont>[]>([
              ["ar", fallbackFonts.ar],
              ["ja", fallbackFonts.ja],
            ]),
            locale,
            []
          )
        )
    );

    const fontSetup = await resolveFontSetup({
      fallbackFontLocales: ["ja", "ar"],
      fonts: [baseFont],
      getFallbackFontsForLocale,
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
