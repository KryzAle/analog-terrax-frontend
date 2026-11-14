import type { Aspect, AspectScores } from "./aspect";
import type { Site } from "./site";

export type FeatureComparison = Readonly<{
  family: Aspect;
  label: string;
  targetValue: number;
  earthValue: number;
  unit: string;
  closenessPct: number;
}>;

export type AnalogMatch = Readonly<{
  rank: number;
  site: Site;
  overallPct: number;
  aspects: AspectScores;
  features: readonly FeatureComparison[];
}>;

export type AnalogSearchResult = Readonly<{
  target: Site;
  matches: readonly AnalogMatch[];
  evaluatedCount: number;
}>;
