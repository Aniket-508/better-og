# better-og

`better-og` is a single npm package for generating Open Graph images with
Takumi.

It exposes one core entry point plus adapter subpaths:

- `better-og`
- `better-og/next`
- `better-og/edge`

## Install

Install only the pieces you use.

Core helpers only:

```sh
pnpm add better-og
```

Next.js (Node runtime):

```sh
pnpm add better-og @takumi-rs/image-response next react
```

Next.js (Edge runtime):

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
3. Built-in fallback fonts when `fallbackFonts: true`

Built-in locale fallbacks:

- `en`, `ru`, `uk` -> `Noto Sans`
- `zh` -> `Noto Sans SC`
- `ja` -> `Noto Sans JP`
- `ko` -> `Noto Sans KR`
- `ar` -> `Noto Sans Arabic`
- `hi` -> `Noto Sans Devanagari`

Fallback fonts are fetched from Google Fonts CSS, resolved to font files, and
cached in memory by locale.

## Next.js

Node runtime:

```tsx
import { createOgRouteHandler } from "better-og/next";

export const runtime = "nodejs";
export const revalidate = false;

export const GET = createOgRouteHandler({
  component: <div>Hello from Node</div>,
  fallbackFonts: true,
});
```

For the Node runtime entry, Takumi's Node backend should be externalized:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/image-response"],
};

export default nextConfig;
```

Edge runtime:

```tsx
import { createOgHandler } from "better-og/edge";

export const runtime = "edge";
export const revalidate = false;

const loadNextWasmModule = async () => {
  const nextModule = await import("@takumi-rs/wasm/next");

  return nextModule.default;
};

export const GET = createOgHandler({
  component: <div>Hello from Edge</div>,
  fallbackFonts: true,
  module: loadNextWasmModule,
});
```

## Generic WASM Runtimes

```tsx
import { createOgHandler } from "better-og/edge";

const handler = createOgHandler({
  component: <div>Hello</div>,
  fallbackFonts: true,
  module: wasmModule,
});
```

`better-og/edge` is the single WASM adapter. You provide Takumi's runtime-
specific `module` input yourself. For Next.js Edge routes, pass
`@takumi-rs/wasm/next`. For other runtimes, pass the module shape that Takumi
documents for that environment.

## Takumi References

These are the official Takumi pages this package aligns with:

- [Takumi docs](https://takumi.kane.tw/docs/)
- [Takumi: From Next.js ImageResponse](https://takumi.kane.tw/docs/migration/image-response/)
- [Takumi: Cloudflare Workers](https://takumi.kane.tw/docs/integrations/cloudflare-workers)
