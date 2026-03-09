import type { Translation } from ".";

const en: Translation = {
  footer: {
    builtBy: "Built by",
    hostedOn: "Hosted on",
    llms: "LLMs.txt",
    sourceAvailableOn: "Source available on",
    twitter: "X",
  },
  home: {
    adaptersDescription:
      "Use the adapter that matches your runtime today, and keep the same mental model everywhere.",
    adaptersTitle: "Adapters for every stack",
    ctaDocs: "Get started",
    ctaGitHub: "GitHub",
    heroEyebrow: "Open Graph image toolkit",
    heroSubtitle:
      "Automatic aspect ratios. Locale-aware fonts. Multi-runtime adapters.",
    heroTitle: "Platform-aware OG images, made simple.",
    localizedDescription:
      "Preview the same image pipeline across English, Japanese, and Arabic routes.",
    localizedTitle: "Multilingual OG preview",
    platformsDescription:
      "One endpoint can adapt the final card size for the target social surface.",
    platformsTitle: "Every platform, one route",
  },
  landing: {
    adapters: {
      nextEdge: "Edge",
      nextNode: "Node",
      node: "Node.js",
      tanstack: "TanStack Start",
      workers: "Workers",
    },
    nextRuntimeAriaLabel: "Next.js runtime",
    now: "now",
    platforms: {
      imessage: {
        appLabel: "iMessage",
        codeSnippet: [
          "portrait canvas",
          "taller copy layout",
          "locale-aware fonts",
        ],
        previewLabel: "Preview in Messages",
        title: "iMessage",
      },
      instagram: {
        appLabel: "Instagram",
        codeSnippet: [
          "taller social crop",
          "feed-ready ratio",
          "one component",
        ],
        previewLabel: "Shared to social feed",
        title: "Instagram",
      },
      square: {
        appLabel: "Telegram / Slack",
        codeSnippet: ["square preview", "feed-safe crop", "single route"],
        previewLabel: "Shared in team chat",
        title: "Telegram / Slack",
      },
      x: {
        appLabel: "X",
        codeSnippet: [
          "summary_large_image",
          "title + description",
          "safe area: 44px",
        ],
        previewLabel: "Posted from better-og",
        title: "X (formerly Twitter)",
      },
    },
  },
};

export default en;
