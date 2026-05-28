# Signal Generator Visualizer

[Signal Generator Visualizer](https://signal-generator-visualizer.vercel.app/) is an interactive web app for exploring common engineering waveforms in both the time domain and an educational frequency-domain view. Users can adjust waveform parameters, inspect oscilloscope-style plots, compare harmonic content, view basic signal measurements, and export generated waveform data as CSV.

Repository: [github.com/hychaw/signal-generator-visualizer](https://github.com/hychaw/signal-generator-visualizer)

## Live Demo

https://signal-generator-visualizer.vercel.app/

## Project Overview

The project is designed as an educational engineering visualization tool rather than a laboratory-grade instrument. It focuses on making waveform behavior easy to inspect, compare, and export while keeping the interface approachable for learning and portfolio review.

## Key Features

- Interactive controls for sine, square, triangle, sawtooth, and pulse waveforms
- Adjustable frequency, amplitude, phase, DC offset, and duty cycle when applicable
- Oscilloscope-style time-domain plot
- Full Window and Zoomed time-domain display modes
- Zoomed mode showing approximately five cycles for easier inspection
- Adaptive sample-rate generation for clearer high-frequency waveform display
- Educational frequency-domain harmonic visualization
- Measurement readouts for frequency, period, max, min, peak-to-peak, offset, and duty cycle when applicable
- Engineering presets for common signal examples
- CSV export for generated waveform data
- Reset Parameters button
- Responsive blue oscilloscope-style interface

## Screenshots

![Signal Generator Visualizer screenshot](public/Signal%20Generator%20Visualizer%20UI.png)

## How The App Works

1. The user selects a waveform type and adjusts the available signal parameters.
2. TypeScript utility functions sanitize the inputs and generate time-domain sample points.
3. The sample rate adapts to the selected frequency so higher-frequency waveforms stay readable.
4. Recharts renders the generated waveform in either Full Window mode or Zoomed mode.
5. A separate ideal harmonic model calculates theoretical frequency components for the selected waveform.
6. Measurement cards summarize useful signal values such as frequency, period, maximum, minimum, peak-to-peak, offset, and duty cycle.
7. CSV export downloads the generated time-domain sample data for external inspection.

## Frequency-Domain Explanation

The frequency-domain panel uses an ideal harmonic model rather than a sampled FFT. This means the graph shows the expected theoretical harmonic components for each waveform type. For example, a sine wave shows one fundamental component, a square wave shows odd harmonics, a triangle wave shows weaker odd harmonics, and a sawtooth wave shows all harmonics with decreasing magnitude.

This approach was chosen to make waveform frequency content easier to understand and verify. It keeps the visualization stable and educational without introducing FFT effects such as spectral leakage, sampling-rate limits, windowing, FFT bin spacing, or scaling details. A real FFT analysis mode could be added later as a separate mode.

## Tech Stack

- React
- TypeScript
- Vite
- Recharts
- CSS
- Git and GitHub
- Vercel

## Project Workflow

- Planned the feature set, UI sections, and file structure before implementation
- Built the app incrementally with reusable React components and TypeScript utilities
- Used AI-assisted development support while manually reviewing behavior and code
- Tested locally during development with Vite
- Checked production builds with `npm run build`
- Managed source control with Git and GitHub
- Deployed the finished app with Vercel

## Installation And Local Development

Clone the repository:

```bash
git clone https://github.com/hychaw/signal-generator-visualizer.git
cd signal-generator-visualizer
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Build Instructions

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Usage Examples

- Select **Sine** and adjust frequency or phase to see a smooth periodic signal shift in time.
- Select **Square** and change duty cycle to compare timing behavior and odd-harmonic content.
- Select **Triangle** to inspect a ramp-based waveform with weaker high-frequency harmonics.
- Select **Sawtooth** to compare a sharp reset waveform against its full harmonic series.
- Select **Pulse** and adjust duty cycle to explore PWM-style signals.
- Use **Zoomed** mode to inspect roughly five cycles, then switch to **Full Window** for the full generated duration.
- Apply a preset, review the measurement cards, and export the generated samples as CSV.

## Future Improvements

- Real FFT analysis mode
- dB magnitude scale
- Window function selection
- Sampling and aliasing demo
- Two-signal superposition mode
- Noise and filter visualization
- Cursor measurement tools
- Audio playback for audible frequency ranges
- Export chart as image

## Learning Outcomes

This project strengthened practice with React component structure, TypeScript data modeling, signal generation math, Recharts visualization, browser-based CSV export, responsive interface design, Git/GitHub workflow, and Vercel deployment.

It also helped clarify the difference between a theoretical harmonic model and a sampled FFT, which is important when presenting frequency-domain visualizations in an educational tool.

## Author

Created by [How Yee Chaw](https://github.com/hychaw).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
