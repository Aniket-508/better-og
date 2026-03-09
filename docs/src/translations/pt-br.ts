import type { Translation } from ".";

const ptBr: Translation = {
  footer: {
    builtBy: "Criado por",
    hostedOn: "Hospedado na",
    llms: "LLMs.txt",
    sourceAvailableOn: "Codigo-fonte disponivel no",
    twitter: "X",
  },
  home: {
    adaptersDescription:
      "Use o adaptador que combina com o seu runtime atual e mantenha o mesmo modelo mental em qualquer ambiente.",
    adaptersTitle: "Adaptadores para cada stack",
    ctaDocs: "Comecar",
    ctaGitHub: "GitHub",
    heroEyebrow: "Kit de imagens Open Graph",
    heroSubtitle:
      "Proporcoes automaticas. Fontes conscientes do idioma. Adaptadores para varios runtimes.",
    heroTitle: "Imagens OG conscientes da plataforma, sem complicacao.",
    localizedDescription:
      "Veja a mesma pipeline de imagens nas rotas em ingles, japones e arabe.",
    localizedTitle: "Preview OG multilíngue",
    platformsDescription:
      "Um unico endpoint pode adaptar o tamanho final do card para a plataforma social de destino.",
    platformsTitle: "Cada plataforma, uma rota",
  },
  landing: {
    adapters: {
      nextEdge: "Edge",
      nextNode: "Node",
      node: "Node.js",
      tanstack: "TanStack Start",
      workers: "Workers",
    },
    nextRuntimeAriaLabel: "Runtime do Next.js",
    now: "agora",
    platforms: {
      imessage: {
        appLabel: "iMessage",
        codeSnippet: [
          "canvas em retrato",
          "layout com texto mais alto",
          "fontes por idioma",
        ],
        previewLabel: "Preview no Messages",
        title: "iMessage",
      },
      instagram: {
        appLabel: "Instagram",
        codeSnippet: [
          "corte social mais alto",
          "proporcao pronta para feed",
          "um componente",
        ],
        previewLabel: "Compartilhado no feed social",
        title: "Instagram",
      },
      square: {
        appLabel: "Telegram / Slack",
        codeSnippet: ["preview quadrado", "corte seguro para feed", "uma rota"],
        previewLabel: "Compartilhado no chat do time",
        title: "Telegram / Slack",
      },
      x: {
        appLabel: "X",
        codeSnippet: [
          "summary_large_image",
          "titulo + descricao",
          "area segura: 44px",
        ],
        previewLabel: "Publicado com better-og",
        title: "X (antigo Twitter)",
      },
    },
  },
};

export default ptBr;
