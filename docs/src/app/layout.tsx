import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { i18n } from "@/lib/i18n";

import "@/app/global.css";
import { JsonLdScripts } from "@/seo/json-ld";
import { baseMetadata } from "@/seo/metadata";

export const metadata: Metadata = baseMetadata;

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const fontClassnames = [geist.variable, geistMono.variable].join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={i18n.defaultLanguage}
      className={fontClassnames}
      suppressHydrationWarning
    >
      <head>
        <JsonLdScripts />
      </head>
      <body className="flex flex-col min-h-screen antialiased">{children}</body>
    </html>
  );
}
