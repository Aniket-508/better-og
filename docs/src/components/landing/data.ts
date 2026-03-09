import type { Translation } from "@/translations";

export interface LocaleCard {
  code: string;
  name: string;
}

export interface AspectRatioCard {
  appLabel: string;
  aspectRatio: string;
  codeSnippet: string[];
  dimensionLabel: string;
  height: number;
  id: string;
  logos: ("apple" | "instagram" | "slack" | "telegram" | "x")[];
  previewChrome: {
    accent: string;
    background: string;
    label: string;
    secondary: string;
  };
  query: string;
  title: string;
  width: number;
}

export interface AdapterCardConfig {
  href: string;
  id: string;
  title: string;
  img: {
    light: string;
    dark: string;
  };
}

export interface NextAdapterVariant extends AdapterCardConfig {
  id: "edge" | "node";
}

const normalizeLocale = (locale: string) =>
  locale.toLowerCase() === "pt-br" ? "pt-BR" : locale;

const getLanguageDisplayName = (viewerLocale: string, targetLocale: string) => {
  try {
    return (
      new Intl.DisplayNames([normalizeLocale(viewerLocale)], {
        type: "language",
      }).of(normalizeLocale(targetLocale)) ?? targetLocale
    );
  } catch {
    return targetLocale;
  }
};

export const getLocaleCards = (lang: string): LocaleCard[] =>
  ["en", "ja", "ar"].map((code) => ({
    code,
    name: getLanguageDisplayName(lang, code),
  }));

export const getPlatformCards = (
  translation: Translation
): AspectRatioCard[] => [
  {
    appLabel: "X",
    aspectRatio: "1.91:1",
    codeSnippet: translation.landing.platforms.x.codeSnippet,
    dimensionLabel: "1200x630",
    height: 630,
    id: "x",
    logos: ["x"],
    previewChrome: {
      accent: "#111827",
      background: "#0f172a",
      label: translation.landing.platforms.x.previewLabel,
      secondary: "#94a3b8",
    },
    query: "1.91:1",
    title: translation.landing.platforms.x.title,
    width: 1200,
  },
  {
    appLabel: translation.landing.platforms.square.appLabel,
    aspectRatio: "1:1",
    codeSnippet: translation.landing.platforms.square.codeSnippet,
    dimensionLabel: "1200x1200",
    height: 1200,
    id: "square",
    logos: ["telegram", "slack"],
    previewChrome: {
      accent: "#0ea5e9",
      background: "#082f49",
      label: translation.landing.platforms.square.previewLabel,
      secondary: "#bae6fd",
    },
    query: "1:1",
    title: translation.landing.platforms.square.title,
    width: 1200,
  },
  {
    appLabel: "iMessage",
    aspectRatio: "1:1.91",
    codeSnippet: translation.landing.platforms.imessage.codeSnippet,
    dimensionLabel: "630x1200",
    height: 1200,
    id: "imessage",
    logos: ["apple"],
    previewChrome: {
      accent: "#2563eb",
      background: "#0b1220",
      label: translation.landing.platforms.imessage.previewLabel,
      secondary: "#bfdbfe",
    },
    query: "1:1.91",
    title: translation.landing.platforms.imessage.title,
    width: 630,
  },
  {
    appLabel: "Instagram",
    aspectRatio: "4:5",
    codeSnippet: translation.landing.platforms.instagram.codeSnippet,
    dimensionLabel: "1200x1500",
    height: 1500,
    id: "instagram",
    logos: ["instagram"],
    previewChrome: {
      accent: "#e11d48",
      background: "#4c0519",
      label: translation.landing.platforms.instagram.previewLabel,
      secondary: "#fecdd3",
    },
    query: "4:5",
    title: translation.landing.platforms.instagram.title,
    width: 1200,
  },
];

export const getAdapterCards = (
  translation: Translation
): AdapterCardConfig[] => [
  {
    href: "/docs/node",
    id: "node",
    img: {
      dark: "https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/node-example-dark.png",
      light:
        "https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/node-example.png",
    },
    title: translation.landing.adapters.node,
  },
  {
    href: "/docs/workers",
    id: "workers",
    img: {
      dark: "https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/workers-example-dark.png",
      light:
        "https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/workers-example.png",
    },
    title: translation.landing.adapters.workers,
  },
  {
    href: "/docs/tanstack-start",
    id: "tanstack",
    img: {
      dark: "https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/tanstack-example-dark.png",
      light:
        "https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/tanstack-example.png",
    },
    title: translation.landing.adapters.tanstack,
  },
];

export const getNextAdapterVariants = (
  translation: Translation
): NextAdapterVariant[] => [
  {
    href: "/docs/next",
    id: "node",
    img: {
      dark: "https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/nextjs-node-example-dark.png",
      light:
        "https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/nextjs-node-example.png",
    },
    title: translation.landing.adapters.nextNode,
  },
  {
    href: "/docs/next/edge",
    id: "edge",
    img: {
      dark: "https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/nextjs-edge-example-dark.png",
      light:
        "https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/nextjs-edge-example.png",
    },
    title: translation.landing.adapters.nextEdge,
  },
];
