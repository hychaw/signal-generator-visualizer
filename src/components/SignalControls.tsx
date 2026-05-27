import type { SignalParameters, SignalType } from "../lib/signalTypes";

interface SignalControlsProps {
  parameters: SignalParameters;
  onParametersChange: (updates: Partial<SignalParameters>) => void;
}

const SIGNAL_TYPES: SignalType[] = [
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "pulse",
];

function SignalControls({
  parameters,
  onParametersChange,
}: SignalControlsProps) {
  return (
    <section className="panel controls-panel" aria-labelledby="controls-title">
      <h2 id="controls-title">Signal Controls</h2>

      <label className="field">
        <span>Signal type</span>
        <select
          value={parameters.type}
          onChange={(event) =>
            onParametersChange({ type: event.target.value as SignalType })
          }
        >
          {SIGNAL_TYPES.map((signalType) => (
            <option key={signalType} value={signalType}>
              {signalType}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Frequency (Hz)</span>
        <input
          min="0"
          step="0.1"
          type="number"
          value={parameters.frequency}
          onChange={(event) =>
            onParametersChange({ frequency: event.target.valueAsNumber })
          }
        />
      </label>

      <label className="field">
        <span>Amplitude</span>
        <input
          step="0.1"
          type="number"
          value={parameters.amplitude}
          onChange={(event) =>
            onParametersChange({ amplitude: event.target.valueAsNumber })
          }
        />
      </label>
    </section>
  );
}

export default SignalControls;
