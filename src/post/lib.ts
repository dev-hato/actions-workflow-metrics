import { z } from "zod";
import { Renderer } from "./renderer";
import {
  cpuLoadPercentagesSchema,
  memoryUsageMBsSchema,
  metricsDataSchema,
  serverPort,
} from "../lib";

export const metricsInfoSchema = z.object({
  color: z.string(),
  name: z.string(),
  data: z.array(z.number()),
});
export const metricsInfoListSchema = z.array(metricsInfoSchema);
export const renderDataSchema = z.object({
  stepName: z.string(),
  metricsInfoList: metricsInfoListSchema,
  times: z.array(z.coerce.date()),
  yAxis: z.object({
    title: z.string(),
    range: z.string().optional(),
  }),
});
export const renderParamsSchema = z.object({
  title: z.string(),
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
        data: [["All", metricsData.cpuLoadPercentages]]
          .concat(
            stepMetricsDataEntries.map(
              ([stepName, { cpuLoadPercentages }]: [
                string,
                z.TypeOf<typeof metricsDataSchema>,
              ]): [string, z.TypeOf<typeof cpuLoadPercentagesSchema>] => [
                stepName,
                cpuLoadPercentages,
              ],
            ),
          )
          .filter(
            ([_, c]: [
              string,
              z.TypeOf<typeof cpuLoadPercentagesSchema>,
            ]): boolean => 0 < c.length,
          )
          .map(
            ([stepName, c]: [
              string,
              z.TypeOf<typeof cpuLoadPercentagesSchema>,
            ]): z.TypeOf<typeof renderDataSchema> => ({
              stepName,
              metricsInfoList: [
                {
                  color: "Orange",
                  name: "System",
                  data: c.map(
                    ({ system }: { system: number }): number => system,
                  ),
                },
                {
                  color: "Red",
                  name: "User",
                  data: c.map(({ user }: { user: number }): number => user),
                },
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
        data: [["All", metricsData.memoryUsageMBs]]
          .concat(
            stepMetricsDataEntries.map(
              ([stepName, { memoryUsageMBs }]: [
                string,
                z.TypeOf<typeof metricsDataSchema>,
              ]): [string, z.TypeOf<typeof memoryUsageMBsSchema>] => [
                stepName,
                memoryUsageMBs,
              ],
            ),
          )
          .filter(
            ([_, m]: [
              string,
              z.TypeOf<typeof memoryUsageMBsSchema>,
            ]): boolean => 0 < m.length,
          )
          .map(
            ([stepName, m]: [
              string,
              z.TypeOf<typeof memoryUsageMBsSchema>,
            ]): z.TypeOf<typeof renderDataSchema> => ({
              stepName,
              metricsInfoList: [
                {
                  color: "Green",
                  name: "Free",
                  data: m.map(({ free }: { free: number }): number => free),
                },
                {
                  color: "Blue",
                  name: "Used",
                  data: m.map(({ used }: { used: number }): number => used),
                },
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
