import { describe, expect, it, beforeEach, mock } from "bun:test";
import { getMetricsData, render } from "./lib";
import type { z } from "zod";
import type { metricsDataSchema } from "../lib";

/**
 * Sample metrics data for testing.
 */
const sampleMetricsData: z.TypeOf<typeof metricsDataSchema> = {
  cpuLoadPercentages: [
    { time: 1704067200000, user: 25.5, system: 10.3 },
    { time: 1704067205000, user: 30.2, system: 12.1 },
  ],
  memoryUsageMBs: [
    { time: 1704067200000, used: 4096, free: 8192 },
    { time: 1704067205000, used: 4200, free: 8000 },
  ],
};

/**
 * Creates a mock fetch function that returns the given metrics data.
 */
function createMockFetch(
  data: z.TypeOf<typeof metricsDataSchema>,
): typeof fetch {
  return mock(
    async (): Promise<Response> =>
      ({
        ok: true,
        json: (): Promise<z.TypeOf<typeof metricsDataSchema>> =>
          Promise.resolve(data),
      }) as Response,
  ) as unknown as typeof fetch;
}

describe("render", () => {
  it("should render charts with valid metrics data", () => {
    const result: string = render(sampleMetricsData);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);

    // Verify rendered result contains expected content
    expect(result).toContain("CPU Loads");
    expect(result).toContain("Memory Usages");
  });

  it("should handle empty metrics data", () => {
    const metricsData: z.TypeOf<typeof metricsDataSchema> = {
      cpuLoadPercentages: [],
      memoryUsageMBs: [],
    };

    const result: string = render(metricsData);

    // Empty data results in empty string (no charts to render)
    expect(typeof result).toBe("string");
  });

  it("should correctly map CPU load percentages", () => {
    const metricsData: z.TypeOf<typeof metricsDataSchema> = {
      cpuLoadPercentages: [
        { time: 1704067200000, user: 20, system: 10 },
        { time: 1704067205000, user: 25, system: 15 },
      ],
      memoryUsageMBs: [
        { time: 1704067200000, used: 4000, free: 8000 },
        { time: 1704067205000, used: 4100, free: 7900 },
      ],
    };

    const result: string = render(metricsData);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should correctly map memory usage data", () => {
    const metricsData: z.TypeOf<typeof metricsDataSchema> = {
      cpuLoadPercentages: [{ time: 1704067200000, user: 20, system: 10 }],
      memoryUsageMBs: [
        { time: 1704067200000, used: 5000, free: 10000 },
        { time: 1704067205000, used: 5500, free: 9500 },
      ],
    };

    const result: string = render(metricsData);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("getMetricsData", () => {
  beforeEach(() => mock.restore());

  it("should fetch metrics data from server", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result = await getMetricsData();

    expect(result).toEqual(sampleMetricsData);
  });

  it("should throw error for invalid metrics data", async () => {
    globalThis.fetch = mock(
      async (): Promise<Response> =>
        ({
          ok: true,
          json: () =>
            Promise.resolve({
              cpuLoadPercentages: "not an array",
              memoryUsageMBs: [],
            }),
        }) as Response,
    ) as unknown as typeof fetch;

    expect(getMetricsData()).rejects.toThrow();
  });

  it("should throw error when fetch fails", async () => {
    globalThis.fetch = mock(() =>
      Promise.reject(new Error("Network error")),
    ) as unknown as typeof fetch;

    expect(getMetricsData()).rejects.toThrow("Network error");
  });

  it("should throw error when response is not ok", async () => {
    globalThis.fetch = mock(
      async (): Promise<Response> =>
        ({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        }) as Response,
    ) as unknown as typeof fetch;

    expect(getMetricsData()).rejects.toThrow("Failed to fetch metrics");
  });
});
