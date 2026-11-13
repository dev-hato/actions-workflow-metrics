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
import { TimeLabelFormatter } from "./timeLabels";

export class Renderer {
  render(
    renderParamsList: z.output<typeof renderParamsListSchema>,
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

  private formatLegends(legends: z.output<typeof legendsSchema>): string {
    return legends
      .map(
        (l: z.output<typeof legendSchema>): string =>
          `* $\${\\color{${l.color}} \\verb|${l.color}: ${l.name}|}$$`,
      )
      .join("\n");
  }

  // Step names can contain untrusted text (e.g. PR titles via expressions),
  // so keep them inside a single-line code span that they cannot break out of
  private formatCodeSpan(text: string): string {
    const singleLine: string = text.replace(/[\r\n]+/g, " ");
    const fence: string = "`".repeat(
      Math.max(
        0,
        ...(singleLine.match(/`+/g) ?? []).map((s: string): number => s.length),
      ) + 1,
    );
    const padding: string =
      singleLine.startsWith("`") || singleLine.endsWith("`") ? " " : "";
    return `${fence}${padding}${singleLine}${padding}${fence}`;
  }

  private formatChartHeader(stepName?: string): string {
    return stepName === undefined
      ? "#### All"
      : `#### Step ${this.formatCodeSpan(stepName)}

<details>
<summary>Chart</summary>`;
  }

  private extractColors(legends: z.output<typeof legendsSchema>): string {
    return legends
      .map(({ color }: z.output<typeof legendSchema>): string => color)
      .join(", ");
  }

  private formatTimes(times: z.output<typeof timesSchema>): string {
    return JSON.stringify(TimeLabelFormatter.format(times));
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
    stackedBarData: z.output<typeof stackedBarDataSchema>,
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
    renderParams: z.output<typeof renderParamsSchema>,
  ): string {
    return `### ${renderParams.title}

#### Legends

${this.formatLegends(renderParams.legends)}${this.renderSectionCharts(renderParams)}`;
  }

  private renderChart(
    chartParams: z.output<typeof chartParamsSchema>,
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
    renderParams: z.output<typeof renderParamsSchema>,
  ): string {
    const plotColorPalette: string = this.extractColors(renderParams.legends);
    return renderParams.data
      .filter(
        ({ stackedBarData }: z.output<typeof chartParamsSchema>): boolean =>
          stackedBarData.length > 0,
      )
      .map((p: z.output<typeof chartParamsSchema>): string =>
        this.renderChart(p, plotColorPalette),
      )
      .join("");
  }

  private renderSections(
    renderParamsList: z.output<typeof renderParamsListSchema>,
  ): string {
    return renderParamsList
      .map((p: z.output<typeof renderParamsSchema>): string =>
        this.renderSection(p),
      )
      .join("\n\n");
  }
}
