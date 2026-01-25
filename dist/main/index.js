// src/main/index.ts
import * as core from "@actions/core";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
var __dirname2 = dirname(fileURLToPath(import.meta.url));
async function index() {
  const serverProcess = spawn("node", [join(__dirname2, "server.js")], {
    detached: true,
    stdio: "ignore",
    env: {
      ...process.env,
      METRICS_INTERVAL_SECONDS: core.getInput("interval_seconds") || "5"
    }
  });
  serverProcess.unref();
  console.log(`Server started with PID: ${serverProcess.pid}`);
}
await index();

//# debugId=8CC66553D1EA641164756E2164756E21
//# sourceMappingURL=index.js.map
