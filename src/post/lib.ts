import { z } from "zod";
import { Renderer } from "./renderer";
import { metricsDataSchema, serverPort } from "../lib";

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

export async function render(): Promise<string> {
	const controller: AbortController = new AbortController();
	const timer: Timer = setTimeout(() => controller.abort(), 10 * 1000); // 10 seconds

	try {
		const res: Response = await fetch(`http://localhost:${serverPort}`, {
			signal: controller.signal,
		});

		if (!res.ok) {
			throw new Error(
				`Failed to fetch metrics: ${res.status} ${res.statusText}`,
			);
		}

		const {
			cpuLoadPercentages,
			memoryUsageMBs,
		}: z.TypeOf<typeof metricsDataSchema> = metricsDataSchema.parse(
			await res.json(),
		);

		const renderer: Renderer = new Renderer();
		return renderer.render(
			renderParamsListSchema.parse([
				{
					title: "CPU Loads",
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
						({ time }: { time: number }): number => time,
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
							data: memoryUsageMBs.map(
								({ free }: { free: number }): number => free,
							),
						},
						{
							color: "Blue",
							name: "Used",
							data: memoryUsageMBs.map(
								({ used }: { used: number }): number => used,
							),
						},
					],
					times: memoryUsageMBs.map(
						({ time }: { time: number }): number => time,
					),
					yAxis: {
						title: "MB",
					},
				},
			]),
		);
	} finally {
		clearTimeout(timer);
	}
}
