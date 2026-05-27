import type { SignalParameters, SignalPoint } from "./signalTypes";

const CSV_HEADERS = ["time_seconds", "amplitude"];

export function signalDataToCsv(data: SignalPoint[]): string {
  const rows = data.map((point) =>
    [point.t.toFixed(6), point.y.toFixed(6)].join(","),
  );

  return [CSV_HEADERS.join(","), ...rows].join("\n");
}

export function getSignalCsvFileName(
  signalType: SignalParameters["type"],
): string {
  return `${signalType}_wave.csv`;
}

export function downloadCsvFile(csvText: string, fileName: string): void {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.style.display = "none";

  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
