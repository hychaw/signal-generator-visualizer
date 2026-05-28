import type { SignalType } from "./signalTypes";

export interface IdealSpectrumParams {
  type: SignalType;
  frequency: number;
  amplitude: number;
  offset: number;
  dutyCycle?: number;
  harmonicCount?: number;
  maxFrequency?: number;
}

export interface IdealSpectrumPoint {
  frequency: number;
  magnitude: number;
  label?: string;
}

export const DEFAULT_HARMONIC_COUNT = 12;

const MIN_VISIBLE_MAGNITUDE = 1e-9;

const isVisibleMagnitude = (magnitude: number) =>
  Number.isFinite(magnitude) && magnitude > MIN_VISIBLE_MAGNITUDE;

const addDcComponent = (
  spectrum: IdealSpectrumPoint[],
  magnitude: number,
) => {
  const dcMagnitude = Math.abs(magnitude);

  if (isVisibleMagnitude(dcMagnitude)) {
    spectrum.push({
      frequency: 0,
      magnitude: dcMagnitude,
      label: "DC",
    });
  }
};

const addHarmonic = (
  spectrum: IdealSpectrumPoint[],
  fundamentalFrequency: number,
  harmonicNumber: number,
  magnitude: number,
  maxFrequency?: number,
) => {
  const frequency = fundamentalFrequency * harmonicNumber;

  if (
    frequency < 0 ||
    (maxFrequency !== undefined && frequency > maxFrequency) ||
    !isVisibleMagnitude(magnitude)
  ) {
    return;
  }

  spectrum.push({
    frequency,
    magnitude,
    label:
      harmonicNumber === 1 ? "Fundamental" : `${harmonicNumber}th harmonic`,
  });
};

export function generateIdealSpectrum({
  type,
  frequency,
  amplitude,
  offset,
  dutyCycle = 50,
  harmonicCount = DEFAULT_HARMONIC_COUNT,
  maxFrequency,
}: IdealSpectrumParams): IdealSpectrumPoint[] {
  const spectrum: IdealSpectrumPoint[] = [];
  const safeFrequency = Math.max(0, frequency);
  const safeAmplitude = Math.max(0, Math.abs(amplitude));
  const safeHarmonicCount = Math.max(1, Math.floor(harmonicCount));
  const dutyCycleRatio = Math.min(Math.max(dutyCycle / 100, 0), 1);

  if (type === "pulse") {
    addDcComponent(spectrum, offset + safeAmplitude * dutyCycleRatio);
  } else {
    addDcComponent(spectrum, offset);
  }

  if (safeFrequency <= 0 || safeAmplitude <= 0) {
    return spectrum;
  }

  switch (type) {
    case "sine":
      addHarmonic(spectrum, safeFrequency, 1, safeAmplitude, maxFrequency);
      break;

    case "square":
      for (let index = 0; index < safeHarmonicCount; index += 1) {
        const harmonicNumber = index * 2 + 1;
        addHarmonic(
          spectrum,
          safeFrequency,
          harmonicNumber,
          safeAmplitude / harmonicNumber,
          maxFrequency,
        );
      }
      break;

    case "triangle":
      for (let index = 0; index < safeHarmonicCount; index += 1) {
        const harmonicNumber = index * 2 + 1;
        addHarmonic(
          spectrum,
          safeFrequency,
          harmonicNumber,
          safeAmplitude / harmonicNumber ** 2,
          maxFrequency,
        );
      }
      break;

    case "sawtooth":
      for (
        let harmonicNumber = 1;
        harmonicNumber <= safeHarmonicCount;
        harmonicNumber += 1
      ) {
        addHarmonic(
          spectrum,
          safeFrequency,
          harmonicNumber,
          safeAmplitude / harmonicNumber,
          maxFrequency,
        );
      }
      break;

    case "pulse":
      for (
        let harmonicNumber = 1;
        harmonicNumber <= safeHarmonicCount;
        harmonicNumber += 1
      ) {
        addHarmonic(
          spectrum,
          safeFrequency,
          harmonicNumber,
          (safeAmplitude *
            Math.abs(Math.sin(Math.PI * harmonicNumber * dutyCycleRatio))) /
            harmonicNumber,
          maxFrequency,
        );
      }
      break;
  }

  return spectrum.sort(
    (firstPoint, secondPoint) => firstPoint.frequency - secondPoint.frequency,
  );
}
