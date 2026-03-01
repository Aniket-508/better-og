# better-og

`better-og` is a single npm package for generating Open Graph images with
shared aspect-ratio and font helpers, plus Next and Takumi-backed adapters.

It exposes one core entry point plus adapter subpaths:

- `better-og`
- `better-og/next`
- `better-og/next/edge`
- `better-og/edge`
- `better-og/tanstack-start`
- `better-og/workers`

## Install

Install only the pieces you use.

Core helpers only:

```sh
pnpm add better-og
```

Next.js (default `next/og` provider):

```sh
pnpm add better-og next react
```

Next.js with Takumi provider:

```sh
pnpm add better-og @takumi-rs/image-response next react
```

TanStack Start:

```sh
pnpm add better-og @takumi-rs/image-response react
```

Next.js Edge with the low-level Takumi adapter:

```sh
pnpm add better-og @takumi-rs/image-response @takumi-rs/wasm next react
```

Non-Next WASM runtime:

```sh
pnpm add better-og @takumi-rs/image-response @takumi-rs/wasm react
```

## Exports

The root entry exports the runtime-agnostic helpers:

- `STANDARD`, `SQUARE`, `PORTRAIT`, `INSTAGRAM`
- `getOgContext(request)`
- `getFontsForRequest(context, options)`
- `resolveFontSetup(options)`
- `clearFontCache()`
- `Font`, `OgContext`, and `OgAdapterOptions`

## Aspect Ratios

`getOgContext(request)` resolves dimensions like this:

1. If `?aspect_ratio=` is present and matches a known preset, use it.
2. Otherwise inspect the request `User-Agent`.

Default mapping:

- Twitter -> `STANDARD`
- Telegram / Slack -> `SQUARE`
- iMessage -> `PORTRAIT`
- Instagram -> `INSTAGRAM`
- Everything else -> `STANDARD`

Presets:

- `STANDARD`: `1200x630` (`1.91:1`)
- `SQUARE`: `1200x1200`
- `PORTRAIT`: `630x1200` (`1:1.91`)
- `INSTAGRAM`: `1200x1500` (`4:5`)

## Font Fallbacks

`getFontsForRequest()` merges fonts in this order:

1. `getFontsForLocale(locale)` if you provide one
2. Otherwise `fonts`
3. If neither returns anything, built-in English `Noto Sans`

If you pass `fallbackFontLocales: ["ja", "ar"]`, those locale fallbacks are
appended on top of the base fonts. When `fallbackFontLocales` is omitted or an
empty array, only your provided fonts are used, or the default English
fallback if you did not provide any.

If you want to source fallback locale fonts from your own repo or storage,
provide `getFallbackFontsForLocale(locale)`. That hook is checked first for
each requested fallback locale, and the built-in Noto mapping is only used when
your hook returns no fonts for that locale.

Built-in locale fallbacks:

- `en`, `ru`, `uk` -> `Noto Sans`
- `zh` -> `Noto Sans SC`
- `ja` -> `Noto Sans JP`
- `ko` -> `Noto Sans KR`
- `ar` -> `Noto Sans Arabic`
- `hi` -> `Noto Sans Devanagari`

Fallback fonts are fetched from Google Fonts CSS, resolved to font files, and
cached in memory by locale.

If you want one helper that returns both the loaded `fonts` and the resolved
family names, use `resolveFontSetup()`. It returns `fontSetup.families.base`
for the default family and `fontSetup.families.locales` for locale-specific
families.

## Next.js

Node runtime:

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
  component: (
    <div style={{ fontFamily: fontSetup.families.base }}>
      <span
        style={{
          fontFamily: fontSetup.families.locales.ja ?? fontSetup.families.base,
        }}
      >
        のコストを 溜め込むのはやめよう
      </span>
    </div>
  ),
  fonts: fontSetup.fonts,
  // provider defaults to "next"
  ...rest,
});
```

If you want repo-local fallback fonts in that flow, pass
`getFallbackFontsForLocale(locale)` into `resolveFontSetup()`.

If you need complex-script shaping or advanced OpenType substitution support
(for example Arabic), set `provider: "takumi"` on the Node adapter. The
default `next/og` provider can fail on some fonts that rely on unsupported GSUB
lookups.

When you use `better-og/next`, externalize Takumi's Node backend so the
optional `provider: "takumi"` path stays compatible with Next's build:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/image-response"],
};

export default nextConfig;
```

Next.js Edge runtime:

```tsx
import { createOgRouteHandler } from "better-og/next/edge";

export const runtime = "edge";
export const revalidate = false;

export const GET = createOgRouteHandler({
  component: <div>Hello from Edge</div>,
  fallbackFontLocales: ["ja", "ar"],
  // provider defaults to "next"
  ...rest,
});
```

Low-level generic WASM runtime:

```tsx
import { createOgHandler } from "better-og/edge";

export const runtime = "edge";
export const revalidate = false;

export const GET = createOgHandler({
  component: <div>Hello from Edge</div>,
  fallbackFontLocales: ["ja", "ar"],
  module: wasmModule,
  ...rest,
});
```

Workers convenience wrapper:

```tsx
import { createOgHandler } from "better-og/workers";

const handler = createOgHandler({
  component: <div>Hello from Workers</div>,
  fallbackFontLocales: ["ja", "ar"],
  ...rest,
});

export default {
  fetch: handler,
};
```

TanStack Start (Takumi / Node runtime):

```tsx
import { createOgRouteHandler } from "better-og/tanstack-start";

export const GET = createOgRouteHandler({
  component: <div>Hello from TanStack Start</div>,
  fallbackFontLocales: ["ja"],
});
```

Use that in a TanStack Start route handler that receives `{ request, params }`.

## Generic WASM Runtimes

```tsx
import { createOgHandler } from "better-og/edge";

const handler = createOgHandler({
  component: <div>Hello</div>,
  fallbackFontLocales: ["ja", "ar"],
  module: wasmModule,
});
```

`better-og/next`, `better-og/next/edge`, `better-og/edge`,
`better-og/tanstack-start`, and `better-og/workers` all forward the remaining
`ImageResponse` options directly.

`better-og/next` defaults to `provider: "next"`, which uses Next.js
`ImageResponse` from `next/og`. It also supports `provider: "takumi"` for the
Node runtime.

`better-og/next/edge` currently runs only with the default `provider: "next"`.
The `provider: "takumi"` branch is intentionally disabled there until the
current Vercel duplicate-WASM deployment issue is fixed upstream.

`better-og/workers` defaults to Takumi's `@takumi-rs/wasm/takumi_wasm_bg.wasm`
module. `better-og/edge` remains the low-level Takumi adapter and requires an
explicit `module` so you can pass the runtime-specific Takumi module input your
environment expects.

If you want Takumi on Next Edge today, use the low-level adapter directly:

```tsx
import nextWasmModule from "@takumi-rs/wasm/next";
import { createOgHandler } from "better-og/edge";

export const runtime = "edge";

export const GET = createOgHandler({
  component: <div>Hello from Takumi on Next Edge</div>,
  module: nextWasmModule,
});
```

## Credits

- [next/og docs](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Takumi docs](https://takumi.kane.tw/docs/)
