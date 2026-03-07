"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { FaNodeJs } from "react-icons/fa";
import { SiCloudflare, SiNextdotjs } from "react-icons/si";

import { adapterCards, nextAdapterVariants } from "@/components/landing/data";
import type { AdapterCardConfig } from "@/components/landing/data";
import { cn } from "@/lib/utils";
import type { Translation } from "@/translations";

const PreviewFrame = ({ lines, title }: { lines: string[]; title: string }) => (
  <div className="hidden sm:block absolute top-0 -right-4 h-58 overflow-hidden rounded-lg">
    <div className="h-full w-[19rem] rounded-lg border border-border/60 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.92))] p-4 opacity-40 transition-opacity duration-200 ease group-hover:opacity-100">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-400">
          {title}
        </span>
        <div className="flex gap-1">
          <span className="size-2 rounded-full bg-zinc-500" />
          <span className="size-2 rounded-full bg-zinc-600" />
          <span className="size-2 rounded-full bg-zinc-700" />
        </div>
      </div>
      <div className="space-y-1 font-mono text-[11px] leading-5 text-zinc-200">
        {lines.map((line) => (
          <div key={`${title}-${line}`} className="truncate">
            {line}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdapterLogo = ({ id }: { id: AdapterCardConfig["id"] | "next" }) => {
  if (id === "node") {
    return <FaNodeJs className="size-10 sm:size-14" />;
  }

  if (id === "workers") {
    return <SiCloudflare className="size-10 sm:size-14" />;
  }

  if (id === "next") {
    return <SiNextdotjs className="size-10 sm:size-14" />;
  }

  return (
    <span className="flex size-10 items-center justify-center rounded-full border border-border font-mono text-sm sm:size-14 sm:text-lg">
      TS
    </span>
  );
};

const BaseAdapterCard = ({
  href,
  id,
  lang,
  previewAlt,
  previewLines,
  title,
}: AdapterCardConfig & { lang: string }) => (
  <Link
    className={cn(
      "group relative flex flex-col items-center justify-center overflow-hidden border-b border-r border-border bg-card p-3 transition-colors duration-200 ease hover:bg-muted/20 sm:h-[356px] sm:items-start sm:justify-end sm:p-6"
    )}
    href={`/${lang}${href}`}
  >
    <PreviewFrame lines={previewLines} title={previewAlt} />
    <AdapterLogo id={id} />
    <span className="hidden font-mono text-base font-medium uppercase tracking-[0.64px] text-foreground sm:mt-4 sm:block">
      {title}
    </span>
  </Link>
);

const NextAdapterCard = ({ lang }: { lang: string }) => {
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
  const variant =
    nextAdapterVariants.find((item) => item.id === variantId) ??
    nextAdapterVariants[0];

  return (
    <div className="group relative flex flex-col items-center justify-center overflow-hidden border-b border-r border-border bg-card p-3 transition-colors duration-200 ease hover:bg-muted/20 sm:h-[356px] sm:items-start sm:justify-end sm:p-6">
      <PreviewFrame lines={variant.previewLines} title={variant.previewAlt} />

      <div className="absolute top-4 right-4 z-20">
        <div className="relative">
          <select
            aria-label="Next.js runtime"
            className="appearance-none rounded-full border border-border/70 bg-background/90 py-1 pr-8 pl-3 text-xs font-medium text-foreground backdrop-blur"
            onChange={handleVariantChange}
            value={variantId}
          >
            {nextAdapterVariants.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <Link
        className="absolute inset-0 z-10"
        href={`/${lang}${variant.href}`}
        aria-label={`Open Next.js ${variant.label} docs`}
      />

      <SiNextdotjs className="size-10 sm:size-14" />
      <div className="relative z-20 hidden items-center gap-2 sm:mt-4 sm:flex">
        <span className="font-mono text-base font-medium uppercase tracking-[0.64px] text-foreground">
          NEXT.JS
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          {variant.label}
        </span>
      </div>
    </div>
  );
};

interface AdaptersProps {
  lang: string;
  translation: Translation;
}

export const Adapters = ({ lang, translation }: AdaptersProps) => (
  <section className="relative mt-20 max-w-full">
    <div className="relative before:absolute before:top-0 before:h-px before:w-full before:bg-border after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
      <h2 className="max-w-2xl px-2 text-4xl font-medium tracking-tighter text-balance max-sm:px-4">
        {translation.home.adaptersTitle}
      </h2>
    </div>
    <div className="relative font-mono text-xs/6 text-muted-foreground after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
      <p className="px-2 text-balance max-sm:px-4">
        {translation.home.adaptersDescription}
      </p>
    </div>

    <div className="relative after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
      <div className="grid grid-cols-2 md:grid-cols-4">
        <BaseAdapterCard {...adapterCards[0]} lang={lang} />
        <NextAdapterCard lang={lang} />
        <BaseAdapterCard {...adapterCards[1]} lang={lang} />
        <BaseAdapterCard {...adapterCards[2]} lang={lang} />
      </div>
    </div>
  </section>
);
