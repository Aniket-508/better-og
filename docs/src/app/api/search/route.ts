import { createFromSource } from "fumadocs-core/search/server";

import { source } from "@/lib/source";

export const { GET } = createFromSource(source, {
  localeMap: {
    ar: { language: "arabic" },
    da: {},
    de: {},
    en: { language: "english" },
    es: {},
    fr: {},
    hi: {},
    id: {},
    it: {},
    // Orama does not support Japanese stemming. Use the default tokenizer
    // config instead of forcing an unsupported language name.
    ja: {},
    ko: {},
    pt: {},
    "pt-br": {},
    ru: {},
    tr: {},
    uk: {},
    zh: {},
  },
});
