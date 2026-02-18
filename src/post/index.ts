import { promises as fs } from "node:fs";
import { DefaultArtifactClient } from "@actions/artifact";
import { info, setFailed, summary, warning } from "@actions/core";
import { getMetricsData, render } from "./lib";
import { serverPort } from "../lib";
import type { z } from "zod";
import type { metricsDataSchema } from "../lib";

function reportError(
  error: unknown,
  report: (message: string | Error) => void,
) {
  if (!(error instanceof Error)) {
    report(String(error));
    return;
  }

  if (error.cause instanceof AggregateError) {
    for (const err of error.cause.errors) {
      report(err);
    }

    return;
  }

  report(error);
}

async function index(): Promise<void> {
  try {
    const maxRetryCount: number = 10;
    let metricsData: z.TypeOf<typeof metricsDataSchema>;

    for (let i = 0; i < maxRetryCount; i++) {
      try {
        metricsData = await getMetricsData();
        break;
      } catch (error) {
        if (
          maxRetryCount - 2 < i ||
          !(error instanceof TypeError) ||
          error.message !== "fetch failed"
        ) {
          throw error;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const fileBaseName: string = "workflow_metrics";
    const fileName: string = `${fileBaseName}.json`;
    await fs.writeFile(fileName, JSON.stringify(metricsData));
    let metricsID: string = "";

    for (let i = 0; i < maxRetryCount; i++) {
      metricsID = new Date().getTime().toString();

      try {
        const client: DefaultArtifactClient = new DefaultArtifactClient();
        await client.uploadArtifact(
          [fileBaseName, metricsID].join("_"),
          [fileName],
          ".",
        );
        break;
      } catch (error) {
        if (
          maxRetryCount - 2 < i ||
          !(error instanceof Error) ||
          !error.message.includes(
            "Failed request: (409) Conflict: an artifact with this name already exists on the workflow run",
          )
        ) {
          throw error;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Render metrics
    await summary.addRaw(render(metricsData, metricsID)).write();
  } catch (error) {
    console.error(error);
    reportError(error, setFailed);
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
        warning(`Failed to finish server: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.warn(error);
      reportError(error, warning);
    } finally {
      clearTimeout(timer);
    }
  }
}

await index();
