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
export const renderParamsSchema = z.object({
  title: z.string(),
  metricsInfoList: metricsInfoListSchema,
  times: z.array(z.coerce.date()),
  yAxis: z.object({
    title: z.string(),
    range: z.string().optional(),
  }),
});
export const renderParamsListSchema = z.array(renderParamsSchema);
export const metricsDataWithStepMapSchema = metricsDataSchema.extend({
  stepMap: z.map(z.string(), metricsDataSchema),
});

function generateRenderParamsFromCPULoadPercentages(
  stepName: string,
  cpuLoadPercentages: z.TypeOf<typeof cpuLoadPercentagesSchema>,
): z.TypeOf<typeof renderParamsSchema> {
  return {
    title: `CPU Loads (${stepName})`,
    metricsInfoList: [
      {
        color: "Orange",
        name: "System",
        data: cpuLoadPercentages.map(
          ({ system }: { system: number }): number => system,
        ),
      },
      {
        color: "Red",
        name: "User",
        data: cpuLoadPercentages.map(
          ({ user }: { user: number }): number => user,
        ),
      },
    ],
    times: cpuLoadPercentages.map(
      ({ unixTimeMs }: { unixTimeMs: number }): Date => new Date(unixTimeMs),
    ),
    yAxis: {
      title: "%",
      range: "0 --> 100",
    },
  };
}

function generateRenderParamsFromMemoryUsageMBs(
  stepName: string,
  memoryUsageMBs: z.TypeOf<typeof memoryUsageMBsSchema>,
): z.TypeOf<typeof renderParamsSchema> {
  return {
    title: `Memory Usages (${stepName})`,
    metricsInfoList: [
      {
        color: "Green",
        name: "Free",
        data: memoryUsageMBs.map(({ free }: { free: number }): number => free),
      },
      {
        color: "Blue",
        name: "Used",
        data: memoryUsageMBs.map(({ used }: { used: number }): number => used),
      },
    ],
    times: memoryUsageMBs.map(
      ({ unixTimeMs }: { unixTimeMs: number }): Date => new Date(unixTimeMs),
    ),
    yAxis: {
      title: "MB",
    },
  };
}

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
  const renderer: Renderer = new Renderer();
  return renderer.render(
    renderParamsListSchema.parse([
      generateRenderParamsFromCPULoadPercentages(
        "All",
        metricsData.cpuLoadPercentages,
      ),
      ...metricsData.stepMap.keys().map((k) => {
        const stepMetricsData = metricsData.stepMap.get(k);
        console.log(k, stepMetricsData);

        if (stepMetricsData === undefined) {
          return;
        }

        return generateRenderParamsFromCPULoadPercentages(
          k,
          stepMetricsData.cpuLoadPercentages,
        );
      }),
      generateRenderParamsFromMemoryUsageMBs("All", metricsData.memoryUsageMBs),
      ...metricsData.stepMap.keys().map((k) => {
        const stepMetricsData = metricsData.stepMap.get(k);
        console.log(k, stepMetricsData);

        if (stepMetricsData === undefined) {
          return;
        }

        return generateRenderParamsFromMemoryUsageMBs(
          k,
          stepMetricsData.memoryUsageMBs,
        );
      }),
    ]),
    metricsID,
  );
}
