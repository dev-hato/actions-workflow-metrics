import { promises as fs } from "node:fs";
import { DefaultArtifactClient } from "@actions/artifact";
import { info, setFailed, summary } from "@actions/core";
import { getMetricsData, render } from "./lib";
import { serverPort } from "../lib";
import type { z } from "zod";
import type { metricsDataSchema } from "../lib";

async function index(): Promise<void> {
  try {
    const metricsData: z.TypeOf<typeof metricsDataSchema> =
      await getMetricsData();

    // Render metrics
    await summary.addRaw(render(metricsData)).write();

    const artifactName: string = "workflow_metrics";
    const fileName: string = `${artifactName}.json`;
    await fs.writeFile(fileName, JSON.stringify(metricsData));
    const client: DefaultArtifactClient = new DefaultArtifactClient();
    await client.uploadArtifact(artifactName, [fileName], ".");
  } catch (error) {
    setFailed(error);
  } finally {
    const controller: AbortController = new AbortController();
    const timer: Timer = setTimeout(() => controller.abort(), 10 * 1000); // 10 seconds

    // Stop the metrics server
    try {
      const res: Response = await fetch(
        `http://localhost:${serverPort}/finish`,
        {
          signal: controller.signal,
        },
      );

      if (res.ok) {
        info("Server finished");
      } else {
        setFailed(`Failed to finish server: ${res.status} ${res.statusText}`);
      }
    } finally {
      clearTimeout(timer);
    }
  }
}

await index();
