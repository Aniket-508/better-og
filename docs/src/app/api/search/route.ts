import { createFromSource } from "fumadocs-core/search/server";

import { source } from "@/lib/source";

export const { GET } = createFromSource(source, {
  localeMap: {
    ar: { language: "arabic" },
    en: { language: "english" },
    ja: { language: "japanese" },
  },
});
