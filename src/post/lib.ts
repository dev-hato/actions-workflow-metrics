import { z } from "zod";
import { Renderer } from "./renderer";
import { metricsDataSchema, serverPort } from "../lib";

export const metricsInfoListSchema = z.array(z.array(z.number()));
export const renderDataSchema = z.object({
  stepName: z.string().optional(),
  metricsInfoList: metricsInfoListSchema,
  times: z.array(z.coerce.date()),
  yAxis: z.object({
    title: z.string(),
    range: z.string().optional(),
  }),
});
export const metricsInfoSchema = z.object({
  color: z.string(),
  name: z.string(),
});
export const renderParamsSchema = z.object({
  title: z.string(),
  legends: z.array(metricsInfoSchema),
  data: z.array(renderDataSchema),
});
export const renderParamsListSchema = z.array(renderParamsSchema);
const stepMapSchema = z.object({
  stepName: z.string().optional(),
  data: metricsDataSchema,
});
export const metricsDataWithStepMapSchema = metricsDataSchema.extend({
  stepMap: z.array(stepMapSchema),
});

export async function getMetricsData(): Promise<
  z.TypeOf<typeof metricsDataWithStepMapSchema>
> {
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

    return { ...metricsDataSchema.parse(await res.json()), stepMap: [] };
  } finally {
    clearTimeout(timer);
  }
}

export function render(
  metricsData: z.TypeOf<typeof metricsDataWithStepMapSchema>,
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
        data: [
          { stepName: undefined, data: metricsData },
          ...metricsData.stepMap,
        ].map(
          ({
            stepName,
            data,
          }: z.TypeOf<typeof stepMapSchema>): z.TypeOf<
            typeof renderDataSchema
          > => ({
            stepName,
            metricsInfoList: [
              data.cpuLoadPercentages.map(
                ({ system }: { system: number }): number => system,
              ),
              data.cpuLoadPercentages.map(
                ({ user }: { user: number }): number => user,
              ),
            ],
            times: data.cpuLoadPercentages.map(
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
        data: [
          { stepName: undefined, data: metricsData },
          ...metricsData.stepMap,
        ].map(
          ({
            stepName,
            data,
          }: z.TypeOf<typeof stepMapSchema>): z.TypeOf<
            typeof renderDataSchema
          > => ({
            stepName,
            metricsInfoList: [
              data.memoryUsageMBs.map(
                ({ free }: { free: number }): number => free,
              ),
              data.memoryUsageMBs.map(
                ({ used }: { used: number }): number => used,
              ),
            ],
            times: data.memoryUsageMBs.map(
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
