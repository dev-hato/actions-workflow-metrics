import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ChildProcess } from "node:child_process";

const __dirname: string = dirname(fileURLToPath(import.meta.url));

async function index(): Promise<void> {
  // Start server in background
  const serverProcess: ChildProcess = spawn(
    "node",
    [join(__dirname, "server.js")],
    { detached: true, stdio: "ignore" },
  );

  // Unref to allow parent process to exit
  serverProcess.unref();

  console.log(`Server started with PID: ${serverProcess.pid}`);
}

await index();
