import { resolveOgRequestState } from "#core";

import { createFont, createOgContext, createRequest } from "./test-helpers";

describe("request state resolution", () => {
  it("combines an overridden og context with resolved fonts", async () => {
    const overrideContext = createOgContext({
      aspectRatio: "custom",
      height: 500,
      platform: "custom",
      safeArea: {
        bottom: 3,
        left: 4,
        right: 2,
        top: 1,
      },
      width: 1000,
    });
    const customFont = createFont("Custom");

    const result = await resolveOgRequestState({
      configuredFonts: [customFont],
      getOgContextOverride: () => Promise.resolve(overrideContext),
      request: createRequest("https://example.com/og"),
    });

    expect(result.ogContext).toBe(overrideContext);
    expect(result.fonts).toStrictEqual([customFont]);
  });
});
