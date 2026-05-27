import type { SignalParameters, SignalPoint } from "./signalTypes";

const TWO_PI = Math.PI * 2;
const MIN_SAMPLE_RATE = 1;
const MAX_SAMPLE_RATE = 192_000;
const MIN_DURATION = 0.001;
const MAX_DURATION = 60;

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function degreesToRadians(degrees: number): number {
  if (!Number.isFinite(degrees)) {
    return 0;
  }

  return (degrees * Math.PI) / 180;
}

function finiteOrDefault(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function normalizedCyclePosition(
  time: number,
  frequency: number,
  phaseRadians: number,
): number {
  const phaseCycles = phaseRadians / TWO_PI;
  const rawCyclePosition = time * frequency + phaseCycles;

  return ((rawCyclePosition % 1) + 1) % 1;
}

export function generateSignal(parameters: SignalParameters): SignalPoint[] {
  const frequency = Math.abs(finiteOrDefault(parameters.frequency, 0));
  const amplitude = finiteOrDefault(parameters.amplitude, 0);
  const phaseRadians = degreesToRadians(parameters.phase);
  const offset = finiteOrDefault(parameters.offset, 0);
  const dutyCycle = clamp(parameters.dutyCycle, 1, 99) / 100;
  const sampleRate = clamp(
    Math.round(parameters.sampleRate),
    MIN_SAMPLE_RATE,
    MAX_SAMPLE_RATE,
  );
  const duration = clamp(parameters.duration, MIN_DURATION, MAX_DURATION);
  const sampleCount = Math.max(1, Math.floor(sampleRate * duration));

  return Array.from({ length: sampleCount }, (_, sampleIndex) => {
    const t = sampleIndex / sampleRate;
    const cyclePosition = normalizedCyclePosition(t, frequency, phaseRadians);
    let baseWaveform: number;

    switch (parameters.type) {
      case "sine":
        // A sine wave follows the smooth circular motion formula sin(angle).
        // The angle advances by 2*pi radians for every full signal cycle.
        baseWaveform = Math.sin(TWO_PI * frequency * t + phaseRadians);
        break;

      case "square":
        // A square wave jumps between +1 and -1. The duty cycle controls how
        // much of each cycle stays high before switching low.
        baseWaveform = cyclePosition < dutyCycle ? 1 : -1;
        break;

      case "triangle":
        // A triangle wave rises in a straight line to +1, then falls in a
        // straight line to -1. This creates a symmetric ramp up and down.
        baseWaveform = 1 - 4 * Math.abs(cyclePosition - 0.5);
        break;

      case "sawtooth":
        // A sawtooth wave is a steady ramp from -1 to +1, then it resets at
        // the start of the next cycle.
        baseWaveform = 2 * cyclePosition - 1;
        break;

      case "pulse":
        // A pulse wave uses 1 during the high part of the duty cycle and 0
        // otherwise, which is useful for digital-style on/off signals.
        baseWaveform = cyclePosition < dutyCycle ? 1 : 0;
        break;

      default:
        baseWaveform = 0;
        break;
    }

    return {
      t,
      y: offset + amplitude * baseWaveform,
    };
  });
}
