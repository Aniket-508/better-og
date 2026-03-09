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

export interface OgSafeArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface LayoutBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OgLayout {
  strategy: ResolvedLayoutStrategy;
  canvas: LayoutBox;
  safe: LayoutBox;
  content: LayoutBox;
  center: LayoutBox;
  bleed: LayoutBox;
}

export interface PlatformCapabilities {
  svg: boolean;
  webp: boolean;
  emoji: boolean;
  preferredFormat: "png" | "webp";
  maxResponseBytes: number;
}

export type ResolvedLayoutStrategy = "wide" | "square" | "portrait";
export type LayoutStrategy = ResolvedLayoutStrategy | "auto";

export type DetectPlatformSignalType =
  | "query-platform"
  | "user-agent"
  | "accept"
  | "referer"
  | "custom";

export interface DetectPlatformSignal {
  type: DetectPlatformSignalType;
  value: string;
  platform: string;
  crawler?: string;
  weight: number;
}

export interface PlatformMatcherMap {
  userAgent?: RegExp[];
  accept?: RegExp[];
  referer?: RegExp[];
}

export interface SafeAreaContext {
  aspectRatio: string;
  width: number;
  height: number;
}

export interface PlatformProfile {
  platform: string;
  crawler: string;
  defaultAspectRatio: AspectRatioPreset;
  defaultLayoutStrategy: ResolvedLayoutStrategy;
  capabilities: PlatformCapabilities;
  matchers?: PlatformMatcherMap;
  safeArea?: (context: SafeAreaContext) => OgSafeArea;
}

export interface DetectPlatformMatch {
  platform: string;
  crawler?: string;
  signal?: string;
  weight?: number;
}

export interface DetectPlatformOptions {
  defaultPlatform?: string;
  customMatchers?: ((
    request: Request
  ) =>
    | DetectPlatformMatch
    | undefined
    | Promise<DetectPlatformMatch | undefined>)[];
  platformProfiles?: PlatformProfile[];
}

export interface DetectedPlatform {
  platform: string;
  crawler: string;
  confidence: number;
  matchedSignals: DetectPlatformSignal[];
  aspectRatio: string;
  capabilities: PlatformCapabilities;
}

export interface ResolveOgRequestQuery {
  aspectRatio?: string;
  layout?: LayoutStrategy;
  platform?: string;
}

export interface ResolveOgRequestOptions extends DetectPlatformOptions {
  aspectRatio?: string;
  layout?: LayoutStrategy;
  padding?: number | Partial<OgSafeArea>;
  platform?: string;
}

export interface ResolvedOgRequest {
  aspectRatio: string;
  capabilities: PlatformCapabilities;
  confidence: number;
  crawler: string;
  height: number;
  layout: OgLayout;
  layoutStrategy: ResolvedLayoutStrategy;
  matchedSignals: DetectPlatformSignal[];
  normalizedQuery: ResolveOgRequestQuery;
  platform: string;
  safeArea: OgSafeArea;
  width: number;
}

export interface LoadGoogleFontsOptions {
  family: string;
  weights?: number[];
  style?: string;
}

export interface FontSourceRequest {
  locale: string;
  request?: Request;
  scripts: string[];
  text: string;
}

export interface FontSource {
  load: (request: FontSourceRequest) => Font[] | Promise<Font[]>;
  name: string;
}

export interface ResolveFontsOptions {
  baseFonts?: Font[];
  fallbackLocales?: string[];
  locale?: string;
  request?: Request;
  sources?: FontSource[];
  text?: string;
}

export type ResolveFontSetupOptions = ResolveFontsOptions;

export interface ResolvedFontSetup {
  families: ResolvedFontSetupFamilies;
  fonts: Font[];
}

export interface ResolvedFontSetupFamilies {
  base?: string;
  locales: Record<string, string>;
}

export type RouteParamValue = string | string[] | undefined;
export type RouteParams = Record<string, RouteParamValue>;

export interface CreateLayoutOptions {
  height: number;
  padding?: number | Partial<OgSafeArea>;
  safeArea?: Partial<OgSafeArea>;
  strategy?: LayoutStrategy;
  width: number;
}

export interface GetSafeAreaOptions extends SafeAreaContext {
  platform: string;
  platformProfiles?: PlatformProfile[];
}

export interface OgRendererRenderContext<TNode, TRenderOptions> {
  component: TNode;
  fonts: Font[];
  options: TRenderOptions | undefined;
  request: Request;
  resolvedRequest: ResolvedOgRequest;
}

export type OgRenderer<TNode, TRenderOptions = unknown> = (
  context: OgRendererRenderContext<TNode, TRenderOptions>
) => Response | Promise<Response>;

export interface OgHandlerFontResolverContext<TNode, TContext> {
  component: TNode;
  context: TContext | undefined;
  locale?: string;
  request: Request;
  resolvedRequest: ResolvedOgRequest;
  text: string;
}

export interface CreateOgRouteHandlerOptions<
  TNode,
  TContext,
  TRenderOptions,
