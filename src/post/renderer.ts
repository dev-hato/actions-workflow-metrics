import type { z } from "zod";
import type {
  chartParamsSchema,
  legendsSchema,
  legendSchema,
  renderParamsListSchema,
  renderParamsSchema,
  stackedBarDataSchema,
  timesSchema,
} from "./lib";

export class Renderer {
  render(
    renderParamsList: z.TypeOf<typeof renderParamsListSchema>,
    metricsID: string,
  ): string {
    return this.renderMetrics(this.renderSections(renderParamsList), metricsID);
  }

  private renderMetrics(charts: string, metricsID: string): string {
    return `## Workflow Metrics

### Metrics ID

${metricsID}

${charts}`;
  }

  private formatLegends(legends: z.TypeOf<typeof legendsSchema>): string {
    return legends
      .map(
        (l: z.TypeOf<typeof legendSchema>): string =>
          `* $\${\\color{${l.color}} \\verb|${l.color}: ${l.name}|}$$`,
      )
      .join("\n");
  }

  private formatChartHeader(stepName?: string): string {
    return stepName === undefined
      ? "#### All"
      : `#### Step \`${stepName}\`

<details>
<summary>Chart</summary>`;
  }

  private extractColors(legends: z.TypeOf<typeof legendsSchema>): string {
    return legends
      .map(({ color }: z.TypeOf<typeof legendSchema>): string => color)
      .join(", ");
  }

  private formatTimes(times: z.TypeOf<typeof timesSchema>): string {
    return JSON.stringify(
      times.map((d: Date): string =>
        d.toLocaleTimeString("en-GB", { hour12: false }),
      ),
    );
  }

  private formatYAxisRange(range?: string): string {
    return range ? ` ${range}` : "";
  }

  private accumulateStackedData(
    accumulated: number[][],
    barData: number[],
    index: number,
  ): number[][] {
    accumulated.push(
      barData.map((v: number, c: number): number => v + accumulated[index][c]),
    );
    return accumulated;
  }

  private calculateStackedBars(
    stackedBarData: z.TypeOf<typeof stackedBarDataSchema>,
  ): string {
    return stackedBarData
      .toReversed()
      .reduce(this.accumulateStackedData, [
        stackedBarData[0].map((): number => 0),
      ])
      .slice(1)
      .toReversed()
      .map((v: number[]): string => `bar ${JSON.stringify(v)}`)
      .join("\n");
  }

  private formatChartFooter(stepName?: string): string {
    return stepName === undefined
      ? ""
      : `

</details>`;
  }

  private renderSection(
    renderParams: z.TypeOf<typeof renderParamsSchema>,
  ): string {
    return `### ${renderParams.title}

#### Legends

${this.formatLegends(renderParams.legends)}${this.renderSectionCharts(renderParams)}`;
  }

  private renderChart(
    chartParams: z.TypeOf<typeof chartParamsSchema>,
    plotColorPalette: string,
  ): string {
    return `

${this.formatChartHeader(chartParams.stepName)}

\`\`\`mermaid
%%{
  init: {
    "themeVariables": {
      "xyChart": {
        "plotColorPalette": "${plotColorPalette}"
      }
    }
  }
}%%
xychart

x-axis "Time" ${this.formatTimes(chartParams.times)}
y-axis "${chartParams.yAxis.title}"${this.formatYAxisRange(chartParams.yAxis.range)}
${this.calculateStackedBars(chartParams.stackedBarData)}
\`\`\`${this.formatChartFooter(chartParams.stepName)}`;
  }

  private renderSectionCharts(
    renderParams: z.TypeOf<typeof renderParamsSchema>,
  ): string {
    const plotColorPalette: string = this.extractColors(renderParams.legends);
    return renderParams.data
      .filter(
        ({ stackedBarData }: z.TypeOf<typeof chartParamsSchema>): boolean =>
          stackedBarData.length > 0,
      )
      .map((p: z.TypeOf<typeof chartParamsSchema>): string =>
        this.renderChart(p, plotColorPalette),
      )
      .join("");
  }

  private renderSections(
    renderParamsList: z.TypeOf<typeof renderParamsListSchema>,
  ): string {
    return renderParamsList
      .map((p: z.TypeOf<typeof renderParamsSchema>): string =>
        this.renderSection(p),
      )
      .join("\n\n");
  }
}
