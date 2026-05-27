import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SignalParameters, SignalPoint } from "../lib/signalTypes";

interface WaveformPanelProps {
  data: SignalPoint[];
  oscilloscopeMode: boolean;
  parameters: SignalParameters;
  onExportCsv: () => void;
  onOscilloscopeModeChange: (enabled: boolean) => void;
}

interface Measurement {
  label: string;
  value: string;
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

const chartTheme = {
  standard: {
    axis: "#475569",
    grid: "#e2e8f0",
    line: "#0f766e",
    tooltipBackground: "#ffffff",
    tooltipBorder: "#cbd5e1",
    tooltipText: "#172033",
  },
  oscilloscope: {
    axis: "#c8facc",
    grid: "#2f6f55",
    line: "#86efac",
    tooltipBackground: "#0c1f18",
    tooltipBorder: "#3f8f68",
    tooltipText: "#ecfdf5",
  },
};

const formatMeasurement = (value: number, unit = "") => {
  const formattedValue =
    Math.abs(value) >= 100
      ? value.toFixed(1)
      : Math.abs(value) >= 10
        ? value.toFixed(2)
        : value.toFixed(3);

  return `${formattedValue}${unit}`;
};

const getDataRange = (data: SignalPoint[]) => {
  if (data.length === 0) {
    return { max: 0, min: 0 };
  }

  return data.reduce(
    (range, point) => ({
      max: Math.max(range.max, point.y),
      min: Math.min(range.min, point.y),
    }),
    { max: data[0].y, min: data[0].y },
  );
};

const getMeasurements = (
  parameters: SignalParameters,
  data: SignalPoint[],
): Measurement[] => {
  const { max, min } = getDataRange(data);
  const period = parameters.frequency > 0 ? 1 / parameters.frequency : 0;
  const dcOffset =
    data.length > 0
      ? data.reduce((total, point) => total + point.y, 0) / data.length
      : parameters.offset;
  const measurements: Measurement[] = [
    {
      label: "Frequency",
      value: formatMeasurement(parameters.frequency, " Hz"),
    },
    {
      label: "Period",
      value: formatMeasurement(period, " s"),
    },
    {
      label: "Max",
      value: formatMeasurement(max),
    },
    {
      label: "Min",
      value: formatMeasurement(min),
    },
    {
      label: "Peak-to-Peak",
      value: formatMeasurement(max - min),
    },
    {
      label: "Offset",
      value: formatMeasurement(dcOffset),
    },
  ];

  if (parameters.type === "square" || parameters.type === "pulse") {
    measurements.push({
      label: "Duty Cycle",
      value: formatMeasurement(parameters.dutyCycle, "%"),
    });
  }

  return measurements;
};

const getOscilloscopeYAxisDomain = (data: SignalPoint[]): [number, number] => {
  const { max, min } = getDataRange(data);
  const lowerBound = Math.min(min, 0);
  const upperBound = Math.max(max, 0);
  const padding = Math.max((upperBound - lowerBound) * 0.08, 0.2);

  return [lowerBound - padding, upperBound + padding];
};

function WaveformPanel({
  data,
  oscilloscopeMode,
  parameters,
  onExportCsv,
  onOscilloscopeModeChange,
}: WaveformPanelProps) {
  const theme = oscilloscopeMode ? chartTheme.oscilloscope : chartTheme.standard;
  const measurements = getMeasurements(parameters, data);
  const yAxisDomain = oscilloscopeMode
    ? getOscilloscopeYAxisDomain(data)
    : undefined;

  return (
    <section
      className={`panel waveform-panel${oscilloscopeMode ? " waveform-panel-oscilloscope" : ""}`}
      aria-labelledby="waveform-panel-title"
    >
      <div className="waveform-details">
        <div>
          <h2 id="waveform-panel-title">Waveform Preview</h2>
          <p>{data.length.toLocaleString()} generated data points</p>
        </div>
        <div className="waveform-actions">
          <label className="mode-toggle">
            <input
              checked={oscilloscopeMode}
              onChange={(event) =>
                onOscilloscopeModeChange(event.target.checked)
              }
              type="checkbox"
            />
            <span className="mode-toggle-track" aria-hidden="true">
              <span className="mode-toggle-thumb" />
            </span>
            <span>Oscilloscope Mode</span>
          </label>
          <button className="export-button" type="button" onClick={onExportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      <div
        className={`waveform-chart${oscilloscopeMode ? " waveform-chart-oscilloscope" : ""}`}
        role="img"
        aria-label="Generated signal waveform chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 24, bottom: 28, left: 16 }}
          >
            <CartesianGrid
              stroke={theme.grid}
              strokeDasharray={oscilloscopeMode ? "2 6" : "4 4"}
            />
            <XAxis
              dataKey="t"
              label={{
                value: "Time (s)",
                position: "insideBottom",
                offset: -18,
                fill: theme.axis,
              }}
              stroke={theme.axis}
              tick={{ fill: theme.axis }}
              tickFormatter={(value: number) => value.toFixed(2)}
              tickMargin={8}
              type="number"
            />
            <YAxis
              dataKey="y"
              domain={yAxisDomain}
              label={{
                value: "Amplitude",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                fill: theme.axis,
              }}
              stroke={theme.axis}
              tick={{ fill: theme.axis }}
              tickFormatter={(value: number) => value.toFixed(2)}
              tickMargin={8}
              type="number"
            />
            {oscilloscopeMode && (
              <ReferenceLine
                ifOverflow="extendDomain"
                stroke="#7dd3a0"
                strokeDasharray="8 6"
                strokeWidth={1.5}
                y={0}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: theme.tooltipBackground,
                borderColor: theme.tooltipBorder,
                color: theme.tooltipText,
              }}
              formatter={(value) => [formatChartValue(value), "Amplitude"]}
              itemStyle={{ color: theme.tooltipText }}
              labelFormatter={(value) => `Time: ${formatChartValue(value)} s`}
              labelStyle={{ color: theme.tooltipText }}
            />
            <Line
              dataKey="y"
              dot={false}
              isAnimationActive={false}
              name="Amplitude"
              stroke={theme.line}
              strokeWidth={2}
              type="linear"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {oscilloscopeMode && (
        <section
          className="scope-readout"
          aria-label="Oscilloscope measurements"
        >
          {measurements.map((measurement) => (
            <div className="scope-measurement" key={measurement.label}>
              <span>{measurement.label}</span>
              <strong>{measurement.value}</strong>
            </div>
          ))}
        </section>
      )}
    </section>
  );
}

export default WaveformPanel;
