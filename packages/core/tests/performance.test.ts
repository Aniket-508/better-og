import { performance } from "node:perf_hooks";

import { createOgRouteHandler } from "#core";

import { createFont, createRequest } from "./test-helpers";

const ITERATIONS = 12;
const MAX_OVERHEAD_RATIO = 0.35;
const RENDER_COST_MS = 20;
const WARMUP_ITERATIONS = 3;

const busyWait = (durationMs: number): void => {
  const start = performance.now();

  while (performance.now() - start < durationMs) {
    // Intentionally empty. This simulates renderer work so we can isolate
    // better-og's orchestration overhead from the renderer's own cost.
  }
};

const median = (values: number[]): number => {
  // oxlint-disable-next-line unicorn/no-array-sort
  const sortedValues = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 0) {
    return (
      ((sortedValues[middleIndex - 1] ?? 0) +
        (sortedValues[middleIndex] ?? 0)) /
      2
    );
  }

  return sortedValues[middleIndex] ?? 0;
};

const measure = async (
  run: () => Promise<Response> | Response
): Promise<number> => {
  const start = performance.now();

  await run();

  return performance.now() - start;
};

const divideOrZero = (numerator: number, denominator: number): number =>
  denominator === 0 ? 0 : numerator / denominator;

const sampleMedian = async (
  run: () => Promise<Response> | Response
): Promise<number> => {
  for (let iteration = 0; iteration < WARMUP_ITERATIONS; iteration += 1) {
    await run();
  }

  const samples: number[] = [];

  for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
    samples.push(await measure(run));
  }

  return median(samples);
};

describe("route handler performance", () => {
  it("keeps better-og overhead small relative to renderer cost", async () => {
    const request = createRequest("https://example.com/og");
    const renderResponse = () => {
      busyWait(RENDER_COST_MS);

      return new Response("rendered");
    };
    const handler = createOgRouteHandler<string>({
      baseFonts: [createFont("Geist")],
      component: "rendered",
      renderer: () => renderResponse(),
      text: "rendered",
    });

    const rawRendererMedianMs = await sampleMedian(() => renderResponse());
    const wrappedHandlerMedianMs = await sampleMedian(
      async () => await handler(request)
    );
    const overheadMs = wrappedHandlerMedianMs - rawRendererMedianMs;
    const overheadRatio = divideOrZero(overheadMs, rawRendererMedianMs);

    console.info(
      [
        "better-og overhead",
        `raw=${rawRendererMedianMs.toFixed(2)}ms`,
        `wrapped=${wrappedHandlerMedianMs.toFixed(2)}ms`,
        `overhead=${overheadMs.toFixed(2)}ms`,
        `ratio=${(overheadRatio * 100).toFixed(1)}%`,
      ].join(" | ")
    );

    expect(overheadMs).toBeGreaterThanOrEqual(0);
    expect(overheadRatio).toBeLessThan(MAX_OVERHEAD_RATIO);
  });
});
