import type { SignalPoint } from "./signalTypes";

export interface FrequencyPoint {
  frequency: number;
  magnitude: number;
}

const MAX_DFT_SAMPLES = 2048;

function getSortedFiniteData(data: SignalPoint[]): SignalPoint[] {
  return [...data]
    .filter((point) => Number.isFinite(point.t) && Number.isFinite(point.y))
    .sort((firstPoint, secondPoint) => firstPoint.t - secondPoint.t);
}

function interpolateUniformSamples(
  sortedData: SignalPoint[],
  sampleRate: number,
): number[] {
  if (sortedData.length < 2) {
    return sortedData.map((point) => point.y);
  }

  const duration = sortedData[sortedData.length - 1].t - sortedData[0].t;
  const sampleCount = Math.min(
    Math.max(2, Math.floor(duration * sampleRate) + 1),
    MAX_DFT_SAMPLES,
  );
  const startTime = sortedData[0].t;

  if (duration <= 0) {
    return sortedData.slice(0, sampleCount).map((point) => point.y);
  }

  const samples: number[] = [];
  let sourceIndex = 0;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const targetTime = startTime + sampleIndex / sampleRate;

    while (
      sourceIndex < sortedData.length - 2 &&
      sortedData[sourceIndex + 1].t < targetTime
    ) {
      sourceIndex += 1;
    }

    const leftPoint = sortedData[sourceIndex];
    const rightPoint = sortedData[sourceIndex + 1] ?? leftPoint;
    const interval = rightPoint.t - leftPoint.t;

    if (interval <= 0) {
      samples.push(leftPoint.y);
      continue;
    }

    const interpolationAmount = (targetTime - leftPoint.t) / interval;
    samples.push(
      leftPoint.y + (rightPoint.y - leftPoint.y) * interpolationAmount,
    );
  }

  return samples;
}

export function calculateFrequencySpectrum(
  data: SignalPoint[],
  sampleRate: number,
): FrequencyPoint[] {
  const sortedData = getSortedFiniteData(data);
  const samples = interpolateUniformSamples(sortedData, sampleRate);

  if (samples.length < 2 || sampleRate <= 0) {
    return [];
  }

  const binCount = Math.floor(samples.length / 2);
  const nyquistFrequency = sampleRate / 2;

  return Array.from({ length: binCount + 1 }, (_, frequencyIndex) => {
    let real = 0;
    let imaginary = 0;

    for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex += 1) {
      const angle =
        (-2 * Math.PI * frequencyIndex * sampleIndex) / samples.length;

      real += samples[sampleIndex] * Math.cos(angle);
      imaginary += samples[sampleIndex] * Math.sin(angle);
    }

    const scale = frequencyIndex === 0 ? 1 / samples.length : 2 / samples.length;
    const magnitude = Math.sqrt(real * real + imaginary * imaginary) * scale;

    const frequency = (frequencyIndex * sampleRate) / samples.length;

    return {
      frequency,
      magnitude,
    };
  }).filter((point) => point.frequency <= nyquistFrequency);
}
