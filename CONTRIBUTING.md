# Contributing to better-og

Thanks for your interest in contributing to `better-og`! This project is a monorepo containing the core engine and various runtime adapters for Open Graph image generation.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v22.20+
- [pnpm](https://pnpm.io/) v10.29+ (package manager)

### Getting Started

```bash
# Clone the repo
git clone https://github.com/Aniket-508/better-og.git
cd better-og

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test
```

## Project Structure

```
packages/
├── core/             # @better-og/core - Shared logic and utilities
├── node/             # @better-og/node - Node.js adapter
├── next/             # @better-og/next - Next.js (Node/Edge) adapter
├── edge/             # @better-og/edge - Low-level Takumi WASM adapter
├── workers/          # @better-og/workers - Cloudflare Workers adapter
└── tanstack-start/   # @better-og/tanstack-start - TanStack Start adapter
docs/                 # Next.js documentation site (Fumadocs)
```

## Development Commands

```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Type check everything
pnpm typecheck

# Lint and format check (ultracite)
pnpm check

# Fix lint and format issues (ultracite)
pnpm fix

# Run tests for a specific package
pnpm --filter @better-og/core test
```

### Documentation and Demo

To run the documentation site locally:

```bash
pnpm --filter docs dev
```

## Code Style

We use `oxfmt` and `oxlint` (via `ultracite`) for linting and formatting. Run `pnpm fix` to auto-fix most issues.

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Ensure tests pass: `pnpm test`
4. Run `pnpm check` to verify code quality
5. Submit a PR

### Changesets

For any user-facing changes to packages, you must add a changeset:

```bash
pnpm changeset
```

Follow the prompts to select the affected packages and provide a brief description of the change.

## Package Architecture

- **`@better-og/core`**: The brain of the project. Contains layout logic, font resolution, and request parsing. It remains runtime-agnostic and should not depend on environment-specific APIs (like Node `fs` or browser `fetch`).
- **Runtime Adapters**: Packages like `@better-og/next` or `@better-og/workers` wrap the core logic to provide idiomatic APIs for specific platforms.

When adding features:

- If it's a general helper or logic, it likely belongs in `@better-og/core`.
- If it's specific to a framework or platform (e.g., Next.js `ImageResponse`), it belongs in an adapter.

## Questions?

Feel free to open an issue or start a discussion if you have questions!
