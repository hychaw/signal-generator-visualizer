import type { SignalParameters } from "./signalTypes";

export interface SignalPreset {
  name: string;
  description: string;
  parameters: Partial<SignalParameters>;
}

export const SIGNAL_PRESETS: SignalPreset[] = [
  {
    name: "10 Hz sine wave",
    description: "Clean low-frequency sine wave for baseline waveform checks.",
    parameters: {
      type: "sine",
      frequency: 10,
      amplitude: 1,
      phase: 0,
      offset: 0,
      dutyCycle: 50,
    },
  },
  {
    name: "50 Hz AC-style sine wave",
    description: "Mains-style sine example kept within the 1-100 Hz UI range.",
    parameters: {
      type: "sine",
      frequency: 50,
      amplitude: 1,
      phase: 0,
      offset: 0,
      dutyCycle: 50,
    },
  },
  {
    name: "Digital clock-style square wave",
    description: "A 50% duty cycle square wave like a simple timing clock.",
    parameters: {
      type: "square",
      frequency: 20,
      amplitude: 1,
      phase: 0,
      offset: 0,
      dutyCycle: 50,
    },
  },
  {
    name: "PWM motor control example",
    description: "Pulse waveform with a narrow duty cycle for power control.",
    parameters: {
      type: "pulse",
      frequency: 25,
      amplitude: 3,
      phase: 0,
      offset: 0,
      dutyCycle: 30,
    },
  },
  {
    name: "DC offset sine wave",
    description: "Sine wave riding above zero to show bias or sensor offset.",
    parameters: {
      type: "sine",
      frequency: 8,
      amplitude: 1,
      phase: 0,
      offset: 1.5,
      dutyCycle: 50,
    },
  },
  {
    name: "Phase-shifted sine wave",
    description: "Sine wave shifted by 90 degrees for phase comparison.",
    parameters: {
      type: "sine",
      frequency: 12,
      amplitude: 1,
      phase: 90,
      offset: 0,
      dutyCycle: 50,
    },
  },
  {
    name: "Triangle test signal",
    description: "Linear ramp up and down for amplifier or filter testing.",
    parameters: {
      type: "triangle",
      frequency: 6,
      amplitude: 1.5,
      phase: 0,
      offset: 0,
      dutyCycle: 50,
    },
  },
  {
    name: "Sawtooth sweep signal",
    description: "Repeated ramp signal often used for sweep-style tests.",
    parameters: {
      type: "sawtooth",
      frequency: 15,
      amplitude: 1.2,
      phase: 0,
      offset: 0,
      dutyCycle: 50,
    },
  },
];
