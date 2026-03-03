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

- Publishable packages live under `packages/`.
- Use `pnpm changeset` for user-facing package changes.
- `docs/` is a local Next.js app used for validation and examples.
- Keep package boundaries explicit. Put shared logic in `better-og` and keep
  runtime-specific code inside the adapter packages.
