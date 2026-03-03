import {
  getOgContext,
  resolveLocaleFromParams,
  resolveOgComponent,
  resolveSafeAreaForPlatform,
} from "#core";

import { createOgContext, createRequest } from "./test-helpers";

describe("locale param resolution", () => {
  it("prefers lang, then locale, then the first truthy value", () => {
    expect(
      resolveLocaleFromParams({
        lang: "en",
        locale: "fr",
        slug: "ignored",
      })
    ).toBe("en");

    expect(
      resolveLocaleFromParams({
        locale: "fr",
        slug: "ignored",
      })
    ).toBe("fr");

    expect(
      resolveLocaleFromParams({
        first: "de",
        second: "es",
        slug: "",
      })
    ).toBe("de");

    expect(resolveLocaleFromParams({})).toBeUndefined();
  });
});

describe("platform safe areas", () => {
  it("returns the twitter safe area and a zero safe area for everything else", () => {
    expect(resolveSafeAreaForPlatform("twitter")).toStrictEqual({
      bottom: 44,
      left: 0,
      right: 0,
      top: 0,
    });

    expect(resolveSafeAreaForPlatform("generic")).toStrictEqual({
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    });
  });
});

describe("og context detection", () => {
  it("uses an explicit aspect ratio alias when provided", () => {
    const context = getOgContext(
      createRequest("https://example.com/og?aspect_ratio=4:5", "Slackbot 1.0")
    );

    expect(context).toMatchObject({
      aspectRatio: "4:5",
      height: 1500,
      platform: "slack",
      width: 1200,
    });
  });

  it("falls back to the standard preset for an invalid explicit aspect ratio", () => {
    const context = getOgContext(
      createRequest(
        "https://example.com/og?aspect_ratio=not-valid",
        "Twitterbot/1.0"
      )
    );

    expect(context).toMatchObject({
      aspectRatio: "1.91:1",
      height: 630,
      platform: "twitter",
      width: 1200,
    });
    expect(context.safeArea.bottom).toBe(44);
  });

  it("derives the preset from the requesting platform when no aspect ratio is set", () => {
    expect(
      getOgContext(createRequest("https://example.com/og", "Slackbot 1.0"))
    ).toMatchObject({
      aspectRatio: "1:1",
      height: 1200,
      platform: "slack",
      width: 1200,
    });

    expect(
      getOgContext(
        createRequest("https://example.com/og", "iMessagePreview/1.0")
      )
    ).toMatchObject({
      aspectRatio: "1:1.91",
      height: 1200,
      platform: "imessage",
      width: 630,
    });
  });
});

describe("og component resolution", () => {
  it("returns the component value directly or resolves it from the context", () => {
    const context = createOgContext();

    expect(resolveOgComponent("static", context)).toBe("static");
    expect(resolveOgComponent((value) => value.platform, context)).toBe(
      "generic"
    );
  });
});
