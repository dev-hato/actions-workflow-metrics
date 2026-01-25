import * as core from "@actions/core";
import { currentLoad, mem } from "systeminformation";
import type { z } from "zod";
import type { metricsDataSchema } from "../lib";

export class Metrics {
  private readonly data: z.TypeOf<typeof metricsDataSchema>;
  private readonly intervalMs: number;

  constructor() {
    this.data = { cpuLoadPercentages: [], memoryUsageMBs: [] };

    this.intervalMs = 5 * 1000;
    const intervalSecondsInput: string = core.getInput("interval_seconds");

    if (intervalSecondsInput) {
      const intervalSecondsVal: number = parseInt(intervalSecondsInput);
      if (Number.isInteger(intervalSecondsVal)) {
        this.intervalMs = intervalSecondsVal * 1000;
      }
    }

    // Start async processing immediately (don't await in constructor)
    this.append(Date.now()).catch((error: Error) => {
      console.error("Failed to collect initial metrics:", error);
    });
  }

  get(): string {
    return JSON.stringify(this.data);
  }

  private async append(time: number): Promise<void> {
    try {
      const {
        currentLoadUser,
        currentLoadSystem,
      }: { currentLoadUser: number; currentLoadSystem: number } =
        await currentLoad();
      this.data.cpuLoadPercentages.push({
        time,
        user: currentLoadUser,
        system: currentLoadSystem,
      });

      const bytesPerMB: number = 1024 * 1024;
      const { active, available }: { active: number; available: number } =
        await mem();
      this.data.memoryUsageMBs.push({
        time,
        used: active / bytesPerMB,
        free: available / bytesPerMB,
      });
    } catch (error) {
      console.error("Error collecting metrics:", error);
    } finally {
      const nextTime: number = time + this.intervalMs;
      setTimeout(
        () => {
          this.append(nextTime).catch((error: Error) => {
            console.error("Failed to collect metrics:", error);
          });
        },
        Math.max(0, nextTime - Date.now()),
      );
    }
  }
}
