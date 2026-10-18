import { createServer } from "node:http";
import { setFailed } from "@actions/core";
import { serverHost, serverPort } from "../lib";
import type { IncomingMessage, Server, ServerResponse } from "node:http";

export function createMetricsServer(
  // Source of the metrics JSON served by the server
  metrics: { get(): string },

  onFinish: () => void,
): Server {
  const server: Server = createServer(
    (request: IncomingMessage, response: ServerResponse): void => {
      try {
        // Reject requests whose Host is not the loopback address (DNS rebinding protection)
        if (request.headers.host !== `${serverHost}:${serverPort}`) {
          response.statusCode = 403;
          response.end();
          return;
        }

        switch (request.url) {
          case "/metrics":
            response.setHeader("Content-Type", "application/json");
            response.statusCode = 200;
            response.end(metrics.get());
            break;
          case "/finish":
            response.statusCode = 200;
            response.end();
            server.close(onFinish);
            break;
          default:
            response.statusCode = 404;
            response.end();
            break;
        }
      } catch (error: unknown) {
        response.statusCode = 500;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ error: "Internal server error" }));
        console.error(error);
        setFailed(error instanceof Error ? error : String(error));
      }
    },
  );
  return server;
}

// Bind to loopback only so the server is not reachable from other hosts
export function listenMetricsServer(
  server: Server,
  port: number = serverPort,
): Server {
  return server.listen(port, serverHost);
}
