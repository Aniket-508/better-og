# better-og

The core package for the `better-og` workspace.

It contains the runtime-agnostic helpers used by every adapter:

- aspect-ratio presets (`STANDARD`, `SQUARE`, `PORTRAIT`, `INSTAGRAM`)
- `getOgContext(request)` with Twitter safe-area hints
- locale-aware font loading via `getFontsForRequest()`
- `resolveFontSetup()` for loaded fonts plus resolved family names
- shared adapter helpers such as `applyStableCacheHeaders()`

## Install

```sh
pnpm add better-og
```

## Usage

```ts
import { getOgContext, resolveFontSetup } from "better-og";

const ogContext = getOgContext(request);

const fontSetup = await resolveFontSetup({
  fallbackFontLocales: ["ja", "ar"],
  fonts: customFonts,
});
```

## Notes

- Twitter requests expose `safeArea.bottom = 44`
- Built-in locale fallbacks use Noto Sans variants
- Adapter packages live alongside this package in the workspace
