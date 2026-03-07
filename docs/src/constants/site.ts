const baseUrl =
  process.env.VERCEL_URL !== undefined && process.env.VERCEL_URL !== null
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.SITE_URL ?? "https://better-og.vercel.app");

export const SITE = {
  AUTHOR: {
    NAME: "Aniket-508",
    TWITTER: "@Aniket_508",
  },
  DESCRIPTION: {
    LONG: "Platform-aware Open Graph image helpers with sane aspect-ratio defaults, locale-aware font loading, and adapters for Next.js, Edge runtimes, Workers, and TanStack Start.",
    SHORT:
      "Platform-aware Open Graph image helpers with sane aspect-ratio defaults and locale-aware font loading.",
  },
  KEYWORDS: [
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
  NAME: "better-og",
  OG_IMAGE: "/og/en/docs/image.png",
  URL: baseUrl,
} as const;
