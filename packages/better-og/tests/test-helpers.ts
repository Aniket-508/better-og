import type { Font, OgContext } from "#core";

export const createFont = (name?: string): Font => ({
  ...(name ? { name } : {}),
  data: Uint8Array.from([1, 2, 3]),
});

export const createRequest = (url: string, userAgent?: string): Request =>
  new Request(url, {
    headers: userAgent ? { "user-agent": userAgent } : undefined,
  });

export const createOgContext = (
  overrides: Partial<OgContext> = {}
): OgContext => ({
  aspectRatio: "1.91:1",
  height: 630,
  platform: "generic",
  safeArea: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  width: 1200,
  ...overrides,
});

export const getMapValueOrFallback = <T>(
  entries: Map<string, T>,
  key: string,
  fallback: T
): T => {
  const value = entries.get(key);

  if (value === undefined) {
    return fallback;
  }

  return value;
};

export const getRequiredMapValue = <T>(
  entries: Map<string, T>,
  key: string
): T => {
  const value = entries.get(key);

  if (value === undefined) {
    throw new Error(`Missing test fixture for key: ${key}`);
  }

  return value;
};
