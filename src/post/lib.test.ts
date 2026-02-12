import { describe, expect, it, beforeEach, mock } from "bun:test";
import { getMetricsData, render } from "./lib";
import type { z } from "zod";
import type { metricsDataWithStepMapSchema } from "./lib";
import type { metricsDataSchema } from "../lib";

/**
 * Sample metrics data for testing (base data without stepMap).
 */
const sampleMetricsData: z.TypeOf<typeof metricsDataSchema> = {
  cpuLoadPercentages: [
    { unixTimeMs: 1704067200000, user: 25.5, system: 10.3 },
    { unixTimeMs: 1704067205000, user: 30.2, system: 12.1 },
    { unixTimeMs: 1704067210000, user: 35.2, system: 14.1 },
  ],
  memoryUsageMBs: [
    { unixTimeMs: 1704067200000, used: 4096, free: 8192 },
    { unixTimeMs: 1704067205000, used: 4200, free: 8000 },
    { unixTimeMs: 1704067210000, used: 4304, free: 7808 },
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
        stepMap: new Map([
          [
            "Build",
            {
              cpuLoadPercentages: [
                { unixTimeMs: 1704067200000, user: 40.0, system: 20.0 },
                { unixTimeMs: 1704067205000, user: 45.0, system: 22.0 },
              ],
              memoryUsageMBs: [
                { unixTimeMs: 1704067200000, used: 6000, free: 6192 },
                { unixTimeMs: 1704067205000, used: 6200, free: 6000 },
              ],
            },
          ],
        ]),
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

  it("should render only All charts when stepMap is empty", () => {
    const result: string = render(
      {
        ...sampleMetricsData,
        stepMap: new Map(),
      },
      testMetricsID,
    );

    expect(result).toContain("### CPU Loads");
    expect(result).toContain("### Memory Usages");
    expect(result).toContain("#### All");
  });

  it("should handle empty metrics data", () => {
    const metricsData: z.TypeOf<typeof metricsDataWithStepMapSchema> = {
      cpuLoadPercentages: [],
      memoryUsageMBs: [],
      stepMap: new Map(),
    };

    const result: string = render(metricsData, testMetricsID);

    // Empty data results in empty string (no charts to render)
    expect(typeof result).toBe("string");
  });

  it("should correctly map CPU load percentages", () => {
    const metricsData: z.TypeOf<typeof metricsDataWithStepMapSchema> = {
      cpuLoadPercentages: [
        { unixTimeMs: 1704067200000, user: 20, system: 10 },
        { unixTimeMs: 1704067205000, user: 25, system: 15 },
      ],
      memoryUsageMBs: [
        { unixTimeMs: 1704067200000, used: 4000, free: 8000 },
        { unixTimeMs: 1704067205000, used: 4100, free: 7900 },
      ],
      stepMap: new Map(),
    };

    const result: string = render(metricsData, testMetricsID);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should correctly map memory usage data", () => {
    const metricsData: z.TypeOf<typeof metricsDataWithStepMapSchema> = {
      cpuLoadPercentages: [{ unixTimeMs: 1704067200000, user: 20, system: 10 }],
      memoryUsageMBs: [
        { unixTimeMs: 1704067200000, used: 5000, free: 10000 },
        { unixTimeMs: 1704067205000, used: 5500, free: 9500 },
      ],
      stepMap: new Map(),
    };

    const result: string = render(metricsData, testMetricsID);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("getMetricsData", () => {
  beforeEach(() => mock.restore());

  it("should fetch metrics data from server", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result = await getMetricsData();

    expect(result).toEqual({ ...sampleMetricsData, stepMap: new Map() });
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
