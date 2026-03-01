import {
  createOgRouteHandler,
  loadGoogleFontForImageResponse,
} from "better-og/next";

export const runtime = "nodejs";
export const revalidate = false;

const handler = createOgRouteHandler({
  component: (
    <div
      style={{
        alignItems: "stretch",
        background:
          "linear-gradient(135deg, rgb(13, 25, 44) 0%, rgb(23, 58, 112) 52%, rgb(73, 147, 214) 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Geist",
        gap: 24,
        height: "100%",
        justifyContent: "space-between",
        padding: 64,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 3,
            opacity: 0.8,
            textTransform: "uppercase",
          }}
        >
          better-og
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Automatic aspect-ratio aware OG images
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          opacity: 0.92,
        }}
      >
        Locale-aware fallback fonts are enabled for this route.
      </div>
    </div>
  ),
  fallbackFontLocales: ["ja", "ar"],
  fallbackFonts: true,
  fonts: await loadGoogleFontForImageResponse({
    family: "Geist",
    weights: [400, 700],
  }),
});

export const GET = handler;
