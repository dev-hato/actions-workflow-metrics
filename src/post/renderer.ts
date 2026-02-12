import type { z } from "zod";
import type {
  renderDataSchema,
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
        .map((d: z.TypeOf<typeof renderDataSchema>): string => {
          const stackedDatum: number[][] = d.metricsInfoList
            .toReversed()
            .reduce(
              (prev: number[][], data: number[], i: number): number[][] => {
                prev.push(
                  data.map((d: number, j: number): number => d + prev[i][j]),
                );
                return prev;
              },
              [d.metricsInfoList[0].map((): number => 0)],
            )
            .slice(1)
            .toReversed();
          return `#### ${d.stepName === undefined ? "All" : `Step \`${d.stepName}\``}

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
            d.times.map((d: Date): string =>
              d.toLocaleTimeString("en-GB", { hour12: false }),
            ),
          )}
y-axis "${d.yAxis.title}"${d.yAxis.range ? ` ${d.yAxis.range}` : ""}
${stackedDatum.map((d: number[]): string => `bar ${JSON.stringify(d)}`).join("\n")}
\`\`\``;
        }),
    ];
  })
  .join("\n\n")}`;
  }
}
