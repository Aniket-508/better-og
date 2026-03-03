# @better-og/next

Next.js adapters for `better-og`.

## Install

```sh
pnpm add better-og @better-og/next next react
```

If you use `provider: "takumi"` on the Node runtime adapter, also install:

```sh
pnpm add @takumi-rs/image-response
```

## Exports

- `@better-og/next`
- `@better-og/next/edge`

## Usage

```tsx
import { resolveFontSetup } from "better-og";
import {
  createOgRouteHandler,
  loadGoogleFontForImageResponse,
} from "@better-og/next";

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
      Hello from Next.js
    </div>
  ),
  fonts: fontSetup.fonts,
});
```

Use `@better-og/next/edge` for the Next.js Edge runtime. It supports the
`next/og` provider only.
