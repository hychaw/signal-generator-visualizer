# Signal Generator Visualizer Project Plan

## Project Overview

Signal Generator Visualizer is a Vite, React, and TypeScript web app for students and engineering learners. The app will let users select common signal types, adjust key parameters, and see the resulting waveform update in real time.

The first version should prioritize clarity, readable code, and a clean engineering-style interface suitable for a public GitHub portfolio project.

## Target Features

- Signal type selection: sine, square, triangle, sawtooth, and pulse
- Parameter controls:
  - Frequency
  - Amplitude
  - Phase
  - DC offset
  - Duty cycle for pulse and square-style signals
- Real-time waveform visualization
- Responsive layout for desktop and tablet-sized screens
- Beginner-friendly labels and defaults
- Clear separation between signal math, React components, and styling
- Public-project polish: useful README, screenshots, and simple local setup instructions

## Planned Folder Structure

```text
src/
  components/
    ControlPanel/
      ControlPanel.tsx
      ControlPanel.css
    SignalSelector/
      SignalSelector.tsx
      SignalSelector.css
    ParameterSlider/
      ParameterSlider.tsx
      ParameterSlider.css
    WaveformPlot/
      WaveformPlot.tsx
      WaveformPlot.css
  lib/
    signalGenerators.ts
    signalTypes.ts
    plotScale.ts
  hooks/
    useSignalParameters.ts
  styles/
    tokens.css
  App.tsx
  App.css
  main.tsx
  index.css
```

## Planned Components

- `App`: Owns the main page layout and coordinates app state.
- `SignalSelector`: Lets users choose the active signal type.
- `ControlPanel`: Groups parameter controls and shows only controls relevant to the selected signal.
- `ParameterSlider`: Reusable labeled slider/input control for numeric parameters.
- `WaveformPlot`: Draws the waveform using generated sample data.
- `useSignalParameters`: Keeps default values and parameter updates organized.
- `signalGenerators`: Contains pure functions for generating waveform sample points.
- `signalTypes`: Defines shared TypeScript types, parameter ranges, labels, and defaults.
- `plotScale`: Converts signal values into screen or SVG coordinates.

## Development Milestones

1. Replace the Vite starter UI with the basic app shell.
2. Define signal types, parameter ranges, and default parameter values.
3. Implement pure waveform generation functions for each signal type.
4. Build the control panel and reusable parameter controls.
5. Add the real-time waveform plot.
6. Improve visual styling for a clean engineering dashboard feel.
7. Add responsive layout refinements.
8. Update README with project purpose, setup steps, feature list, and screenshots.
9. Add focused tests for signal generation math if a test framework is introduced.

## Possible Future Extensions

- Add noise, clipping, or quantization controls.
- Show time-domain and frequency-domain views.
- Add FFT spectrum visualization.
- Support exporting waveform samples as CSV.
- Add oscilloscope-style grid options.
- Add presets for common lab signal configurations.
- Add educational callouts explaining each parameter.
- Add keyboard-accessible fine adjustment controls.
- Add unit tests for waveform generation and plot scaling.
