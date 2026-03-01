import { resolveFontSetup } from "better-og";
import { loadGoogleFontForImageResponse } from "better-og/next";
import { createOgRouteHandler } from "better-og/next/edge";

export const runtime = "edge";
export const revalidate = false;

const fallbackFontLocales = ["ja", "ar"];
const fontSetup = await resolveFontSetup({
  fallbackFontLocales,
  fonts: await loadGoogleFontForImageResponse({
    family: "Geist",
    weights: [400, 700],
  }),
});

const handler = createOgRouteHandler({
  component: (
    <div
      style={{
        alignItems: "stretch",
        background:
          "linear-gradient(140deg, rgb(14, 16, 42) 0%, rgb(29, 85, 122) 48%, rgb(68, 188, 155) 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: fontSetup.families.base,
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
          better-og edge
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Next Edge runtime with next/og
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: fontSetup.families.locales.ja ?? fontSetup.families.base,
          fontSize: 32,
          opacity: 0.92,
        }}
      >
        のコストを 溜め込むのはやめよう
      </div>
    </div>
  ),
  fonts: fontSetup.fonts,
});

export const GET = handler;
