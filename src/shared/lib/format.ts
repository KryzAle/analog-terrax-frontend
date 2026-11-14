export const humanize = (id: string): string =>
  id.replaceAll("_", " ").replace(/^\w/, (first) => first.toUpperCase());

export const formatNumber = (value: number, unit = ""): string =>
  `${Number.isInteger(value) ? value : value.toFixed(value >= 100 ? 0 : 1)}${unit ? ` ${unit}` : ""}`;

export const formatCoordinates = (lat: number, lon: number): string =>
  `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`;
