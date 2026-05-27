import type { SignalParameters, SignalPoint } from "./signalTypes";

const TWO_PI = Math.PI * 2;
const MIN_FREQUENCY = 0;
const MAX_FREQUENCY = 20_000;
const MIN_AMPLITUDE = 0;
const MAX_AMPLITUDE = 1_000;
const MIN_SAMPLE_RATE = 10;
const MAX_SAMPLE_RATE = 192_000;
const MIN_DURATION = 0.001;
const MAX_DURATION = 10;
const MIN_DUTY_CYCLE = 1;
const MAX_DUTY_CYCLE = 99;
const MAX_UNIFORM_DISPLAY_POINTS = 2_500;
const MAX_EDGE_MARKER_CYCLES = 200;
const EDGE_EPSILON_SECONDS = 1e-9;

interface SanitizedSignalParameters extends SignalParameters {
  dutyCycle: number;
  phaseCycles: number;
  sampleCount: number;
  sampleStep: number;
}

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

export function normalizePhase(phaseDegrees: number): number {
  if (!Number.isFinite(phaseDegrees)) {
    return 0;
  }

  return (((phaseDegrees / 360) % 1) + 1) % 1;
}

export function getCyclePosition(
  time: number,
  frequency: number,
  phaseCycles = 0,
): number {
  const rawCyclePosition = time * frequency + phaseCycles;

  return ((rawCyclePosition % 1) + 1) % 1;
}

export function sanitizeSignalParameters(
  parameters: SignalParameters,
): SanitizedSignalParameters {
  const frequency = clamp(
    Math.abs(parameters.frequency),
    MIN_FREQUENCY,
    MAX_FREQUENCY,
  );
  const amplitude = clamp(
    Math.abs(parameters.amplitude),
    MIN_AMPLITUDE,
    MAX_AMPLITUDE,
  );
  const offset = Number.isFinite(parameters.offset) ? parameters.offset : 0;
  const phase = Number.isFinite(parameters.phase) ? parameters.phase : 0;
  const dutyCycle = clamp(
    parameters.dutyCycle,
    MIN_DUTY_CYCLE,
    MAX_DUTY_CYCLE,
  );
  const sampleRate = clamp(
    Math.round(parameters.sampleRate),
    MIN_SAMPLE_RATE,
    MAX_SAMPLE_RATE,
  );
  const duration = clamp(parameters.duration, MIN_DURATION, MAX_DURATION);
  const requestedSampleCount = Math.max(
    2,
    Math.floor(sampleRate * duration) + 1,
  );
  const sampleCount = Math.min(requestedSampleCount, MAX_UNIFORM_DISPLAY_POINTS);

  return {
    ...parameters,
    frequency,
    amplitude,
    offset,
    phase,
    phaseCycles: normalizePhase(phase),
    dutyCycle,
    sampleRate,
    duration,
    sampleCount,
    sampleStep: duration / (sampleCount - 1),
  };
}

function waveformValue(
  type: SignalParameters["type"],
  cyclePosition: number,
  dutyCycle: number,
): number {
  switch (type) {
    case "sine":
      // A sine wave is circular motion projected onto one axis. One cycle is
      // 2*pi radians, so a cycle position of 0.25 is pi/2 radians.
      return Math.sin(TWO_PI * cyclePosition);

    case "square":
      // A square wave is bipolar: it switches between +1 and -1. The duty
      // cycle controls how long the high side lasts before the low side begins.
      return cyclePosition < dutyCycle ? 1 : -1;

    case "triangle":
      // A triangle wave uses straight-line ramps. This formula moves from -1
      // up to +1, then back down to -1 over each normalized cycle.
      return 1 - 4 * Math.abs(cyclePosition - 0.5);

    case "sawtooth":
      // A sawtooth wave is a straight ramp from -1 to +1 followed by an
      // instant reset at the cycle boundary.
      return 2 * cyclePosition - 1;

    case "pulse":
      // A pulse wave is unipolar: it is 1 while high and 0 while low. Amplitude
      // scales only the high portion, then the DC offset shifts the whole wave.
      return cyclePosition < dutyCycle ? 1 : 0;
  }
}

function makePoint(
  parameters: SanitizedSignalParameters,
  time: number,
): SignalPoint {
  const cyclePosition =
    parameters.frequency === 0
      ? parameters.phaseCycles
      : getCyclePosition(time, parameters.frequency, parameters.phaseCycles);
  const baseWaveform = waveformValue(
    parameters.type,
    cyclePosition,
    parameters.dutyCycle / 100,
  );
  const y = parameters.offset + parameters.amplitude * baseWaveform;

  return {
    t: time,
    y: Number.isFinite(y) ? y : parameters.offset,
  };
}

function getTransitionTimes(parameters: SanitizedSignalParameters): number[] {
  if (
    parameters.frequency === 0 ||
    (parameters.type !== "square" && parameters.type !== "pulse") ||
    parameters.frequency * parameters.duration > MAX_EDGE_MARKER_CYCLES
  ) {
    return [];
  }

  const period = 1 / parameters.frequency;
  const dutyCycle = parameters.dutyCycle / 100;
  const phaseShiftSeconds = parameters.phaseCycles / parameters.frequency;
  const transitionTimes: number[] = [];

  for (
    let cycleIndex = -1;
    cycleIndex * period - phaseShiftSeconds <= parameters.duration;
    cycleIndex += 1
  ) {
    const cycleStart = cycleIndex * period - phaseShiftSeconds;
    const highToLow = cycleStart + dutyCycle * period;

    for (const transitionTime of [cycleStart, highToLow]) {
      if (transitionTime > 0 && transitionTime < parameters.duration) {
        transitionTimes.push(
          Math.max(0, transitionTime - EDGE_EPSILON_SECONDS),
          Math.min(parameters.duration, transitionTime + EDGE_EPSILON_SECONDS),
        );
      }
    }
  }

  return transitionTimes;
}

export function generateSignal(parameters: SignalParameters): SignalPoint[] {
  const sanitizedParameters = sanitizeSignalParameters(parameters);
  const points = Array.from(
    { length: sanitizedParameters.sampleCount },
    (_, sampleIndex) =>
      makePoint(sanitizedParameters, sampleIndex * sanitizedParameters.sampleStep),
  );

  const transitionPoints = getTransitionTimes(sanitizedParameters).map((time) =>
    makePoint(sanitizedParameters, time),
  );

  return [...points, ...transitionPoints].sort(
    (firstPoint, secondPoint) => firstPoint.t - secondPoint.t,
  );
}
