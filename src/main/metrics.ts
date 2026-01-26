import { setFailed } from "@actions/core";
import { currentLoad, mem } from "systeminformation";
import type { z } from "zod";
import type { metricsDataSchema } from "../lib";

export class Metrics {
  private readonly data: z.TypeOf<typeof metricsDataSchema>;
  private readonly intervalMs: number;

  constructor() {
    this.data = { cpuLoadPercentages: [], memoryUsageMBs: [] };

    this.intervalMs = 5 * 1000;
    const intervalSecondsInput: string | undefined =
      process.env.METRICS_INTERVAL_SECONDS;

    if (intervalSecondsInput) {
      const intervalSecondsVal: number = parseInt(intervalSecondsInput, 10);
      if (Number.isInteger(intervalSecondsVal)) {
        this.intervalMs = intervalSecondsVal * 1000;
      }
    }

    // Start async processing immediately (don't await in constructor)
    this.append(Date.now()).catch(setFailed);
  }

  get(): string {
    return JSON.stringify(this.data);
  }

  private async append(unixTimeMs: number): Promise<void> {
    try {
      const {
        currentLoadUser,
        currentLoadSystem,
      }: { currentLoadUser: number; currentLoadSystem: number } =
        await currentLoad();
      this.data.cpuLoadPercentages.push({
        unixTimeMs,
        user: currentLoadUser,
        system: currentLoadSystem,
      });

      const bytesPerMB: number = 1024 * 1024;
      const { active, available }: { active: number; available: number } =
        await mem();
      this.data.memoryUsageMBs.push({
        unixTimeMs,
        used: active / bytesPerMB,
        free: available / bytesPerMB,
      });
    } catch (error) {
      setFailed(error);
    } finally {
      const nextUNIXTimeMs: number = unixTimeMs + this.intervalMs;
      setTimeout(
        () => this.append(nextUNIXTimeMs).catch(setFailed),
        Math.max(0, nextUNIXTimeMs - Date.now()),
      );
    }
  }
}
