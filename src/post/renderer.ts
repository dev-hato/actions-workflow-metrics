import type { z } from "zod";
import type {
  renderParamsListSchema,
  renderParamsSchema,
  metricsInfoListSchema,
  metricsInfoSchema,
} from "./lib";

export const MAX_VISIBLE_TIME_LABELS: number = 12;

const formatTimeLabels = (times: Date[]): string[] => {
  if (times.length === 0) {
    return [];
  }

  const formattedTimes: string[] = times.map((d: Date): string =>
    d.toLocaleTimeString("en-GB", { hour12: false }),
  );

  if (formattedTimes.length <= MAX_VISIBLE_TIME_LABELS) {
    return formattedTimes;
  }

  const usableSlots: number = Math.max(MAX_VISIBLE_TIME_LABELS - 2, 1);
  const spacing: number = Math.ceil((formattedTimes.length - 2) / usableSlots);

  return formattedTimes.map(
    (label: string, index: number, array: string[]): string => {
      if (index === 0 || index === array.length - 1) {
        return label;
      }

      const normalizedIndex: number = index - 1;
      return normalizedIndex % spacing === 0 ? label : "";
    },
  );
};

export class Renderer {
  render(
    renderParamsList: z.TypeOf<typeof renderParamsListSchema>,
    metricsID: string,
  ): string {
    return `## Workflow Metrics

### Metrics ID

${metricsID}

${renderParamsList
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
          prev.push(data.map((d: number, j: number): number => d + prev[i][j]));
          return prev;
        },
        [p.metricsInfoList[0].data.map((): number => 0)],
      )
      .slice(1)
      .toReversed();
    return `### ${p.title}

#### Legends

${p.metricsInfoList
  .map(
    (i: z.TypeOf<typeof metricsInfoSchema>): string =>
      `* $\${\\color{${i.color}} \\verb|${i.color}: ${i.name}|}$$`,
  )
  .join("\n")}

#### Chart

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

x-axis "Time" ${JSON.stringify(formatTimeLabels(p.times))}
y-axis "${p.yAxis.title}"${p.yAxis.range ? ` ${p.yAxis.range}` : ""}
${stackedDatum.map((d: number[]): string => `bar ${JSON.stringify(d)}`).join("\n")}
\`\`\``;
  })
  .join("\n\n")}`;
  }
}
