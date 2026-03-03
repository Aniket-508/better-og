import { MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SeparatorProps {
  className?: string;
}

interface AspectRatioCard {
  aspectRatio: string;
  description: string;
  height: number;
  platform: string;
  query: string;
  size: string;
  title: string;
  width: number;
}

interface AdapterCardConfig {
  badge: string;
  href?: string;
  monogram: string;
  name: string;
  previewLabel: string;
  previewLines: string[];
  tone: string;
}

const aspectRatioCards: AspectRatioCard[] = [
  {
    aspectRatio: "1.91:1",
    description: "The default Open Graph canvas for most link previews.",
    height: 630,
    platform: "Twitter / Web",
    query: "1.91:1",
    size: "1200x630",
    title: "Standard",
    width: 1200,
  },
  {
    aspectRatio: "1:1",
    description: "Used by square-first surfaces such as Telegram and Slack.",
    height: 1200,
    platform: "Telegram / Slack",
    query: "1:1",
    size: "1200x1200",
    title: "Square",
    width: 1200,
  },
  {
    aspectRatio: "1:1.91",
    description:
      "Vertical composition for portrait-oriented messaging layouts.",
    height: 1200,
    platform: "iMessage",
    query: "1:1.91",
    size: "630x1200",
    title: "Portrait",
    width: 630,
  },
  {
    aspectRatio: "4:5",
    description: "A taller card tuned for social feeds such as Instagram.",
    height: 1500,
    platform: "Instagram",
    query: "4:5",
    size: "1200x1500",
    title: "Instagram",
    width: 1200,
  },
];

const adapterCards: AdapterCardConfig[] = [
  {
    badge: "Adapter",
    href: "/docs/adapters/next",
    monogram: "NX",
    name: "Next.js",
    previewLabel: "APP ROUTER",
    previewLines: [
      'createOgRouteHandler({ provider: "next" })',
      'createOgRouteHandler({ provider: "takumi" })',
      "withOgRewrite()",
    ],
    tone: "from-zinc-950 via-zinc-700 to-zinc-500",
  },
  {
    badge: "Adapter",
    href: "/docs/adapters/next-edge",
    monogram: "NE",
    name: "Next Edge",
    previewLabel: "EDGE RUNTIME",
    previewLines: [
      'createOgRouteHandler({ provider: "next" })',
      'export const runtime = "edge"',
      "same request-aware context",
    ],
    tone: "from-sky-950 via-sky-700 to-cyan-500",
  },
  {
    badge: "Adapter",
    href: "/docs/adapters/workers",
    monogram: "WK",
    name: "Workers",
    previewLabel: "FETCH HANDLER",
    previewLines: [
      "initSync + Renderer handled internally",
      "pass component + fetchedResources",
      "deploy to workers",
    ],
    tone: "from-amber-950 via-orange-700 to-yellow-500",
  },
  {
    badge: "Adapter",
    href: "/docs/adapters/tanstack-start",
    monogram: "TS",
    name: "TanStack Start",
    previewLabel: "SERVER FUNCTION",
    previewLines: [
      "({ request, params }) => Response",
      "params-aware locale resolution",
      "Takumi on Node",
    ],
    tone: "from-emerald-950 via-emerald-700 to-lime-500",
  },
];

const Separator = ({ className }: SeparatorProps) => (
  <div
    className={cn(
      "relative flex h-7 w-full border-y border-border lg:h-10",
      "bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed [--pattern-fg:rgba(0,0,0,0.05)] dark:[--pattern-fg:rgba(255,255,255,0.1)]",
      className
    )}
  />
);

const VerticalSeparator = ({ className }: SeparatorProps) => (
  <div
    className={cn(
      "row-span-full row-start-1 hidden border-x border-border",
      "bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed [--pattern-fg:rgba(0,0,0,0.07)] md:block dark:[--pattern-fg:rgba(255,255,255,0.08)]",
      className
    )}
  />
);

const AdapterCard = ({
  adapter,
  lang,
}: {
  adapter: AdapterCardConfig;
  lang: string;
}) => {
  const content = (
    <>
      <span className="hidden sm:block absolute top-6 right-6 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        {adapter.badge}
      </span>

      <div className="hidden sm:block absolute top-6 inset-x-6 h-40 overflow-hidden rounded-2xl border border-border/70">
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br opacity-95",
            adapter.tone
          )}
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-4 font-mono text-[11px]/5 text-white/90">
          <span className="uppercase tracking-[0.28em] text-white/60">
            {adapter.previewLabel}
          </span>
          <div>
            {adapter.previewLines.map((line) => (
              <div key={`${adapter.name}-${line}`} className="truncate">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex size-10 items-center justify-center rounded-2xl border border-border bg-card font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-foreground sm:mb-4 sm:size-14 sm:text-xs">
        {adapter.monogram}
      </div>

      <span className="font-mono text-sm font-medium uppercase tracking-[0.28em] text-foreground sm:text-base">
        {adapter.name}
      </span>
    </>
  );

  return (
    <Link
      className={cn(
        "relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden p-4 text-center sm:min-h-[356px] sm:items-start sm:justify-end sm:text-left",
        "transition-colors duration-200 ease hover:bg-muted/30"
      )}
      href={`/${lang}${adapter.href}`}
    >
      {content}
    </Link>
  );
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center [--gutter-width:2.5rem] md:-mx-4 md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-xl))_var(--gutter-width)] lg:mx-0">
      <VerticalSeparator />

      <main className="grid gap-24 pb-24 text-foreground sm:gap-40 md:pb-40">
        <div>
          <div className="relative flex h-16 items-end px-2 font-mono text-xs/6 tracking-tighter text-muted-foreground whitespace-pre max-sm:px-4 sm:h-24">
            Open Graph image toolkit
          </div>

          <div className="relative before:absolute before:top-0 before:w-full before:h-px before:bg-border after:absolute after:-bottom-1.5 after:h-px after:w-full after:bg-border">
            <h1 className="px-2 text-4xl tracking-tighter text-balance max-lg:font-medium max-sm:px-4 sm:text-5xl lg:text-6xl xl:text-8xl">
              Platform-aware OG images, made simple.
            </h1>
          </div>

          <div className="relative mt-5 px-2 font-mono text-xs/6 tracking-tighter text-muted-foreground max-sm:px-4">
            Automatic aspect ratios. Locale-aware fonts. Multi-runtime adapters.
          </div>

          <Separator />

          <div className="relative mt-10 before:absolute before:top-0 before:h-px before:w-full before:bg-border after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
            <div className="flex flex-wrap gap-2 px-2 max-sm:px-4">
              <Button asChild className="tracking-tight">
                <Link href={`/${lang}/docs`}>Get started</Link>
              </Button>
              <Button variant="secondary" asChild className="tracking-tight">
                <Link
                  className="inline-flex items-center gap-2"
                  href="https://github.com/Aniket-508/better-og"
                  rel="noopener"
                  target="_blank"
                >
                  GitHub
                  <MoveUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          <section className="relative mt-20 max-w-full">
            <div className="relative before:absolute before:top-0 before:h-px before:w-full before:bg-border after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <h2 className="max-w-2xl px-2 text-4xl font-medium tracking-tighter text-balance max-sm:px-4">
                Multilingual OG preview
              </h2>
            </div>
            <div className="relative font-mono text-xs/6 text-muted-foreground after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <p className="px-2 text-balance max-sm:px-4">
                Each OG image adapts its fonts and layout based on the locale
                and requesting platform.
              </p>
            </div>

            <div className="relative after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <div className="grid grid-cols-1 md:grid-cols-3 md:[&>*:not(:nth-child(3n))]:border-r md:[&>*:nth-child(n+4)]:border-t *:border-border max-md:*:border-t">
                {(
                  [
                    { code: "en", name: "English" },
                    { code: "ja", name: "Japanese" },
                    { code: "ar", name: "Arabic" },
                  ] as const
                ).map((locale) => (
                  <div key={locale.code} className="px-4 py-6 space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-medium">{locale.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        [{locale.code}]
                      </p>
                    </div>
                    <Image
                      alt={`OG image preview (${locale.name})`}
                      className="block w-full border border-border bg-card"
                      height={630}
                      src={`/og/${locale.code}/docs/image.png`}
                      unoptimized
                      width={1200}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative mt-20 max-w-full">
            <div className="relative before:absolute before:top-0 before:h-px before:w-full before:bg-border after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <h2 className="max-w-2xl px-2 text-4xl font-medium tracking-tighter text-balance max-sm:px-4">
                Every platform, one route
              </h2>
            </div>
            <div className="relative font-mono text-xs/6 text-muted-foreground after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <p className="px-2 text-balance max-sm:px-4">
                One endpoint renders the right aspect ratio and output format
                for every social surface.
              </p>
            </div>

            <div className="relative after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <div className="grid grid-cols-1 md:grid-cols-4 md:[&>*:not(:nth-child(4n))]:border-r md:[&>*:nth-child(n+5)]:border-t *:border-border max-md:*:border-t">
                {aspectRatioCards.map((card) => (
                  <div
                    key={card.query}
                    className="px-4 py-6 text-card-foreground"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-medium">{card.platform}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {card.aspectRatio} ({card.size})
                      </p>
                    </div>

                    <Image
                      alt={`${card.title} aspect ratio preview`}
                      className="block h-auto w-full rounded-xl mt-2 border border-border/60"
                      height={card.height}
                      src={`/og/${lang}/docs/image.png?aspect_ratio=${encodeURIComponent(card.query)}`}
                      unoptimized
                      width={card.width}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative mt-20 max-w-full">
            <div className="relative before:absolute before:top-0 before:h-px before:w-full before:bg-border after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <h2 className="max-w-2xl px-2 text-4xl font-medium tracking-tighter text-balance max-sm:px-4">
                Adapters for every stack
              </h2>
            </div>
            <div className="relative font-mono text-xs/6 text-muted-foreground after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <p className="px-2 text-balance max-sm:px-4">
                Works with the tools and frameworks you already know and love.
              </p>
            </div>

            <div className="relative after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <div className="grid grid-cols-1 md:grid-cols-4 md:[&>*:not(:nth-child(4n))]:border-r md:[&>*:nth-child(n+5)]:border-t *:border-border max-md:*:border-t">
                {adapterCards.map((adapter) => (
                  <AdapterCard
                    key={adapter.name}
                    adapter={adapter}
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <VerticalSeparator className="md:col-start-3" />
    </div>
  );
}
