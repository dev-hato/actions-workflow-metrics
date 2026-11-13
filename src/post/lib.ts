import { promises as fs } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { Renderer } from "./renderer";
import { serverHost, serverPort } from "../lib";
import { metricsDataSchema } from "../type";
import type { components } from "@octokit/openapi-types";
import type {
  cpuLoadPercentageSchema,
  memoryUsageMBSchema,
  unixTimeMsSchema,
} from "../type";

type GitHubJobStep = {
  name: string;
  started_at?: string | null;
  completed_at?: string | null;
};

// Location of the metrics file written for artifact upload
export type MetricsFile = { rootDirectory: string; fileName: string };

export const legendSchema = z.object({
  color: z.string(),
  name: z.string(),
});
export const stackedBarDataSchema = z.array(z.array(z.number()));
export const legendsSchema = z.array(legendSchema);
export const timesSchema = z.array(z.coerce.date());
const baseChartParamsSchema = z.object({
  stackedBarData: stackedBarDataSchema,
  times: timesSchema,
  yAxis: z.object({
    title: z.string(),
    range: z.string().optional(),
  }),
});
export const chartParamsSchema = baseChartParamsSchema.extend({
  stepName: z.string().optional(),
});
const chartParamsListSchema = z.array(chartParamsSchema);
export const renderParamsSchema = z.object({
  title: z.string(),
  legends: legendsSchema,
  data: chartParamsListSchema,
});
export const renderParamsListSchema = z.array(renderParamsSchema);
const stepSchema = z.object({
  stepName: z.string().optional(),
  data: metricsDataSchema,
});
const stepsSchema = z.array(stepSchema);
export const metricsDataWithStepsSchema = metricsDataSchema.extend({
  steps: stepsSchema,
});

function isCurrentRunnerJob(job: components["schemas"]["job"]): boolean {
  return (
    job.status === "in_progress" && job.runner_name === process.env.RUNNER_NAME
  );
}

function filter(unixTimeMs: number, workflowStep: GitHubJobStep): boolean {
  const startMs: number | undefined =
    workflowStep.started_at == null
      ? undefined
      : new Date(workflowStep.started_at).getTime();
  const endMs: number | undefined =
    workflowStep.completed_at == null
      ? undefined
      : new Date(workflowStep.completed_at).getTime();
  return (
    (startMs === undefined || startMs <= unixTimeMs) &&
    (endMs === undefined || unixTimeMs <= endMs)
  );
}

function filterMetricsByStep(
  workflowStep: GitHubJobStep,
  metricsData: z.output<typeof metricsDataSchema>,
): z.output<typeof stepSchema> {
  return {
    stepName: workflowStep.name,
    data: {
      cpuLoadPercentages: metricsData.cpuLoadPercentages.filter(
        ({ unixTimeMs }: z.output<typeof unixTimeMsSchema>): boolean =>
          filter(unixTimeMs, workflowStep),
      ),
      memoryUsageMBs: metricsData.memoryUsageMBs.filter(
        ({ unixTimeMs }: z.output<typeof unixTimeMsSchema>): boolean =>
          filter(unixTimeMs, workflowStep),
      ),
    },
  };
}

function hasMetricsData({ data }: z.output<typeof stepSchema>): boolean {
  return data.cpuLoadPercentages.length > 0 && data.memoryUsageMBs.length > 0;
}

