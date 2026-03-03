import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPageImage, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { slug, lang } = await params;

  const page = source.getPage(slug, lang);
  if (!page) {
    notFound();
  }

  const PageContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <PageContent components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export const generateStaticParams = () => source.generateParams();

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> => {
  const { slug, lang } = await params;

  const page = source.getPage(slug, lang);
  if (!page) {
    notFound();
  }

  return {
    description: page.data.description,
    openGraph: {
      images: getPageImage(page, lang).url,
    },
    title: page.data.title,
  };
};
