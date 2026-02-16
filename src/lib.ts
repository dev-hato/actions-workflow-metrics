import { z } from "zod";

export const unixTimeMsSchema = z.object({
  unixTimeMs: z.number(),
});
export const cpuLoadPercentageSchema = unixTimeMsSchema.extend({
  user: z.number().nonnegative().max(100),
  system: z.number().nonnegative().max(100),
});
export const cpuLoadPercentagesSchema = z.array(cpuLoadPercentageSchema);
export const memoryUsageMBSchema = unixTimeMsSchema.extend({
  used: z.number().nonnegative(),
  free: z.number().nonnegative(),
});
export const memoryUsageMBsSchema = z.array(memoryUsageMBSchema);
export const metricsDataSchema = z.object({
  cpuLoadPercentages: cpuLoadPercentagesSchema,
  memoryUsageMBs: memoryUsageMBsSchema,
});

export const serverPort: number = 7777;
