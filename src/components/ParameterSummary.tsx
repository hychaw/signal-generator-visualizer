import type { SignalParameters } from "../lib/signalTypes";

interface ParameterSummaryProps {
  parameters: SignalParameters;
}

function ParameterSummary({ parameters }: ParameterSummaryProps) {
  return (
    <section className="panel summary-panel" aria-labelledby="summary-title">
      <h2 id="summary-title">Parameter Summary</h2>

      <dl className="parameter-list">
        <div>
          <dt>Signal type</dt>
          <dd>{parameters.type}</dd>
        </div>
        <div>
          <dt>Frequency</dt>
          <dd>{parameters.frequency} Hz</dd>
        </div>
        <div>
          <dt>Amplitude</dt>
          <dd>{parameters.amplitude}</dd>
        </div>
        <div>
          <dt>Phase</dt>
          <dd>{parameters.phase} deg</dd>
        </div>
        <div>
          <dt>Offset</dt>
          <dd>{parameters.offset}</dd>
        </div>
        <div>
          <dt>Duty cycle</dt>
          <dd>{parameters.dutyCycle}%</dd>
        </div>
        <div>
          <dt>Sample rate</dt>
          <dd>{parameters.sampleRate} Hz</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{parameters.duration} s</dd>
        </div>
      </dl>
    </section>
  );
}

export default ParameterSummary;
