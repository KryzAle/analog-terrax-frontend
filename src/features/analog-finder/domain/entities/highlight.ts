import type { Aspect } from "./aspect";
import type { FeatureComparison } from "./analog-match";

export type Highlight =
  | Readonly<{ kind: "feature"; feature: FeatureComparison }>
  | Readonly<{ kind: "aspect"; aspect: Aspect; score: number }>
  | Readonly<{ kind: "lithology"; targetLithology: string; earthLithology: string }>;

export type Highlights = Readonly<{ similar: readonly Highlight[]; different: readonly Highlight[] }>;

export type HighlightThresholds = Readonly<{
  similarFromPct: number;
  differentBelowPct: number;
  weakAspectBelow: number;
}>;
