import { getInput } from "@actions/core";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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

  console.log(`Server started with PID: ${serverProcess.pid}`);
}

await index();
