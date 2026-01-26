import { promises as fs } from "node:fs";
import { DefaultArtifactClient } from "@actions/artifact";
import { summary } from "@actions/core";
import { getMetricsData, render } from "./lib";
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
    console.error("Failed to render metrics:", error);
    process.exit(1);
  }
}

await index();
