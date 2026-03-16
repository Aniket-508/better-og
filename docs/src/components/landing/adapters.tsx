"use client";

import Link from "next/link";
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";

import type { AdapterCardConfig } from "@/components/landing/data";
import {
  getAdapterCards,
  getNextAdapterVariants,
} from "@/components/landing/data";
import { CloudflareWorkers } from "@/components/ui/icon/cloudflare-workers";
import { Nextjs } from "@/components/ui/icon/nextjs";
import { Nodejs } from "@/components/ui/icon/nodejs";
import { TanStack } from "@/components/ui/icon/tanstack";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import { getLocalizedPath } from "@/translations";
import type { Translation } from "@/translations";

const PreviewFrame = ({ light, dark }: AdapterCardConfig["img"]) => (
  <div className="absolute top-0 -right-4 h-58 overflow-hidden rounded-lg">
    <div className="block dark:hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        width="305"
        height="232"
        alt="NODE.JS code snippet"
        className="w-full h-full object-cover object-top-left opacity-15 group-hover:opacity-100 transition-opacity duration-200 ease"
        src={light}
      />
    </div>
    <div className="hidden dark:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        width="305"
        height="232"
        alt="NODE.JS code snippet"
        className="w-full h-full object-cover object-top-left opacity-15 group-hover:opacity-100 transition-opacity duration-200 ease"
        src={dark}
      />
    </div>
  </div>
);

const AdapterLogo = ({ id }: { id: AdapterCardConfig["id"] | "next" }) => {
  if (id === "node") {
    return <Nodejs className="size-10 sm:size-14" />;
  }

  if (id === "workers") {
    return <CloudflareWorkers className="size-10 sm:size-14" />;
  }

  if (id === "next") {
    return <Nextjs className="size-10 sm:size-14" />;
  }

  return <TanStack className="size-10 sm:size-14" />;
};

const BaseAdapterCard = ({
  lang,
  adapter,
  className,
  children,
}: {
  lang: string;
  adapter: AdapterCardConfig;
  className?: string;
  children?: React.ReactNode;
}) => {
  const { href, id, title, img } = adapter;

  return (
    <Link
      className={cn(
        "group relative flex flex-col overflow-hidden bg-card p-3 transition-colors duration-200 ease hover:bg-muted/20 h-[250px] sm:h-[356px] items-start justify-end sm:p-6",
        className
      )}
      href={getLocalizedPath(lang, href)}
    >
      <PreviewFrame {...img} />

      <div className="relative z-20 flex items-end gap-4 w-full bg-card pt-4 sm:pt-6 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-2">
          <AdapterLogo id={id} />
          <span className="font-mono text-base font-medium uppercase tracking-[0.64px] text-foreground">
            {title}
          </span>
        </div>
        {children}
      </div>
    </Link>
  );
};

const NextAdapterCard = ({
  lang,
  translation,
}: {
  lang: string;
  translation: Translation;
}) => {
  const nextAdapterVariants = getNextAdapterVariants(translation);
  const [variantId, setVariantId] =
    useState<(typeof nextAdapterVariants)[number]["id"]>("node");
  const handleVariantChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setVariantId(
        event.target.value as (typeof nextAdapterVariants)[number]["id"]
      );
    },
    []
  );
  const handleSelectClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const variant =
    nextAdapterVariants.find((item) => item.id === variantId) ??
    nextAdapterVariants[0];

  return (
    <BaseAdapterCard
      lang={lang}
      adapter={{ ...variant, id: "next", title: "NEXT.JS" }}
    >
      <NativeSelect
        size="sm"
        aria-label={translation.landing.nextRuntimeAriaLabel}
        onChange={handleVariantChange}
        value={variantId}
        onClick={handleSelectClick}
      >
        {nextAdapterVariants.map((option) => (
          <NativeSelectOption key={option.id} value={option.id}>
            {option.title}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </BaseAdapterCard>
  );
};

interface AdaptersProps {
  lang: string;
  translation: Translation;
}

export const Adapters = ({ lang, translation }: AdaptersProps) => {
  const adapterCards = getAdapterCards(translation);

  return (
    <section className="relative mt-20 max-w-full">
      <div className="relative before:absolute before:top-0 before:h-px before:w-full before:bg-border after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
        <h2 className="max-w-2xl px-2 text-4xl font-medium tracking-tighter text-balance max-sm:px-4">
          {translation.home.adaptersTitle}
        </h2>
      </div>
      <div className="relative font-mono text-xs/6 text-muted-foreground after:absolute after:bottom-0 after:h-px after:w-full md:after:bg-border">
        <p className="px-2 text-balance max-sm:px-4">
          {translation.home.adaptersDescription}
        </p>
      </div>

      <div className="relative after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
        <div className="grid grid-cols-1 md:grid-cols-4 md:[&>*:not(:nth-child(4n))]:border-r md:[&>*:nth-child(n+5)]:border-t *:border-border max-md:*:border-t">
          <BaseAdapterCard lang={lang} adapter={adapterCards[0]} />
          <NextAdapterCard lang={lang} translation={translation} />
          <BaseAdapterCard lang={lang} adapter={adapterCards[1]} />
          <BaseAdapterCard lang={lang} adapter={adapterCards[2]} />
        </div>
      </div>
    </section>
  );
};
