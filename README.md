# Signal Generator Visualizer

Signal Generator Visualizer is an interactive React + TypeScript web app for visualizing common engineering waveforms in a blue oscilloscope-style interface. Users can adjust signal parameters, view measurement readouts, apply presets, reset parameters, and export generated waveform samples as CSV data.

## Live Demo

View the production app here:

https://signal-generator-visualizer.vercel.app/

## Screenshot

![Signal Generator Visualizer Screenshot](public/Signal%20Generator%20Visualizer%20UI.png)

## Overview

The app helps users explore how waveform parameters affect signal shape over time. It is useful for engineering learning, quick experimentation, and demonstrating frontend portfolio skills through a responsive, data-driven React interface.

## Features

- Sine, square, triangle, sawtooth, and pulse waveforms
- Adjustable frequency, amplitude, phase, DC offset, and duty cycle where applicable
- Blue oscilloscope-style waveform display
- Frequency-domain spectrum view
- DFT-based signal analysis from generated waveform samples
- Adaptive visible time window so higher-frequency signals remain readable
- Real-time waveform updates
- Measurement readouts for frequency, period, max/min voltage, peak-to-peak voltage, average value, RMS voltage, sample count, and duty cycle where relevant
- Improved oscilloscope display with grid, zero reference, time/div, volts/div, and compact display toggles
- Engineering signal presets
- Reset Parameters button
- CSV export for generated waveform samples
- Educational explanation panel
- Responsive dashboard-style UI

## Tech Stack

- Vite
- React
- TypeScript
- Recharts
- CSS
- Git and GitHub
- Vercel

## How It Works

1. The user selects a signal type and adjusts the available parameters.
2. Internal time-domain samples are generated from the selected signal parameters for measurements, frequency-domain analysis, and CSV export.
3. The time-domain plot uses an adaptive visible time window so low frequencies can show up to one second while higher frequencies show only a few readable cycles.
4. Frequency-domain data is calculated from the generated samples with a TypeScript DFT utility and displayed as a one-sided spectrum up to the Nyquist frequency.
5. Recharts displays both the waveform and frequency spectrum in the oscilloscope-style panel.
6. Measurement values are computed from the waveform data, including average value and RMS voltage.
7. CSV export converts the current waveform data into downloadable sample rows.

## Project Structure

```text
src/
  components/
  lib/
  App.tsx
  main.tsx
public/
  Signal Generator Visualizer UI.png
```

- `src/components/` contains the main UI sections.
- `src/lib/` contains signal math, types, presets, and CSV export helpers.
- `src/App.tsx` connects app state and layout.
- `src/main.tsx` mounts the React app.
- `public/` stores the screenshot and other static assets.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/hychaw/signal-generator-visualizer.git
cd signal-generator-visualizer
```

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

`npm run dev` starts the Vite development server for local testing. `npm run build` checks the TypeScript project and creates an optimized production build.

## Development Workflow

The project was developed with a planned, milestone-based workflow:

- Planned the project features, UI sections, and file structure before implementation
- Built the app step by step using an AI-assisted development workflow with Codex
- Manually reviewed each feature during implementation
- Tested locally with `npm run dev`
- Checked production builds with `npm run build`
- Used Git commits and GitHub pushes after milestones
- Deployed through Vercel

This workflow combined AI-assisted implementation support with manual review, local testing, and Git-based version control.

## Deployment

The app is deployed with Vercel:

https://signal-generator-visualizer.vercel.app/

Vercel is connected to the GitHub repository, so future pushes to the main branch can trigger a new production deployment.

## Key Skills Demonstrated

- React component-based UI development
- TypeScript interfaces and reusable data models
- Signal generation logic for engineering waveforms
- Data visualization with Recharts
- Browser-based CSV export
- Responsive dashboard UI design
- Git/GitHub version control
- Vercel deployment workflow
- AI-assisted development with manual testing and review

## What I Learned

This project helped me practice React component structure, UI state management, and TypeScript reusable types for organizing signal parameters, presets, and generated waveform data.

I also learned more about signal generation math, data visualization with Recharts, CSV export in the browser, Git/GitHub workflow, and deployment with Vercel. The project also gave me practice using an AI-assisted workflow responsibly while testing and reviewing the result manually.

## Future Improvements

- dB scale for frequency-domain analysis
- Window functions for frequency-domain analysis
- Audio playback for audible signals
- Trigger level marker
- Cursor measurement tools
- Digital sampling and quantization visualization
- Filter or Bode response tools
- Unit tests for signal generation functions

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
