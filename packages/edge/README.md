# @better-og/edge

Low-level Takumi WASM adapter for `Better OG`.

## Install

```sh
pnpm add @better-og/core @better-og/edge @takumi-rs/image-response react
```

## Usage

```tsx
import { createOgHandler } from "@better-og/edge";

export const GET = createOgHandler({
  component: <div>Hello from Edge</div>,
  module: wasmModule,
});
```

Pass the runtime-specific Takumi WASM module yourself.
