import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { Font } from "@better-og/core";
import { createOgRouteHandler } from "@better-og/next";
import { ImageResponse as TakumiImageResponse } from "@takumi-rs/image-response";
import { bench, group, run, summary } from "mitata";
import { ImageResponse as NextImageResponse } from "next/og";
import { createElement } from "react";
import type { ReactNode } from "react";

const WIDTH = 1200;
const HEIGHT = 630;

// Load a real font — next/og bundles Noto Sans for satori.
const fontPath = join(
  import.meta.dirname,
  "../../node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf"
);
const fontData = await readFile(fontPath);

const fonts: Font[] = [{ data: fontData, name: "Noto Sans", weight: 400 }];

const nextOgFonts = [
  { data: fontData.buffer, name: "Noto Sans", weight: 400 as const },
];

const HelloWorld = (): ReactNode =>
  createElement(
    "div",
    {
      style: {
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Noto Sans, sans-serif",
        fontSize: 60,
        height: "100%",
        justifyContent: "center",
        width: "100%",
      },
    },
    createElement("div", { style: { fontWeight: 700 } }, "Hello World"),
    createElement(
      "div",
      { style: { fontSize: 30, marginTop: 20, opacity: 0.8 } },
      "better-og benchmark"
    )
  );

const element = createElement(HelloWorld);

// --- Raw providers (no better-og wrapper) ---

const rawNextOg = () =>
  new NextImageResponse(element, {
    fonts: nextOgFonts,
    height: HEIGHT,
    width: WIDTH,
  });

const rawTakumi = () =>
  new TakumiImageResponse(element, {
    fonts,
    format: "webp",
    height: HEIGHT,
    loadDefaultFonts: false,
    width: WIDTH,
  });

// --- better-og wrapped providers ---

const betterOgNextHandler = createOgRouteHandler({
  baseFonts: fonts,
  component: element,
  renderer: "next",
  text: "Hello World better-og benchmark",
});

const betterOgTakumiHandler = createOgRouteHandler({
  baseFonts: fonts,
  component: element,
  loadDefaultFonts: false,
  renderer: "takumi",
  text: "Hello World better-og benchmark",
});

const betterOgRequest = new Request("https://example.com/og");

const wrappedNextOg = () => betterOgNextHandler(betterOgRequest);

const wrappedTakumi = () => betterOgTakumiHandler(betterOgRequest);

// --- Benchmark ---

summary(() => {
  group("hello-world", () => {
    bench("next/og", async () => {
      const response = rawNextOg();
      await response.arrayBuffer();
    });

    bench("better-og + next/og", async () => {
      const response = await wrappedNextOg();
      await response.arrayBuffer();
    });

    bench("takumi", async () => {
      const response = rawTakumi();
      await response.arrayBuffer();
    });

    bench("better-og + takumi", async () => {
      const response = await wrappedTakumi();
      await response.arrayBuffer();
    });
  });
});

await run();
