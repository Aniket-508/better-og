# @better-og/edge

## 1.0.0

### Major Changes

- 12203ae: Release the v1 request-resolution architecture.

  Core now provides multi-signal platform detection, platform capability profiles,
  computed safe areas, reusable layout boxes, script-aware font resolution, text
  fitting, image asset loading, platform simulation, and a shared renderer/route
  handler contract.

  The runtime adapters now build on the shared core handler and use `renderer`
  terminology instead of `provider` for backend selection.

### Patch Changes

- Updated dependencies [12203ae]
  - @better-og/core@1.0.0

## 0.1.0

### Minor Changes

- 694797d: Initial public release.

### Patch Changes

- Updated dependencies [694797d]
  - better-og@0.1.0

All notable changes to this package will be documented in this file.
