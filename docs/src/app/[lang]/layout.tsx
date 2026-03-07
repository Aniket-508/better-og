import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";

import { i18n } from "@/lib/i18n";
import { baseMetadata } from "@/seo/metadata";

import "@/app/global.css";

export const metadata: Metadata = baseMetadata;

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
