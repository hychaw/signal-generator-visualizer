import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FrequencyPoint } from "../lib/frequencyAnalysis";

interface FrequencySpectrumPanelProps {
  data: FrequencyPoint[];
  nyquistFrequency: number;
  showGrid: boolean;
}

const chartTheme = {
  axis: "#bdeeff",
  bar: "#38bdf8",
  grid: "#1f6f93",
  tooltipBackground: "#061523",
  tooltipBorder: "#38bdf8",
  tooltipText: "#e0f7ff",
};

const formatFrequency = (value: number) =>
  Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(1);

const formatMagnitude = (value: number) =>
  Math.abs(value) >= 10
    ? value.toFixed(2)
    : Math.abs(value) >= 1
      ? value.toFixed(3)
      : value.toFixed(4);

function FrequencySpectrumPanel({
  data,
  nyquistFrequency,
  showGrid,
}: FrequencySpectrumPanelProps) {
  return (
    <section
      className="spectrum-panel"
      aria-labelledby="frequency-spectrum-title"
    >
      <div className="chart-heading">
        <h3 id="frequency-spectrum-title">Frequency Spectrum</h3>
        <span>Linear magnitude</span>
      </div>

      <div
        className={`scope-chart spectrum-chart${showGrid ? "" : " hide-grid"}`}
        role="img"
        aria-label="Frequency spectrum chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 14, right: 24, bottom: 28, left: 16 }}
          >
            <CartesianGrid stroke={chartTheme.grid} strokeDasharray="2 6" />
            <XAxis
              dataKey="frequency"
              domain={[0, nyquistFrequency]}
              label={{
                value: "Frequency (Hz)",
                position: "insideBottom",
                offset: -18,
                fill: chartTheme.axis,
              }}
              stroke={chartTheme.axis}
              tick={{ fill: chartTheme.axis }}
              tickFormatter={(value: number) => formatFrequency(value)}
              tickMargin={8}
              type="number"
            />
            <YAxis
              dataKey="magnitude"
              label={{
                value: "Magnitude",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                fill: chartTheme.axis,
              }}
              stroke={chartTheme.axis}
              tick={{ fill: chartTheme.axis }}
              tickFormatter={(value: number) => formatMagnitude(value)}
              tickMargin={8}
              type="number"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBackground,
                borderColor: chartTheme.tooltipBorder,
                color: chartTheme.tooltipText,
              }}
              formatter={(value) => [
                typeof value === "number" ? formatMagnitude(value) : value,
                "Magnitude",
              ]}
              itemStyle={{ color: chartTheme.tooltipText }}
              labelFormatter={(value) =>
                `Frequency: ${
                  typeof value === "number" ? formatFrequency(value) : value
                } Hz`
              }
              labelStyle={{ color: chartTheme.tooltipText }}
            />
            <Bar
              dataKey="magnitude"
              fill={chartTheme.bar}
              isAnimationActive={false}
              name="Magnitude"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default FrequencySpectrumPanel;
