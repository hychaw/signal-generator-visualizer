import { SIGNAL_PRESETS, type SignalPreset } from "../lib/signalPresets";
import type { SignalParameters } from "../lib/signalTypes";

interface SignalPresetsProps {
  activePresetName: string | null;
  onPresetSelect: (
    presetName: string,
    parameters: Partial<SignalParameters>,
  ) => void;
}

function SignalPresets({
  activePresetName,
  onPresetSelect,
}: SignalPresetsProps) {
  const applyPreset = (preset: SignalPreset) => {
    onPresetSelect(preset.name, preset.parameters);
  };

  return (
    <section className="panel presets-panel" aria-labelledby="presets-title">
      <div className="panel-heading">
        <h2 id="presets-title">Signal Presets</h2>
        <span className="preset-state">
          {activePresetName ?? "Custom Signal"}
        </span>
      </div>

      <div className="preset-list">
        {SIGNAL_PRESETS.map((preset) => {
          const isActive = preset.name === activePresetName;

          return (
            <button
              aria-pressed={isActive}
              className={`preset-button${isActive ? " is-active" : ""}`}
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
            >
              <span className="preset-name">{preset.name}</span>
              <span className="preset-description">{preset.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default SignalPresets;
