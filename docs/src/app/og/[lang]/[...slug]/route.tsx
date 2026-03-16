import { createCachedModuleLoader, resolveFontSetup } from "@better-og/core";
import {
  createOgRouteHandler,
  loadGoogleFontForImageResponse,
} from "@better-og/next";
import { notFound } from "next/navigation";

import OgImage from "@/components/og/og-image";
import { source } from "@/lib/source";
import { getTranslation } from "@/translations";

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

const resolvePageData = (
  slug: string[],
  lang: string
): { category?: string; description?: string; title: string } => {
  if (slug[0] === "home") {
    const translation = getTranslation(lang);
    return {
      description: translation.home.heroSubtitle,
      title: translation.home.heroTitle,
    };
  }

  if (slug[0] === "docs") {
    const pageSlug = slug.slice(1, -1);
    const page = source.getPage(pageSlug, lang);
    if (!page) {
      notFound();
    }
    const { description, title } = page.data;
    return { category: "Documentation", description, title };
  }

  notFound();
};

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ lang: string; slug: string[] }> }
) => {
  const { lang, slug } = await params;
  const fontSetup = await getFontSetup();
  const { category, description, title } = resolvePageData(slug, lang);

  const handler = createOgRouteHandler({
    baseFonts: fontSetup.fonts,
    component: (ogContext) => (
      <OgImage
        category={category}
        description={description}
        descriptionFontFamily={getDescriptionFontFamily(fontSetup, lang)}
        fontFamily={fontSetup.families.base}
        safeAreaBottom={ogContext.safeArea.bottom}
        title={title}
      />
    ),
    renderer: "takumi",
  });

  return handler(request, { params });
};
