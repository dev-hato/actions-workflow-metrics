import { z } from "zod";
import { Renderer } from "./renderer";
import { metricsDataSchema, serverPort } from "../lib";

export const metricsInfoSchema = z.object({
  color: z.string(),
  name: z.string(),
  data: z.array(z.number()),
});
export const metricsInfoListSchema = z.array(metricsInfoSchema);
export const timesSchema = z.array(z.coerce.date());
export const renderParamsSchema = z.object({
  title: z.string(),
  metricsInfoList: metricsInfoListSchema,
  times: timesSchema,
  yAxis: z.object({
    title: z.string(),
    range: z.string().optional(),
  }),
});
export const renderParamsListSchema = z.array(renderParamsSchema);

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
  metricsData: z.TypeOf<typeof metricsDataSchema>,
  metricsID: string,
): string {
  const renderer: Renderer = new Renderer();
  return renderer.render(
    renderParamsListSchema.parse([
      {
        title: "CPU Loads",
        metricsInfoList: [
          {
            color: "Orange",
            name: "System",
            data: metricsData.cpuLoadPercentages.map(
              ({ system }: { system: number }): number => system,
            ),
          },
          {
            color: "Red",
            name: "User",
            data: metricsData.cpuLoadPercentages.map(
              ({ user }: { user: number }): number => user,
            ),
          },
        ],
        times: metricsData.cpuLoadPercentages.map(
          ({ unixTimeMs }: { unixTimeMs: number }): number => unixTimeMs,
        ),
        yAxis: {
          title: "%",
          range: "0 --> 100",
        },
      },
      {
        title: "Memory Usages",
        metricsInfoList: [
          {
            color: "Green",
            name: "Free",
            data: metricsData.memoryUsageMBs.map(
              ({ free }: { free: number }): number => free,
            ),
          },
          {
            color: "Blue",
            name: "Used",
            data: metricsData.memoryUsageMBs.map(
              ({ used }: { used: number }): number => used,
            ),
          },
        ],
        times: metricsData.memoryUsageMBs.map(
          ({ unixTimeMs }: { unixTimeMs: number }): number => unixTimeMs,
        ),
        yAxis: {
          title: "MB",
        },
      },
    ]),
    metricsID,
  );
}
