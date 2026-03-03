import { withOgRewrite } from "@better-og/next";
import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import type { NextFetchEvent, NextRequest } from "next/server";

import { i18n } from "@/lib/i18n";

const i18nMiddleware = createI18nMiddleware(i18n);

export const proxy = (request: NextRequest, event: NextFetchEvent) => {
  if (request.nextUrl.pathname.startsWith("/og")) {
    return withOgRewrite(request);
  }

  return i18nMiddleware(request, event);
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
