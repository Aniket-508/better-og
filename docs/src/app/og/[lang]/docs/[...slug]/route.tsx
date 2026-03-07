import { createCachedModuleLoader, resolveFontSetup } from "@better-og/core";
import {
  createOgRouteHandler,
  loadGoogleFontForImageResponse,
} from "@better-og/next";
import { notFound } from "next/navigation";

import { source } from "@/lib/source";

export const revalidate = false;

const fallbackFontLocales = ["ja", "ar"];
const getFontSetup = createCachedModuleLoader(async () =>
  resolveFontSetup({
    fallbackFontLocales,
    fonts: await loadGoogleFontForImageResponse({
      family: "Geist",
      weights: [400, 700],
    }),
  })
);

const getDescriptionFontFamily = (
  fontSetup: Awaited<ReturnType<typeof getFontSetup>>,
  lang: string
) => {
  if (lang === "ja") {
    return fontSetup.families.locales.ja ?? fontSetup.families.base;
  }
  if (lang === "ar") {
    return fontSetup.families.locales.ar ?? fontSetup.families.base;
  }
  return fontSetup.families.base;
};

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ lang: string; slug: string[] }> }
) => {
  const { lang, slug } = await params;
  const pageSlug = slug.slice(0, -1);
  const page = source.getPage(pageSlug, lang);
  const fontSetup = await getFontSetup();

  if (!page) {
    notFound();
  }

  const handler = createOgRouteHandler({
    component: (ogContext) => (
      <div
        style={{
          alignItems: "stretch",
          background:
            "linear-gradient(135deg, rgb(13, 25, 44) 0%, rgb(23, 58, 112) 52%, rgb(73, 147, 214) 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          fontFamily: fontSetup.families.base,
          gap: 24,
          height: "100%",
          justifyContent: "space-between",
          padding: 64,
          paddingBottom: 64 + ogContext.safeArea.bottom,
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
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {page.data.title}
          </div>
        </div>
        {page.data.description ? (
          <div
            style={{
              display: "flex",
              fontFamily: getDescriptionFontFamily(fontSetup, lang),
              fontSize: 28,
              opacity: 0.85,
            }}
          >
            {page.data.description}
          </div>
        ) : null}
      </div>
    ),
    fonts: fontSetup.fonts,
    provider: "takumi",
  });

  return handler(request, { params });
};
