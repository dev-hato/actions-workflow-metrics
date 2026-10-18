import type { Server } from "node:http";
import { setFailed } from "@actions/core";
import { Metrics } from "./metrics";
import { createMetricsServer, listenMetricsServer } from "./metricsServer";

async function server(): Promise<void> {
  const server: Server = createMetricsServer(new Metrics(), (): void =>
    process.exit(0),
  );

  server.on("error", setFailed);
  listenMetricsServer(server);
}

await server();
