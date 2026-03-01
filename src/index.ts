export interface AspectRatioPreset {
  label: string;
  width: number;
  height: number;
}

export interface Font {
  name?: string;
  data: ArrayBuffer | Uint8Array;
  weight?: number;
  style?: string;
}

export interface OgContext {
  aspectRatio: string;
  width: number;
  height: number;
  platform: string;
}

export interface GetFontsForRequestContext {
  locale?: string;
  request?: Request;
}

export type GetFontsForLocale = (locale: string) => Font[] | Promise<Font[]>;

export interface GetFontsForRequestOptions {
  fonts?: Font[];
  getFontsForLocale?: GetFontsForLocale;
  fallbackFonts?: boolean;
}

export interface OgAdapterOptions extends GetFontsForRequestOptions {
  getOgContext?: (req: Request) => OgContext | Promise<OgContext>;
  localeFromRequest?: (req: Request) => string | undefined;
  format?: "webp" | "png";
  loadDefaultFonts?: boolean;
}

interface FontConfig {
  family: string;
  weight: number;
  style: string;
}

interface PlatformMatcher {
  platform: string;
  match: (userAgent: string) => boolean;
}

export const STANDARD: AspectRatioPreset = {
  height: 630,
  label: "1.91:1",
  width: 1200,
};

export const SQUARE: AspectRatioPreset = {
  height: 1200,
  label: "1:1",
  width: 1200,
};

export const PORTRAIT: AspectRatioPreset = {
  height: 1200,
  label: "1:1.91",
  width: 630,
};

export const INSTAGRAM: AspectRatioPreset = {
  height: 1500,
  label: "4:5",
  width: 1200,
};

const DEFAULT_PLATFORM = "generic";
const GOOGLE_FONTS_USER_AGENT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const fontConfigByLocale: Record<string, FontConfig> = {
  ar: {
    family: "Noto Sans Arabic",
    style: "normal",
    weight: 400,
  },
  en: {
    family: "Noto Sans",
    style: "normal",
    weight: 400,
  },
  hi: {
    family: "Noto Sans Devanagari",
    style: "normal",
    weight: 400,
  },
  ja: {
    family: "Noto Sans JP",
    style: "normal",
    weight: 400,
  },
  ko: {
    family: "Noto Sans KR",
    style: "normal",
    weight: 400,
  },
  ru: {
    family: "Noto Sans",
    style: "normal",
    weight: 400,
  },
  uk: {
    family: "Noto Sans",
    style: "normal",
    weight: 400,
  },
  zh: {
    family: "Noto Sans SC",
    style: "normal",
    weight: 400,
  },
};

const aspectRatioAliases: Record<string, AspectRatioPreset> = {
  "1.91:1": STANDARD,
  "1200x1200": SQUARE,
  "1200x1500": INSTAGRAM,
  "1200x630": STANDARD,
  "1:1": SQUARE,
  "1:1.91": PORTRAIT,
  "4:5": INSTAGRAM,
  "630x1200": PORTRAIT,
  instagram: INSTAGRAM,
  portrait: PORTRAIT,
  square: SQUARE,
  standard: STANDARD,
};

const fontCache = new Map<string, Promise<Font[]>>();
const platformMatchers: PlatformMatcher[] = [
  {
    match: (userAgent) => userAgent.includes("twitterbot"),
    platform: "twitter",
  },
  {
    match: (userAgent) => userAgent.includes("telegrambot"),
    platform: "telegram",
  },
  {
    match: (userAgent) => userAgent.includes("slackbot"),
    platform: "slack",
  },
  {
    match: (userAgent) =>
      userAgent.includes("imessage") ||
      userAgent.includes("com.apple.messages") ||
      userAgent.includes("imessagepreview"),
    platform: "imessage",
  },
  {
    match: (userAgent) => userAgent.includes("instagram"),
    platform: "instagram",
  },
];

const normalizeAspectRatio = (value: string): string =>
  value.trim().toLowerCase().replaceAll(/\s+/g, "");

const normalizeLocale = (locale: string): string | undefined => {
  const [baseLocale] = locale.trim().toLowerCase().split(/[-_]/);

  return baseLocale || undefined;
};

const resolveAspectRatioPreset = (
  aspectRatioValue: string | null | undefined
): AspectRatioPreset | undefined => {
  if (!aspectRatioValue) {
    return undefined;
  }

  return aspectRatioAliases[normalizeAspectRatio(aspectRatioValue)];
};

const resolvePresetForPlatform = (platform: string): AspectRatioPreset => {
  if (platform === "telegram" || platform === "slack") {
    return SQUARE;
  }

  if (platform === "imessage") {
    return PORTRAIT;
  }

  if (platform === "instagram") {
    return INSTAGRAM;
  }

  return STANDARD;
};

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

const detectPlatformFromUserAgent = (userAgent: string): string => {
  const normalizedUserAgent = userAgent.toLowerCase();
  const matchedPlatform = platformMatchers.find(({ match }) =>
    match(normalizedUserAgent)
  );

  return matchedPlatform?.platform ?? DEFAULT_PLATFORM;
};

