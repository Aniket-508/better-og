# @better-og/workers

Workers adapter for `Better OG`.

It initializes Takumi's bundled Workers WASM runtime and renders through a
`Renderer`, which matches the Cloudflare Workers setup used in Takumi's own
examples.

## Install

```sh
pnpm add @better-og/core @better-og/workers @takumi-rs/image-response @takumi-rs/wasm react
```

## Usage

```tsx
import { createOgHandler } from "@better-og/workers";

const handler = createOgHandler({
  component: <div>Hello from Workers</div>,
});

export default {
  fetch: handler,
};
```

If you already have a preconfigured Takumi `Renderer`, pass it through
`renderer` and the adapter will reuse it.
