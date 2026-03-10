import { i18n } from "@/lib/i18n";
import { source } from "@/lib/source";

export const revalidate = false;

export const GET = () => {
  const lines: string[] = ["# Documentation", ""];

  for (const pageItem of source
    .getPages()
    .filter((p) => p.locale === i18n.defaultLanguage)) {
    lines.push(
      `- [${pageItem.data.title}](${pageItem.url}): ${pageItem.data.description}`
    );
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown" },
  });
};
