import type { Translation } from ".";

const ko: Translation = {
  footer: {
    builtBy: "제작",
    hostedOn: "호스팅",
    llms: "LLMs.txt",
    sourceAvailableOn: "소스 코드",
    twitter: "X",
  },
  home: {
    adaptersDescription:
      "현재 런타임에 맞는 어댑터를 사용하면서 어느 환경에서나 같은 사용 방식을 유지하세요.",
    adaptersTitle: "모든 스택을 위한 어댑터",
    ctaDocs: "시작하기",
    ctaGitHub: "GitHub",
    heroEyebrow: "Open Graph 이미지 툴킷",
    heroSubtitle: "자동 종횡비. 로케일 인식 폰트. 멀티 런타임 어댑터.",
    heroTitle: "플랫폼을 이해하는 OG 이미지를 더 단순하게.",
    localizedDescription:
      "영어, 일본어, 아랍어 경로에서 동일한 이미지 파이프라인을 미리 볼 수 있습니다.",
    localizedTitle: "다국어 OG 미리보기",
    platformsDescription:
      "하나의 엔드포인트로 대상 소셜 플랫폼에 맞게 최종 카드 크기를 조정할 수 있습니다.",
    platformsTitle: "모든 플랫폼, 하나의 경로",
  },
  landing: {
    adapters: {
      nextEdge: "Edge",
      nextNode: "Node",
      node: "Node.js",
      tanstack: "TanStack Start",
      workers: "Workers",
    },
    nextRuntimeAriaLabel: "Next.js 런타임",
    now: "지금",
    platforms: {
      imessage: {
        appLabel: "iMessage",
        codeSnippet: ["세로 캔버스", "더 긴 카피 레이아웃", "로케일 인식 폰트"],
        previewLabel: "메시지에서 미리보기",
        title: "iMessage",
      },
      instagram: {
        appLabel: "Instagram",
        codeSnippet: ["더 높은 소셜 크롭", "피드용 비율", "단일 컴포넌트"],
        previewLabel: "소셜 피드에 공유됨",
        title: "Instagram",
      },
      square: {
        appLabel: "Telegram / Slack",
        codeSnippet: ["정사각형 미리보기", "피드 안전 크롭", "단일 경로"],
        previewLabel: "팀 채팅에 공유됨",
        title: "Telegram / Slack",
      },
      x: {
        appLabel: "X",
        codeSnippet: [
          "summary_large_image",
          "제목 + 설명",
          "세이프 영역: 44px",
        ],
        previewLabel: "better-og에서 게시",
        title: "X(구 Twitter)",
      },
    },
  },
};

export default ko;
