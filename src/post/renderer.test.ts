import { describe, expect, it } from "bun:test";
import { Renderer } from "./renderer";

describe("Renderer", () => {
  it("should return empty string for empty metricsInfo", () => {
    const renderer: Renderer = new Renderer();

    expect(
      renderer.render([
        {
          title: "Test",
          metricsInfoList: [],
          times: [],
          yAxis: {
            title: "Units",
          },
        },
      ]),
    ).toBe("");
  });

  it("should render with single metric", () => {
    const renderer: Renderer = new Renderer();
    const result: string = renderer.render([
      {
        title: "CPU Usage",
        metricsInfoList: [
          {
            color: "Red",
            name: "User CPU",
            data: [10, 20, 30],
          },
        ],
        times: [new Date("2024-01-01T00:00:00Z")],
        yAxis: {
          title: "Percentage",
          range: "0 --> 100",
        },
      },
    ]);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);

    // Verify title is included
    expect(result).toContain("### CPU Usage");

    // Verify Mermaid block is included
    expect(result).toContain("```mermaid");
    expect(result).toContain("xychart");

    // Verify color palette is set correctly
    expect(result).toContain('"plotColorPalette": "Red"');

    // Verify axis settings are included
    expect(result).toContain('x-axis "Time"');
    expect(result).toContain('y-axis "Percentage" 0 --> 100');

    // Verify bar chart is included
    expect(result).toContain("bar");

    // Verify legend is included
    expect(result).toContain("#### legends");
    expect(result).toContain("Red: User CPU");
  });

  it("should render with multiple metrics", () => {
    const renderer: Renderer = new Renderer();
    const result: string = renderer.render([
      {
        title: "System Metrics",
        metricsInfoList: [
          {
            color: "Red",
            name: "User CPU",
            data: [10, 20, 30],
          },
          {
            color: "Orange",
            name: "System CPU",
            data: [5, 10, 15],
          },
        ],
        times: [
          new Date("2024-01-01T00:00:00Z"),
          new Date("2024-01-01T00:00:05Z"),
          new Date("2024-01-01T00:00:10Z"),
        ],
        yAxis: {
          title: "%",
          range: "0 --> 100",
        },
      },
    ]);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);

    // Verify title is included
    expect(result).toContain("### System Metrics");

    // Verify multiple colors are set in color palette
    expect(result).toContain('"plotColorPalette": "Red, Orange"');

    // Verify time axis includes multiple times
    expect(result).toContain("00:00:00");
    expect(result).toContain("00:00:05");
    expect(result).toContain("00:00:10");

    // Verify axis settings are included
    expect(result).toContain('y-axis "%" 0 --> 100');

    // Verify legends for both metrics are included
    expect(result).toContain("Red: User CPU");
    expect(result).toContain("Orange: System CPU");

    // Verify 2 bar charts are included (for stacking)
    const barMatches: RegExpMatchArray | null = result.match(/bar \[/g);
    expect(barMatches).not.toBeNull();
    expect(barMatches?.length).toBe(2);
  });

  it("should handle yAxis without range", () => {
    const renderer: Renderer = new Renderer();
    const result: string = renderer.render([
      {
        title: "Memory Usage",
        metricsInfoList: [
          {
            color: "Blue",
            name: "Used Memory",
            data: [100, 200, 300],
          },
        ],
        times: [new Date()],
        yAxis: {
          title: "MB",
        },
      },
    ]);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);

    // Verify title is included
    expect(result).toContain("### Memory Usage");

    // Verify y-axis includes only title, not range
    expect(result).toContain('y-axis "MB"');
    expect(result).not.toContain('y-axis "MB" 0 -->');

    // Verify legend is included
    expect(result).toContain("Blue: Used Memory");
  });

  it("should correctly extract colors from metricsInfo", () => {
    const renderer: Renderer = new Renderer();
    const result: string = renderer.render([
      {
        title: "Test",
        metricsInfoList: [
          {
            color: "Red",
            name: "Metric 1",
            data: [1],
          },
          {
            color: "Blue",
            name: "Metric 2",
            data: [2],
          },
          {
            color: "Green",
            name: "Metric 3",
            data: [3],
          },
        ],
        times: [new Date()],
        yAxis: {
          title: "Units",
        },
      },
    ]);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);

    // Verify all colors are included in color palette
    expect(result).toContain('"plotColorPalette": "Red, Blue, Green"');

    // Verify each color is included in legend
    expect(result).toContain("Red: Metric 1");
    expect(result).toContain("Blue: Metric 2");
    expect(result).toContain("Green: Metric 3");
  });

  it("should calculate stacked data correctly", () => {
    const renderer: Renderer = new Renderer();

    // Test data: two metrics with known values
    // Metric 1: [10, 20, 30]
    // Metric 2: [5, 10, 15]
    // Stacked should be:
    // - Base (Metric 1): [0, 0, 0] + [10, 20, 30] = [10, 20, 30]
    // - Stacked (Metric 2): [10, 20, 30] + [5, 10, 15] = [15, 30, 45]

    const result: string = renderer.render([
      {
        title: "Stacked Test",
        metricsInfoList: [
          {
            color: "Red",
            name: "Base Metric",
            data: [10, 20, 30],
          },
          {
            color: "Blue",
            name: "Stacked Metric",
            data: [5, 10, 15],
          },
        ],
        times: [
          new Date("2024-01-01T00:00:00Z"),
          new Date("2024-01-01T00:00:05Z"),
          new Date("2024-01-01T00:00:10Z"),
        ],
        yAxis: {
          title: "Value",
        },
      },
    ]);

    // The result should be a valid rendered template
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain("### Stacked Test");

    // Verify stacked data is calculated correctly
    // First bar is topmost stack (cumulative): [10+5, 20+10, 30+15] = [15, 30, 45]
    expect(result).toContain("bar [15,30,45]");
    // Second bar is lower layer (Blue Metric only): [5, 10, 15]
    expect(result).toContain("bar [5,10,15]");

    // Verify legends for both metrics are included
    expect(result).toContain("Red: Base Metric");
    expect(result).toContain("Blue: Stacked Metric");
  });

  it("should handle three or more metrics in stack", () => {
    const renderer: Renderer = new Renderer();
    const result: string = renderer.render([
      {
        title: "Multi-layer Stack",
        metricsInfoList: [
          {
            color: "Red",
            name: "Layer 1",
            data: [10, 20],
          },
          {
            color: "Orange",
            name: "Layer 2",
            data: [5, 10],
          },
          {
            color: "Yellow",
            name: "Layer 3",
            data: [3, 6],
          },
        ],
        times: [
          new Date("2024-01-01T00:00:00Z"),
          new Date("2024-01-01T00:00:05Z"),
        ],
        yAxis: {
          title: "Units",
        },
      },
    ]);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);

    // Verify title is included
    expect(result).toContain("### Multi-layer Stack");

    // Verify 3 colors are set in color palette
    expect(result).toContain('"plotColorPalette": "Red, Orange, Yellow"');

    // Verify stacked data is calculated correctly
    // Layer 1: [10, 20]
    // Layer 2: [5, 10]
    // Layer 3: [3, 6]
    // Topmost stack (all layers cumulative): [3+5+10, 6+10+20] = [18, 36]
    expect(result).toContain("bar [18,36]");
    // Middle stack (Layer 3 + Layer 2): [3+5, 6+10] = [8, 16]
    expect(result).toContain("bar [8,16]");
    // Bottom layer (Layer 3 only): [3, 6]
    expect(result).toContain("bar [3,6]");

    // Verify legends for all layers are included
    expect(result).toContain("Red: Layer 1");
    expect(result).toContain("Orange: Layer 2");
    expect(result).toContain("Yellow: Layer 3");

    // Verify 3 bar charts are included
    const barMatches: RegExpMatchArray | null = result.match(/bar \[/g);
    expect(barMatches).not.toBeNull();
    expect(barMatches?.length).toBe(3);
  });

  it("should format times correctly in x-axis", () => {
    const renderer: Renderer = new Renderer();
    const result: string = renderer.render([
      {
        title: "Time Format Test",
        metricsInfoList: [
          {
            color: "Blue",
            name: "Test Metric",
            data: [10, 20, 30],
          },
        ],
        times: [
          new Date("2024-01-01T09:15:30Z"),
          new Date("2024-01-01T14:30:45Z"),
          new Date("2024-01-01T23:59:59Z"),
        ],
        yAxis: {
          title: "Value",
        },
      },
    ]);

    // Verify times are in HH:MM:SS format
    expect(result).toContain("09:15:30");
    expect(result).toContain("14:30:45");
    expect(result).toContain("23:59:59");

    // Verify x-axis definition includes time array
    expect(result).toContain('x-axis "Time"');
  });

  it("should include complete Mermaid chart structure", () => {
    const renderer: Renderer = new Renderer();
    const result: string = renderer.render([
      {
        title: "Structure Test",
        metricsInfoList: [
          {
            color: "Green",
            name: "Test",
            data: [100],
          },
        ],
        times: [new Date()],
        yAxis: {
          title: "Units",
          range: "0 --> 200",
        },
      },
    ]);

    // Verify Mermaid block start and end are included
    expect(result).toContain("```mermaid");
    expect(result).toContain("```");

    // Verify theme settings are included
    expect(result).toContain("%%{");
    expect(result).toContain('"themeVariables"');
    expect(result).toContain('"xyChart"');
    expect(result).toContain("}%%");

    // Verify xychart definition is included
    expect(result).toContain("xychart");

    // Verify legends section is included
    expect(result).toContain("#### legends");

    // Verify LaTeX format legend is included
    expect(result).toContain("$$");
    expect(result).toContain("\\color{");
    expect(result).toContain("\\verb|");
  });

  it("should handle single data point", () => {
    const renderer: Renderer = new Renderer();
    const result: string = renderer.render([
      {
        title: "Single Point",
        metricsInfoList: [
          {
            color: "Purple",
            name: "Single Metric",
            data: [42],
          },
        ],
        times: [new Date("2024-01-01T12:00:00Z")],
        yAxis: {
          title: "Value",
        },
      },
    ]);

    expect(result).toBeTruthy();
    expect(result).toContain("### Single Point");
    expect(result).toContain("bar [42]");
    expect(result).toContain("12:00:00");
    expect(result).toContain("Purple: Single Metric");
  });
});
