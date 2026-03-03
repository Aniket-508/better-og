import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="min-h-dvh">
      <main className="mx-auto max-w-4xl grid gap-24 px-4 pb-24 text-foreground sm:gap-40 md:pb-40">
        <div>
          <p className="font-mono text-xs tracking-tighter text-muted-foreground whitespace-pre">
            Open Graph image toolkit
          </p>

          <h1 className="mt-4 text-4xl font-medium tracking-tighter text-balance max-sm:text-3xl sm:text-5xl lg:text-6xl">
            Platform-aware OG images, made simple.
          </h1>

          <p className="mt-5 font-mono text-xs tracking-tighter text-muted-foreground">
            Automatic aspect ratios. Locale-aware fonts. Multi-runtime adapters.
          </p>

          <div className="my-10 h-px w-full bg-border" />

          <div className="flex flex-wrap gap-2">
            <Button asChild className="tracking-tight">
              <Link href={`/${lang}/docs`}>Get started</Link>
            </Button>
            <Button variant="secondary" asChild className="tracking-tight">
              <Link
                href="https://github.com/Aniket-508/better-og"
                target="_blank"
                rel="noopener"
              >
                GitHub
              </Link>
            </Button>
          </div>

          <section className="mt-20">
            <h2 className="text-2xl font-medium tracking-tighter sm:text-3xl">
              Multilingual OG preview
            </h2>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              Each OG image adapts its fonts and layout based on the locale and
              requesting platform.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {(["en", "ja", "ar"] as const).map((locale) => (
                <div key={locale} className="space-y-2">
                  <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    {locale}
                  </p>
                  <Image
                    alt={`OG image preview (${locale})`}
                    height={630}
                    src={`/og/${locale}/docs/image.png`}
                    className="block w-full rounded-lg border border-border"
                    unoptimized
                    width={1200}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-2xl font-medium tracking-tighter sm:text-3xl">
              Every platform, one route
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Twitter", ratio: "1.91:1", size: "1200x630" },
                { name: "Telegram / Slack", ratio: "1:1", size: "1200x1200" },
                { name: "iMessage", ratio: "1:1.91", size: "630x1200" },
                { name: "Instagram", ratio: "4:5", size: "1200x1500" },
              ].map((platform) => (
                <div
                  key={platform.name}
                  className={cn(
                    "rounded-lg border border-border p-4 space-y-1",
                    "bg-card text-card-foreground"
                  )}
                >
                  <p className="font-medium text-sm">{platform.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {platform.ratio} ({platform.size})
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
