import { z } from "zod";

export const cpuLoadPercentageSchema = z.object({
  time: z.number().finite(),
  user: z.number().finite().nonnegative().max(100),
  system: z.number().finite().nonnegative().max(100),
});
export const cpuLoadPercentagesSchema = z.array(cpuLoadPercentageSchema);
export const memoryUsageMBSchema = z.object({
  time: z.number().finite(),
  used: z.number().finite().nonnegative(),
  free: z.number().finite().nonnegative(),
});
export const memoryUsageMBsSchema = z.array(memoryUsageMBSchema);
export const metricsDataSchema = z.object({
  cpuLoadPercentages: cpuLoadPercentagesSchema,
  memoryUsageMBs: memoryUsageMBsSchema,
});

export const serverPort: number = 7777;
