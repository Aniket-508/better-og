import { applyStableCacheHeaders, createCachedModuleLoader } from "#core";

describe("cached module loading", () => {
  it("loads a module only once", async () => {
    let loadCount = 0;
    const loader = async () => {
      loadCount += 1;

      return await Promise.resolve({ value: 1 });
    };
    const getModule = createCachedModuleLoader(loader);

    const [first, second] = await Promise.all([getModule(), getModule()]);

    expect(loadCount).toBe(1);
    expect(first).toBe(second);
  });
});

describe("cache header handling", () => {
  it("adds the default cache header when one is missing", async () => {
    const response = new Response("ok", {
      headers: {
        ETag: "etag-1",
      },
      status: 201,
      statusText: "Created",
    });

    const result = applyStableCacheHeaders(response);

    expect(result.headers.get("Cache-Control")).toBe(
      "public, immutable, no-transform, max-age=31536000"
    );
    expect(result.headers.get("ETag")).toBe("etag-1");
    expect(result.status).toBe(201);
    expect(result.statusText).toBe("Created");
    await expect(result.text()).resolves.toBe("ok");
  });

  it("preserves an explicit cache header", () => {
    const response = new Response("ok", {
      headers: {
        "Cache-Control": "private, max-age=60",
      },
    });

    const result = applyStableCacheHeaders(response);

    expect(result.headers.get("Cache-Control")).toBe("private, max-age=60");
  });
});
