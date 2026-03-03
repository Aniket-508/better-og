import { createFromSource } from "fumadocs-core/search/server";

import { source } from "@/lib/source";

export const { GET } = createFromSource(source, {
  localeMap: {
    ar: { language: "arabic" },
    en: { language: "english" },
    // Orama does not support Japanese stemming. Use the default tokenizer
    // config instead of forcing an unsupported language name.
    ja: {},
  },
});
