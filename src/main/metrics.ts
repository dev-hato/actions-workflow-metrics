import { setFailed } from "@actions/core";
import { currentLoad, mem } from "systeminformation";
import type { z } from "zod";
import type { metricsDataSchema } from "../type";

// setTimeout treats delays above 2^31-1 ms as 1 ms, which would cause a busy loop
export const maxIntervalSeconds: number = Math.floor((2 ** 31 - 1) / 1000);

export function parseIntervalMs(intervalSecondsInput?: string): number {
  let intervalSeconds: number = 5;

  if (intervalSecondsInput) {
    const intervalSecondsVal: number = Number(intervalSecondsInput);

    // Reject 0, negative, non-integer, and too large values to avoid a busy loop
    if (
      Number.isSafeInteger(intervalSecondsVal) &&
      0 < intervalSecondsVal &&
      intervalSecondsVal <= maxIntervalSeconds
    ) {
      intervalSeconds = intervalSecondsVal;
    }
  }

  return intervalSeconds * 1000;
}

export class Metrics {
  private readonly data: z.TypeOf<typeof metricsDataSchema>;
  private readonly intervalMs: number;

  constructor() {
    this.data = { cpuLoadPercentages: [], memoryUsageMBs: [] };

    this.intervalMs = parseIntervalMs(process.env.METRICS_INTERVAL_SECONDS);

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
      console.error(error);
      setFailed(error instanceof Error ? error : String(error));
    } finally {
      const nextUNIXTimeMs: number = unixTimeMs + this.intervalMs;
      setTimeout(
        () => this.append(nextUNIXTimeMs).catch(setFailed),
        Math.max(0, nextUNIXTimeMs - Date.now()),
      );
    }
  }
}
