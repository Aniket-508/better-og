import { MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SeparatorProps {
  className?: string;
}

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
                  target="_blank"
                  rel="noopener"
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
              <p className="text-balance px-2 max-sm:px-4">
                Each OG image adapts its fonts and layout based on the locale
                and requesting platform.
              </p>
            </div>

            <div className="relative after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <div className="px-2 py-6 max-sm:px-4 grid gap-6 sm:grid-cols-3">
                {(["en", "ja", "ar"] as const).map((locale) => (
                  <div key={locale} className="space-y-2">
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {locale}
                    </p>
                    <Image
                      alt={`OG image preview (${locale})`}
                      height={630}
                      src={`/og/${locale}/docs/image.png`}
                      className="block w-full border border-border bg-card"
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
              <p className="text-balance px-2 max-sm:px-4">
                One endpoint renders the right aspect ratio and output format
                for every social surface.
              </p>
            </div>

            <div className="relative after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 py-6 px-2 max-sm:px-4">
                {[
                  { name: "Twitter", ratio: "1.91:1", size: "1200x630" },
                  { name: "Telegram / Slack", ratio: "1:1", size: "1200x1200" },
                  { name: "iMessage", ratio: "1:1.91", size: "630x1200" },
                  { name: "Instagram", ratio: "4:5", size: "1200x1500" },
                ].map((platform) => (
                  <div
                    key={platform.name}
                    className={cn(
                      "space-y-1 border border-border bg-card p-4",
                      "text-card-foreground"
                    )}
                  >
                    <p className="text-sm font-medium">{platform.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {platform.ratio} ({platform.size})
                    </p>
                  </div>
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
