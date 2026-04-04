// Canvas metrics are measured from the GitHub Actions summary Mermaid output.
const CHART_WIDTH_PX: number = 1161;
const TICK_WIDTH_PX: number = 5;
const LABEL_WIDTH_PX: number = 107;
const REQUIRED_GAP_PX: number = LABEL_WIDTH_PX - TICK_WIDTH_PX;
const ZERO_WIDTH_ZERO: string = "\u200b";
const ZERO_WIDTH_ONE: string = "\u200c";
const ZERO_WIDTH_SENTINEL: string = "\u200d";

type TimePoints = ReadonlyArray<Date>;

export class TimeLabelFormatter {
  public static calculateLabelStep(count: number): number {
    if (count <= 2) {
      return 1;
    }

    const totalGapWidth: number = CHART_WIDTH_PX - TICK_WIDTH_PX * count;
    if (totalGapWidth <= 0) {
      return count;
    }

    const numerator: number = REQUIRED_GAP_PX * (count - 1);
    return Math.max(1, Math.ceil(numerator / totalGapWidth));
  }

  public static format(times: TimePoints): string[] {
    if (times.length === 0) {
      return [];
    }

    const formattedTimes: string[] = times.map((d: Date): string =>
      d.toLocaleTimeString("en-GB", { hour12: false }),
    );

    if (formattedTimes.length <= 2) {
      return formattedTimes;
    }

    const labelStep: number = TimeLabelFormatter.calculateLabelStep(
      formattedTimes.length,
    );
    if (labelStep <= 1) {
      return formattedTimes;
    }

    const lastIndex: number = formattedTimes.length - 1;
    const totalInteriorPositions: number = Math.max(
      formattedTimes.length - 2,
      0,
    );
    const estimatedInteriorLabels: number = Math.max(
      Math.floor(lastIndex / labelStep) - 1,
      0,
    );
    const usableInteriorLabels: number = Math.min(
      totalInteriorPositions,
      estimatedInteriorLabels,
    );

    const visibleLabelIndices: Set<number> = new Set<number>([0, lastIndex]);
    if (usableInteriorLabels > 0) {
      const spacing: number =
        totalInteriorPositions / (usableInteriorLabels + 1);
      for (let slot: number = 1; slot <= usableInteriorLabels; slot += 1) {
        const targetIndex: number = 1 + Math.round(slot * spacing);
        let clamped: number = Math.min(lastIndex - 1, Math.max(1, targetIndex));
        while (visibleLabelIndices.has(clamped) && clamped < lastIndex - 1) {
          clamped += 1;
        }
        visibleLabelIndices.add(clamped);
      }
    }

    return formattedTimes.map((label: string, index: number): string =>
      visibleLabelIndices.has(index)
        ? label
        : TimeLabelFormatter.encodeHiddenLabel(index),
    );
  }

  private static encodeHiddenLabel(index: number): string {
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
  }
}
