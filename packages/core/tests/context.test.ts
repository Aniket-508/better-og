import {
  createLayout,
  detectPlatform,
  getPlatformCapabilities,
  getSafeArea,
  resolveLocaleFromParams,
  resolveOgComponent,
  resolveOgRequest,
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

describe("platform detection", () => {
  it("uses multiple signals and exposes capabilities", async () => {
    const detection = await detectPlatform(
      new Request("https://example.com/og", {
        headers: {
          accept: "text/html,*/*",
          referer: "https://x.com/example/status/1",
          "user-agent": "Twitterbot/1.0",
        },
      })
    );

    expect(detection).toMatchObject({
      aspectRatio: "1.91:1",
      crawler: "Twitterbot",
      platform: "twitter",
    });
    expect(detection.confidence).toBeGreaterThan(0.9);
    expect(detection.capabilities).toStrictEqual(
      getPlatformCapabilities("twitter")
    );
    expect(detection.matchedSignals.map((signal) => signal.type)).toStrictEqual(
      ["user-agent", "referer"]
    );
  });

  it("supports explicit platform overrides", async () => {
    const request = new Request(
      "https://example.com/og?platform=instagram&aspect_ratio=1:1",
      {
        headers: {
          accept: "text/html,*/*",
          referer: "https://slack.com/",
          "user-agent":
            "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
        },
      }
    );
    const detection = await detectPlatform(request);

    expect(detection.platform).toBe("instagram");
    expect(detection.aspectRatio).toBe("1:1");
    expect(detection.confidence).toBe(1);
  });
});

describe("safe area and request resolution", () => {
  it("computes platform safe areas and layout metadata", async () => {
    expect(
      getSafeArea({
        aspectRatio: "1.91:1",
        height: 630,
        platform: "twitter",
        width: 1200,
      })
    ).toStrictEqual({
      bottom: 44,
      left: 0,
      right: 0,
      top: 0,
    });

    expect(
      getSafeArea({
        aspectRatio: "1.91:1",
        height: 1260,
        platform: "twitter",
        width: 2400,
      })
    ).toStrictEqual({
      bottom: 88,
      left: 0,
      right: 0,
      top: 0,
    });

    const request = await resolveOgRequest(
      createRequest("https://example.com/og?layout=portrait", "Slackbot 1.0")
    );

    expect(request).toMatchObject({
      aspectRatio: "1:1",
      height: 1200,
      layoutStrategy: "portrait",
      platform: "slack",
      width: 1200,
    });
    expect(request.layout.safe).toStrictEqual({
      height: 1200,
      width: 1200,
      x: 0,
      y: 0,
    });
  });

  it("builds reusable layout boxes", () => {
    const layout = createLayout({
      height: 630,
      padding: 32,
      safeArea: {
        bottom: 44,
        left: 0,
        right: 0,
        top: 0,
      },
      strategy: "wide",
      width: 1200,
    });

    expect(layout.content).toStrictEqual({
      height: 522,
      width: 1136,
      x: 32,
      y: 32,
    });
    expect(layout.center.width).toBeCloseTo(863.36);
    expect(layout.bleed.x).toBe(0);
  });
});

describe("og component resolution", () => {
  it("returns the component value directly or resolves it from the request plan", () => {
    const context = createOgContext();

    expect(resolveOgComponent("static", context)).toBe("static");
    expect(resolveOgComponent((value) => value.platform, context)).toBe(
      "generic"
    );
  });
});
