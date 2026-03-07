import { i18n } from "@/lib/i18n";

import { ar } from "./ar";
import { en } from "./en";
import { ja } from "./ja";

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
}

const translations: Record<string, Translation> = {
  ar,
  en,
  ja,
};

export const getTranslation = (locale: string): Translation =>
  translations[locale] ?? translations[i18n.defaultLanguage];