export async function getMetricsData(
  jobs: components["schemas"]["job"][],
): Promise<z.output<typeof metricsDataWithStepsSchema>> {
  const controller: AbortController = new AbortController();
  const timer: Timer = setTimeout(() => controller.abort(), 10 * 1000); // 10 seconds
  try {
    const res: Response = await fetch(
      `http://${serverHost}:${serverPort}/metrics`,
      {
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch metrics: ${res.status} ${res.statusText}`,
      );
    }

    const metricsData: z.output<typeof metricsDataSchema> =
      metricsDataSchema.parse(await res.json());
    return {
      ...metricsData,
      steps: (jobs.find(isCurrentRunnerJob)?.steps ?? [])
        .map((s: GitHubJobStep): z.output<typeof stepSchema> =>
          filterMetricsByStep(s, metricsData),
        )
        .filter(hasMetricsData),
    };
  } finally {
    clearTimeout(timer);
  }
}

function toDate({ unixTimeMs }: z.output<typeof unixTimeMsSchema>): Date {
  return new Date(unixTimeMs);
}

function toChartParams(
  step: z.output<typeof stepSchema>,
  mapper: (
    d: z.output<typeof metricsDataSchema>,
  ) => z.output<typeof baseChartParamsSchema>,
): z.output<typeof chartParamsSchema> {
  return {
    stepName: step.stepName,
    ...mapper(step.data),
  };
}

function toRenderData(
  metricsData: z.output<typeof metricsDataWithStepsSchema>,
  mapper: (
    d: z.output<typeof metricsDataSchema>,
  ) => z.output<typeof baseChartParamsSchema>,
): z.output<typeof chartParamsListSchema> {
  const steps: z.output<typeof stepsSchema> = [
    {
      data: {
        cpuLoadPercentages: metricsData.cpuLoadPercentages,
        memoryUsageMBs: metricsData.memoryUsageMBs,
      },
    },
    ...metricsData.steps,
  ];
  return steps.map(
    (s: z.output<typeof stepSchema>): z.output<typeof chartParamsSchema> =>
      toChartParams(s, mapper),
  );
}

function mapCpuLoadToChartParams({
  cpuLoadPercentages,
}: z.output<typeof metricsDataSchema>): z.output<typeof baseChartParamsSchema> {
  return {
    stackedBarData: [
      cpuLoadPercentages.map(
        ({ system }: z.output<typeof cpuLoadPercentageSchema>): number =>
          system,
      ),
      cpuLoadPercentages.map(
        ({ user }: z.output<typeof cpuLoadPercentageSchema>): number => user,
      ),
    ],
    times: cpuLoadPercentages.map(toDate),
    yAxis: {
      title: "%",
      range: "0 --> 100",
    },
  };
}

function mapMemoryUsageToChartParams({
  memoryUsageMBs,
}: z.output<typeof metricsDataSchema>): z.output<typeof baseChartParamsSchema> {
  return {
    stackedBarData: [
      memoryUsageMBs.map(
        ({ free }: z.output<typeof memoryUsageMBSchema>): number => free,
      ),
      memoryUsageMBs.map(
        ({ used }: z.output<typeof memoryUsageMBSchema>): number => used,
      ),
    ],
    times: memoryUsageMBs.map(toDate),
    yAxis: {
      title: "MB",
    },
  };
}

export function render(
  metricsData: z.output<typeof metricsDataWithStepsSchema>,
  metricsID: string,
): string {
  const renderer: Renderer = new Renderer();
  return renderer.render(
    renderParamsListSchema.parse([
      {
        title: "CPU Loads",
        legends: [
          {
            color: "Orange",
            name: "System",
          },
          {
            color: "Red",
            name: "User",
          },
        ],
        data: toRenderData(metricsData, mapCpuLoadToChartParams),
      },
      {
        title: "Memory Usages",
        legends: [
          {
            color: "Green",
            name: "Free",
          },
          {
            color: "#4da0ff",
            name: "Used",
          },
        ],
        data: toRenderData(metricsData, mapMemoryUsageToChartParams),
      },
    ]),
    metricsID,
  );
}

// Write to a fresh temporary directory instead of the workspace,
// so a file or symlink planted in the checked-out repository cannot be overwritten
export async function writeMetricsFile({
  metricsData,
  fileBaseName,
  tempDirectory,
}: {
  metricsData: z.output<typeof metricsDataWithStepsSchema>;
  fileBaseName: string;
  tempDirectory: string;
}): Promise<MetricsFile> {
  const rootDirectory: string = await fs.mkdtemp(
    join(tempDirectory, `${fileBaseName}_`),
  );
  const fileName: string = join(rootDirectory, `${fileBaseName}.json`);
  await fs.writeFile(fileName, JSON.stringify(metricsData), { flag: "wx" });
  return { rootDirectory, fileName };
}
