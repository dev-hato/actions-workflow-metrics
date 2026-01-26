import { createServer } from "node:http";
import { Metrics } from "./metrics";
import { serverPort } from "../lib";
import type { ServerResponse } from "node:http";

async function server(): Promise<void> {
	const metrics: Metrics = new Metrics();
	const server = createServer((_, response: ServerResponse) => {
		try {
			response.setHeader("Content-Type", "application/json");
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.statusCode = 200;
			response.end(metrics.get());
		} catch (error) {
			console.error("Error handling request:", error);
			response.statusCode = 500;
			response.setHeader("Content-Type", "application/json");
			response.end(JSON.stringify({ error: "Internal server error" }));
		}
	});

	server.on("error", (error: Error) => {
		console.error("Server error:", error);
	});
	server.listen(serverPort);
}

await server();
