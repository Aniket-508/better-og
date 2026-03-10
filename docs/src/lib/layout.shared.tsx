import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { LogoMark } from "@/components/logo";
import { i18n } from "@/lib/i18n";

export const baseOptions: (_locale: string) => BaseLayoutProps = () => ({
  githubUrl: "https://github.com/Aniket-508/better-og",
  i18n,
  nav: {
    title: (
      <>
        <LogoMark className="h-6" />
        better-og
      </>
    ),
  },
});
