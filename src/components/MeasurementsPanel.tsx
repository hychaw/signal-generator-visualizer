import type { SignalMeasurements } from "../lib/measurements";

interface MeasurementsPanelProps {
  measurements: SignalMeasurements;
}

interface MeasurementReadout {
  label: string;
  value: string;
}

const formatMeasurement = (value: number, unit = "") => {
  const formattedValue =
    Math.abs(value) >= 100
      ? value.toFixed(1)
      : Math.abs(value) >= 10
        ? value.toFixed(2)
        : value.toFixed(3);

  return `${formattedValue}${unit}`;
};

const formatPeriod = (periodSeconds: number) => {
  if (periodSeconds < 1) {
    return formatMeasurement(periodSeconds * 1000, " ms");
  }

  return formatMeasurement(periodSeconds, " s");
};

function MeasurementsPanel({ measurements }: MeasurementsPanelProps) {
  const readouts: MeasurementReadout[] = [
    {
      label: "Frequency",
      value: formatMeasurement(measurements.frequency, " Hz"),
    },
    {
      label: "Period",
      value: formatPeriod(measurements.period),
    },
    {
      label: "Sampled Max",
      value: formatMeasurement(measurements.max, " V"),
    },
    {
      label: "Sampled Min",
      value: formatMeasurement(measurements.min, " V"),
    },
    {
      label: "Peak-to-peak",
      value: formatMeasurement(measurements.peakToPeak, " V"),
    },
    {
      label: "Average",
      value: formatMeasurement(measurements.average, " V"),
    },
    {
      label: "RMS",
      value: formatMeasurement(measurements.rms, " V"),
    },
    {
      label: "Samples",
      value: `${measurements.sampleCount.toLocaleString()} samples`,
    },
  ];

  if (measurements.dutyCycle !== null) {
    readouts.push({
      label: "Duty cycle",
      value: formatMeasurement(measurements.dutyCycle, "%"),
    });
  }

  return (
    <section className="scope-readout" aria-label="Signal measurements">
      {readouts.map((measurement) => (
        <div className="scope-measurement" key={measurement.label}>
          <span>{measurement.label}</span>
          <strong>{measurement.value}</strong>
        </div>
      ))}
    </section>
  );
}

export default MeasurementsPanel;
