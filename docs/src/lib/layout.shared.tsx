import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { Logo } from "@/components/logo";
import { i18n } from "@/lib/i18n";

export const baseOptions: (_locale: string) => BaseLayoutProps = () => ({
  githubUrl: "https://github.com/Aniket-508/better-og",
  i18n,
  nav: {
    title: (
      <>
        <Logo className="h-6" />
        better-og
      </>
    ),
  },
});
