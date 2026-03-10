# @better-og/node

Node.js adapter for `Better OG`.

It uses Takumi's native Node.js runtime for rendering Open Graph images.

## Install

```sh
pnpm add @better-og/core @better-og/node @takumi-rs/image-response react
```

## Usage

```tsx
import { createOgHandler } from "@better-og/node";

const handler = createOgHandler({
  component: <div>Hello from Node.js</div>,
});
```
