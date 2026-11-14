import type { AnalogMatch } from "../entities/analog-match";
import { ASPECTS } from "../entities/aspect";
import type { Highlight, Highlights, HighlightThresholds } from "../entities/highlight";
import type { Site } from "../entities/site";

const featureHighlights = (match: AnalogMatch, isWanted: (pct: number) => boolean): Highlight[] =>
  match.features
    .filter((feature) => isWanted(feature.closenessPct))
    .map((feature) => ({ kind: "feature", feature }));

const weakAspects = (match: AnalogMatch, below: number): Highlight[] =>
  ASPECTS.filter((aspect) => match.aspects[aspect] < below).map((aspect) => ({
    kind: "aspect",
    aspect,
    score: match.aspects[aspect],
  }));

const lithologyMismatch = (target: Site, earth: Site): Highlight[] =>
  target.dominantLithology && earth.dominantLithology && target.dominantLithology !== earth.dominantLithology
    ? [{ kind: "lithology", targetLithology: target.dominantLithology, earthLithology: earth.dominantLithology }]
    : [];

export const splitHighlights = (
  target: Site,
  match: AnalogMatch,
  thresholds: HighlightThresholds,
): Highlights => ({
  similar: featureHighlights(match, (pct) => pct >= thresholds.similarFromPct),
  different: [
    ...lithologyMismatch(target, match.site),
    ...weakAspects(match, thresholds.weakAspectBelow),
    ...featureHighlights(match, (pct) => pct < thresholds.differentBelowPct),
  ],
});