const buildGoogleFontsCssUrl = (family: string, weight: number): string => {
  const normalizedFamily = family.trim().split(/\s+/).join("+");

  return `https://fonts.googleapis.com/css2?family=${normalizedFamily}:wght@${weight}&display=swap`;
};

const parseFontUrlsFromCss = (css: string): string[] => {
  const ttfMatches = [
    ...css.matchAll(/url\(([^)]+)\)\s*format\((['"])truetype\2\)/gi),
  ];
  const preferredUrls = ttfMatches
    .map((match) => match[1]?.trim().replaceAll(/^['"]|['"]$/g, ""))
    .filter(isDefined);

  if (preferredUrls.length > 0) {
    return [...new Set(preferredUrls)];
  }

  const fallbackMatches = [...css.matchAll(/url\(([^)]+)\)/g)];
  const fallbackUrls = fallbackMatches
    .map((match) => match[1]?.trim().replaceAll(/^['"]|['"]$/g, ""))
    .filter(isDefined);

  return [...new Set(fallbackUrls)];
};

const fetchFontCss = async (config: FontConfig): Promise<string> => {
  const response = await fetch(
    buildGoogleFontsCssUrl(config.family, config.weight),
    {
      headers: {
        "User-Agent": GOOGLE_FONTS_USER_AGENT,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Unable to load Google Fonts CSS for ${config.family}`);
  }

  return response.text();
};

const fetchFontData = async (
  url: string,
  config: FontConfig
): Promise<Font | undefined> => {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": GOOGLE_FONTS_USER_AGENT,
      },
    });

    if (!response.ok) {
      return undefined;
    }

    return {
      data: await response.arrayBuffer(),
      name: config.family,
      style: config.style,
      weight: config.weight,
    };
  } catch {
    return undefined;
  }
};

const resolveFontConfigForLocale = (
  locale: string
): { locale: string; config: FontConfig } | undefined => {
  const normalizedLocale = normalizeLocale(locale);

  if (!normalizedLocale) {
    return undefined;
  }

  const config = fontConfigByLocale[normalizedLocale];

  if (!config) {
    return undefined;
  }

  return { config, locale: normalizedLocale };
};

const createFallbackFontPromise = async (
  config: FontConfig
): Promise<Font[]> => {
  try {
    const css = await fetchFontCss(config);
    const fontUrls = parseFontUrlsFromCss(css);

    if (fontUrls.length === 0) {
      return [];
    }

    const fonts = await Promise.all(
      fontUrls.map((fontUrl) => fetchFontData(fontUrl, config))
    );

    return fonts.filter(isDefined);
  } catch {
    return [];
  }
};

const getPendingFallbackFonts = (resolvedConfig: {
  locale: string;
  config: FontConfig;
}): Promise<Font[]> => {
  const cachedFonts = fontCache.get(resolvedConfig.locale);

  if (cachedFonts) {
    return cachedFonts;
  }

  const pendingFonts = createFallbackFontPromise(resolvedConfig.config);

  fontCache.set(resolvedConfig.locale, pendingFonts);

  return pendingFonts;
};

const loadFallbackFontsForLocale = async (locale: string): Promise<Font[]> => {
  const resolvedConfig = resolveFontConfigForLocale(locale);

  if (!resolvedConfig) {
    return [];
  }

  const fonts = await getPendingFallbackFonts(resolvedConfig);

  if (fonts.length === 0) {
    fontCache.delete(resolvedConfig.locale);
  }

  return fonts;
};

export const clearFontCache = (): void => {
  fontCache.clear();
};

export const getOgContext = (request: Request): OgContext => {
  const requestUrl = new URL(request.url);
  const explicitAspectRatio = resolveAspectRatioPreset(
    requestUrl.searchParams.get("aspect_ratio")
  );

  if (explicitAspectRatio) {
    return {
      aspectRatio: explicitAspectRatio.label,
      height: explicitAspectRatio.height,
      platform: DEFAULT_PLATFORM,
      width: explicitAspectRatio.width,
    };
  }

  if (requestUrl.searchParams.has("aspect_ratio")) {
    return {
      aspectRatio: STANDARD.label,
      height: STANDARD.height,
      platform: DEFAULT_PLATFORM,
      width: STANDARD.width,
    };
  }

  const platform = detectPlatformFromUserAgent(
    request.headers.get("user-agent") ?? ""
  );
  const preset = resolvePresetForPlatform(platform);

  return {
    aspectRatio: preset.label,
    height: preset.height,
    platform,
    width: preset.width,
  };
};

export const getFontsForRequest = async (
  context: GetFontsForRequestContext,
  options: GetFontsForRequestOptions
): Promise<Font[]> => {
  const { locale } = context;
  const baseFonts =
    locale && options.getFontsForLocale
      ? await options.getFontsForLocale(locale)
      : (options.fonts ?? []);

  if (!locale || !options.fallbackFonts) {
    return [...baseFonts];
  }

  const fallbackFonts = await loadFallbackFontsForLocale(locale);

  return [...baseFonts, ...fallbackFonts];
};
