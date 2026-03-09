# @better-og/core

The core package for the `better-og` workspace.

It contains the runtime-agnostic helpers used by every adapter:

- platform detection via `detectPlatform()` and `resolveOgRequest()`
- aspect-ratio presets (`STANDARD`, `SQUARE`, `PORTRAIT`, `INSTAGRAM`)
- computed safe areas and reusable layout boxes via `getSafeArea()` and `createLayout()`
- script-aware font resolution via `resolveFonts()` and `resolveFontSetup()`
- shared route and renderer contracts used by the runtime adapters

## Install

```sh
pnpm add @better-og/core
```

## Usage

```ts
import {
  detectPlatform,
  resolveFontSetup,
  resolveOgRequest,
} from "@better-og/core";

const detection = await detectPlatform(request);
const ogRequest = await resolveOgRequest(request);

const fontSetup = await resolveFontSetup({
  fallbackLocales: ["ja", "ar"],
  baseFonts: customFonts,
});
```

## Notes

- Twitter requests expose a proportional bottom safe area equivalent to `44px` on a `1200x630` canvas
- Built-in locale fallbacks use Noto Sans variants and mixed-script text resolves only the needed locales
- Adapter packages live alongside this package in the workspace
