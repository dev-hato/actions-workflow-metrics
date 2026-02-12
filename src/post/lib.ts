import { z } from "zod";
import { Renderer } from "./renderer";
import {
  cpuLoadPercentagesSchema,
  memoryUsageMBsSchema,
  metricsDataSchema,
  serverPort,
} from "../lib";

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
export const metricsDataWithStepMapSchema = metricsDataSchema.extend({
  stepMap: z.map(z.string(), metricsDataSchema),
});

export async function getMetricsData(): Promise<
  z.TypeOf<typeof metricsDataSchema>
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

    return metricsDataSchema.parse(await res.json());
  } finally {
    clearTimeout(timer);
  }
}

export function render(
  metricsData: z.TypeOf<typeof metricsDataWithStepMapSchema>,
  metricsID: string,
): string {
  const stepMetricsDataEntries: [string, z.TypeOf<typeof metricsDataSchema>][] =
    Array.from(metricsData.stepMap.entries());
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
          [undefined, metricsData.cpuLoadPercentages],
          ...stepMetricsDataEntries.map(
            ([stepName, { cpuLoadPercentages }]: [
              string,
              z.TypeOf<typeof metricsDataSchema>,
            ]): [string, z.TypeOf<typeof cpuLoadPercentagesSchema>] => [
              stepName,
              cpuLoadPercentages,
            ],
          ),
        ]
          .filter(
            ([_, c]: [
              string | undefined,
              z.TypeOf<typeof cpuLoadPercentagesSchema>,
            ]): boolean => 0 < c.length,
          )
          .map(
            ([stepName, c]: [
              string | undefined,
              z.TypeOf<typeof cpuLoadPercentagesSchema>,
            ]): z.TypeOf<typeof renderDataSchema> => ({
              stepName,
              metricsInfoList: [
                c.map(({ system }: { system: number }): number => system),
                c.map(({ user }: { user: number }): number => user),
              ],
              times: c.map(
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
          [undefined, metricsData.memoryUsageMBs],
          ...stepMetricsDataEntries.map(
            ([stepName, { memoryUsageMBs }]: [
              string,
              z.TypeOf<typeof metricsDataSchema>,
            ]): [string, z.TypeOf<typeof memoryUsageMBsSchema>] => [
              stepName,
              memoryUsageMBs,
            ],
          ),
        ]
          .filter(
            ([_, m]: [
              string | undefined,
              z.TypeOf<typeof memoryUsageMBsSchema>,
            ]): boolean => 0 < m.length,
          )
          .map(
            ([stepName, m]: [
              string | undefined,
              z.TypeOf<typeof memoryUsageMBsSchema>,
            ]): z.TypeOf<typeof renderDataSchema> => ({
              stepName,
              metricsInfoList: [
                m.map(({ free }: { free: number }): number => free),
                m.map(({ used }: { used: number }): number => used),
              ],
              times: m.map(
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
