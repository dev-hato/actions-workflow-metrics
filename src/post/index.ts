import { promises as fs } from "node:fs";
import { DefaultArtifactClient } from "@actions/artifact";
import { info, setFailed, summary, warning } from "@actions/core";
import { context } from "@actions/github";
import { Octokit } from "@octokit/action";
import { getMetricsData, render } from "./lib";
import { serverPort } from "../lib";
import type { components } from "@octokit/openapi-types";
import type { z } from "zod";
import type { metricsDataWithStepsSchema } from "./lib";

async function index(): Promise<void> {
  const maxRetryCount: number = 10;
  let metricsData: z.TypeOf<typeof metricsDataWithStepsSchema>;

  for (let i = 0; i < maxRetryCount; i++) {
    let jobs: components["schemas"]["job"][] = [];

    try {
      const octokit: Octokit = new Octokit();
      jobs = await octokit.paginate(
        octokit.rest.actions.listJobsForWorkflowRun,
        {
          owner: context.repo.owner,
          repo: context.repo.repo,
          run_id: context.runId,
        },
      );
    } catch (error) {
      console.warn(error);
      warning(error);
    }

    try {
      metricsData = await getMetricsData(jobs);
      break;
    } catch (error) {
      if (
        maxRetryCount - 2 < i ||
        !(error instanceof TypeError) ||
        error.message !== "fetch failed"
      ) {
        console.error(error);
        setFailed(error);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  try {
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
          console.error(error);
          setFailed(error);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Render metrics
    await summary.addRaw(render(metricsData, metricsID)).write();
  } catch (error) {
    console.error(error);
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
