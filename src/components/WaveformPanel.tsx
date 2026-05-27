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
  activePresetName: string | null;
  data: SignalPoint[];
  parameters: SignalParameters;
  onExportCsv: () => void;
}

interface Measurement {
  label: string;
  value: string;
}

interface YAxisScale {
  domain: [number, number];
  max: number;
  min: number;
  ticks: number[];
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

const formatSeconds = (value: number) => `${value.toFixed(4)} s`;

const formatAmplitude = (value: number) => {
  if (Math.abs(value) < 0.0005) {
    return "0";
  }

  const roundedValue =
    Math.abs(value) >= 10
      ? value.toFixed(2)
      : Math.abs(value) >= 1
        ? value.toFixed(3)
        : value.toFixed(4);

  return roundedValue.replace(/\.?0+$/, "");
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

const formatScale = (value: number, unit: string) => {
  const formattedValue =
    Math.abs(value) >= 10
      ? value.toFixed(2)
      : Math.abs(value) >= 1
        ? value.toFixed(3)
        : value.toFixed(4);

  return `${formattedValue.replace(/\.?0+$/, "")} ${unit}`;
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
      label: "Vpp",
      value: formatMeasurement(max - min),
    },
    {
      label: "Offset",
      value: formatMeasurement(dcOffset),
    },
  ];

  if (parameters.type === "square" || parameters.type === "pulse") {
    measurements.push({
      label: "Duty",
      value: formatMeasurement(parameters.dutyCycle, "%"),
    });
  }

  return measurements;
};

const getNiceStep = (span: number, targetTickCount: number) => {
  const rawStep = span / Math.max(targetTickCount - 1, 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalizedStep = rawStep / magnitude;
  const niceMultiplier =
    normalizedStep <= 1
      ? 1
      : normalizedStep <= 2
        ? 2
        : normalizedStep <= 5
          ? 5
          : 10;

  return niceMultiplier * magnitude;
};

const getNiceTicks = (
  lowerBound: number,
  upperBound: number,
  targetTickCount = 7,
) => {
  const step = getNiceStep(upperBound - lowerBound, targetTickCount);
  const firstTick = Math.ceil(lowerBound / step) * step;
  const ticks: number[] = [];

  for (
    let tick = firstTick;
    tick <= upperBound + step * 0.5;
    tick += step
  ) {
    ticks.push(Number(tick.toFixed(10)));
  }

  return ticks;
};

const getOscilloscopeYAxisScale = (data: SignalPoint[]): YAxisScale => {
  const { max, min } = getDataRange(data);
  const signalSpan = max - min;
  const fallbackSpan = Math.max(Math.abs(max), Math.abs(min), 1);
  const padding = signalSpan > 0 ? signalSpan * 0.08 : fallbackSpan * 0.16;
  const lowerBound = min - padding;
  const upperBound = max + padding;

  return {
    domain: [lowerBound, upperBound],
    max,
    min,
    ticks: getNiceTicks(lowerBound, upperBound),
  };
};

function WaveformPanel({
  activePresetName,
  data,
  parameters,
  onExportCsv,
}: WaveformPanelProps) {
  const measurements = getMeasurements(parameters, data);
  const yAxisScale = getOscilloscopeYAxisScale(data);
  const signalLabel =
    parameters.type.charAt(0).toUpperCase() + parameters.type.slice(1);
  const timePerDivision = parameters.duration / 10;
  const amplitudePerDivision = (yAxisScale.domain[1] - yAxisScale.domain[0]) / 8;
  const setupLabel = activePresetName ?? "Custom Signal";
  const showMinMaxMarkers = yAxisScale.max !== yAxisScale.min;
  const hasDutyCycle = parameters.type === "square" || parameters.type === "pulse";

  return (
    <section
      className="panel waveform-panel"
      aria-labelledby="waveform-panel-title"
    >
      <div className="waveform-details">
        <div>
          <h2 id="waveform-panel-title">Waveform Preview</h2>
          <p>{setupLabel} - {data.length.toLocaleString()} generated points</p>
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

      <div className="scope-meta" aria-label="Oscilloscope setup">
        <span>
          <strong>Time window</strong>
          {formatScale(parameters.duration, "s")}
        </span>
        <span>
          <strong>Sample rate</strong>
          {parameters.sampleRate.toLocaleString()} samples/s
        </span>
        <span>
          <strong>Horizontal</strong>
          {formatScale(timePerDivision, "s/div")}
        </span>
        <span>
          <strong>Vertical</strong>
          {formatScale(amplitudePerDivision, "amplitude/div")}
        </span>
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
              domain={yAxisScale.domain}
              label={{
                value: "Amplitude",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                fill: chartTheme.axis,
              }}
              stroke={chartTheme.axis}
              ticks={yAxisScale.ticks}
              tick={{ fill: chartTheme.axis }}
              tickFormatter={(value: number) => formatAmplitude(value)}
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
            {showMinMaxMarkers ? (
              <>
                <ReferenceLine
                  ifOverflow="extendDomain"
                  label={{
                    value: `max ${formatAmplitude(yAxisScale.max)}`,
                    fill: chartTheme.axis,
                    fontSize: 12,
                    position: "insideTopRight",
                  }}
                  stroke={chartTheme.reference}
                  strokeDasharray="4 6"
                  strokeOpacity={0.72}
                  y={yAxisScale.max}
                />
                <ReferenceLine
                  ifOverflow="extendDomain"
                  label={{
                    value: `min ${formatAmplitude(yAxisScale.min)}`,
                    fill: chartTheme.axis,
                    fontSize: 12,
                    position: "insideBottomRight",
                  }}
                  stroke={chartTheme.reference}
                  strokeDasharray="4 6"
                  strokeOpacity={0.72}
                  y={yAxisScale.min}
                />
              </>
            ) : null}
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBackground,
                borderColor: chartTheme.tooltipBorder,
                color: chartTheme.tooltipText,
              }}
              formatter={(value) => [
                typeof value === "number"
                  ? formatAmplitude(value)
                  : formatChartValue(value),
                "Amplitude",
              ]}
              itemStyle={{ color: chartTheme.tooltipText }}
              labelFormatter={(value) =>
                `Time: ${
                  typeof value === "number"
                    ? formatSeconds(value)
                    : `${formatChartValue(value)} s`
                }`
              }
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

      <section
        className={`scope-readout${hasDutyCycle ? " has-duty-cycle" : ""}`}
        aria-label="Signal measurements"
      >
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
