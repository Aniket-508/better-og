import type { Translation } from ".";

const zh: Translation = {
  footer: {
    builtBy: "作者",
    hostedOn: "托管于",
    llms: "LLMs.txt",
    sourceAvailableOn: "源码位于",
    twitter: "X",
  },
  home: {
    adaptersDescription:
      "选择与你当前运行时匹配的适配器，并在不同环境中保持一致的使用方式。",
    adaptersTitle: "适配每一种技术栈",
    ctaDocs: "开始使用",
    ctaGitHub: "GitHub",
    heroEyebrow: "Open Graph 图像工具包",
    heroSubtitle: "自动宽高比。语言感知字体。多运行时适配器。",
    heroTitle: "面向平台的 OG 图像，保持简单。",
    localizedDescription: "在英语、日语和阿拉伯语路由中预览同一套图像流水线。",
    localizedTitle: "多语言 OG 预览",
    platformsDescription: "同一个端点可以根据目标社交平台调整最终卡片尺寸。",
    platformsTitle: "一条路由，适配所有平台",
  },
  landing: {
    adapters: {
      nextEdge: "Edge",
      nextNode: "Node",
      node: "Node.js",
      tanstack: "TanStack Start",
      workers: "Workers",
    },
    nextRuntimeAriaLabel: "Next.js 运行时",
    now: "刚刚",
    platforms: {
      imessage: {
        appLabel: "iMessage",
        codeSnippet: ["纵向画布", "更高的文案布局", "语言感知字体"],
        previewLabel: "在信息中预览",
        title: "iMessage",
      },
      instagram: {
        appLabel: "Instagram",
        codeSnippet: ["更高的社交裁切", "适合信息流的比例", "单一组件"],
        previewLabel: "分享到社交信息流",
        title: "Instagram",
      },
      square: {
        appLabel: "Telegram / Slack",
        codeSnippet: ["方形预览", "信息流安全裁切", "单一路由"],
        previewLabel: "分享到团队聊天",
        title: "Telegram / Slack",
      },
      x: {
        appLabel: "X",
        codeSnippet: ["summary_large_image", "标题 + 描述", "安全区：44px"],
        previewLabel: "由 better-og 发布",
        title: "X（原 Twitter）",
      },
    },
  },
  notFound: {
    description: "你寻找的页面可能已被移动或不存在。",
    explore: "探索",
    goHome: "返回首页",
    heading: "404",
  },
};

export default zh;
