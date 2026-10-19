import type { Mock } from "bun:test";
import type {
  ClientRequest,
  IncomingHttpHeaders,
  IncomingMessage,
  Server,
} from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { once } from "node:events";
import { request } from "node:http";
import { createMetricsServer, listenMetricsServer } from "./metricsServer";
import { serverHost, serverPort } from "../lib";

const metricsJSON: string = JSON.stringify({
  cpuLoadPercentages: [],
  memoryUsageMBs: [],
});

// Host header that the real server receives from the post step
const validHost: string = `${serverHost}:${serverPort}`;

type TestResponse = {
  status: number;
  headers: IncomingHttpHeaders;
  body: string;
};

// Use node:http instead of fetch, which other test files replace with mocks
function get(url: string, host: string): Promise<TestResponse> {
  return new Promise<TestResponse>(
    (
      resolve: (value: TestResponse) => void,
      reject: (reason: Error) => void,
    ): void => {
      const req: ClientRequest = request(
        url,
        { headers: { host }, timeout: 1000 },
        (res: IncomingMessage): void => {
          let body: string = "";
          res.setEncoding("utf8");
          res.on("data", (chunk: string): void => {
            body += chunk;
          });
          res.on("end", (): void =>
            resolve({
              status: res.statusCode ?? 0,
              headers: res.headers,
              body,
            }),
          );
        },
      );
      req.on("timeout", (): void => {
        req.destroy(new Error("Request timed out"));
      });
      req.on("error", reject);
      req.end();
    },
  );
}

// AddressInfo is a type only, so narrow with typeof/null checks instead of instanceof
function getAddressInfo(server: Server): AddressInfo {
  const address: string | AddressInfo | null = server.address();

  if (address === null || typeof address === "string") {
    throw new Error(`Server is not listening on a TCP port: ${address}`);
  }

  return address;
}

describe("createMetricsServer", () => {
  let server: Server;
  let onFinish: Mock<() => void>;
  let baseURL: string;

  beforeEach(async (): Promise<void> => {
    onFinish = mock((): void => {});

    // Listen on an ephemeral port so tests do not collide with a running server
    server = listenMetricsServer(
      createMetricsServer({ get: (): string => metricsJSON }, onFinish),
      0,
    );
    await once(server, "listening");
    baseURL = `http://${serverHost}:${getAddressInfo(server).port}`;
  });

  afterEach((): void => {
    server.close();
  });

  it("should listen on the loopback address only", (): void =>
    expect(getAddressInfo(server).address).toBe("127.0.0.1"));

  it("should return metrics without a CORS header", async (): Promise<void> => {
    const res: TestResponse = await get(`${baseURL}/metrics`, validHost);

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    expect(res.body).toBe(metricsJSON);
  });

  it("should reject requests with a non-loopback Host header", async (): Promise<void> => {
    for (const host of ["evil.example:7777", `localhost:${serverPort}`]) {
      const res: TestResponse = await get(`${baseURL}/metrics`, host);

      expect(res.status).toBe(403);
      expect(res.body).toBe("");
    }
  });

  it("should not finish the server for a non-loopback Host header", async (): Promise<void> => {
    const res: TestResponse = await get(
      `${baseURL}/finish`,
      "evil.example:7777",
    );

    expect(res.status).toBe(403);
    expect(server.listening).toBe(true);
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("should return 404 for unknown paths instead of hanging", async (): Promise<void> => {
    const res: TestResponse = await get(`${baseURL}/unknown`, validHost);

    expect(res.status).toBe(404);
  });
});
