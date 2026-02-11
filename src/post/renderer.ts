import type { z } from "zod";
import type {
  renderDataWithStepNameSchema,
  renderParamsListSchema,
  renderParamsSchema,
  metricsInfoListSchema,
  metricsInfoSchema,
} from "./lib";

export class Renderer {
  render(
    renderParamsList: z.TypeOf<typeof renderParamsListSchema>,
    metricsID: string,
  ): string {
    return `## Workflow Metrics

### Metrics ID

${metricsID}

${renderParamsList
  .flatMap((p: z.TypeOf<typeof renderParamsSchema>): string[] => {
    const colors: string[] = p.legends.map(
      ({ color }: { color: string }): string => color,
    );
    return [
      `### ${p.title}

#### Legends

${p.legends
  .map(
    (l: z.TypeOf<typeof metricsInfoSchema>): string =>
      `* $\${\\color{${l.color}} \\verb|${l.color}: ${l.name}|}$$`,
  )
  .join("\n")}`,
      ...p.data
        .filter(
          ({
            metricsInfoList,
          }: {
            metricsInfoList: z.TypeOf<typeof metricsInfoListSchema>;
          }): boolean => metricsInfoList.length > 0,
        )
        .map((s: z.TypeOf<typeof renderDataWithStepNameSchema>): string => {
          const stackedDatum: number[][] = s.metricsInfoList
            .toReversed()
            .reduce(
              (prev: number[][], values: number[], i: number): number[][] => {
                prev.push(
                  values.map((v: number, j: number): number => v + prev[i][j]),
                );
                return prev;
              },
              [s.metricsInfoList[0].map((): number => 0)],
            )
            .slice(1)
            .toReversed();
          return `${
            s.stepName === undefined
              ? "#### All"
              : `#### Step \`${s.stepName}\`

<details>
<summary>Chart</summary>`
          }

\`\`\`mermaid
%%{
  init: {
    "themeVariables": {
      "xyChart": {
        "plotColorPalette": "${colors.join(", ")}"
      }
    }
  }
}%%
xychart

x-axis "Time" ${JSON.stringify(
            s.times.map((t: Date): string =>
              t.toLocaleTimeString("en-GB", { hour12: false }),
            ),
          )}
y-axis "${s.yAxis.title}"${s.yAxis.range ? ` ${s.yAxis.range}` : ""}
${stackedDatum.map((r: number[]): string => `bar ${JSON.stringify(r)}`).join("\n")}
\`\`\`${
            s.stepName === undefined
              ? ""
              : `

</details>`
          }`;
        }),
    ];
  })
  .join("\n\n")}`;
  }
}
