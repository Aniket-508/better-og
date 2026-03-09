# better-og

<p align="left">
  <a href="https://github.com/Aniket-508/better-og/actions/workflows/ci.yml"><img src="https://github.com/Aniket-508/better-og/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/Aniket-508/better-og/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" /></a>
</p>

Platform-aware Open Graph image tooling with a shared core engine and
runtime-specific adapters.

## Packages

- [`@better-og/core`](./packages/core/README.md): request resolution, layout, font, and asset helpers
- [`@better-og/next`](./packages/next/README.md): Next.js Node and Edge adapters
- [`@better-og/edge`](./packages/edge/README.md): low-level Takumi WASM adapter
- [`@better-og/workers`](./packages/workers/README.md): Workers adapter with bundled Takumi WASM
- [`@better-og/tanstack-start`](./packages/tanstack-start/README.md): TanStack Start adapter

## Monorepo

- Workspace packages live in [`packages`](./packages)
- The docs app lives in [`docs`](./docs)
- Versioning and publishing are handled with Changesets

## Development

```sh
pnpm install
pnpm check
pnpm build
pnpm typecheck
```
