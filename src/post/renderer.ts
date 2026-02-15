import type { z } from "zod";
import type {
  renderParamsListSchema,
  renderParamsSchema,
  metricsInfoListSchema,
  metricsInfoSchema,
  timesSchema,
} from "./lib";

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
