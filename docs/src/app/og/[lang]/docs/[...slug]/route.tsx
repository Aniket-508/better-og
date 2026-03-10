import { createCachedModuleLoader, resolveFontSetup } from "@better-og/core";
import {
  createOgRouteHandler,
  loadGoogleFontForImageResponse,
} from "@better-og/next";
import { notFound } from "next/navigation";

import DocsOgImage from "@/components/og/docs-og-image";
import { source } from "@/lib/source";

export const revalidate = false;

const fallbackLocales = ["ja", "ar"];
const getFontSetup = createCachedModuleLoader(async () =>
  resolveFontSetup({
    baseFonts: await loadGoogleFontForImageResponse({
      family: "Geist",
      weights: [400, 700],
    }),
    fallbackLocales,
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
    baseFonts: fontSetup.fonts,
    component: (ogContext) => (
      <DocsOgImage
        title={page.data.title}
        description={page.data.description}
        fontFamily={fontSetup.families.base}
        descriptionFontFamily={getDescriptionFontFamily(fontSetup, lang)}
        safeAreaBottom={ogContext.safeArea.bottom}
      />
    ),
    renderer: "takumi",
  });

  return handler(request, { params });
};
