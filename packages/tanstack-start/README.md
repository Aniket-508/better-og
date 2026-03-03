# @better-og/tanstack-start

TanStack Start adapter for `better-og`.

## Install

```sh
pnpm add better-og @better-og/tanstack-start @takumi-rs/image-response react
```

## Usage

```tsx
import { createOgRouteHandler } from "@better-og/tanstack-start";

const getOg = createOgRouteHandler({
  component: <div>Hello from TanStack Start</div>,
});

export const GET = ({ params, request }) => getOg({ params, request });
```
