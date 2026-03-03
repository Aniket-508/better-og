import type { MetadataRoute } from "next";

import { i18n } from "@/lib/i18n";
import { source } from "@/lib/source";

const baseUrl =
  process.env.VERCEL_URL !== undefined && process.env.VERCEL_URL !== null
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.SITE_URL ?? "https://better-og-docs.vercel.app");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const lang of i18n.languages) {
    routes.push({
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 1,
      url: `${baseUrl}/${lang}`,
    });
    routes.push({
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.9,
      url: `${baseUrl}/${lang}/docs`,
    });

    for (const page of source.getPages(lang)) {
      routes.push({
        changeFrequency: "weekly",
        lastModified: new Date(),
        priority: 0.8,
        url: `${baseUrl}/${page.url}`,
      });
    }
  }

  return routes;
}
