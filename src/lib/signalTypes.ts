export type SignalType = "sine" | "square" | "triangle" | "sawtooth" | "pulse";

export interface SignalPoint {
  t: number;
  y: number;
}

export interface SignalParameters {
  type: SignalType;
  frequency: number;
  amplitude: number;
  phase: number;
  offset: number;
  dutyCycle: number;
  sampleRate: number;
  duration: number;
}

export type NumericSignalParameterKey = Exclude<keyof SignalParameters, "type">;

export interface NumericParameterRange {
  min: number;
  max: number;
  step: number;
}

export const SIGNAL_PARAMETER_RANGES: Record<
  NumericSignalParameterKey,
  NumericParameterRange
> = {
  frequency: {
    min: 1,
    max: 100,
    step: 1,
  },
  amplitude: {
    min: 0.1,
    max: 5,
    step: 0.1,
  },
  phase: {
    min: 0,
    max: 360,
    step: 1,
  },
  offset: {
    min: -5,
    max: 5,
    step: 0.1,
  },
  dutyCycle: {
    min: 1,
    max: 99,
    step: 1,
  },
  sampleRate: {
    min: 10,
    max: 192_000,
    step: 1,
  },
  duration: {
    min: 0.001,
    max: 10,
    step: 0.001,
  },
};

export const MAX_GENERATED_POINTS = 2_500;

export const DEFAULT_SIGNAL_PARAMETERS: SignalParameters = {
  type: "sine",
  frequency: 5,
  amplitude: 1,
  phase: 0,
  offset: 0,
  dutyCycle: 50,
  sampleRate: 1000,
  duration: 1,
};
