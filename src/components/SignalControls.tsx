import type { SignalParameters, SignalType } from "../lib/signalTypes";

interface SignalControlsProps {
  parameters: SignalParameters;
  onParametersChange: (updates: Partial<SignalParameters>) => void;
}

type NumericParameterKey = keyof Pick<
  SignalParameters,
  "frequency" | "amplitude" | "phase" | "offset" | "dutyCycle"
>;

interface NumericControlConfig {
  key: NumericParameterKey;
  label: string;
  min: number;
  max: number;
  step: number;
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
    min: 1,
    max: 100,
    step: 1,
    unit: "Hz",
  },
  {
    key: "amplitude",
    label: "Amplitude",
    min: 0.1,
    max: 5,
    step: 0.1,
  },
  {
    key: "phase",
    label: "Phase",
    min: 0,
    max: 360,
    step: 1,
    unit: "deg",
  },
  {
    key: "offset",
    label: "DC offset",
    min: -5,
    max: 5,
    step: 0.1,
  },
  {
    key: "dutyCycle",
    label: "Duty cycle",
    min: 1,
    max: 99,
    step: 1,
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

function SignalControls({
  parameters,
  onParametersChange,
}: SignalControlsProps) {
  const shouldShowDutyCycle = DUTY_CYCLE_SIGNAL_TYPES.includes(parameters.type);

  const updateNumericParameter = (
    key: NumericParameterKey,
    value: number,
  ) => {
    if (!Number.isFinite(value)) {
      return;
    }

    onParametersChange({ [key]: value });
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
                max={control.max}
                min={control.min}
                step={control.step}
                type="range"
                value={value}
                onChange={(event) =>
                  updateNumericParameter(control.key, event.target.valueAsNumber)
                }
              />
              <div className="number-input-with-unit">
                <input
                  aria-label={`${control.label} value`}
                  max={control.max}
                  min={control.min}
                  step={control.step}
                  type="number"
                  value={value}
                  onChange={(event) =>
                    updateNumericParameter(
                      control.key,
                      event.target.valueAsNumber,
                    )
                  }
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
