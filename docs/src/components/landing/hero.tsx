import { MoveUpRight } from "lucide-react";
import Link from "next/link";

import { Separator } from "@/components/landing/grid-separators";
import { Button } from "@/components/ui/button";
import type { Translation } from "@/translations";

interface HeroProps {
  lang: string;
  translation: Translation;
}

export const Hero = ({ lang, translation }: HeroProps) => (
  <div>
    <div className="relative flex h-16 items-end px-2 font-mono text-xs/6 tracking-tighter text-muted-foreground whitespace-pre max-sm:px-4 sm:h-24">
      {translation.home.heroEyebrow}
    </div>

    <div className="relative before:absolute before:top-0 before:h-px before:w-full before:bg-border after:absolute after:-bottom-1.5 after:h-px after:w-full after:bg-border">
      <h1 className="px-2 text-4xl tracking-tighter text-balance max-lg:font-medium max-sm:px-4 sm:text-5xl lg:text-6xl xl:text-8xl">
        {translation.home.heroTitle}
      </h1>
    </div>

    <div className="relative mt-5 px-2 font-mono text-xs/6 tracking-tighter text-muted-foreground max-sm:px-4">
      {translation.home.heroSubtitle}
    </div>

    <Separator />

    <div className="relative mt-10 before:absolute before:top-0 before:h-px before:w-full before:bg-border after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
      <div className="flex flex-wrap gap-2 px-2 max-sm:px-4">
        <Button asChild className="tracking-tight">
          <Link href={`/${lang}/docs`}>{translation.home.ctaDocs}</Link>
        </Button>
        <Button variant="secondary" asChild className="tracking-tight">
          <Link
            className="inline-flex items-center gap-2"
            href="https://github.com/Aniket-508/better-og"
            rel="noopener"
            target="_blank"
          >
            {translation.home.ctaGitHub}
            <MoveUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  </div>
);
