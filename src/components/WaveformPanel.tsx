import type { SignalPoint } from "../lib/signalTypes";

interface WaveformPanelProps {
  data: SignalPoint[];
}

function WaveformPanel({ data }: WaveformPanelProps) {
  const previewPoints = data.slice(0, 8);

  return (
    <section
      className="panel waveform-panel"
      aria-labelledby="waveform-panel-title"
    >
      <div className="waveform-placeholder" aria-hidden="true">
        <div className="waveform-line" />
      </div>

      <div className="waveform-details">
        <h2 id="waveform-panel-title">Waveform Preview</h2>
        <p>{data.length.toLocaleString()} generated data points</p>

        <table className="point-preview">
          <caption>First generated points</caption>
          <thead>
            <tr>
              <th scope="col">t (s)</th>
              <th scope="col">y</th>
            </tr>
          </thead>
          <tbody>
            {previewPoints.map((point) => (
              <tr key={point.t}>
                <td>{point.t.toFixed(4)}</td>
                <td>{point.y.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default WaveformPanel;
