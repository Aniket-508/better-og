import { HomeLayout } from "fumadocs-ui/layouts/home";

import { Footer } from "@/components/landing/footer";
import { baseOptions } from "@/lib/layout.shared";
import { getTranslation } from "@/translations";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;
  const translation = getTranslation(lang);

  return (
    <HomeLayout
      className="flex min-h-dvh max-w-screen flex-col overflow-x-hidden"
      {...baseOptions(lang)}
    >
      <div className="flex-1">{children}</div>
      <Footer translation={translation} />
    </HomeLayout>
  );
}
