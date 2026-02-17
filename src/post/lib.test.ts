import { describe, expect, it, beforeEach, mock } from "bun:test";
import { getMetricsData, render } from "./lib";
import type { components } from "@octokit/openapi-types";
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

describe("getMetricsData", () => {
  const runnerName: string = "test-runner";
  const createJob = (
    overrides: Partial<components["schemas"]["job"]>,
  ): components["schemas"]["job"] =>
    ({
      id: 1,
      run_id: 1,
      status: "in_progress",
      runner_name: runnerName,
      steps: [],
      ...overrides,
    }) as components["schemas"]["job"];

  const buildStep = {
    name: "Build",
    status: "completed" as const,
    conclusion: "success",
    number: 1,
    started_at: "2024-01-01T00:00:00.000Z",
    completed_at: "2024-01-01T00:00:05.000Z",
  };
  const expectOnlyFirstDataPoint = (
    result: z.TypeOf<typeof metricsDataWithStepsSchema>,
  ) => {
    expect(result.steps[0].data.cpuLoadPercentages).toEqual([
      sampleMetricsData.cpuLoadPercentages[0],
    ]);
    expect(result.steps[0].data.memoryUsageMBs).toEqual([
      sampleMetricsData.memoryUsageMBs[0],
    ]);
  };

  beforeEach(() => {
    mock.restore();
    process.env.RUNNER_NAME = runnerName;
  });

  it("should fetch metrics data from server", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    expect(await getMetricsData([])).toEqual({
      ...sampleMetricsData,
      steps: [],
    });
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

    expect(getMetricsData([])).rejects.toThrow();
  });

  it("should throw error when fetch fails", async () => {
    globalThis.fetch = mock(() =>
      Promise.reject(new Error("Network error")),
    ) as unknown as typeof fetch;

    expect(getMetricsData([])).rejects.toThrow("Network error");
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

    expect(getMetricsData([])).rejects.toThrow("Failed to fetch metrics");
  });

  it("should return steps with filtered metrics for matching job", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result: z.TypeOf<typeof metricsDataWithStepsSchema> =
      await getMetricsData([
        createJob({
          steps: [{ ...buildStep, completed_at: "2024-01-01T00:00:02.000Z" }],
        }),
      ]);

    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].stepName).toBe("Build");
    expectOnlyFirstDataPoint(result);
  });

  it("should return empty steps when no job matches RUNNER_NAME", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result: z.TypeOf<typeof metricsDataWithStepsSchema> =
      await getMetricsData([createJob({ runner_name: "other-runner" })]);

    expect(result.steps).toEqual([]);
  });

  it("should return empty steps when no job is in_progress", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result: z.TypeOf<typeof metricsDataWithStepsSchema> =
      await getMetricsData([
        createJob({
          status: "completed",
          steps: [
            {
              name: "Build",
              status: "completed",
              conclusion: "success",
              number: 1,
              started_at: "2024-01-01T00:00:00.000Z",
              completed_at: "2024-01-01T00:00:05.000Z",
            },
          ],
        }),
      ]);

    expect(result.steps).toEqual([]);
  });

  it("should filter out steps with empty metrics", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result: z.TypeOf<typeof metricsDataWithStepsSchema> =
      await getMetricsData([
        createJob({
          steps: [
            buildStep,
            {
              name: "No Data",
              status: "completed",
              conclusion: "success",
              number: 2,
              started_at: "2025-01-01T00:00:00.000Z",
              completed_at: "2025-01-01T00:00:05.000Z",
            },
          ],
        }),
      ]);

    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].stepName).toBe("Build");
  });

  it("should return empty steps when matching job has no steps", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result: z.TypeOf<typeof metricsDataWithStepsSchema> =
      await getMetricsData([createJob({})]);

    expect(result.steps).toEqual([]);
  });

  it("should include all metrics when step has null time bounds", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result: z.TypeOf<typeof metricsDataWithStepsSchema> =
      await getMetricsData([
        createJob({
          steps: [
            {
              name: "Unbounded",
              status: "in_progress",
              conclusion: null,
              number: 1,
              started_at: null,
              completed_at: null,
            },
          ],
        }),
      ]);

    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].data.cpuLoadPercentages).toEqual(
      sampleMetricsData.cpuLoadPercentages,
    );
    expect(result.steps[0].data.memoryUsageMBs).toEqual(
      sampleMetricsData.memoryUsageMBs,
    );
  });

  it("should filter with only started_at", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result: z.TypeOf<typeof metricsDataWithStepsSchema> =
      await getMetricsData([
        createJob({
          steps: [
            {
              name: "Started Only",
              status: "in_progress",
              conclusion: null,
              number: 1,
              started_at: "2024-01-01T00:00:03.000Z",
              completed_at: null,
            },
          ],
        }),
      ]);

    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].data.cpuLoadPercentages).toEqual([
      sampleMetricsData.cpuLoadPercentages[1],
    ]);
    expect(result.steps[0].data.memoryUsageMBs).toEqual([
      sampleMetricsData.memoryUsageMBs[1],
    ]);
  });

  it("should filter with only completed_at", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result: z.TypeOf<typeof metricsDataWithStepsSchema> =
      await getMetricsData([
        createJob({
          steps: [
            {
              name: "Completed Only",
              status: "completed",
              conclusion: "success",
              number: 1,
              started_at: null,
              completed_at: "2024-01-01T00:00:02.000Z",
            },
          ],
        }),
      ]);

    expect(result.steps).toHaveLength(1);
    expectOnlyFirstDataPoint(result);
  });

  it("should handle multiple jobs and select the correct one", async () => {
    globalThis.fetch = createMockFetch(sampleMetricsData);

    const result: z.TypeOf<typeof metricsDataWithStepsSchema> =
      await getMetricsData([
        createJob({
          id: 1,
          status: "completed",
          runner_name: runnerName,
          steps: [
            {
              name: "Wrong Job",
              status: "completed",
              conclusion: "success",
              number: 1,
              started_at: "2024-01-01T00:00:00.000Z",
              completed_at: "2024-01-01T00:00:05.000Z",
            },
          ],
        }),
        createJob({
          id: 2,
          status: "in_progress",
          runner_name: runnerName,
          steps: [
            {
              name: "Correct Job Step",
              status: "completed",
              conclusion: "success",
              number: 1,
              started_at: "2024-01-01T00:00:00.000Z",
              completed_at: "2024-01-01T00:00:05.000Z",
            },
          ],
        }),
      ]);

    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].stepName).toBe("Correct Job Step");
  });
});
