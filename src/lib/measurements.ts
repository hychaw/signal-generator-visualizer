import type { SignalParameters, SignalPoint } from "./signalTypes";

export interface SignalMeasurements {
  average: number;
  dutyCycle: number | null;
  frequency: number;
  max: number;
  min: number;
  peakToPeak: number;
  period: number;
  rms: number;
  sampleCount: number;
}

export function calculateSignalMeasurements(
  parameters: SignalParameters,
  data: SignalPoint[],
): SignalMeasurements {
  const sampleCount = data.length;

  if (sampleCount === 0) {
    return {
      average: parameters.offset,
      dutyCycle:
        parameters.type === "square" || parameters.type === "pulse"
          ? parameters.dutyCycle
          : null,
      frequency: parameters.frequency,
      max: parameters.offset,
      min: parameters.offset,
      peakToPeak: 0,
      period: parameters.frequency > 0 ? 1 / parameters.frequency : 0,
      rms: Math.abs(parameters.offset),
      sampleCount,
    };
  }

  const totals = data.reduce(
    (summary, point) => ({
      max: Math.max(summary.max, point.y),
      min: Math.min(summary.min, point.y),
      sum: summary.sum + point.y,
      sumSquares: summary.sumSquares + point.y * point.y,
    }),
    {
      max: data[0].y,
      min: data[0].y,
      sum: 0,
      sumSquares: 0,
    },
  );
  const average = totals.sum / sampleCount;

  return {
    average,
    dutyCycle:
      parameters.type === "square" || parameters.type === "pulse"
        ? parameters.dutyCycle
        : null,
    frequency: parameters.frequency,
    max: totals.max,
    min: totals.min,
    peakToPeak: totals.max - totals.min,
    period: parameters.frequency > 0 ? 1 / parameters.frequency : 0,
    rms: Math.sqrt(totals.sumSquares / sampleCount),
    sampleCount,
  };
}
