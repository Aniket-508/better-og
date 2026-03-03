import { clearFontCache } from "#core";

afterEach(() => {
  clearFontCache();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
