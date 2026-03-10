<p align="center">
  <img src="https://yffrvzi8zwbljfuj.public.blob.vercel-storage.com/better-og/og.png" alt="better-og hero" width="100%" />
</p>

<h2 align="center">
  Better OG
</h2>

<p align="center">
  Betterrrrrr Open Graph image toolkit
  <br />
  <br />
  <a href="https://better-og.vercel.app">Website</a>
  ·
  <a href="https://github.com/Aniket-508/better-og/issues">Issues</a>
</p>

<p align="center">
  <a href="https://github.com/Aniket-508/better-og/actions/workflows/ci.yml"><img src="https://github.com/Aniket-508/better-og/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/Aniket-508/better-og/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" /></a>
  <a href="https://github.com/sponsors/Aniket-508"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor" /></a>
</p>

## Features

- **Unified Core Engine**: Shared logic for layout, font resolution, and asset handling.
- **Platform Aware**: Automatic detection of request source (Twitter, Open Graph) with safe-area calculations.
- **Runtime Adapters**: Optimized for Next.js (Node/Edge), Cloudflare Workers, and more.
- **Flexible Layouts**: Support for various aspect ratios and script-aware font resolution.
- **High Performance**: Minimal overhead with support for specialized renderers like Takumi (WASM).

## Packages

| Package                                                  | Description                                          |
| :------------------------------------------------------- | :--------------------------------------------------- |
| [`@better-og/core`](./packages/core)                     | Request resolution, layout, font, and asset helpers. |
| [`@better-og/node`](./packages/node)                     | Node.js/Bun/Deno adapter.                            |
| [`@better-og/next`](./packages/next)                     | Next.js Node and Edge adapters.                      |
| [`@better-og/edge`](./packages/edge)                     | Low-level Takumi WASM adapter.                       |
| [`@better-og/workers`](./packages/workers)               | Workers adapter with bundled Takumi WASM.            |
| [`@better-og/tanstack-start`](./packages/tanstack-start) | TanStack Start adapter.                              |

## Quick Start (Next.js)

```tsx
import { resolveFontSetup } from "@better-og/core";
import {
  createOgRouteHandler,
  loadGoogleFontForImageResponse,
} from "@better-og/next";

const fontSetup = await resolveFontSetup({
  baseFonts: await loadGoogleFontForImageResponse({
    family: "Inter",
    weights: [400, 700],
  }),
});

export const GET = createOgRouteHandler({
  component: (ogContext) => (
    <div style={{ fontFamily: fontSetup.families.base }}>
      Hello from better-og
    </div>
  ),
  baseFonts: fontSetup.fonts,
});
```

## Development

```sh
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## Credits

- [next/og](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Takumi](https://takumi.kane.tw/)

## License

[MIT](./LICENSE)
