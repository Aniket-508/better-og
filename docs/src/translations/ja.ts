import type { Translation } from ".";

const ja: Translation = {
  footer: {
    builtBy: "開発者",
    hostedOn: "ホスティング",
    llms: "LLMs.txt",
    sourceAvailableOn: "ソースコード",
    twitter: "X",
  },
  home: {
    adaptersDescription:
      "実行環境に合ったアダプターを選びつつ、どこでも同じ考え方で運用できます。",
    adaptersTitle: "あらゆるスタック向けアダプター",
    ctaDocs: "使い方を見る",
    ctaGitHub: "GitHub",
    heroEyebrow: "Open Graph 画像ツールキット",
    heroSubtitle:
      "アスペクト比を自動調整し、ロケールごとのフォントを読み込み、複数ランタイムに対応します。",
    heroTitle: "プラットフォームごとに最適化されたOG画像を、もっと簡単に。",
    localizedDescription:
      "同じ画像パイプラインを、英語・日本語・アラビア語の各ルートで確認できます。",
    localizedTitle: "多言語OGプレビュー",
    platformsDescription:
      "1つのエンドポイントで、配信先に応じたカードサイズへ切り替えられます。",
    platformsTitle: "1つのルートで、あらゆるプラットフォームへ",
  },
  landing: {
    adapters: {
      nextEdge: "Edge",
      nextNode: "Node",
      node: "Node.js",
      tanstack: "TanStack Start",
      workers: "Workers",
    },
    nextRuntimeAriaLabel: "Next.js ランタイム",
    now: "今",
    platforms: {
      imessage: {
        appLabel: "iMessage",
        codeSnippet: [
          "縦長キャンバス",
          "長めのコピー向けレイアウト",
          "ロケール対応フォント",
        ],
        previewLabel: "メッセージでプレビュー",
        title: "iMessage",
      },
      instagram: {
        appLabel: "Instagram",
        codeSnippet: [
          "縦長のソーシャル裁ち落とし",
          "フィード向け比率",
          "単一コンポーネント",
        ],
        previewLabel: "ソーシャルフィードに共有",
        title: "Instagram",
      },
      square: {
        appLabel: "Telegram / Slack",
        codeSnippet: ["正方形プレビュー", "フィード安全裁ち落とし", "単一路線"],
        previewLabel: "チームチャットに共有",
        title: "Telegram / Slack",
      },
      x: {
        appLabel: "X",
        codeSnippet: [
          "summary_large_image",
          "タイトル + 説明",
          "セーフエリア: 44px",
        ],
        previewLabel: "better-og から投稿",
        title: "X（旧 Twitter）",
      },
    },
  },
  notFound: {
    description: "お探しのページは移動したか、存在しない可能性があります。",
    explore: "探索",
    goHome: "ホームに戻る",
    heading: "404",
  },
};

export default ja;
