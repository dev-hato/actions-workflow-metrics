// src/main/index.ts
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
var __dirname2 = dirname(fileURLToPath(import.meta.url));
async function index() {
  const serverProcess = spawn("node", [join(__dirname2, "server.js")], { detached: true, stdio: "ignore" });
  serverProcess.unref();
  console.log(`Server started with PID: ${serverProcess.pid}`);
}
await index();

//# debugId=D1E4E5642781339364756E2164756E21
//# sourceMappingURL=index.js.map
