import type { BuildOutput } from "bun";

const result: BuildOutput = await Bun.build({
  entrypoints: ["src/main/index.ts", "src/main/server.ts", "src/post/index.ts"],
  outdir: "dist",
  target: "node",
  sourcemap: "linked",
});

if (!result.success) {
  console.error("Build failed:");

  for (const log of result.logs) {
    console.error(log);
  }

  process.exit(1);
}

console.log("Build succeeded");
