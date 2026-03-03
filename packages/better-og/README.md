# better-og

<p align="left">
  <a href="https://www.npmjs.com/package/better-og"><img src="https://img.shields.io/npm/v/better-og.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/better-og"><img src="https://img.shields.io/npm/dm/better-og.svg" alt="npm downloads" /></a>
  <a href="https://github.com/Aniket-508/better-og/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/better-og.svg" alt="license" /></a>
  <a href="https://github.com/Aniket-508/better-og/actions/workflows/ci.yml"><img src="https://github.com/Aniket-508/better-og/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
</p>

Open Graph image helpers with sane aspect-ratio defaults, locale-aware font
fallbacks, and adapters for Next.js, Edge/Takumi, Workers, and TanStack Start.

## Entry Points

- `better-og`
- `better-og/next`
- `better-og/next/edge`
- `better-og/edge`
- `better-og/tanstack-start`
- `better-og/workers`

## Install

Install only the runtime pieces you need.

| Use case                        | Command                                                                   |
| ------------------------------- | ------------------------------------------------------------------------- |
| Core helpers only               | `pnpm add better-og`                                                      |
| Next.js with `next/og`          | `pnpm add better-og next react`                                           |
| Next.js Node with Takumi        | `pnpm add better-og @takumi-rs/image-response next react`                 |
| Edge / Workers with Takumi WASM | `pnpm add better-og @takumi-rs/image-response @takumi-rs/wasm next react` |
| TanStack Start                  | `pnpm add better-og @takumi-rs/image-response react`                      |

## Quick Start

```tsx
import { resolveFontSetup } from "better-og";
import {
  createOgRouteHandler,
  loadGoogleFontForImageResponse,
} from "better-og/next";

export const runtime = "nodejs";
export const revalidate = false;

const fontSetup = await resolveFontSetup({
  fonts: await loadGoogleFontForImageResponse({
    family: "Geist",
    weights: [400, 700],
  }),
  fallbackFontLocales: ["ja"],
});

export const GET = createOgRouteHandler({
  component: (ogContext) => (
    <div
      style={{
        fontFamily: fontSetup.families.base,
        paddingBottom: 32 + ogContext.safeArea.bottom,
      }}
    >
      Hello from better-og
    </div>
  ),
  fonts: fontSetup.fonts,
});
```

If you use `provider: "takumi"` on `better-og/next`, keep Takumi external in
Next.js:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/image-response"],
};

export default nextConfig;
```

## Adapters

| Import                     | Runtime              | Notes                                                              |
| -------------------------- | -------------------- | ------------------------------------------------------------------ |
| `better-og`                | Any                  | Core helpers, context detection, font resolution                   |
| `better-og/next`           | Next.js Node         | Defaults to `provider: "next"`, also supports `provider: "takumi"` |
| `better-og/next/edge`      | Next.js Edge         | Uses `next/og`; Takumi is intentionally disabled here              |
| `better-og/edge`           | Generic WASM runtime | Low-level Takumi adapter, requires an explicit `module`            |
| `better-og/workers`        | Workers              | Wraps `better-og/edge` with the default Takumi WASM module         |
| `better-og/tanstack-start` | TanStack Start       | Node/Takumi route handler                                          |

## Core Helpers

The root entry exports:

- `STANDARD`, `SQUARE`, `PORTRAIT`, `INSTAGRAM`
- `getOgContext(request)`
- `getFontsForRequest(context, options)`
- `resolveFontSetup(options)`
- `clearFontCache()`
- `Font`, `OgContext`, `OgSafeArea`, and `OgAdapterOptions`

## Runtime Behavior

- `getOgContext(request)` uses `?aspect_ratio=` first, then falls back to the
  caller `User-Agent`.
- Platform defaults are:
  - Twitter -> `STANDARD`
  - Telegram / Slack -> `SQUARE`
  - iMessage -> `PORTRAIT`
  - Instagram -> `INSTAGRAM`
  - Everything else -> `STANDARD`
- Twitter adds `safeArea.bottom = 44` so card text can stay out of the lower
  crop zone.
- `getFontsForRequest()` resolves fonts in this order:
  1. `getFontsForLocale(locale)`
  2. `fonts`
  3. built-in English `Noto Sans`
- `fallbackFontLocales` appends locale-specific fallbacks on top of the base
  font set.
- Built-in locale fallbacks cover `en`, `ru`, `uk`, `zh`, `ja`, `ko`, `ar`,
  and `hi`.

## Credits

- [Takumi](https://takumi.kane.tw/docs/)
- [next/og](https://nextjs.org/docs/app/api-reference/functions/image-response)
