import type { MetadataRoute } from "next";

import { SITE } from "@/constants/site";
import { i18n } from "@/lib/i18n";
import { source } from "@/lib/source";

const sitemap = (): MetadataRoute.Sitemap => {
  const routes: MetadataRoute.Sitemap = [];

  for (const lang of i18n.languages) {
    routes.push({
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 1,
      url: `${SITE.URL}/${lang}`,
    });
    routes.push({
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.9,
      url: `${SITE.URL}/${lang}/docs`,
    });

    for (const page of source.getPages(lang)) {
      routes.push({
        changeFrequency: "weekly",
        lastModified: new Date(),
        priority: 0.8,
        url: `${SITE.URL}/${page.url}`,
      });
    }
  }

  return routes;
};

export default sitemap;
