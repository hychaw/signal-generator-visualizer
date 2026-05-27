# Signal Generator Visualizer

A React + TypeScript web app for visualizing common engineering waveforms such as sine, square, triangle, sawtooth, and pulse signals.

## Demo / Screenshot

Screenshot coming soon.

## Features

- Select sine, square, triangle, sawtooth, and pulse signals
- Adjust frequency, amplitude, phase, DC offset, and duty cycle where applicable
- Real-time waveform chart
- Educational explanation panel
- Engineering signal presets
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
  components/   Reusable React UI components for controls, presets, explanations, and the waveform chart
  lib/          Signal types, generation math, preset data, and CSV export helpers
  App.tsx       Main application component that connects state, controls, generated data, and UI sections
```

## What I Learned

This project helped me practice building a React application with a clear component structure and reusable UI pieces. I also worked with TypeScript types to keep signal settings, presets, and generated waveform data more organized.

On the engineering side, I learned more about signal generation math for common waveforms, including how parameters like frequency, amplitude, phase, DC offset, and duty cycle affect the final signal. I also gained experience charting live data with Recharts, exporting generated samples to CSV in the browser, and using a Git/GitHub workflow to build the project step by step.

## Future Improvements

- FFT spectrum view
- Audio playback
- Oscilloscope-style grid
- Filters
- Bode/frequency response tools
- Unit tests for signal generation

## License

This project is licensed under the MIT License.
