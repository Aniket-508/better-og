import { withOgRewrite } from "better-og/next";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/og/:path*", "/og-edge/:path*"],
};

export const proxy = (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/og-edge")) {
    return withOgRewrite(request, { pathnamePrefix: "/og-edge" });
  }

  return withOgRewrite(request);
};
