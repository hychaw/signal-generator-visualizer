# Signal Generator Visualizer

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green)

Signal Generator Visualizer is an interactive React + TypeScript web app for exploring common engineering waveforms. It provides a blue oscilloscope-style display where users can adjust signal parameters, view measurement readouts, apply presets, reset parameters, and export generated waveform samples as CSV data.

The project is intended as an educational engineering visualization tool and a public portfolio project demonstrating frontend development, TypeScript data modeling, signal-generation math, browser-based data export, and deployment with Vercel.

## Live Demo

View the production app here:

https://signal-generator-visualizer.vercel.app/

## Screenshot

![Signal Generator Visualizer Screenshot](public/Signal%20Generator%20Visualizer%20UI.png)

## Overview

The app helps users explore how common waveform parameters affect signal shape over time. Users can select a waveform type, adjust controls such as frequency and amplitude, and immediately see the plotted waveform update in the oscilloscope-style chart.

The interface is designed as a responsive dashboard so it can be used for quick experimentation, classroom-style explanations, or as a reference project for building data-driven React interfaces.

## Features

- Sine, square, triangle, sawtooth, and pulse waveforms
- Adjustable frequency, amplitude, phase, DC offset, and duty cycle where applicable
- Blue oscilloscope-style waveform display
- Real-time waveform updates
- Measurement readouts for frequency, period, max, min, Vpp, offset, and duty cycle where relevant
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
2. TypeScript utility functions generate waveform sample points from the current settings.
3. Recharts displays the generated waveform in the oscilloscope-style panel.
4. Measurement cards summarize important signal values such as frequency, period, voltage range, offset, and duty cycle where applicable.
5. CSV export converts the current waveform data into downloadable sample rows.

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

- `src/components/` contains the reusable UI sections for signal controls, presets, explanations, and the waveform display.
- `src/lib/` contains signal types, waveform generation utilities, preset data, and CSV export helpers.
- `src/App.tsx` connects app state, generated waveform data, controls, and layout.
- `src/main.tsx` mounts the React app.
- `public/` stores static assets such as the README screenshot.

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
- Built the app step by step using an AI-assisted coding workflow with Codex
- Reviewed and tested each feature locally with `npm run dev`
- Checked production readiness with `npm run build`
- Committed changes with Git and pushed to GitHub after project milestones
- Deployed the final app to Vercel from the GitHub repository

This workflow combined AI-assisted implementation support with manual review, local testing, and Git-based version control.

## Deployment

The app is deployed with Vercel:

https://signal-generator-visualizer.vercel.app/

Vercel is connected to the GitHub repository, so future pushes to the main branch can trigger a new production deployment.

## What I Learned

This project helped me practice building a structured React application with reusable components and clear state flow. I also worked with TypeScript interfaces and reusable types to keep signal parameters, presets, and generated waveform data organized.

From the engineering side, I learned more about signal generation math, UI state management, data visualization with Recharts, and exporting CSV files directly in the browser. I also gained experience with a Git/GitHub workflow, deployment with Vercel, and using an AI-assisted development workflow while still manually reviewing and testing the app.

## Future Improvements

- FFT / frequency spectrum view
- Audio playback for audible signals
- Trigger level marker
- Cursor measurement tools
- Time/div and volts/div controls
- Digital sampling and quantization visualization
- Filter or Bode response tools
- Unit tests for signal generation functions

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
