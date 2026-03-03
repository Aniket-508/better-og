# Contributing

## Setup

```sh
pnpm install
```

## Validate

Run these before opening a PR:

```sh
pnpm check
pnpm build
pnpm typecheck
pnpm --filter ./docs build
```

## Local Development

To work on the demo/docs app:

```sh
pnpm --filter ./docs dev
```

## Notes

- The only publishable package is `packages/better-og`.
- `docs/` is a local Next.js app used for validation and examples.
- Keep changes compatible with the current TypeScript project-reference setup.
