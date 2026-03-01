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

export interface LoadGoogleFontsOptions {
  family: string;
  weights?: number[];
  style?: string;
}

interface BuildFontFamilyStackOptions {
  baseFamily?: string;
  fallbackFamilies?: string[];
  fallbackFontLocales?: string[];
}

export interface ResolveFontSetupOptions extends GetFontsForRequestOptions {
  baseFamily?: string;
  baseFonts?: Font[];
  fallbackFamilies?: string[];
  locale?: string;
  request?: Request;
}

export interface ResolvedFontSetup {
  families: ResolvedFontSetupFamilies;
  fontFamily?: string;
  fonts: Font[];
}

export interface ResolvedFontSetupFamilies {
  base?: string;
  locales: Record<string, string>;
}

export type GetFontsForLocale = (locale: string) => Font[] | Promise<Font[]>;

export interface GetFontsForRequestOptions {
  fonts?: Font[];
  getFontsForLocale?: GetFontsForLocale;
  getFallbackFontsForLocale?: GetFontsForLocale;
  fallbackFontLocales?: string[];
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

const googleFontCache = new Map<string, Promise<Font[]>>();
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

const createGoogleFontPromise = async (config: FontConfig): Promise<Font[]> => {
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

const getGoogleFontCacheKey = (key: string, config: FontConfig): string =>
  `${key}:${config.family}:${config.weight}:${config.style}`;

const getPendingGoogleFonts = (
  cacheKey: string,
  config: FontConfig
): Promise<Font[]> => {
  const normalizedCacheKey = getGoogleFontCacheKey(cacheKey, config);
  const cachedFonts = googleFontCache.get(normalizedCacheKey);

  if (cachedFonts) {
    return cachedFonts;
  }

  const pendingFonts = createGoogleFontPromise(config);

  googleFontCache.set(normalizedCacheKey, pendingFonts);

  return pendingFonts;
};

const loadGoogleFontsWithConfig = async (
  cacheKey: string,
  config: FontConfig
): Promise<Font[]> => {
  const fonts = await getPendingGoogleFonts(cacheKey, config);

  if (fonts.length === 0) {
    googleFontCache.delete(getGoogleFontCacheKey(cacheKey, config));
  }

  return fonts;
};

const normalizeRequestedFontWeights = (
  weights: number[] | undefined
): number[] => {
  if (!weights || weights.length === 0) {
    return [400];
  }

  return [...new Set(weights)];
};

export const loadGoogleFonts = async ({
  family,
  style = "normal",
  weights,
}: LoadGoogleFontsOptions): Promise<Font[]> => {
  const loadedFonts = await Promise.all(
    normalizeRequestedFontWeights(weights).map((weight) =>
      loadGoogleFontsWithConfig(`family:${family}`, {
        family,
        style,
        weight,
      })
    )
  );

  return loadedFonts.flat();
};

const loadFallbackFontsForLocale = (locale: string): Promise<Font[]> => {
  const resolvedConfig = resolveFontConfigForLocale(locale);

  if (!resolvedConfig) {
    return Promise.resolve([]);
  }

  return loadGoogleFontsWithConfig(
    `locale:${resolvedConfig.locale}`,
    resolvedConfig.config
  );
};

const loadResolvedFallbackFontsForLocale = async (
  locale: string,
  getFallbackFontsForLocale: GetFontsForLocale | undefined,
  allowBuiltInFallback: boolean
): Promise<Font[]> => {
  if (getFallbackFontsForLocale) {
    const configuredFonts = await getFallbackFontsForLocale(locale);

    if (configuredFonts.length > 0) {
      return configuredFonts;
    }
  }

  if (!allowBuiltInFallback) {
    return [];
  }

  return loadFallbackFontsForLocale(locale);
};

const resolveRequestedFallbackLocales = (
  fallbackFontLocales: string[] | undefined
): string[] => {
  let requestedFallbackLocales: string[] = [];

  if (fallbackFontLocales && fallbackFontLocales.length > 0) {
    requestedFallbackLocales = fallbackFontLocales;
  }

  return [
    ...new Set(requestedFallbackLocales.map(normalizeLocale).filter(isDefined)),
  ];
};

const resolveBuiltInFallbackFamilies = (
  fallbackFontLocales: string[] | undefined
): string[] =>
  resolveRequestedFallbackLocales(fallbackFontLocales)
    .map((locale) => fontConfigByLocale[locale]?.family)
    .filter(isDefined);

const resolveFirstNamedFontFamily = (fonts: Font[]): string | undefined => {
  for (const font of fonts) {
    const fontFamily = font.name?.trim();

    if (fontFamily) {
      return fontFamily;
    }
  }

  return undefined;
};

const resolveFallbackFamilyForLocale = async (
  locale: string,
  getFallbackFontsForLocale: GetFontsForLocale | undefined
): Promise<string | undefined> => {
  if (getFallbackFontsForLocale) {
    const configuredFonts = await getFallbackFontsForLocale(locale);
    const configuredFamily = resolveFirstNamedFontFamily(configuredFonts);

    if (configuredFamily) {
      return configuredFamily;
    }

    if (configuredFonts.length > 0) {
      return undefined;
    }
  }

  return fontConfigByLocale[locale]?.family;
};

const resolveFallbackFamiliesByLocale = async (
  fallbackFontLocales: string[] | undefined,
  getFallbackFontsForLocale: GetFontsForLocale | undefined
): Promise<Record<string, string>> => {
  const resolvedFallbackLocales =
    resolveRequestedFallbackLocales(fallbackFontLocales);
  const localeFamilies: Record<string, string> = {};

  for (const fallbackLocale of resolvedFallbackLocales) {
    const fallbackFamily = await resolveFallbackFamilyForLocale(
      fallbackLocale,
      getFallbackFontsForLocale
    );

    if (fallbackFamily) {
      localeFamilies[fallbackLocale] = fallbackFamily;
    }
  }

  return localeFamilies;
};

const resolveLoadedFontFamilies = (fonts: Font[]): string[] =>
  [...new Set(fonts.map((font) => font.name?.trim()).filter(isDefined))].filter(
    Boolean
  );

const buildFontFamilyStack = ({
  baseFamily,
  fallbackFamilies,
  fallbackFontLocales,
}: BuildFontFamilyStackOptions): string | undefined => {
  const families = [
    ...(baseFamily ? [baseFamily] : []),
    ...resolveBuiltInFallbackFamilies(fallbackFontLocales),
    ...(fallbackFamilies ?? []),
  ];
  const uniqueFamilies = [
    ...new Set(families.map((family) => family.trim())),
  ].filter(Boolean);

  if (uniqueFamilies.length === 0) {
    return undefined;
  }

  return uniqueFamilies.join(", ");
};

export const clearFontCache = (): void => {
  googleFontCache.clear();
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
  const resolvedBaseFonts =
    baseFonts.length > 0
      ? [...baseFonts]
      : await loadFallbackFontsForLocale("en");
  const usesDefaultEnglishBase = baseFonts.length === 0;

  const fallbackLocales = resolveRequestedFallbackLocales(
    options.fallbackFontLocales
  );

  if (fallbackLocales.length === 0) {
    return resolvedBaseFonts;
  }

  const resolvedFallbackFonts = await Promise.all(
    fallbackLocales.map((fallbackLocale) =>
      loadResolvedFallbackFontsForLocale(
        fallbackLocale,
        options.getFallbackFontsForLocale,
        !(usesDefaultEnglishBase && fallbackLocale === "en")
      )
    )
  );

  return [...resolvedBaseFonts, ...resolvedFallbackFonts.flat()];
};

export const resolveFontSetup = async ({
  baseFamily,
  baseFonts,
  fallbackFamilies,
  fallbackFontLocales,
  getFallbackFontsForLocale,
  getFontsForLocale,
  locale,
  request,
}: ResolveFontSetupOptions): Promise<ResolvedFontSetup> => {
  const fonts = await getFontsForRequest(
    { locale, request },
    {
      fallbackFontLocales,
      fonts: baseFonts,
      getFallbackFontsForLocale,
      getFontsForLocale,
    }
  );
  const localeFamilies = await resolveFallbackFamiliesByLocale(
    fallbackFontLocales,
    getFallbackFontsForLocale
  );
  const normalizedBaseFamily = baseFamily?.trim() || undefined;
  const loadedFontFamilies = resolveLoadedFontFamilies(fonts);
  const resolvedBaseFamily =
    normalizedBaseFamily ?? loadedFontFamilies.find(Boolean);
  const resolvedLocaleFamilies = Object.values(localeFamilies);
  const resolvedFallbackFamilies = [
    ...resolvedLocaleFamilies,
    ...loadedFontFamilies.filter(
      (family) =>
        family !== resolvedBaseFamily &&
        !resolvedLocaleFamilies.includes(family)
    ),
    ...(fallbackFamilies ?? []),
  ];

  return {
    families: {
      base: resolvedBaseFamily,
      locales: localeFamilies,
    },
    fontFamily: buildFontFamilyStack({
      baseFamily: resolvedBaseFamily,
      fallbackFamilies: resolvedFallbackFamilies,
    }),
    fonts,
  };
};