> extends ResolveFontsOptions {
  component: TNode | OgComponentFactory<TNode>;
  fontResolver?: (
    context: OgHandlerFontResolverContext<TNode, TContext>
  ) => Font[] | Promise<Font[]>;
  localeFromContext?: (
    context: TContext
  ) => string | undefined | Promise<string | undefined>;
  localeFromRequest?: (
    request: Request
  ) => string | undefined | Promise<string | undefined>;
  renderOptions?: TRenderOptions;
  renderer: OgRenderer<TNode, TRenderOptions>;
  requestResolver?: (
    request: Request
  ) => ResolvedOgRequest | Promise<ResolvedOgRequest>;
  resolveRequestOptions?: ResolveOgRequestOptions;
  text?: string;
  textFromComponent?: (
    context: OgHandlerFontResolverContext<TNode, TContext>
  ) => string | undefined | Promise<string | undefined>;
}

interface FontConfig {
  family: string;
  style: string;
  weight: number;
}

const DEFAULT_PLATFORM = "generic";
const GOOGLE_FONTS_USER_AGENT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const STABLE_CACHE_CONTROL =
  "public, immutable, no-transform, max-age=31536000";
const DEFAULT_SAFE_AREA: OgSafeArea = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};
const DEFAULT_PADDING = 48;
const DEFAULT_LAYOUT_STRATEGY: ResolvedLayoutStrategy = "wide";
const RATIO_TWITTER_BOTTOM_INSET = 44 / 630;

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

