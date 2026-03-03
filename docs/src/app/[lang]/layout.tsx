import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";

import { i18n } from "@/lib/i18n";

import "@/app/global.css";

const baseUrl =
  process.env.VERCEL_URL !== undefined && process.env.VERCEL_URL !== null
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.SITE_URL ?? "https://better-og-docs.vercel.app");

export const metadata: Metadata = {
  authors: [{ name: "Aniket-508", url: "https://github.com/Aniket-508" }],
  creator: "Aniket-508",
  description:
    "Open Graph image helpers with sane aspect-ratio defaults, locale-aware font fallbacks, and adapters for Next.js, Edge, Workers, and TanStack Start.",
  icons: { icon: "/icon.svg" },
  keywords: [
    "OG image",
    "Open Graph",
    "better-og",
    "Next.js",
    "Edge",
    "Workers",
    "TanStack Start",
    "aspect ratio",
    "i18n",
  ],
  metadataBase: new URL(baseUrl),
  openGraph: {
    description:
      "Open Graph image helpers with sane aspect-ratio defaults and locale-aware font fallbacks.",
    siteName: "better-og",
    title: "better-og",
    type: "website",
  },
  title: {
    default: "better-og",
    template: "%s | better-og",
  },
  twitter: {
    card: "summary_large_image",
    description:
      "Open Graph image helpers with sane aspect-ratio defaults and locale-aware font fallbacks.",
    title: "better-og",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const { provider } = defineI18nUI(i18n, {
  translations: {
    ar: {
      displayName: "Arabic",
      search: "البحث في المستندات",
    },
    en: {
      displayName: "English",
    },
    ja: {
      displayName: "Japanese",
      search: "ドキュメントを検索",
    },
  },
});

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={provider(lang)}>{children}</RootProvider>
      </body>
    </html>
  );
}
