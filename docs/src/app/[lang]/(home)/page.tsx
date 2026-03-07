import type { Metadata } from "next";

import { Adapters } from "@/components/landing/adapters";
import { getPlatformCards, getLocaleCards } from "@/components/landing/data";
import { VerticalSeparator } from "@/components/landing/grid-separators";
import { Hero } from "@/components/landing/hero";
import { LocalePreview } from "@/components/landing/locale-preview";
import { Platforms } from "@/components/landing/platforms";
import { i18n } from "@/lib/i18n";
import { createMetadata } from "@/seo/metadata";
import { getTranslation } from "@/translations";

export const generateStaticParams = () =>
  i18n.languages.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  const translation = getTranslation(lang);

  return createMetadata({
    canonical: `/${lang}`,
    description: translation.home.heroSubtitle,
    ogDescription: translation.home.heroSubtitle,
    ogImage: `/og/${lang}/docs/image.png`,
    title: translation.home.heroTitle,
  });
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const translation = getTranslation(lang);
  const localeCards = getLocaleCards(lang);
  const platformCards = getPlatformCards();

  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center [--gutter-width:2.5rem] md:-mx-4 md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-xl))_var(--gutter-width)] lg:mx-0">
      <VerticalSeparator />

      <main className="grid gap-24 pb-24 text-foreground sm:gap-40 md:pb-40">
        <div>
          <Hero lang={lang} translation={translation} />
          <LocalePreview localeCards={localeCards} translation={translation} />
          <Platforms
            lang={lang}
            platformCards={platformCards}
            translation={translation}
          />
          <Adapters lang={lang} translation={translation} />
        </div>
      </main>

      <VerticalSeparator className="md:col-start-3" />
    </div>
  );
}
