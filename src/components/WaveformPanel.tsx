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
  parameters: SignalParameters;
  onExportCsv: () => void;
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
  axis: "#bdeeff",
  grid: "#1f6f93",
  line: "#22d3ee",
  reference: "#7dd3fc",
  tooltipBackground: "#061523",
  tooltipBorder: "#38bdf8",
  tooltipText: "#e0f7ff",
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
      label: "Max amplitude",
      value: formatMeasurement(max),
    },
    {
      label: "Min amplitude",
      value: formatMeasurement(min),
    },
    {
      label: "Peak-to-peak",
      value: formatMeasurement(max - min),
    },
    {
      label: "DC offset",
      value: formatMeasurement(dcOffset),
    },
  ];

  if (parameters.type === "square" || parameters.type === "pulse") {
    measurements.push({
      label: "Duty cycle",
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
  parameters,
  onExportCsv,
}: WaveformPanelProps) {
  const measurements = getMeasurements(parameters, data);
  const yAxisDomain = getOscilloscopeYAxisDomain(data);
  const signalLabel =
    parameters.type.charAt(0).toUpperCase() + parameters.type.slice(1);

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
        <div className="waveform-actions">
          <span className="scope-badge">{signalLabel}</span>
          <span className="scope-badge">{parameters.frequency} Hz</span>
          <span className="scope-badge">
            {parameters.sampleRate.toLocaleString()} samples/s
          </span>
          <button className="export-button" type="button" onClick={onExportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      <div
        className="waveform-chart"
        role="img"
        aria-label="Generated signal waveform chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 24, bottom: 28, left: 16 }}
          >
            <CartesianGrid
              stroke={chartTheme.grid}
              strokeDasharray="2 6"
            />
            <XAxis
              dataKey="t"
              label={{
                value: "Time (s)",
                position: "insideBottom",
                offset: -18,
                fill: chartTheme.axis,
              }}
              stroke={chartTheme.axis}
              tick={{ fill: chartTheme.axis }}
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
                fill: chartTheme.axis,
              }}
              stroke={chartTheme.axis}
              tick={{ fill: chartTheme.axis }}
              tickFormatter={(value: number) => value.toFixed(2)}
              tickMargin={8}
              type="number"
            />
            <ReferenceLine
              ifOverflow="extendDomain"
              stroke={chartTheme.reference}
              strokeDasharray="8 6"
              strokeWidth={1.5}
              y={0}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBackground,
                borderColor: chartTheme.tooltipBorder,
                color: chartTheme.tooltipText,
              }}
              formatter={(value) => [formatChartValue(value), "Amplitude"]}
              itemStyle={{ color: chartTheme.tooltipText }}
              labelFormatter={(value) => `Time: ${formatChartValue(value)} s`}
              labelStyle={{ color: chartTheme.tooltipText }}
            />
            <Line
              dataKey="y"
              dot={false}
              isAnimationActive={false}
              name="Amplitude"
              stroke={chartTheme.line}
              strokeWidth={2}
              type="linear"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <section className="scope-readout" aria-label="Signal measurements">
        {measurements.map((measurement) => (
          <div className="scope-measurement" key={measurement.label}>
            <span>{measurement.label}</span>
            <strong>{measurement.value}</strong>
          </div>
        ))}
      </section>
    </section>
  );
}

export default WaveformPanel;
