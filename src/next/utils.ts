import { getOgContext } from "better-og";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export interface OgRouteHandlerContext {
  params?: Promise<Record<string, string>>;
}

export interface OgRewriteOptions {
  pathnamePrefix?: string;
}

const STABLE_CACHE_CONTROL =
  "public, immutable, no-transform, max-age=31536000";

const matchesPathPrefix = (
  pathname: string,
  pathnamePrefix: string
): boolean => {
  const normalizedPrefix =
    pathnamePrefix !== "/" && pathnamePrefix.endsWith("/")
      ? pathnamePrefix.slice(0, -1)
      : pathnamePrefix;

  return (
    pathname === normalizedPrefix || pathname.startsWith(`${normalizedPrefix}/`)
  );
};

export const applyStableCacheHeaders = (response: Response): Response => {
  const headers = new Headers(response.headers);

  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", STABLE_CACHE_CONTROL);
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
};

export const resolveLocaleFromParams = (
  params: Record<string, string> | undefined
): string | undefined => {
  if (!params) {
    return undefined;
  }

  if (params.lang) {
    return params.lang;
  }

  if (params.locale) {
    return params.locale;
  }

  return Object.values(params).find(Boolean);
};

export const withOgRewrite = (
  request: NextRequest,
  options: OgRewriteOptions = {}
): NextResponse => {
  const pathnamePrefix = options.pathnamePrefix ?? "/og";

  if (!matchesPathPrefix(request.nextUrl.pathname, pathnamePrefix)) {
    return NextResponse.next();
  }

  if (request.nextUrl.searchParams.has("aspect_ratio")) {
    return NextResponse.next();
  }

  const ogContext = getOgContext(request);
  const rewriteUrl = request.nextUrl.clone();

  rewriteUrl.searchParams.set("aspect_ratio", ogContext.aspectRatio);

  return NextResponse.rewrite(rewriteUrl);
};
