import { describe, expect, it, beforeEach, mock } from "bun:test";
import { filterStepMetrics, getMetricsData, render } from "./lib";
import type { z } from "zod";
import type { metricsDataWithStepsSchema } from "./lib";
import type { metricsDataSchema } from "../lib";

/**
 * Sample metrics data for testing.
 */
const sampleMetricsData: z.TypeOf<typeof metricsDataSchema> = {
  cpuLoadPercentages: [
    { unixTimeMs: 1704067200000, user: 25.5, system: 10.3 },
    { unixTimeMs: 1704067205000, user: 30.2, system: 12.1 },
  ],
  memoryUsageMBs: [
    { unixTimeMs: 1704067200000, used: 4096, free: 8192 },
    { unixTimeMs: 1704067205000, used: 4200, free: 8000 },
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
  const testMetricsID: string = "1234567890";

  it("should render charts with valid metrics data including step charts", () => {
    const result: string = render(
      {
        ...sampleMetricsData,
        steps: [
          {
            stepName: "Build",
            data: {
              cpuLoadPercentages: [
                { unixTimeMs: 1704067200000, user: 40.0, system: 20.0 },
                { unixTimeMs: 1704067205000, user: 45.0, system: 22.0 },
              ],
              memoryUsageMBs: [
                { unixTimeMs: 1704067200000, used: 6000, free: 6192 },
                { unixTimeMs: 1704067205000, used: 6200, free: 6000 },
              ],
            },
          },
        ],
      },
      testMetricsID,
    );

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);

    // Verify section titles
    expect(result).toContain("### CPU Loads");
    expect(result).toContain("### Memory Usages");

    // Verify "All" and step-specific charts
    expect(result).toContain("#### All");
    expect(result).toContain("#### Step `Build`");
  });

  it("should render only All charts when steps is empty", () => {
    const result: string = render(
      {
        ...sampleMetricsData,
        steps: [],
      },
      testMetricsID,
    );

    expect(result).toContain("### CPU Loads");
    expect(result).toContain("### Memory Usages");
    expect(result).toContain("#### All");
  });

  it("should handle empty metrics data", () => {
    const metricsData: z.TypeOf<typeof metricsDataWithStepsSchema> = {
      cpuLoadPercentages: [],
      memoryUsageMBs: [],
      steps: [],
    };

    const result: string = render(metricsData, testMetricsID);

    // Empty data results in empty string (no charts to render)
    expect(typeof result).toBe("string");
  });

  it("should correctly map CPU load percentages", () => {
    const metricsData: z.TypeOf<typeof metricsDataWithStepsSchema> = {
      cpuLoadPercentages: [
        { unixTimeMs: 1704067200000, user: 20, system: 10 },
        { unixTimeMs: 1704067205000, user: 25, system: 15 },
      ],
      memoryUsageMBs: [
        { unixTimeMs: 1704067200000, used: 4000, free: 8000 },
        { unixTimeMs: 1704067205000, used: 4100, free: 7900 },
      ],
      steps: [],
    };

    const result: string = render(metricsData, testMetricsID);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should correctly map memory usage data", () => {
    const metricsData: z.TypeOf<typeof metricsDataWithStepsSchema> = {
      cpuLoadPercentages: [{ unixTimeMs: 1704067200000, user: 20, system: 10 }],
      memoryUsageMBs: [
        { unixTimeMs: 1704067200000, used: 5000, free: 10000 },
        { unixTimeMs: 1704067205000, used: 5500, free: 9500 },
      ],
      steps: [],
    };

    const result: string = render(metricsData, testMetricsID);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("filterStepMetrics", () => {
  it("should filter metrics within the given time range", () => {
    const result: z.TypeOf<typeof metricsDataSchema> = filterStepMetrics(
      sampleMetricsData,
      "2024-01-01T00:00:00.000Z",
      "2024-01-01T00:00:02.000Z",
    );

    expect(result.cpuLoadPercentages).toEqual([
      { unixTimeMs: 1704067200000, user: 25.5, system: 10.3 },
    ]);
    expect(result.memoryUsageMBs).toEqual([
      { unixTimeMs: 1704067200000, used: 4096, free: 8192 },
    ]);
  });

  it("should return all metrics when both bounds are null", () => {
    const result: z.TypeOf<typeof metricsDataSchema> = filterStepMetrics(
      sampleMetricsData,
      null,
      null,
    );

    expect(result.cpuLoadPercentages).toEqual(
      sampleMetricsData.cpuLoadPercentages,
    );
    expect(result.memoryUsageMBs).toEqual(sampleMetricsData.memoryUsageMBs);
  });

  it("should return all metrics when both bounds are undefined", () => {
    const result: z.TypeOf<typeof metricsDataSchema> = filterStepMetrics(
      sampleMetricsData,
      undefined,
      undefined,
    );

    expect(result.cpuLoadPercentages).toEqual(
      sampleMetricsData.cpuLoadPercentages,
    );
    expect(result.memoryUsageMBs).toEqual(sampleMetricsData.memoryUsageMBs);
  });

  it("should filter with only startedAt", () => {
    const result: z.TypeOf<typeof metricsDataSchema> = filterStepMetrics(
      sampleMetricsData,
      "2024-01-01T00:00:03.000Z",
      null,
    );

    expect(result.cpuLoadPercentages).toEqual([
      { unixTimeMs: 1704067205000, user: 30.2, system: 12.1 },
    ]);
    expect(result.memoryUsageMBs).toEqual([
      { unixTimeMs: 1704067205000, used: 4200, free: 8000 },
    ]);
  });

  it("should filter with only completedAt", () => {
    const result: z.TypeOf<typeof metricsDataSchema> = filterStepMetrics(
      sampleMetricsData,
      null,
      "2024-01-01T00:00:02.000Z",
    );

    expect(result.cpuLoadPercentages).toEqual([
      { unixTimeMs: 1704067200000, user: 25.5, system: 10.3 },
    ]);
    expect(result.memoryUsageMBs).toEqual([
      { unixTimeMs: 1704067200000, used: 4096, free: 8192 },
    ]);
  });

  it("should return empty arrays when no metrics match", () => {
    const result: z.TypeOf<typeof metricsDataSchema> = filterStepMetrics(
      sampleMetricsData,
      "2025-01-01T00:00:00.000Z",
      "2025-01-01T00:00:05.000Z",
    );

    expect(result.cpuLoadPercentages).toEqual([]);
    expect(result.memoryUsageMBs).toEqual([]);
  });
});

describe("getMetricsData", () => {
  beforeEach(() => mock.restore());

  it("should fetch metrics data from server", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result = await getMetricsData();

    expect(result).toEqual({ ...sampleMetricsData, steps: [] });
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
