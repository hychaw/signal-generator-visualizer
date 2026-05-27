import type { SignalType } from "../lib/signalTypes";

interface SignalExplanationProps {
  signalType: SignalType;
}

interface SignalExplanationContent {
  title: string;
  appearance: string;
  uses: string;
  keyParameters: string;
  signalIdea: string;
}

const SIGNAL_EXPLANATIONS: Record<SignalType, SignalExplanationContent> = {
  sine: {
    title: "Sine Wave",
    appearance: "A smooth repeating curve with no sharp corners.",
    uses: "Used for AC signals, oscillators, audio tones, and frequency response testing.",
    keyParameters: "Frequency sets the pitch or repetition rate, while amplitude, phase, and offset shape its level and timing.",
    signalIdea: "y = A * sin(2*pi*f*t + phase) + offset",
  },
  square: {
    title: "Square Wave",
    appearance: "A two-level waveform that jumps between high and low values.",
    uses: "Used for digital clocks, switching circuits, timing signals, and logic testing.",
    keyParameters: "Frequency and duty cycle control the timing; amplitude and offset set the high and low levels.",
    signalIdea: "y = +A while the cycle is high, then -A while it is low.",
  },
  triangle: {
    title: "Triangle Wave",
    appearance: "A straight-line rise followed by a straight-line fall.",
    uses: "Used in modulation, waveform testing, function generators, and control experiments.",
    keyParameters: "Frequency controls how fast it ramps, and amplitude controls the ramp range.",
    signalIdea: "y rises linearly from -A to +A, then falls back to -A.",
  },
  sawtooth: {
    title: "Sawtooth Wave",
    appearance: "A ramp that climbs steadily, then snaps back sharply.",
    uses: "Used in sweep circuits, scanning systems, synchronization, and sound synthesis.",
    keyParameters: "Frequency controls reset timing, while amplitude and offset set the ramp span.",
    signalIdea: "y rises from -A to +A, then resets at the next cycle.",
  },
  pulse: {
    title: "Pulse Wave",
    appearance: "An on/off waveform with a controllable on-time.",
    uses: "Used for PWM, motor control, LED dimming, switching supplies, and duty-cycle experiments.",
    keyParameters: "Duty cycle is most important because it sets how long the signal stays on during each period.",
    signalIdea: "y = A during the on-time, then 0 during the off-time.",
  },
};

function SignalExplanation({ signalType }: SignalExplanationProps) {
  const explanation = SIGNAL_EXPLANATIONS[signalType];

  return (
    <section
      className="panel explanation-panel"
      aria-labelledby="explanation-title"
    >
      <h2 id="explanation-title">Signal Explanation</h2>
      <div className="explanation-content">
        <h3>{explanation.title}</h3>
        <p>{explanation.appearance}</p>

        <dl className="explanation-list">
          <div>
            <dt>Common uses</dt>
            <dd>{explanation.uses}</dd>
          </div>
          <div>
            <dt>Key parameters</dt>
            <dd>{explanation.keyParameters}</dd>
          </div>
          <div>
            <dt>Signal idea</dt>
            <dd>
              <code>{explanation.signalIdea}</code>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default SignalExplanation;
