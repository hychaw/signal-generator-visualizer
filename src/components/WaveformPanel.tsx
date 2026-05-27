import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SignalPoint } from "../lib/signalTypes";

interface WaveformPanelProps {
  data: SignalPoint[];
  onExportCsv: () => void;
}

const formatChartValue = (value: unknown) => {
  if (typeof value === "number") {
    return value.toFixed(4);
  }

  if (typeof value === "string") {
    const numericValue = Number(value);

    if (Number.isFinite(numericValue)) {
      return numericValue.toFixed(4);
    }
  }

  return String(value);
};

function WaveformPanel({ data, onExportCsv }: WaveformPanelProps) {
  return (
    <section
      className="panel waveform-panel"
      aria-labelledby="waveform-panel-title"
    >
      <div className="waveform-details">
        <div>
          <h2 id="waveform-panel-title">Waveform Preview</h2>
          <p>{data.length.toLocaleString()} generated data points</p>
        </div>
        <button className="export-button" type="button" onClick={onExportCsv}>
          Export CSV
        </button>
      </div>

      <div className="waveform-chart" role="img" aria-label="Generated signal waveform chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 24, bottom: 28, left: 16 }}
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis
              dataKey="t"
              label={{
                value: "Time (s)",
                position: "insideBottom",
                offset: -18,
              }}
              tickFormatter={(value: number) => value.toFixed(2)}
              tickMargin={8}
              type="number"
            />
            <YAxis
              dataKey="y"
              label={{
                value: "Amplitude",
                angle: -90,
                position: "insideLeft",
                offset: 0,
              }}
              tickFormatter={(value: number) => value.toFixed(2)}
              tickMargin={8}
              type="number"
            />
            <Tooltip
              formatter={(value) => [formatChartValue(value), "Amplitude"]}
              labelFormatter={(value) => `Time: ${formatChartValue(value)} s`}
            />
            <Line
              dataKey="y"
              dot={false}
              isAnimationActive={false}
              name="Amplitude"
              stroke="#0f766e"
              strokeWidth={2}
              type="linear"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default WaveformPanel;
