export type ScoreTone = "high" | "medium" | "low";

export const scoreTone = (pct: number): ScoreTone => (pct >= 80 ? "high" : pct >= 60 ? "medium" : "low");

export const toneColor: Readonly<Record<ScoreTone, string>> = {
  high: "var(--color-success)",
  medium: "var(--color-warning)",
  low: "var(--color-danger)",
};

export const toPct = (ratio: number): number => Math.round(ratio * 100);