const DEFAULT_PLATFORM_PROFILES: PlatformProfile[] = [
  {
    capabilities: {
      emoji: true,
      maxResponseBytes: 8_000_000,
      preferredFormat: "webp",
      svg: true,
      webp: true,
    },
    crawler: "Generic",
    defaultAspectRatio: STANDARD,
    defaultLayoutStrategy: "wide",
    platform: "generic",
  },
  {
    capabilities: {
      emoji: true,
      maxResponseBytes: 5_000_000,
      preferredFormat: "png",
      svg: false,
      webp: false,
    },
    crawler: "Twitterbot",
    defaultAspectRatio: STANDARD,
    defaultLayoutStrategy: "wide",
    matchers: {
      referer: [/https?:\/\/(?:x|twitter)\.com/i],
      userAgent: [/twitterbot/i],
    },
    platform: "twitter",
    safeArea: ({ height }) => ({
      bottom: Math.round(height * RATIO_TWITTER_BOTTOM_INSET),
      left: 0,
      right: 0,
      top: 0,
    }),
  },
  {
    capabilities: {
      emoji: true,
      maxResponseBytes: 10_000_000,
      preferredFormat: "webp",
      svg: true,
      webp: true,
    },
    crawler: "TelegramBot",
    defaultAspectRatio: SQUARE,
    defaultLayoutStrategy: "square",
    matchers: {
      referer: [/https?:\/\/t\.me/i],
      userAgent: [/telegrambot/i],
    },
    platform: "telegram",
  },
  {
    capabilities: {
      emoji: true,
      maxResponseBytes: 10_000_000,
      preferredFormat: "webp",
      svg: true,
      webp: true,
    },
    crawler: "Slackbot",
    defaultAspectRatio: SQUARE,
    defaultLayoutStrategy: "square",
    matchers: {
      referer: [/https?:\/\/(?:.+\.)?slack\.com/i],
      userAgent: [/slackbot/i],
    },
    platform: "slack",
  },
  {
    capabilities: {
      emoji: true,
      maxResponseBytes: 8_000_000,
      preferredFormat: "png",
      svg: true,
      webp: true,
    },
    crawler: "iMessagePreview",
    defaultAspectRatio: PORTRAIT,
    defaultLayoutStrategy: "portrait",
    matchers: {
      referer: [/messages:\/\//i],
      userAgent: [/imessagepreview/i, /com\.apple\.messages/i, /imessage/i],
    },
    platform: "imessage",
  },
  {
    capabilities: {
      emoji: true,
      maxResponseBytes: 8_000_000,
      preferredFormat: "webp",
      svg: true,
      webp: true,
    },
    crawler: "Instagram",
    defaultAspectRatio: INSTAGRAM,
    defaultLayoutStrategy: "portrait",
    matchers: {
      referer: [/https?:\/\/(?:www\.)?instagram\.com/i],
      userAgent: [/instagram/i],
    },
    platform: "instagram",
  },
];

const SIGNAL_WEIGHTS: Record<DetectPlatformSignalType, number> = {
  accept: 0.35,
  custom: 0.55,
  "query-platform": 1,
  referer: 0.25,
  "user-agent": 0.75,
};

const googleFontCache = new Map<string, Promise<Font[]>>();

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

const normalizeAspectRatio = (value: string): string =>
  value.trim().toLowerCase().replaceAll(/\s+/g, "");

const normalizePlatform = (value: string): string =>
  value.trim().toLowerCase().replaceAll(/\s+/g, "");

const normalizeLayoutStrategy = (
  value: string | null | undefined
): LayoutStrategy | undefined => {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (
    normalizedValue === "wide" ||
    normalizedValue === "square" ||
    normalizedValue === "portrait" ||
    normalizedValue === "auto"
  ) {
    return normalizedValue;
  }

  return undefined;
};

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

const resolveProfiles = (
  profiles: PlatformProfile[] | undefined
): PlatformProfile[] => {
  if (!profiles || profiles.length === 0) {
    return DEFAULT_PLATFORM_PROFILES;
  }

  const mergedProfiles = new Map<string, PlatformProfile>();

  for (const profile of DEFAULT_PLATFORM_PROFILES) {
    mergedProfiles.set(profile.platform, profile);
  }

  for (const profile of profiles) {
    mergedProfiles.set(profile.platform, profile);
  }

  return [...mergedProfiles.values()];
};

const cloneGenericProfile = (platform: string): PlatformProfile => ({
  ...DEFAULT_PLATFORM_PROFILES[0],
  crawler: platform,
  platform,
});

const getPlatformProfile = (
  platform: string,
  profiles: PlatformProfile[]
): PlatformProfile =>
  profiles.find((profile) => profile.platform === platform) ??
  cloneGenericProfile(platform);

const resolveDefaultLayoutStrategy = (
  preset: AspectRatioPreset,
  profile: PlatformProfile
): ResolvedLayoutStrategy => {
  if (profile.defaultLayoutStrategy) {
    return profile.defaultLayoutStrategy;
  }

  const ratio = preset.width / preset.height;

  if (ratio > 1.2) {
    return "wide";
  }

  if (ratio < 0.9) {
    return "portrait";
  }

  return "square";
};

const resolveLayoutStrategy = (
  requestedLayout: LayoutStrategy | undefined,
  preset: AspectRatioPreset,
  profile: PlatformProfile
): ResolvedLayoutStrategy => {
  if (
    requestedLayout === "wide" ||
    requestedLayout === "square" ||
    requestedLayout === "portrait"
  ) {
    return requestedLayout;
  }

  return resolveDefaultLayoutStrategy(preset, profile);
};

const toOgSafeArea = (value: Partial<OgSafeArea> | undefined): OgSafeArea => ({
  bottom: value?.bottom ?? 0,
  left: value?.left ?? 0,
  right: value?.right ?? 0,
  top: value?.top ?? 0,
});

const toSafeAreaPadding = (
  value: number | Partial<OgSafeArea> | undefined
): OgSafeArea => {
  if (typeof value === "number") {
    return {
      bottom: value,
      left: value,
      right: value,
      top: value,
    };
  }

  return {
    bottom: value?.bottom ?? DEFAULT_PADDING,
    left: value?.left ?? DEFAULT_PADDING,
    right: value?.right ?? DEFAULT_PADDING,
    top: value?.top ?? DEFAULT_PADDING,
  };
};

const insetBox = (box: LayoutBox, inset: OgSafeArea): LayoutBox => ({
  height: Math.max(0, box.height - inset.top - inset.bottom),
  width: Math.max(0, box.width - inset.left - inset.right),
  x: box.x + inset.left,
  y: box.y + inset.top,
});

const centerBoxWithin = (
  container: LayoutBox,
  width: number,
  height: number
): LayoutBox => ({
  height,
  width,
  x: container.x + Math.max(0, (container.width - width) / 2),
  y: container.y + Math.max(0, (container.height - height) / 2),
});

const expandBoxWithinCanvas = (
  box: LayoutBox,
  canvas: LayoutBox,
  inset: OgSafeArea
): LayoutBox => {
  const nextX = Math.max(canvas.x, box.x - inset.left);
  const nextY = Math.max(canvas.y, box.y - inset.top);
  const nextRight = Math.min(
    canvas.x + canvas.width,
    box.x + box.width + inset.right
  );
  const nextBottom = Math.min(
    canvas.y + canvas.height,
    box.y + box.height + inset.bottom
  );

  return {
    height: Math.max(0, nextBottom - nextY),
    width: Math.max(0, nextRight - nextX),
    x: nextX,
    y: nextY,
  };
};

const resolveCenterBox = (
  contentBox: LayoutBox,
  strategy: ResolvedLayoutStrategy
): LayoutBox => {
  if (strategy === "square") {
    const sideLength = Math.min(contentBox.width, contentBox.height) * 0.82;

    return centerBoxWithin(contentBox, sideLength, sideLength);
  }

  if (strategy === "portrait") {
    const height = contentBox.height * 0.86;
    const width = Math.min(contentBox.width * 0.72, height * 0.8);

    return centerBoxWithin(contentBox, width, height);
  }

  return {
    height: contentBox.height * 0.64,
    width: contentBox.width * 0.76,
    x: contentBox.x + contentBox.width * 0.12,
    y: contentBox.y + contentBox.height * 0.18,
  };
};

const getHeaderValue = (request: Request, name: string): string =>
  request.headers.get(name) ?? "";

const pushSignal = (
  signals: DetectPlatformSignal[],
  signal: Omit<DetectPlatformSignal, "weight"> & { weight?: number }
) => {
  signals.push({
    ...signal,
    weight: signal.weight ?? SIGNAL_WEIGHTS[signal.type],
  });
};

const getHeaderEntries = (
  request: Request
): {
  type: Exclude<DetectPlatformSignalType, "query-platform" | "custom">;
  value: string;
}[] => [
  {
    type: "user-agent",
    value: getHeaderValue(request, "user-agent"),
  },
  {
    type: "accept",
    value: getHeaderValue(request, "accept"),
  },
  {
    type: "referer",
    value: getHeaderValue(request, "referer"),
  },
];

const resolveMatcherKey = (
  type: Exclude<DetectPlatformSignalType, "query-platform" | "custom">
): keyof PlatformMatcherMap => {
  if (type === "user-agent") {
    return "userAgent";
  }

  return type;
};

const resolveHeaderSignal = (
  profile: PlatformProfile,
  headerEntry: {
    type: Exclude<DetectPlatformSignalType, "query-platform" | "custom">;
    value: string;
  }
): DetectPlatformSignal | undefined => {
  const matchers = profile.matchers?.[resolveMatcherKey(headerEntry.type)];

  if (
    !headerEntry.value ||
    !matchers?.some((matcher) => matcher.test(headerEntry.value))
  ) {
    return undefined;
  }

  return {
    crawler: profile.crawler,
    platform: profile.platform,
    type: headerEntry.type,
    value: headerEntry.value,
    weight: SIGNAL_WEIGHTS[headerEntry.type],
  };
};

const collectHeaderSignals = (
  request: Request,
  profiles: PlatformProfile[]
): DetectPlatformSignal[] =>
  profiles.flatMap((profile) =>
    getHeaderEntries(request)
      .map((headerEntry) => resolveHeaderSignal(profile, headerEntry))
      .filter(isDefined)
  );

const collectCustomSignals = async (
  request: Request,
  matchers: DetectPlatformOptions["customMatchers"]
): Promise<DetectPlatformSignal[]> => {
  if (!matchers || matchers.length === 0) {
    return [];
  }

  const resolvedSignals = await Promise.all(
    matchers.map(async (matcher) => await matcher(request))
  );

  return resolvedSignals.filter(isDefined).map((signal) => ({
    crawler: signal.crawler,
    platform: normalizePlatform(signal.platform),
    type: "custom" as const,
    value: signal.signal ?? signal.platform,
    weight: signal.weight ?? SIGNAL_WEIGHTS.custom,
  }));
};

const createExplicitPlatformSignal = (
  explicitPlatform: string,
  profiles: PlatformProfile[]
): DetectPlatformSignal => ({
  crawler: getPlatformProfile(explicitPlatform, profiles).crawler,
  platform: explicitPlatform,
  type: "query-platform",
  value: explicitPlatform,
  weight: 1,
});

const getPlatformScores = (
  signals: DetectPlatformSignal[]
): Map<string, number> => {
  const scores = new Map<string, number>();

  for (const signal of signals) {
    scores.set(
      signal.platform,
      (scores.get(signal.platform) ?? 0) + signal.weight
    );
  }

  return scores;
};

const resolveBestPlatformFromSignals = (
  signals: DetectPlatformSignal[],
  profiles: PlatformProfile[],
  defaultPlatform: string
): string => {
  const scores = getPlatformScores(signals);
  let resolvedPlatform = defaultPlatform;
  let resolvedScore = -1;

  for (const profile of profiles) {
    const score = scores.get(profile.platform) ?? -1;

    if (score > resolvedScore) {
      resolvedPlatform = profile.platform;
      resolvedScore = score;
    }
  }

  return resolvedPlatform;
};

const resolveDetectionPreset = (
  requestUrl: URL,
  profile: PlatformProfile
): AspectRatioPreset =>
  resolveAspectRatioPreset(requestUrl.searchParams.get("aspect_ratio")) ??
  profile.defaultAspectRatio;

const resolveMatchedSignals = (
  signals: DetectPlatformSignal[],
  platform: string
): DetectPlatformSignal[] =>
  signals.filter((signal) => signal.platform === platform);

const resolveDetectionConfidence = (
  explicitPlatform: string | undefined,
  matchedSignals: DetectPlatformSignal[]
): number => {
  if (explicitPlatform) {
    return 1;
  }

  const score = matchedSignals.reduce(
    (total, signal) => total + signal.weight,
    0
  );

  return Math.min(0.95, score);
};

const collectDetectionSignals = async (
  request: Request,
  explicitPlatform: string | undefined,
  profiles: PlatformProfile[],
  options: DetectPlatformOptions
): Promise<DetectPlatformSignal[]> => {
  const signals = collectHeaderSignals(request, profiles);

  if (explicitPlatform) {
    pushSignal(
      signals,
      createExplicitPlatformSignal(explicitPlatform, profiles)
    );
  }

  signals.push(
    ...(await collectCustomSignals(request, options.customMatchers))
  );

  return signals;
};

const resolveDetectedPlatform = (
  explicitPlatform: string | undefined,
  options: DetectPlatformOptions,
  profiles: PlatformProfile[],
  signals: DetectPlatformSignal[]
): string =>
  explicitPlatform ??
  resolveBestPlatformFromSignals(
    signals,
    profiles,
    options.defaultPlatform ?? DEFAULT_PLATFORM
  );

const resolveQueryPlatform = (requestUrl: URL): string | undefined => {
  const platformValue =
    requestUrl.searchParams.get("platform") ??
    requestUrl.searchParams.get("og_platform");

  if (!platformValue) {
    return undefined;
  }

  return normalizePlatform(platformValue);
};

const dedupeFonts = (fonts: Font[]): Font[] => {
  const seenFonts = new Set<string>();
  const resolvedFonts: Font[] = [];

  for (const font of fonts) {
    const signature = [
      font.name ?? "",
      String(font.weight ?? ""),
      font.style ?? "",
      String(
        font.data instanceof Uint8Array
          ? font.data.byteLength
          : font.data.byteLength
      ),
    ].join(":");

    if (seenFonts.has(signature)) {
      continue;
    }

    seenFonts.add(signature);
    resolvedFonts.push(font);
  }

  return resolvedFonts;
};

const SCRIPT_LOCALE_RANGES: {
  end: number;
  locale: "ar" | "cyrillic" | "hi" | "ja" | "ko";
  start: number;
}[] = [
  { end: 0x06_FF, locale: "ar", start: 0x06_00 },
  { end: 0x09_7F, locale: "hi", start: 0x09_00 },
  { end: 0x04_FF, locale: "cyrillic", start: 0x04_00 },
  { end: 0x30_FF, locale: "ja", start: 0x30_40 },
  { end: 0xD7_AF, locale: "ko", start: 0xAC_00 },
];
const HAN_SCRIPT_RANGE = {
  end: 0x9F_FF,
  start: 0x4E_00,
};

const resolveRangeLocale = (
  locale: (typeof SCRIPT_LOCALE_RANGES)[number]["locale"],
  requestedLocale: string | undefined
): string => {
  if (locale === "cyrillic") {
    return requestedLocale === "uk" ? "uk" : "ru";
  }

  return locale;
};

const resolveHanLocale = (locale: string | undefined): "ja" | "ko" | "zh" =>
  locale === "ja" || locale === "ko" ? locale : "zh";

const resolveLocaleForCodePoint = (
  codePoint: number,
  requestedLocale: string | undefined
): string | undefined => {
  const matchedRange = SCRIPT_LOCALE_RANGES.find(
    ({ end, start }) => codePoint >= start && codePoint <= end
  );

  if (matchedRange) {
    return resolveRangeLocale(matchedRange.locale, requestedLocale);
  }

  if (
    codePoint >= HAN_SCRIPT_RANGE.start &&
    codePoint <= HAN_SCRIPT_RANGE.end
  ) {
    return resolveHanLocale(requestedLocale);
  }

  return undefined;
};

const detectScriptLocales = (text: string, locale?: string): string[] => {
  const requestedLocale = locale ? normalizeLocale(locale) : undefined;
  const detectedLocales = [...text]
    .map((character) =>
      resolveLocaleForCodePoint(character.codePointAt(0) ?? 0, requestedLocale)
    )
    .filter(isDefined);

  return [...new Set(detectedLocales)];
};

const resolveRequestedLocales = (
  locale: string | undefined,
  fallbackLocales: string[] | undefined,
  text: string
): string[] => {
  const requestedLocale = locale ? normalizeLocale(locale) : undefined;

  return [
    ...new Set(
      [
        requestedLocale ?? "en",
        ...(fallbackLocales ?? []).map(normalizeLocale).filter(isDefined),
        ...detectScriptLocales(text, requestedLocale),
      ].filter(isDefined)
    ),
  ];
};

const resolveFontsFromSources = async (
  locale: string,
  text: string,
  request: Request | undefined,
  sources: FontSource[]
): Promise<Font[]> => {
  const scripts = detectScriptLocales(text, locale);
  const resolvedFonts: Font[] = [];

  for (const source of sources) {
    const fonts = await source.load({
      locale,
      request,
      scripts,
      text,
    });

    if (fonts.length > 0) {
      resolvedFonts.push(...fonts);
    }
  }

  return dedupeFonts(resolvedFonts);
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
): { config: FontConfig; locale: string } | undefined => {
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
      fontUrls.map(async (fontUrl) => await fetchFontData(fontUrl, config))
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

const loadFallbackFontsForLocale = async (locale: string): Promise<Font[]> => {
  const resolvedConfig = resolveFontConfigForLocale(locale);

  if (!resolvedConfig) {
    return [];
  }

  return await loadGoogleFontsWithConfig(
    `locale:${resolvedConfig.locale}`,
    resolvedConfig.config
  );
};

const extractPrimaryText = (text: string | undefined): string =>
  text?.trim() ?? "";

const maybeExtractTextFromComponent = <TNode>(component: TNode): string => {
  if (typeof component === "string") {
    return component;
  }

  if (typeof component === "number") {
    return String(component);
  }

  return "";
};

const builtInGoogleFontSource: FontSource = {
  load: async ({ locale }) => await loadFallbackFontsForLocale(locale),
  name: "built-in-google-fonts",
};

const resolveFirstNamedFontFamily = (fonts: Font[]): string | undefined => {
  for (const font of fonts) {
    const fontFamily = font.name?.trim();

    if (fontFamily) {
      return fontFamily;
    }
  }

  return undefined;
};

const resolveFontFamilyForLocale = async (
  locale: string,
  sources: FontSource[],
  request: Request | undefined
): Promise<string | undefined> => {
  const fonts = await resolveFontsFromSources(locale, locale, request, sources);

  return resolveFirstNamedFontFamily(fonts);
};

const resolveLocaleFromParamValue = (
  value: RouteParamValue
): string | undefined => {
  if (typeof value === "string") {
    return value || undefined;
  }

  if (Array.isArray(value)) {
    return value.find(Boolean);
  }

  return undefined;
};

export const PLATFORM_PROFILES = DEFAULT_PLATFORM_PROFILES;

export const createCachedModuleLoader = <T>(
  loadModule: () => Promise<T>
): (() => Promise<T>) => {
  let modulePromise: Promise<T> | undefined;

  return () => {
    if (!modulePromise) {
      modulePromise = loadModule();
    }

    return modulePromise;
  };
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
  params: RouteParams | undefined
): string | undefined => {
  if (!params) {
    return undefined;
  }

  const prioritizedLocale =
    resolveLocaleFromParamValue(params.lang) ??
    resolveLocaleFromParamValue(params.locale);

  if (prioritizedLocale) {
    return prioritizedLocale;
  }

  for (const value of Object.values(params)) {
    const resolvedLocale = resolveLocaleFromParamValue(value);

    if (resolvedLocale) {
      return resolvedLocale;
    }
  }

  return undefined;
};

export const getPlatformCapabilities = (
  platform: string,
  platformProfiles?: PlatformProfile[]
): PlatformCapabilities =>
  getPlatformProfile(
    normalizePlatform(platform),
    resolveProfiles(platformProfiles)
  ).capabilities;

export const getSafeArea = ({
  aspectRatio,
  height,
  platform,
  platformProfiles,
  width,
}: GetSafeAreaOptions): OgSafeArea => {
  const profiles = resolveProfiles(platformProfiles);
  const profile = getPlatformProfile(normalizePlatform(platform), profiles);

  return (
    profile.safeArea?.({
      aspectRatio,
      height,
      width,
    }) ?? DEFAULT_SAFE_AREA
  );
};

export const detectPlatform = async (
  request: Request,
  options: DetectPlatformOptions = {}
): Promise<DetectedPlatform> => {
  const requestUrl = new URL(request.url);
  const profiles = resolveProfiles(options.platformProfiles);
  const explicitPlatform = resolveQueryPlatform(requestUrl);
  const signals = await collectDetectionSignals(
    request,
    explicitPlatform,
    profiles,
    options
  );
  const resolvedPlatform = resolveDetectedPlatform(
    explicitPlatform,
    options,
    profiles,
    signals
  );
  const profile = getPlatformProfile(resolvedPlatform, profiles);
  const preset = resolveDetectionPreset(requestUrl, profile);
  const matchedSignals = resolveMatchedSignals(signals, resolvedPlatform);

  return {
    aspectRatio: preset.label,
    capabilities: profile.capabilities,
    confidence: resolveDetectionConfidence(explicitPlatform, matchedSignals),
    crawler:
      matchedSignals.find((signal) => signal.crawler)?.crawler ??
      profile.crawler,
    matchedSignals,
    platform: resolvedPlatform,
  };
};

export const createLayout = ({
  height,
  padding,
  safeArea,
  strategy = "auto",
  width,
}: CreateLayoutOptions): OgLayout => {
  const canvasBox: LayoutBox = {
    height,
    width,
    x: 0,
    y: 0,
  };
  const resolvedSafeArea = toOgSafeArea(safeArea);
  const safeBox = insetBox(canvasBox, resolvedSafeArea);
  const paddingArea = toSafeAreaPadding(padding);
  const contentBox = insetBox(safeBox, paddingArea);
  const resolvedStrategy = resolveLayoutStrategy(
    strategy,
    { height, label: `${width}x${height}`, width },
    {
      capabilities: getPlatformCapabilities(DEFAULT_PLATFORM),
      crawler: DEFAULT_PLATFORM,
      defaultAspectRatio: STANDARD,
      defaultLayoutStrategy: DEFAULT_LAYOUT_STRATEGY,
      platform: DEFAULT_PLATFORM,
    }
  );

  return {
    bleed: expandBoxWithinCanvas(contentBox, canvasBox, paddingArea),
    canvas: canvasBox,
    center: resolveCenterBox(contentBox, resolvedStrategy),
    content: contentBox,
    safe: safeBox,
    strategy: resolvedStrategy,
  };
};

export const loadGoogleFonts = async ({
  family,
  style = "normal",
  weights,
}: LoadGoogleFontsOptions): Promise<Font[]> => {
  const loadedFonts = await Promise.all(
    normalizeRequestedFontWeights(weights).map(
      async (weight) =>
        await loadGoogleFontsWithConfig(`family:${family}`, {
          family,
          style,
          weight,
        })
    )
  );

  return loadedFonts.flat();
};

export const clearFontCache = (): void => {
  googleFontCache.clear();
};

const resolveFontSources = (sources: FontSource[] | undefined): FontSource[] =>
  sources && sources.length > 0 ? sources : [builtInGoogleFontSource];

const resolveBaseFonts = async ({
  baseFonts,
  requestedLocales,
  request,
  resolvedSources,
  resolvedText,
}: {
  baseFonts?: Font[];
  requestedLocales: string[];
  request: Request | undefined;
  resolvedSources: FontSource[];
  resolvedText: string;
}): Promise<Font[]> => {
  if (baseFonts && baseFonts.length > 0) {
    return [...baseFonts];
  }

  return await resolveFontsFromSources(
    requestedLocales[0] ?? "en",
    resolvedText,
    request,
    resolvedSources
  );
};

const appendFallbackFonts = async ({
  baseLocale,
  requestedLocales,
  request,
  resolvedFonts,
  resolvedSources,
  resolvedText,
}: {
  baseLocale: string | undefined;
  requestedLocales: string[];
  request: Request | undefined;
  resolvedFonts: Font[];
  resolvedSources: FontSource[];
  resolvedText: string;
}): Promise<void> => {
  for (const requestedLocale of requestedLocales) {
    if (!requestedLocale || requestedLocale === baseLocale) {
      continue;
    }

    resolvedFonts.push(
      ...(await resolveFontsFromSources(
        requestedLocale,
        resolvedText,
        request,
        resolvedSources
      ))
    );
  }
};

export const resolveFonts = async ({
  baseFonts,
  fallbackLocales,
  locale,
  request,
  sources,
  text = "",
}: ResolveFontsOptions): Promise<Font[]> => {
  const resolvedText = extractPrimaryText(text);
  const requestedLocales = resolveRequestedLocales(
    locale,
    fallbackLocales,
    resolvedText
  );
  const resolvedSources = resolveFontSources(sources);
  const resolvedBaseFonts = await resolveBaseFonts({
    baseFonts,
    request,
    requestedLocales,
    resolvedSources,
    resolvedText,
  });
  const resolvedFonts = [...resolvedBaseFonts];
  const [baseLocale] = requestedLocales;

  await appendFallbackFonts({
    baseLocale,
    request,
    requestedLocales,
    resolvedFonts,
    resolvedSources,
    resolvedText,
  });

  if (resolvedFonts.length === 0) {
    resolvedFonts.push(...(await loadFallbackFontsForLocale("en")));
  }

  return dedupeFonts(resolvedFonts);
};

export const resolveFontSetup = async ({
  baseFonts,
  fallbackLocales,
  locale,
  request,
  sources,
  text,
}: ResolveFontSetupOptions): Promise<ResolvedFontSetup> => {
  const resolvedSources = [
    ...resolveFontSources(sources),
    builtInGoogleFontSource,
  ];
  const resolvedFonts = await resolveFonts({
    baseFonts,
    fallbackLocales,
    locale,
    request,
    sources: resolvedSources,
    text,
  });
  const localeFamilies: Record<string, string> = {};

  for (const requestedLocale of resolveRequestedLocales(
    locale,
    fallbackLocales,
    text ?? ""
  )) {
    const family = await resolveFontFamilyForLocale(
      requestedLocale,
      resolvedSources,
      request
    );

    if (family) {
      localeFamilies[requestedLocale] = family;
    }
  }

  return {
    families: {
      base: resolveFirstNamedFontFamily(resolvedFonts),
      locales: localeFamilies,
    },
    fonts: resolvedFonts,
  };
};

const resolveRequestedPlatform = (
  platform: string | undefined,
  detectedPlatform: DetectedPlatform
): string =>
  platform ? normalizePlatform(platform) : detectedPlatform.platform;

const resolveExplicitAspectRatio = (
  options: ResolveOgRequestOptions,
  requestUrl: URL
): AspectRatioPreset | undefined =>
  resolveAspectRatioPreset(options.aspectRatio) ??
  resolveAspectRatioPreset(requestUrl.searchParams.get("aspect_ratio"));

const resolveRequestedAspectRatio = (
  options: ResolveOgRequestOptions,
  requestUrl: URL,
  profile: PlatformProfile
): AspectRatioPreset =>
  resolveExplicitAspectRatio(options, requestUrl) ?? profile.defaultAspectRatio;

const resolveRequestedLayout = (
  options: ResolveOgRequestOptions,
  requestUrl: URL,
  preset: AspectRatioPreset,
  profile: PlatformProfile
): {
  explicitLayout: LayoutStrategy | undefined;
  layoutStrategy: ResolvedLayoutStrategy;
} => {
  const explicitLayout =
    options.layout ??
    normalizeLayoutStrategy(
      requestUrl.searchParams.get("layout") ??
        requestUrl.searchParams.get("layout_strategy")
    );

  return {
    explicitLayout,
    layoutStrategy: resolveLayoutStrategy(explicitLayout, preset, profile),
  };
};

const resolveRequestLayout = ({
  layoutStrategy,
  options,
  preset,
  profiles,
  resolvedPlatform,
}: {
  layoutStrategy: ResolvedLayoutStrategy;
  options: ResolveOgRequestOptions;
  preset: AspectRatioPreset;
  profiles: PlatformProfile[];
  resolvedPlatform: string;
}): { layout: OgLayout; safeArea: OgSafeArea } => {
  const safeArea = getSafeArea({
    aspectRatio: preset.label,
    height: preset.height,
    platform: resolvedPlatform,
    platformProfiles: profiles,
    width: preset.width,
  });

  return {
    layout: createLayout({
      height: preset.height,
      padding: options.padding,
      safeArea,
      strategy: layoutStrategy,
      width: preset.width,
    }),
    safeArea,
  };
};

export const resolveOgRequest = async (
  request: Request,
  options: ResolveOgRequestOptions = {}
): Promise<ResolvedOgRequest> => {
  const requestUrl = new URL(request.url);
  const profiles = resolveProfiles(options.platformProfiles);
  const detectedPlatform = await detectPlatform(request, options);
  const resolvedPlatform = resolveRequestedPlatform(
    options.platform,
    detectedPlatform
  );
  const profile = getPlatformProfile(resolvedPlatform, profiles);
  const explicitAspectRatio = resolveExplicitAspectRatio(options, requestUrl);
  const preset = resolveRequestedAspectRatio(options, requestUrl, profile);
  const { explicitLayout, layoutStrategy } = resolveRequestedLayout(
    options,
    requestUrl,
    preset,
    profile
  );
  const { layout, safeArea } = resolveRequestLayout({
    layoutStrategy,
    options,
    preset,
    profiles,
    resolvedPlatform,
  });

  return {
    aspectRatio: preset.label,
    capabilities: profile.capabilities,
    confidence: detectedPlatform.confidence,
    crawler: detectedPlatform.crawler,
    height: preset.height,
    layout,
    layoutStrategy,
    matchedSignals: detectedPlatform.matchedSignals,
    normalizedQuery: {
      aspectRatio: explicitAspectRatio?.label,
      layout: explicitLayout,
      platform: resolveQueryPlatform(requestUrl),
    },
    platform: resolvedPlatform,
    safeArea,
    width: preset.width,
  };
};

export type OgComponentFactory<TNode> = (context: ResolvedOgRequest) => TNode;

export const resolveOgComponent = <TNode>(
  component: TNode | OgComponentFactory<TNode>,
  context: ResolvedOgRequest
): TNode => {
  if (typeof component === "function") {
    return (component as OgComponentFactory<TNode>)(context);
  }

  return component;
};

export const createOgRouteHandler =
  <TNode, TContext = undefined, TRenderOptions = undefined>(
    options: CreateOgRouteHandlerOptions<TNode, TContext, TRenderOptions>
  ) =>
  async (request: Request, context?: TContext): Promise<Response> => {
    const locale =
      (await options.localeFromRequest?.(request)) ??
      (context ? await options.localeFromContext?.(context) : undefined);
    const resolvedRequest = options.requestResolver
      ? await options.requestResolver(request)
      : await resolveOgRequest(request, options.resolveRequestOptions);
    const component = resolveOgComponent(options.component, resolvedRequest);
    const resolvedText =
      options.text ??
      (await options.textFromComponent?.({
        component,
        context,
        locale,
        request,
        resolvedRequest,
        text: maybeExtractTextFromComponent(component),
      })) ??
      maybeExtractTextFromComponent(component);
    const fonts = options.fontResolver
      ? await options.fontResolver({
          component,
          context,
          locale,
          request,
          resolvedRequest,
          text: resolvedText,
        })
      : await resolveFonts({
          baseFonts: options.baseFonts,
          fallbackLocales: options.fallbackLocales,
          locale,
          request,
          sources: options.sources,
          text: resolvedText,
        });
    const response = await options.renderer({
      component,
      fonts,
      options: options.renderOptions,
      request,
      resolvedRequest,
    });

    return applyStableCacheHeaders(response);
  };
