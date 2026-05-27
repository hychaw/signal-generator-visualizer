import './App.css'

function App() {
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
        <article className="panel">
          <div>
            <h2>Signal Controls</h2>
            <p>
              Future controls for waveform type, frequency, amplitude, phase,
              and offset will appear here.
            </p>
          </div>
        </article>

        <article className="panel waveform-panel">
          <div>
            <h2>Waveform Display</h2>
            <p>
              A plotting area for visualizing generated signals will be added in
              a later step.
            </p>
          </div>
        </article>
      </section>

      <p className="note">
        This project is an educational engineering visualization tool.
      </p>
    </main>
  )
}

export default App
