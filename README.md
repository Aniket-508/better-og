# better-og

`better-og` is a single npm package for generating Open Graph images with
Takumi.

It exposes one core entry point plus adapter subpaths:

- `better-og`
  - Runtime-agnostic helpers only
- `better-og/next`
  - Next.js App Router adapter for Node runtime routes
- `better-og/next/edge`
  - Next.js App Router adapter for Edge runtime routes
- `better-og/edge`
  - Generic Fetch-style edge adapter for non-Next runtimes

The repo also contains a single local Next.js docs app in `docs`, but there is
only one publishable package.

## Install

The root `better-og` entry point stays lean by treating Takumi and framework
bindings as optional peer dependencies. Install only the pieces you use.

Core helpers only:

```sh
pnpm add better-og
```

Next.js Node runtime routes:

```sh
pnpm add better-og @takumi-rs/image-response next react
```

Next.js Edge runtime routes:

```sh
pnpm add better-og @takumi-rs/image-response @takumi-rs/wasm next react
```

Generic edge/fetch runtime:

```sh
pnpm add better-og @takumi-rs/image-response @takumi-rs/wasm react
```

## Aspect Ratios

The core entry point exposes four presets:

- `STANDARD`: `1200x630` (`1.91:1`)
- `SQUARE`: `1200x1200` (`1:1`)
- `PORTRAIT`: `630x1200` (`1:1.91`)
- `INSTAGRAM`: `1200x1500` (`4:5`)

`getOgContext(request)` resolves dimensions like this:

1. If `?aspect_ratio=` is present and matches a known alias, use it.
2. Otherwise inspect the request `User-Agent`.

Default platform mapping:

- Twitter -> `STANDARD`
- Telegram / Slack -> `SQUARE`
- iMessage -> `PORTRAIT`
- Instagram -> `INSTAGRAM`
- Anything else -> `STANDARD`

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

Fallback fonts are fetched from Google Fonts CSS using a bot user agent, the TTF
asset URLs are resolved, and the results are cached in memory per locale.

## Core Usage

```ts
import { getFontsForRequest, getOgContext } from "better-og";
```

The root entry point exports:

- `STANDARD`, `SQUARE`, `PORTRAIT`, `INSTAGRAM`
- `getOgContext(request)`
- `getFontsForRequest(context, options)`
- `clearFontCache()`
- shared interfaces like `Font`, `OgContext`, and `OgAdapterOptions`

## Next.js Usage

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

`better-og/next` expects `@takumi-rs/image-response`, `next`, and `react` to be
installed in your app.

Edge runtime:

```tsx
import { createOgRouteHandler } from "better-og/next/edge";

export const runtime = "edge";
export const revalidate = false;

export const GET = createOgRouteHandler({
  component: <div>Hello from Edge</div>,
  fallbackFonts: true,
});
```

`better-og/next/edge` expects `@takumi-rs/image-response`, `@takumi-rs/wasm`,
`next`, and `react` to be installed in your app.

For the Node runtime entry point, Next.js should externalize Takumi's Node
backend:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/image-response"],
};

export default nextConfig;
```

Rewrite helper:

```ts
import type { NextRequest } from "next/server";
import { withOgRewrite } from "better-og/next";

export const proxy = (request: NextRequest) => withOgRewrite(request);
```

## Generic Edge Usage

```tsx
import { createOgHandler } from "better-og/edge";

const handler = createOgHandler({
  component: <div>Hello from Edge</div>,
  fallbackFonts: true,
  module: import("@takumi-rs/wasm/takumi_wasm_bg.wasm").then(
    (wasm) => wasm.default
  ),
});
```

`better-og/edge` requires an explicit WASM module input because it is runtime
agnostic. `better-og/edge` expects `@takumi-rs/image-response`,
`@takumi-rs/wasm`, and `react` to be installed. `better-og/next/edge` wires the
Next-specific module for you.

## Docs App

`docs` demonstrates both Next adapter modes:

- `/og/[lang]` -> `better-og/next`
- `/og-edge/[lang]` -> `better-og/next/edge`

The app also uses `proxy.ts` to append `?aspect_ratio=` automatically from the
incoming user agent.

## Workspace Commands

```sh
pnpm install
pnpm build
pnpm --filter ./docs dev
```

Use the docs app routes above as the concrete reference for the Next adapters.
