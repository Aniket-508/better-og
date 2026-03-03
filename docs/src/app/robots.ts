import type { MetadataRoute } from "next";

const baseUrl =
  process.env.VERCEL_URL !== undefined && process.env.VERCEL_URL !== null
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.SITE_URL ?? "https://better-og-docs.vercel.app");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ allow: "/", userAgent: "*" }],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
