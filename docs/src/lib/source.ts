import { loader } from "fumadocs-core/source";
import type { InferPageType } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { docs } from "fumadocs-mdx:collections/server";

import { i18n } from "@/lib/i18n";

export const source = loader({
  baseUrl: "/docs",
  i18n,
  plugins: [lucideIconsPlugin()],
  source: docs.toFumadocsSource(),
});

export const getPageImage = (
  page: InferPageType<typeof source>,
  lang = "en"
) => {
  const segments = [...page.slugs, "image.png"];

  return {
    description: page.data.description,
    segments,
    title: page.data.title,
    url: `/og/${lang}/docs/${segments.join("/")}`,
  };
};

export const getLLMText = async (page: InferPageType<typeof source>) => {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
};
