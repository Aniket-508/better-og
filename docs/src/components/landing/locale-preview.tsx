import Image from "next/image";

import type { LocaleCard } from "@/components/landing/data";
import type { Translation } from "@/translations";

interface LocalePreviewProps {
  localeCards: LocaleCard[];
  translation: Translation;
}

export const LocalePreview = ({
  localeCards,
  translation,
}: LocalePreviewProps) => (
  <section className="relative mt-20 max-w-full">
    <div className="relative before:absolute before:top-0 before:h-px before:w-full before:bg-border after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
      <h2 className="max-w-2xl px-2 text-4xl font-medium tracking-tighter text-balance max-sm:px-4">
        {translation.home.localizedTitle}
      </h2>
    </div>
    <div className="relative font-mono text-xs/6 text-muted-foreground after:absolute after:bottom-0 after:h-px after:w-full md:after:bg-border">
      <p className="px-2 text-balance max-sm:px-4">
        {translation.home.localizedDescription}
      </p>
    </div>

    <div className="relative after:absolute after:bottom-0 after:h-px after:w-full after:bg-border">
      <div className="grid grid-cols-1 md:grid-cols-3 md:[&>*:not(:nth-child(3n))]:border-r md:[&>*:nth-child(n+4)]:border-t *:border-border max-md:*:border-t">
        {localeCards.map((locale) => (
          <div key={locale.code} className="space-y-2 px-4 py-6">
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
);
