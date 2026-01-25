import type { z } from "zod";
import type {
  renderParamsListSchema,
  renderParamsSchema,
  metricsInfoListSchema,
  metricsInfoSchema,
} from "./lib";

export class Renderer {
  render(renderParamsList: z.TypeOf<typeof renderParamsListSchema>): string {
    return renderParamsList
      .filter(
        ({
          metricsInfoList,
        }: {
          metricsInfoList: z.TypeOf<typeof metricsInfoListSchema>;
        }): boolean => metricsInfoList.length > 0,
      )
      .map((p: z.TypeOf<typeof renderParamsSchema>): string => {
        const colors: string[] = p.metricsInfoList.map(
          ({ color }: { color: string }): string => color,
        );
        const stackedDatum: number[][] = p.metricsInfoList
          .toReversed()
          .reduce(
            (
              prev: number[][],
              { data }: { data: number[] },
              i: number,
            ): number[][] => {
              prev.push(
                data.map((d: number, j: number): number => d + prev[i][j]),
              );
              return prev;
            },
            [p.metricsInfoList[0].data.map((): number => 0)],
          )
          .slice(1)
          .toReversed();
        return `### ${p.title}

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
          p.times.map((d: Date): string =>
            d.toLocaleTimeString("en-GB", { hour12: false }),
          ),
        )}
y-axis "${p.yAxis.title}"${p.yAxis.range ? ` ${p.yAxis.range}` : ""}
${stackedDatum.map((d: number[]): string => `bar ${JSON.stringify(d)}`).join("\n")}
\`\`\`

#### legends

${p.metricsInfoList
  .map(
    (i: z.TypeOf<typeof metricsInfoSchema>): string =>
      `* \$\${\\color{${i.color}} \\verb|${i.color}: ${i.name}|}\$\$`,
  )
  .join("\n")}`;
      })
      .join("\n\n");
  }
}
