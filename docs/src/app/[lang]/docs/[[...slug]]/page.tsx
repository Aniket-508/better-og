import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { SquarePen } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LLMCopyButton, ViewOptions } from "@/components/ai/page-actions";
import { LINK } from "@/constants/links";
import { i18n } from "@/lib/i18n";
import { getPageImage, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { getLocalizedPath } from "@/translations";

interface DocsPageProps {
  params: Promise<{ lang: string; slug?: string[] }>;
}

export default async function Page({ params }: DocsPageProps) {
  const { slug, lang } = await params;

  const page = source.getPage(slug, lang);
  if (!page) {
    notFound();
  }

  const Mdx = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`${LINK.DOCS}/${page.path}`}
        />
      </div>
      <DocsBody>
        <Mdx
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
        <div className="flex flex-row flex-wrap items-center justify-between gap-4 empty:hidden">
          <a
            href={`${LINK.DOCS}/${page.path}`}
            rel="noreferrer noopener"
            target="_blank"
            className="inline-flex items-center justify-center rounded-md p-2 font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground px-2 py-1.5 text-xs gap-1.5 not-prose"
          >
            <SquarePen className="size-3.5" />
            Edit on GitHub
          </a>
          {page.data.lastModified && (
            <PageLastUpdate date={page.data.lastModified} />
          )}
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export const generateStaticParams = () => source.generateParams();

export const generateMetadata = async ({
  params,
}: DocsPageProps): Promise<Metadata> => {
  const { slug, lang } = await params;
  const page = source.getPage(slug, lang);
  if (!page) {
    notFound();
  }

  const docPath = `/docs/${page.slugs.join("/")}`;
  const canonical = getLocalizedPath(lang, docPath);
  const languages: Record<string, string> = Object.fromEntries(
    i18n.languages.map((locale) => [locale, getLocalizedPath(locale, docPath)])
  );
  languages["x-default"] = getLocalizedPath(i18n.defaultLanguage, docPath);

  const ogLocale = lang.replace("-", "_");

  return {
    alternates: {
      canonical,
      languages,
    },
    description: page.data.description,
    openGraph: {
      description: page.data.description,
      images: [
        {
          alt: page.data.title,
          height: 630,
          url: getPageImage(page).url,
          width: 1200,
        },
      ],
      locale: ogLocale,
      title: page.data.title,
      type: "article",
    },
    title: page.data.title,
    twitter: {
      card: "summary_large_image",
      description: page.data.description,
      images: [getPageImage(page).url],
      title: page.data.title,
    },
  };
};
