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
