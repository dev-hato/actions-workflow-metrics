import type { z } from "zod";
import type {
  renderParamsListSchema,
  renderParamsSchema,
  metricsInfoListSchema,
  metricsInfoSchema,
  timesSchema,
} from "./lib";

export const MAX_VISIBLE_TIME_LABELS: number = 8;
const ZERO_WIDTH_ZERO: string = "\u200b";
const ZERO_WIDTH_ONE: string = "\u200c";
const ZERO_WIDTH_SENTINEL: string = "\u200d";

const formatTimeLabels = (times: z.TypeOf<typeof timesSchema>): string[] => {
  if (times.length === 0) {
    return [];
  }

  const formattedTimes: string[] = times.map((d: Date): string =>
    d.toLocaleTimeString("en-GB", { hour12: false }),
  );

  if (formattedTimes.length <= MAX_VISIBLE_TIME_LABELS) {
    return formattedTimes;
  }

  const encodeHiddenLabel = (index: number): string => {
    const binary: string = index.toString(2);
    return (
      ZERO_WIDTH_SENTINEL +
      binary
        .split("")
        .map((digit: string): string =>
          digit === "0" ? ZERO_WIDTH_ZERO : ZERO_WIDTH_ONE,
        )
        .join("")
    );
  };

  const usableSlots: number = Math.max(
    Math.min(MAX_VISIBLE_TIME_LABELS, formattedTimes.length) - 2,
    1,
  );
  const interiorCount: number = formattedTimes.length - 2;
  const interiorStep: number = interiorCount / (usableSlots + 1);
  const visibleInteriorIndices: Set<number> = new Set<number>();

  for (let slot: number = 1; slot <= usableSlots; slot += 1) {
    const targetIndex: number = 1 + Math.round(slot * interiorStep);
    visibleInteriorIndices.add(
      Math.min(formattedTimes.length - 2, Math.max(1, targetIndex)),
    );
  }

  return formattedTimes.map(
    (label: string, index: number, array: string[]): string => {
      if (index === 0 || index === array.length - 1) {
        return label;
      }

      return visibleInteriorIndices.has(index)
        ? label
        : encodeHiddenLabel(index);
    },
  );
};

export class Renderer {
  render(
    renderParamsList: z.TypeOf<typeof renderParamsListSchema>,
    metricsID: string,
  ): string {
    return this.renderMetrics(this.renderCharts(renderParamsList), metricsID);
  }

  private renderMetrics(charts: string, metricsID: string): string {
    return `## Workflow Metrics

### Metrics ID

${metricsID}

${charts}`;
  }

  private formatLegends(
    metricsInfoList: z.TypeOf<typeof metricsInfoListSchema>,
  ): string {
    return metricsInfoList
      .map(
        (i: z.TypeOf<typeof metricsInfoSchema>): string =>
          `* $\${\\color{${i.color}} \\verb|${i.color}: ${i.name}|}$$`,
      )
      .join("\n");
  }

  private extractColors(
    metricsInfoList: z.TypeOf<typeof metricsInfoListSchema>,
  ): string {
    return metricsInfoList
      .map(({ color }: z.TypeOf<typeof metricsInfoSchema>): string => color)
      .join(", ");
  }

  private formatTimes(times: z.TypeOf<typeof timesSchema>): string {
    return JSON.stringify(formatTimeLabels(times));
  }

  private formatYAxisRange(range?: string): string {
    return range ? ` ${range}` : "";
  }

  private accumulateStackedData(
    accumulated: number[][],
    metricsInfo: z.TypeOf<typeof metricsInfoSchema>,
    index: number,
  ): number[][] {
    accumulated.push(
      metricsInfo.data.map(
        (v: number, c: number): number => v + accumulated[index][c],
      ),
    );
    return accumulated;
  }

  private calculateStackedBars(
    metricsInfoList: z.TypeOf<typeof metricsInfoListSchema>,
  ): string {
    return metricsInfoList
      .toReversed()
      .reduce(this.accumulateStackedData, [
        metricsInfoList[0].data.map((): number => 0),
      ])
      .slice(1)
      .toReversed()
      .map((v: number[]): string => `bar ${JSON.stringify(v)}`)
      .join("\n");
  }

  private renderChart(
    renderParams: z.TypeOf<typeof renderParamsSchema>,
  ): string {
    return `### ${renderParams.title}

#### Legends

${this.formatLegends(renderParams.metricsInfoList)}

#### Chart

\`\`\`mermaid
%%{
  init: {
    "themeVariables": {
      "xyChart": {
        "plotColorPalette": "${this.extractColors(renderParams.metricsInfoList)}"
      }
    }
  }
}%%
xychart

x-axis "Time" ${this.formatTimes(renderParams.times)}
y-axis "${renderParams.yAxis.title}"${this.formatYAxisRange(renderParams.yAxis.range)}
${this.calculateStackedBars(renderParams.metricsInfoList)}
\`\`\``;
  }

  private renderCharts(
    renderParamsList: z.TypeOf<typeof renderParamsListSchema>,
  ): string {
    return renderParamsList
      .filter(
        ({ metricsInfoList }: z.TypeOf<typeof renderParamsSchema>): boolean =>
          metricsInfoList.length > 0,
      )
      .map((p: z.TypeOf<typeof renderParamsSchema>): string =>
        this.renderChart(p),
      )
      .join("\n\n");
  }
}
