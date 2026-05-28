import { useMemo, useState } from "react";
import "./App.css";

import type { DisplaySettingsState } from "./components/DisplaySettings";
import SignalControls from "./components/SignalControls";
import SignalExplanation from "./components/SignalExplanation";
import SignalPresets from "./components/SignalPresets";
import WaveformPanel from "./components/WaveformPanel";
import {
  downloadCsvFile,
  getSignalCsvFileName,
  signalDataToCsv,
} from "./lib/csvExport";
import {
  generateSignal,
  sanitizeSignalParameters,
} from "./lib/signalGenerators";
import {
  DEFAULT_SIGNAL_PARAMETERS,
  type SignalParameters,
} from "./lib/signalTypes";

function App() {
  const [parameters, setParameters] = useState<SignalParameters>(
    () => sanitizeSignalParameters(DEFAULT_SIGNAL_PARAMETERS),
  );
  const [activePresetName, setActivePresetName] = useState<string | null>(null);
  const [displaySettings, setDisplaySettings] = useState<DisplaySettingsState>({
    showFrequencySpectrum: true,
    showGrid: true,
    showMeasurements: true,
  });

  const signalData = useMemo(() => generateSignal(parameters), [parameters]);

  const applyParameters = (updates: Partial<SignalParameters>) => {
    setParameters((currentParameters) =>
      sanitizeSignalParameters({
        ...currentParameters,
        ...updates,
      }),
    );
  };

  const updateParameters = (updates: Partial<SignalParameters>) => {
    setActivePresetName(null);
    applyParameters(updates);
  };

  const applyPreset = (
    presetName: string,
    updates: Partial<SignalParameters>,
  ) => {
    setActivePresetName(presetName);
    applyParameters(updates);
  };

  const resetParameters = () => {
    setActivePresetName(null);
    setParameters(sanitizeSignalParameters(DEFAULT_SIGNAL_PARAMETERS));
  };

  const exportSignalCsv = () => {
    downloadCsvFile(
      signalDataToCsv(signalData),
      getSignalCsvFileName(parameters.type),
    );
  };

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">Engineering signal exploration</p>
        <h1>Signal Generator Visualizer</h1>
        <p className="description">
          Explore, adjust, and export common engineering waveforms in an
          oscilloscope-style interface.
        </p>
      </header>

      <section className="dashboard" aria-label="Waveform workspace">
        <div className="sidebar">
          <SignalControls
            parameters={parameters}
            onParametersChange={updateParameters}
            onResetParameters={resetParameters}
          />
          <SignalPresets
            activePresetName={activePresetName}
            onPresetSelect={applyPreset}
          />
          <SignalExplanation signalType={parameters.type} />
        </div>

        <WaveformPanel
          activePresetName={activePresetName}
          data={signalData}
          displaySettings={displaySettings}
          parameters={parameters}
          onExportCsv={exportSignalCsv}
          onDisplaySettingsChange={setDisplaySettings}
        />
      </section>

      <p className="note">
        This project is an educational engineering visualization tool.
      </p>
    </main>
  );
}

export default App;
