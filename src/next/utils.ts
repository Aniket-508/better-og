import { getOgContext, loadGoogleFonts } from "better-og";
import type { Font, LoadGoogleFontsOptions } from "better-og";
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

export interface NextImageResponseFont {
  data: ArrayBuffer;
  name: string;
  style?: "normal" | "italic";
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

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
