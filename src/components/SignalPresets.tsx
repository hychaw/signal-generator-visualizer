import { SIGNAL_PRESETS, type SignalPreset } from "../lib/signalPresets";
import type { SignalParameters } from "../lib/signalTypes";

interface SignalPresetsProps {
  onPresetSelect: (parameters: Partial<SignalParameters>) => void;
}

function SignalPresets({ onPresetSelect }: SignalPresetsProps) {
  const applyPreset = (preset: SignalPreset) => {
    onPresetSelect(preset.parameters);
  };

  return (
    <section className="panel presets-panel" aria-labelledby="presets-title">
      <h2 id="presets-title">Signal Presets</h2>

      <div className="preset-list">
        {SIGNAL_PRESETS.map((preset) => (
          <button
            className="preset-button"
            key={preset.name}
            type="button"
            onClick={() => applyPreset(preset)}
          >
            <span className="preset-name">{preset.name}</span>
            <span className="preset-description">{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default SignalPresets;
