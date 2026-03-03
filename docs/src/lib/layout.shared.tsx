import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { BetterOgLogo } from "@/components/logos/better-og-logo";
import { i18n } from "@/lib/i18n";

export const baseOptions = (_locale: string): BaseLayoutProps => ({
  githubUrl: "https://github.com/Aniket-508/better-og",
  i18n,
  nav: {
    title: (
      <div className="flex items-center gap-1.5">
        <BetterOgLogo width={24} height={24} />
        <span className="font-semibold text-sm">better-og</span>
      </div>
    ),
  },
});
