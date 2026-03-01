import { getFontsForRequest, getOgContext, loadGoogleFonts } from "better-og";
import type {
  Font,
  GetFontsForLocale,
  LoadGoogleFontsOptions,
  OgContext,
} from "better-og";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export interface OgRouteHandlerContext {
  params?: Promise<Record<string, string>>;
}

export interface OgRewriteOptions {
  pathnamePrefix?: string;
}

export interface LoadGoogleFontForImageResponseOptions extends Pick<
  LoadGoogleFontsOptions,
  "style"
> {
  family: string;
  weights?: number[];
}

interface ResolveOgRequestStateOptions {
  configuredFonts?: Font[];
  fallbackFonts?: boolean;
  getFontsForLocale?: GetFontsForLocale;
  getOgContextOverride?: (request: Request) => OgContext | Promise<OgContext>;
  locale?: string;
  request: Request;
}

export interface NextImageResponseFont {
  data: ArrayBuffer;
  name: string;
  style?: "normal" | "italic";
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

const STABLE_CACHE_CONTROL =
  "public, immutable, no-transform, max-age=31536000";
const NEXT_IMAGE_RESPONSE_FONT_WEIGHTS = new Set<
  NextImageResponseFont["weight"]
>([100, 200, 300, 400, 500, 600, 700, 800, 900]);

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

const normalizeGoogleFontWeights = (
  weights: number[] | undefined
): NonNullable<NextImageResponseFont["weight"]>[] => {
  const normalizedWeights = (weights ?? [400]).filter((weight) =>
    NEXT_IMAGE_RESPONSE_FONT_WEIGHTS.has(
      weight as NonNullable<NextImageResponseFont["weight"]>
    )
  );

  if (normalizedWeights.length === 0) {
    return [400];
  }

  return [
    ...new Set(
      normalizedWeights as NonNullable<NextImageResponseFont["weight"]>[]
    ),
  ];
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

export const normalizeFontsForNextImageResponse = (
  fonts: Font[]
): NextImageResponseFont[] | undefined => {
  if (fonts.length === 0) {
    return undefined;
  }

  return fonts.map((font) => ({
    data:
      font.data instanceof Uint8Array
        ? new Uint8Array(font.data).buffer
        : font.data,
    name: font.name ?? "sans serif",
    style: font.style === "italic" ? "italic" : "normal",
    weight: NEXT_IMAGE_RESPONSE_FONT_WEIGHTS.has(
      font.weight as NextImageResponseFont["weight"]
    )
      ? (font.weight as NextImageResponseFont["weight"])
      : undefined,
  }));
};

export const loadGoogleFontForImageResponse = async (
  options: LoadGoogleFontForImageResponseOptions
): Promise<NextImageResponseFont[]> => {
  const fonts = await loadGoogleFonts({
    ...options,
    weights: normalizeGoogleFontWeights(options.weights),
  });

  return normalizeFontsForNextImageResponse(fonts) ?? [];
};

export const resolveOgRequestState = async ({
  configuredFonts,
  fallbackFonts,
  getFontsForLocale,
  getOgContextOverride,
  locale,
  request,
}: ResolveOgRequestStateOptions): Promise<{
  fonts: Font[];
  ogContext: OgContext;
}> => {
  const ogContext = getOgContextOverride
    ? await getOgContextOverride(request)
    : getOgContext(request);
  const fonts = await getFontsForRequest(
    { locale, request },
    {
      fallbackFonts,
      fonts: configuredFonts,
      getFontsForLocale,
    }
  );

  return { fonts, ogContext };
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
