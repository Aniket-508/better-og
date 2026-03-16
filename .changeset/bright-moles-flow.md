---
"@better-og/core": major
"@better-og/next": major
"@better-og/edge": major
"@better-og/workers": major
"@better-og/tanstack-start": major
---

Release the v1 request-resolution architecture.

Core now provides multi-signal platform detection, platform capability profiles,
computed safe areas, reusable layout boxes, script-aware font resolution, text
fitting, image asset loading, platform simulation, and a shared renderer/route
handler contract.

The runtime adapters now build on the shared core handler and use `renderer`
terminology instead of `provider` for backend selection.
