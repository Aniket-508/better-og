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
  previewAlt: string;
  previewLines: string[];
  title: string;
}

export interface NextAdapterVariant {
  href: string;
  id: "edge" | "node";
  label: string;
  previewAlt: string;
  previewLines: string[];
}

export const getLocaleCards = (lang: string): LocaleCard[] => {
  const localeKey = lang === "ja" || lang === "ar" ? lang : "en";
  const localeLabels = {
    ar: {
      ar: "العربية",
      en: "الإنجليزية",
      ja: "اليابانية",
    },
    en: {
      ar: "Arabic",
      en: "English",
      ja: "Japanese",
    },
    ja: {
      ar: "アラビア語",
      en: "英語",
      ja: "日本語",
    },
  }[localeKey];

  return [
    { code: "en", name: localeLabels.en },
    { code: "ja", name: localeLabels.ja },
    { code: "ar", name: localeLabels.ar },
  ];
};

export const getPlatformCards = (): AspectRatioCard[] => [
  {
    appLabel: "X",
    aspectRatio: "1.91:1",
    codeSnippet: [
      "summary_large_image",
      "title + description",
      "safe area: 44px",
    ],
    dimensionLabel: "1200x630",
    height: 630,
    id: "x",
    logos: ["x"],
    previewChrome: {
      accent: "#111827",
      background: "#0f172a",
      label: "Posted from better-og",
      secondary: "#94a3b8",
    },
    query: "1.91:1",
    title: "X",
    width: 1200,
  },
  {
    appLabel: "Telegram / Slack",
    aspectRatio: "1:1",
    codeSnippet: ["square preview", "feed-safe crop", "single route"],
    dimensionLabel: "1200x1200",
    height: 1200,
    id: "square",
    logos: ["telegram", "slack"],
    previewChrome: {
      accent: "#0ea5e9",
      background: "#082f49",
      label: "Shared in team chat",
      secondary: "#bae6fd",
    },
    query: "1:1",
    title: "Telegram / Slack",
    width: 1200,
  },
  {
    appLabel: "iMessage",
    aspectRatio: "1:1.91",
    codeSnippet: [
      "portrait canvas",
      "taller copy layout",
      "locale-aware fonts",
    ],
    dimensionLabel: "630x1200",
    height: 1200,
    id: "imessage",
    logos: ["apple"],
    previewChrome: {
      accent: "#2563eb",
      background: "#0b1220",
      label: "Preview in Messages",
      secondary: "#bfdbfe",
    },
    query: "1:1.91",
    title: "iMessage",
    width: 630,
  },
  {
    appLabel: "Instagram",
    aspectRatio: "4:5",
    codeSnippet: ["taller social crop", "feed-ready ratio", "one component"],
    dimensionLabel: "1200x1500",
    height: 1500,
    id: "instagram",
    logos: ["instagram"],
    previewChrome: {
      accent: "#e11d48",
      background: "#4c0519",
      label: "Shared to social feed",
      secondary: "#fecdd3",
    },
    query: "4:5",
    title: "Instagram",
    width: 1200,
  },
];

export const adapterCards: AdapterCardConfig[] = [
  {
    href: "/docs/core-concepts",
    id: "node",
    previewAlt: "Node.js setup preview",
    previewLines: [
      'import { getOgContext } from "better-og"',
      "const context = getOgContext(request)",
      "const fonts = await resolveFontSetup(...)",
    ],
    title: "Node.js",
  },
  {
    href: "/docs/workers",
    id: "workers",
    previewAlt: "Workers setup preview",
    previewLines: [
      "const handler = createOgHandler({",
      "  component,",
      "  fetchedResources,",
      "})",
    ],
    title: "Workers",
  },
  {
    href: "/docs/tanstack-start",
    id: "tanstack",
    previewAlt: "TanStack Start setup preview",
    previewLines: [
      "export const handler = createOgRouteHandler({",
      "  component,",
      "  fonts,",
      "})",
    ],
    title: "TanStack Start",
  },
];

export const nextAdapterVariants: NextAdapterVariant[] = [
  {
    href: "/docs/next",
    id: "node",
    label: "Node",
    previewAlt: "Next.js Node adapter preview",
    previewLines: [
      "createOgRouteHandler({",
      '  provider: "next" | "takumi",',
      "  component,",
      "})",
    ],
  },
  {
    href: "/docs/next/edge",
    id: "edge",
    label: "Edge",
    previewAlt: "Next.js Edge adapter preview",
    previewLines: [
      'export const runtime = "edge"',
      "createOgRouteHandler({",
      '  provider: "next",',
      "})",
    ],
  },
];
