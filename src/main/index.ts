import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getInput, info, setFailed } from "@actions/core";
import { getMetricsData } from "../post/lib";
import type { ChildProcess } from "node:child_process";

const __dirname: string = dirname(fileURLToPath(import.meta.url));

async function index(): Promise<void> {
  // Start server in background with interval passed via environment variable
  const serverProcess: ChildProcess = spawn(
    "node",
    [join(__dirname, "server.js")],
    {
      detached: true,
      stdio: "ignore",
      env: {
        ...process.env,
        METRICS_INTERVAL_SECONDS: getInput("interval_seconds") || "5",
      },
    },
  );

  // Unref to allow parent process to exit
  serverProcess.unref();

  info(`Server started with PID: ${serverProcess.pid}`);
  const maxRetryCount: number = 10;

  for (let i = 0; i < maxRetryCount; i++) {
    try {
      await getMetricsData();
      break;
    } catch (error) {
      if (
        maxRetryCount - 2 < i ||
        !(error instanceof TypeError) ||
        error.message !== "fetch failed"
      ) {
        setFailed(error);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

await index();
