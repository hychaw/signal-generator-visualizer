import { useState } from "react";

import {
  isFiniteNumber,
  sanitizeNumericSignalParameter,
} from "../lib/signalGenerators";
import {
  SIGNAL_PARAMETER_RANGES,
  type NumericSignalParameterKey,
  type SignalParameters,
  type SignalType,
} from "../lib/signalTypes";

interface SignalControlsProps {
  parameters: SignalParameters;
  onParametersChange: (updates: Partial<SignalParameters>) => void;
}

type NumericControlKey = keyof Pick<
  SignalParameters,
  "frequency" | "amplitude" | "phase" | "offset" | "dutyCycle"
>;

interface NumericControlConfig {
  key: NumericControlKey;
  label: string;
  unit?: string;
}

const SIGNAL_TYPES: SignalType[] = [
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "pulse",
];

const NUMERIC_CONTROLS: NumericControlConfig[] = [
  {
    key: "frequency",
    label: "Frequency",
    unit: "Hz",
  },
  {
    key: "amplitude",
    label: "Amplitude",
  },
  {
    key: "phase",
    label: "Phase",
    unit: "deg",
  },
  {
    key: "offset",
    label: "DC offset",
  },
  {
    key: "dutyCycle",
    label: "Duty cycle",
    unit: "%",
  },
];

const DUTY_CYCLE_SIGNAL_TYPES: SignalType[] = ["square", "pulse"];

function formatSignalTypeLabel(signalType: SignalType): string {
  return signalType.charAt(0).toUpperCase() + signalType.slice(1);
}

function isSignalType(value: string): value is SignalType {
  return SIGNAL_TYPES.some((signalType) => signalType === value);
}

function formatParameterValue(value: number): string {
  return Number.isInteger(value) ? value.toString() : String(value);
}

function SignalControls({
  parameters,
  onParametersChange,
}: SignalControlsProps) {
  const shouldShowDutyCycle = DUTY_CYCLE_SIGNAL_TYPES.includes(parameters.type);
  const [activeInput, setActiveInput] = useState<NumericControlKey | null>(null);
  const [draftValue, setDraftValue] = useState("");

  const updateNumericParameter = (
    key: NumericSignalParameterKey,
    value: number,
  ) => {
    if (!isFiniteNumber(value)) {
      return;
    }

    onParametersChange({ [key]: sanitizeNumericSignalParameter(key, value) });
  };

  const updateDraftParameter = (key: NumericControlKey, value: string) => {
    setDraftValue(value);

    if (value.trim() === "") {
      return;
    }

    const numericValue = Number(value);

    if (isFiniteNumber(numericValue)) {
      updateNumericParameter(key, numericValue);
    }
  };

  const commitDraftParameter = (key: NumericControlKey) => {
    const numericValue = Number(draftValue);

    if (draftValue.trim() !== "" && isFiniteNumber(numericValue)) {
      updateNumericParameter(key, numericValue);
    }

    setActiveInput(null);
    setDraftValue("");
  };

  const updateSignalType = (value: string) => {
    if (!isSignalType(value)) {
      return;
    }

    onParametersChange({ type: value });
  };

  return (
    <section className="panel controls-panel" aria-labelledby="controls-title">
      <h2 id="controls-title">Signal Controls</h2>

      <label className="field">
        <span>Signal type</span>
        <select
          value={parameters.type}
          onChange={(event) => updateSignalType(event.target.value)}
        >
          {SIGNAL_TYPES.map((signalType) => (
            <option key={signalType} value={signalType}>
              {formatSignalTypeLabel(signalType)}
            </option>
          ))}
        </select>
      </label>

      {NUMERIC_CONTROLS.filter(
        (control) => control.key !== "dutyCycle" || shouldShowDutyCycle,
      ).map((control) => {
        const controlId = `signal-${control.key}`;
        const range = SIGNAL_PARAMETER_RANGES[control.key];
        const value = parameters[control.key];

        return (
          <div className="field numeric-field" key={control.key}>
            <label htmlFor={controlId}>
              {control.label}
              {control.unit ? (
                <span className="unit"> {control.unit}</span>
              ) : null}
            </label>

            <div className="parameter-input-row">
              <input
                id={controlId}
                max={range.max}
                min={range.min}
                step={range.step}
                type="range"
                value={value}
                onChange={(event) =>
                  updateNumericParameter(control.key, event.target.valueAsNumber)
                }
              />
              <div className="number-input-with-unit">
                <input
                  aria-label={`${control.label} value`}
                  max={range.max}
                  min={range.min}
                  step={range.step}
                  type="number"
                  value={
                    activeInput === control.key
                      ? draftValue
                      : formatParameterValue(value)
                  }
                  onBlur={() => commitDraftParameter(control.key)}
                  onChange={(event) =>
                    updateDraftParameter(
                      control.key,
                      event.target.value,
                    )
                  }
                  onFocus={() => {
                    setActiveInput(control.key);
                    setDraftValue(formatParameterValue(value));
                  }}
                />
                {control.unit ? (
                  <span aria-hidden="true">{control.unit}</span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default SignalControls;
