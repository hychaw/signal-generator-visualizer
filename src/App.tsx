import { useMemo, useState } from "react";
import "./App.css";

import ParameterSummary from "./components/ParameterSummary";
import SignalControls from "./components/SignalControls";
import SignalExplanation from "./components/SignalExplanation";
import WaveformPanel from "./components/WaveformPanel";
import { generateSignal } from "./lib/signalGenerators";
import {
  DEFAULT_SIGNAL_PARAMETERS,
  type SignalParameters,
} from "./lib/signalTypes";

function App() {
  const [parameters, setParameters] = useState<SignalParameters>(
    DEFAULT_SIGNAL_PARAMETERS,
  );

  const signalData = useMemo(() => generateSignal(parameters), [parameters]);

  const updateParameters = (updates: Partial<SignalParameters>) => {
    setParameters((currentParameters) => ({
      ...currentParameters,
      ...updates,
    }));
  };

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">Engineering signal exploration</p>
        <h1>Signal Generator Visualizer</h1>
        <p className="description">
          Explore common engineering waveforms by adjusting signal parameters.
        </p>
      </header>

      <section className="dashboard" aria-label="Waveform workspace">
        <div className="sidebar">
          <SignalControls
            parameters={parameters}
            onParametersChange={updateParameters}
          />
          <ParameterSummary parameters={parameters} />
          <SignalExplanation signalType={parameters.type} />
        </div>

        <WaveformPanel data={signalData} />
      </section>

      <p className="note">
        This project is an educational engineering visualization tool.
      </p>
    </main>
  );
}

export default App;
