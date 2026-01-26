import * as core from "@actions/core";
import { render } from "./lib";

async function index(): Promise<void> {
	try {
		// Render metrics
		await core.summary.addRaw(await render()).write();
	} catch (error) {
		console.error("Failed to render metrics:", error);
		process.exit(1);
	}
}

await index();
