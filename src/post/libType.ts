import { z } from "zod";
import { metricsDataSchema } from "../libType";

export type GitHubJobStep = {
  name: string;
  started_at?: string | null;
  completed_at?: string | null;
};

export const legendSchema = z.object({
  color: z.string(),
  name: z.string(),
});
export const stackedBarDataSchema = z.array(z.array(z.number()));
export const legendsSchema = z.array(legendSchema);
export const timesSchema = z.array(z.coerce.date());
export const baseChartParamsSchema = z.object({
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
export const chartParamsListSchema = z.array(chartParamsSchema);
export const renderParamsSchema = z.object({
  title: z.string(),
  legends: legendsSchema,
  data: chartParamsListSchema,
});
export const renderParamsListSchema = z.array(renderParamsSchema);
export const stepSchema = z.object({
  stepName: z.string().optional(),
  data: metricsDataSchema,
});
export const stepsSchema = z.array(stepSchema);
export const metricsDataWithStepsSchema = metricsDataSchema.extend({
  steps: stepsSchema,
});
