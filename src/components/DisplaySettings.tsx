export interface DisplaySettingsState {
  showFrequencySpectrum: boolean;
  showGrid: boolean;
  showMeasurements: boolean;
}

interface DisplaySettingsProps {
  settings: DisplaySettingsState;
  onSettingsChange: (settings: DisplaySettingsState) => void;
}

const DISPLAY_OPTIONS: Array<{
  key: keyof DisplaySettingsState;
  label: string;
}> = [
  {
    key: "showFrequencySpectrum",
    label: "Spectrum",
  },
  {
    key: "showMeasurements",
    label: "Measurements",
  },
  {
    key: "showGrid",
    label: "Grid",
  },
];

function DisplaySettings({
  settings,
  onSettingsChange,
}: DisplaySettingsProps) {
  return (
    <section className="display-settings" aria-label="Display settings">
      <span>Display Settings</span>
      <div>
        {DISPLAY_OPTIONS.map((option) => (
          <label key={option.key}>
            <input
              checked={settings[option.key]}
              type="checkbox"
              onChange={(event) =>
                onSettingsChange({
                  ...settings,
                  [option.key]: event.target.checked,
                })
              }
            />
            {option.label}
          </label>
        ))}
      </div>
    </section>
  );
}

export default DisplaySettings;
