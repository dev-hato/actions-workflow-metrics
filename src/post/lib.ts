import { z } from "zod";
import { Renderer } from "./renderer";
import { metricsDataSchema, serverPort } from "../lib";
import type { components } from "@octokit/openapi-types";

const stepSchema = z.object({
  stepName: z.string().optional(),
  data: metricsDataSchema,
});
const stepsSchema = z.array(stepSchema);
export const metricsDataWithStepsSchema = metricsDataSchema.extend({
  steps: stepsSchema,
});
export const metricsInfoSchema = z.object({
  color: z.string(),
  name: z.string(),
});
export const metricsInfoListSchema = z.array(z.array(z.number()));
export const legendsSchema = z.array(metricsInfoSchema);
const renderDataSchema = z.object({
  metricsInfoList: metricsInfoListSchema,
  times: z.array(z.coerce.date()),
  yAxis: z.object({
    title: z.string(),
    range: z.string().optional(),
  }),
});
export const renderDataWithStepNameSchema = renderDataSchema.extend({
  stepName: z.string().optional(),
});
const renderDataWithStepNameListSchema = z.array(renderDataWithStepNameSchema);
export const renderParamsSchema = z.object({
  title: z.string(),
  legends: legendsSchema,
  data: renderDataWithStepNameListSchema,
});
export const renderParamsListSchema = z.array(renderParamsSchema);

export async function getMetricsData(
  jobs: components["schemas"]["job"][],
): Promise<z.TypeOf<typeof metricsDataWithStepsSchema>> {
  const controller: AbortController = new AbortController();
  const timer: Timer = setTimeout(() => controller.abort(), 10 * 1000); // 10 seconds
  try {
    const res: Response = await fetch(
      `http://localhost:${serverPort}/metrics`,
      {
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch metrics: ${res.status} ${res.statusText}`,
      );
    }

    const metricsData: z.TypeOf<typeof metricsDataSchema> =
      metricsDataSchema.parse(await res.json());
    return {
      ...metricsData,
      steps: (
        jobs.find(
          (j: components["schemas"]["job"]): boolean =>
            j.status === "in_progress" &&
            j.runner_name === process.env.RUNNER_NAME,
        )?.steps ?? []
      )
        .map((s): z.TypeOf<typeof stepSchema> => {
          const startMs: number | undefined =
            s.started_at == null ? undefined : new Date(s.started_at).getTime();
          const endMs: number | undefined =
            s.completed_at == null
              ? undefined
              : new Date(s.completed_at).getTime();
          const filter = ({ unixTimeMs }: { unixTimeMs: number }): boolean =>
            (startMs === undefined || startMs <= unixTimeMs) &&
            (endMs === undefined || unixTimeMs <= endMs);
          return {
            stepName: s.name,
            data: {
              cpuLoadPercentages: metricsData.cpuLoadPercentages.filter(filter),
              memoryUsageMBs: metricsData.memoryUsageMBs.filter(filter),
            },
          };
        })
        .filter(
          ({ data }: z.TypeOf<typeof stepSchema>): boolean =>
            data.cpuLoadPercentages.length > 0 &&
            data.memoryUsageMBs.length > 0,
        ),
    };
  } finally {
    clearTimeout(timer);
  }
}

function toRenderData(
  metricsData: z.TypeOf<typeof metricsDataWithStepsSchema>,
  mapper: (
    data: z.TypeOf<typeof metricsDataSchema>,
  ) => z.TypeOf<typeof renderDataSchema>,
): z.TypeOf<typeof renderDataWithStepNameListSchema> {
  const { cpuLoadPercentages, memoryUsageMBs } = metricsData;
  const steps: z.TypeOf<typeof stepsSchema> = [
    { data: { cpuLoadPercentages, memoryUsageMBs } },
    ...metricsData.steps,
  ];
  return steps.map(
    ({
      stepName,
      data,
    }: z.TypeOf<typeof stepSchema>): z.TypeOf<
      typeof renderDataWithStepNameSchema
    > => ({
      stepName,
      ...mapper(data),
    }),
  );
}

export function render(
  metricsData: z.TypeOf<typeof metricsDataWithStepsSchema>,
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
        data: toRenderData(
          metricsData,
          ({
            cpuLoadPercentages,
          }: z.TypeOf<typeof metricsDataSchema>): z.TypeOf<
            typeof renderDataSchema
          > => ({
            metricsInfoList: [
              cpuLoadPercentages.map(
                ({ system }: { system: number }): number => system,
              ),
              cpuLoadPercentages.map(
                ({ user }: { user: number }): number => user,
              ),
            ],
            times: cpuLoadPercentages.map(
              ({ unixTimeMs }: { unixTimeMs: number }): Date =>
                new Date(unixTimeMs),
            ),
            yAxis: {
              title: "%",
              range: "0 --> 100",
            },
          }),
        ),
      },
      {
        title: "Memory Usages",
        legends: [
          {
            color: "Green",
            name: "Free",
          },
          {
            color: "Blue",
            name: "Used",
          },
        ],
        data: toRenderData(
          metricsData,
          ({
            memoryUsageMBs,
          }: z.TypeOf<typeof metricsDataSchema>): z.TypeOf<
            typeof renderDataSchema
          > => ({
            metricsInfoList: [
              memoryUsageMBs.map(({ free }: { free: number }): number => free),
              memoryUsageMBs.map(({ used }: { used: number }): number => used),
            ],
            times: memoryUsageMBs.map(
              ({ unixTimeMs }: { unixTimeMs: number }): Date =>
                new Date(unixTimeMs),
            ),
            yAxis: {
              title: "MB",
            },
          }),
        ),
      },
    ]),
    metricsID,
  );
}
