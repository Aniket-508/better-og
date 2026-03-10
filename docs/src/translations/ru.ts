import type { Translation } from ".";

const ru: Translation = {
  footer: {
    builtBy: "Создано",
    hostedOn: "Размещено на",
    llms: "LLMs.txt",
    sourceAvailableOn: "Исходный код доступен на",
    twitter: "X",
  },
  home: {
    adaptersDescription:
      "Используйте адаптер под текущий runtime и сохраняйте одну и ту же модель работы в любой среде.",
    adaptersTitle: "Адаптеры для любого стека",
    ctaDocs: "Начать",
    ctaGitHub: "GitHub",
    heroEyebrow: "Инструментарий Open Graph",
    heroSubtitle:
      "Автоматические соотношения сторон. Шрифты с учетом языка. Адаптеры для разных runtime.",
    heroTitle: "OG-изображения с учетом платформы, без лишней сложности.",
    localizedDescription:
      "Просматривайте один и тот же конвейер изображений на английских, японских и арабских маршрутах.",
    localizedTitle: "Многоязычный предпросмотр OG",
    platformsDescription:
      "Один endpoint может подстроить итоговый размер карточки под нужную социальную платформу.",
    platformsTitle: "Любая платформа, один маршрут",
  },
  landing: {
    adapters: {
      nextEdge: "Edge",
      nextNode: "Node",
      node: "Node.js",
      tanstack: "TanStack Start",
      workers: "Workers",
    },
    nextRuntimeAriaLabel: "Среда выполнения Next.js",
    now: "сейчас",
    platforms: {
      imessage: {
        appLabel: "iMessage",
        codeSnippet: [
          "вертикальный холст",
          "более высокий текстовый макет",
          "шрифты с учетом локали",
        ],
        previewLabel: "Предпросмотр в Messages",
        title: "iMessage",
      },
      instagram: {
        appLabel: "Instagram",
        codeSnippet: [
          "более высокий social crop",
          "соотношение для ленты",
          "один компонент",
        ],
        previewLabel: "Опубликовано в социальной ленте",
        title: "Instagram",
      },
      square: {
        appLabel: "Telegram / Slack",
        codeSnippet: [
          "квадратный предпросмотр",
          "безопасный crop для ленты",
          "один маршрут",
        ],
        previewLabel: "Поделились в командном чате",
        title: "Telegram / Slack",
      },
      x: {
        appLabel: "X",
        codeSnippet: [
          "summary_large_image",
          "заголовок + описание",
          "безопасная зона: 44px",
        ],
        previewLabel: "Опубликовано из better-og",
        title: "X (бывший Twitter)",
      },
    },
  },
  notFound: {
    description:
      "Страница, которую вы ищете, могла быть перемещена или не существует.",
    explore: "Обзор",
    goHome: "На главную",
    heading: "404",
  },
};

export default ru;
