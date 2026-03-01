# Docs App

This folder contains the local Next.js docs/demo app for `better-og`.

It is not published to npm. The only publishable package in this repository is
the root `better-og` package.

## Run

```sh
pnpm install
pnpm --filter ./docs dev
```

## Build

```sh
pnpm --filter ./docs build
```

## Routes

- `/`
  - Demo page that previews both OG handlers
- `/og/[lang]`
  - Node runtime route using `better-og/next`
- `/og-edge/[lang]`
  - Edge runtime route using `better-og/edge` with `@takumi-rs/wasm/next`

The app also uses `proxy.ts` to rewrite OG requests and append
`?aspect_ratio=` based on the caller's user agent.
