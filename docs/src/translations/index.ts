import { i18n } from "@/lib/i18n";

import ar from "./ar";
import da from "./da";
import de from "./de";
import en from "./en";
import es from "./es";
import fr from "./fr";
import hi from "./hi";
import id from "./id";
import it from "./it";
import ja from "./ja";
import ko from "./ko";
import pt from "./pt";
import ptBr from "./pt-br";
import ru from "./ru";
import tr from "./tr";
import uk from "./uk";
import zh from "./zh";

export interface PlatformTranslation {
  appLabel: string;
  codeSnippet: [string, string, string];
  previewLabel: string;
  title: string;
}

export interface Translation {
  footer: {
    builtBy: string;
    hostedOn: string;
    llms: string;
    sourceAvailableOn: string;
    twitter: string;
  };
  home: {
    adaptersDescription: string;
    adaptersTitle: string;
    ctaDocs: string;
    ctaGitHub: string;
    heroEyebrow: string;
    heroSubtitle: string;
    heroTitle: string;
    localizedDescription: string;
    localizedTitle: string;
    platformsDescription: string;
    platformsTitle: string;
  };
  landing: {
    adapters: {
      nextEdge: string;
      nextNode: string;
      node: string;
      tanstack: string;
      workers: string;
    };
    nextRuntimeAriaLabel: string;
    now: string;
    platforms: {
      imessage: PlatformTranslation;
      instagram: PlatformTranslation;
      square: PlatformTranslation;
      x: PlatformTranslation;
    };
  };
  notFound: {
    heading: string;
    description: string;
    goHome: string;
    explore: string;
  };
}

const translations: Record<string, Translation> = {
  ar,
  da,
  de,
  en,
  es,
  fr,
  hi,
  id,
  it,
  ja,
  ko,
  pt,
  "pt-br": ptBr,
  ru,
  tr,
  uk,
  zh,
};

export const getTranslation = (locale: string): Translation =>
  translations[locale] ?? translations[i18n.defaultLanguage];

export const getLocalizedPath = (locale: string, path: string): string => {
  if (locale === i18n.defaultLanguage) {
    return path;
  }
  return `/${locale}${path}`;
};
