"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { useCallback, useState } from "react";

import type { AspectRatioCard } from "@/components/landing/data";
import { IMessage } from "@/components/ui/icon/imessage";
import { Instagram } from "@/components/ui/icon/instagram";
import { Slack } from "@/components/ui/icon/slack";
import { Telegram } from "@/components/ui/icon/telegram";
import { X } from "@/components/ui/icon/x";
import { cn } from "@/lib/utils";
import type { Translation } from "@/translations";

const PlatformLogo = ({
  logo,
  className,
}: {
  className?: string;
  logo: AspectRatioCard["logos"][number];
}) => {
  const iconClassName = cn(
    "size-8 sm:size-10",
    logo === "x" && "sm:pt-2",
    className
  );

  switch (logo) {
    case "apple": {
      return <IMessage className={iconClassName} />;
    }
    case "instagram": {
      return <Instagram className={iconClassName} />;
    }
    case "slack": {
      return <Slack className={iconClassName} />;
    }
    case "telegram": {
      return <Telegram className={iconClassName} />;
    }
    case "x": {
      return <X className={iconClassName} />;
    }
    default: {
      return null;
    }
  }
};

interface PlatformsProps {
  lang: string;
  platformCards: AspectRatioCard[];
  translation: Translation;
}

export const Platforms = ({
  lang,
  platformCards,
  translation,
}: PlatformsProps) => {
  const [selectedId, setSelectedId] = useState(platformCards[0]?.id);
  const handleSelect = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setSelectedId(event.currentTarget.value);
  }, []);
  const activeCard =
    platformCards.find((card) => card.id === selectedId) ?? platformCards[0];

  if (!activeCard) {
    return null;
  }

  return (
    <section className="relative mt-20 max-w-full">
      <div className="relative before:absolute before:top-0 before:h-px before:w-full before:bg-border after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
        <h2 className="max-w-2xl px-2 text-4xl font-medium tracking-tighter text-balance max-sm:px-4">
          {translation.home.platformsTitle}
        </h2>
      </div>
      <div className="relative font-mono text-xs/6 text-muted-foreground after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
        <p className="px-2 text-balance max-sm:px-4">
          {translation.home.platformsDescription}
        </p>
      </div>

      <div className="relative after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] md:[&>*:first-child]:border-r">
          <div className="border-border">
            {platformCards.map((card, index) => (
              <button
                key={card.id}
                className={cn(
                  "flex flex-col w-full items-start gap-4 px-4 py-5 text-left transition-colors duration-200",
                  "border-border",
                  index > 0 ? "border-t" : "",
                  selectedId === card.id ? "bg-muted/40" : "hover:bg-muted/20"
                )}
                onClick={handleSelect}
                type="button"
                value={card.id}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  {card.logos.map((logo) => (
                    <PlatformLogo key={`${card.id}-${logo}`} logo={logo} />
                  ))}
                </div>

                <div className="min-w-0">
                  <div className="font-medium">{card.title}</div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">
                    {card.dimensionLabel} [{card.aspectRatio}]
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-8 md:px-10">
            <div className="mx-auto flex max-w-3xl items-center justify-center rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.18),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.03),transparent)] p-6 md:min-h-[44rem]">
              <div className="relative w-full max-w-[24rem] rounded-[2.4rem] border border-zinc-300/80 bg-zinc-950 p-3 shadow-2xl dark:border-zinc-800">
                <div className="mb-3 flex items-center justify-between rounded-[1.8rem] bg-zinc-900 px-4 py-2 text-[11px] text-zinc-400">
                  <span>9:41</span>
                  <span className="h-1.5 w-16 rounded-full bg-zinc-700" />
                </div>

                <div className="overflow-hidden rounded-[1.8rem] bg-white shadow-inner dark:bg-zinc-900">
                  <div
                    className="flex items-center justify-between px-4 py-3 text-white"
                    style={{ background: activeCard.previewChrome.accent }}
                  >
                    <div className="flex items-center gap-2">
                      {activeCard.logos.map((logo) => (
                        <PlatformLogo
                          key={`${activeCard.id}-header-${logo}`}
                          className="size-3.5"
                          logo={logo}
                        />
                      ))}
                      <span className="text-sm font-medium">
                        {activeCard.appLabel}
                      </span>
                    </div>
                    <span className="text-xs opacity-80">
                      {translation.landing.now}
                    </span>
                  </div>

                  <div
                    className="space-y-4 px-4 py-4"
                    style={{ background: activeCard.previewChrome.background }}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">
                        {activeCard.previewChrome.label}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: activeCard.previewChrome.secondary }}
                      >
                        {activeCard.dimensionLabel} ({activeCard.aspectRatio})
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                      <Image
                        alt={`${activeCard.title} platform preview`}
                        className="block h-auto w-full"
                        height={activeCard.height}
                        src={`/og/${lang}/docs/image.png?aspect_ratio=${encodeURIComponent(activeCard.query)}`}
                        unoptimized
                        width={activeCard.width}
                      />
                    </div>

                    <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-3 font-mono text-[11px] text-white/75">
                      {activeCard.codeSnippet.map((line) => (
                        <div key={`${activeCard.id}-${line}`}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
