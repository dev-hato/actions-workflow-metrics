import { promises as fs } from "node:fs";
import { join } from "node:path";
import type { BuildOutput } from "bun";

const entrypoints: { dirName: string; baseFileName: string }[] = [
  { dirName: "main", baseFileName: "index" },
  { dirName: "main", baseFileName: "server" },
  { dirName: "post", baseFileName: "index" },
];
const result: BuildOutput = await Bun.build({
  entrypoints: entrypoints.map((e) =>
    join("src", e.dirName, `${e.baseFileName}.ts`),
  ),
  outdir: "dist",
  target: "node",
  sourcemap: "linked",
  naming: "[dir]/[name].bundle.[ext]",
});

if (!result.success) {
  console.error("Build failed:");

  for (const log of result.logs) {
    console.error(log);
  }

  process.exit(1);
}

await Promise.all([
  // Create wrapper files that enable source maps before importing the bundle
  ...entrypoints.map(
    async (e) =>
      await fs.writeFile(
        join("dist", e.dirName, `${e.baseFileName}.js`),
        `process.setSourceMapsEnabled(true);
await import("./${e.baseFileName}.bundle.js");
`,
      ),
  ),

  // Fix source map paths by adding sourceRoot to correct the relative path resolution
  ...entrypoints.map(async (e) => {
    const sourceMapPath = join(
      "dist",
      e.dirName,
      `${e.baseFileName}.bundle.js.map`,
    );
    const sourceMap: { sourceRoot?: string } = JSON.parse(
      await fs.readFile(sourceMapPath, "utf-8"),
    );

    // Add sourceRoot to go up one more level from dist/[dir]/ to project root
    sourceMap.sourceRoot = "../";
    return await fs.writeFile(sourceMapPath, JSON.stringify(sourceMap));
  }),
]);
console.log("Build succeeded");
