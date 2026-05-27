# Signal Generator Visualizer

A React + TypeScript web app for visualizing common engineering waveforms such as sine, square, triangle, sawtooth, and pulse signals.

## Demo / Screenshot

![Signal Generator Visualizer Screenshot](public/Signal%20Generator%20Visualizer%20UI.png)

## Features

- Select sine, square, triangle, sawtooth, and pulse signals
- Adjust frequency, amplitude, phase, DC offset, and duty cycle where applicable
- Blue oscilloscope-style waveform display with grid, scope labels, and clean tooltips
- Measurement readout cards for frequency, period, max, min, peak-to-peak, offset, and duty cycle where applicable
- Educational explanation panel
- Engineering signal presets
- Reset Parameters button for quickly returning to the default signal
- Export waveform samples to CSV
- Responsive clean UI

## Tech Stack

- Vite
- React
- TypeScript
- Recharts
- CSS

## How to Run Locally

Clone the repository:

```bash
git clone https://github.com/hychaw/signal-generator-visualizer.git
cd signal-generator-visualizer
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Project Structure

```text
src/
  components/   Reusable React UI components for controls, presets, explanations, and the waveform display
  lib/          Signal types, generation math, preset data, and CSV export helpers
  App.tsx       Main application component that connects state, controls, generated data, and UI sections
```

## What I Learned

This project helped me practice building a React application with a clear component structure and reusable UI pieces. I also worked with TypeScript types to keep signal settings, presets, and generated waveform data more organized.

On the engineering side, I learned more about signal generation math for common waveforms, including how parameters like frequency, amplitude, phase, DC offset, and duty cycle affect the final signal. I also gained experience charting live data with Recharts, exporting generated samples to CSV in the browser, and using a Git/GitHub workflow to build the project step by step.

## Future Improvements

- FFT spectrum view
- Audio playback
- Trigger level marker
- Cursor measurement tools
- Time/div and volts/div controls
- Filters
- Bode/frequency response tools
- Unit tests for signal generation
- Live deployment with GitHub Pages, Netlify, or Vercel

## License

This project is licensed under the MIT License.
