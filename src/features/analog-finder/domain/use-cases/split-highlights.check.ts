import assert from "node:assert/strict";
import type { AnalogMatch } from "../entities/analog-match";
import type { Site } from "../entities/site";
import { splitHighlights } from "./split-highlights";

const site = (id: string, dominantLithology: string | null): Site => ({
  id, cellId: id, body: "earth", name: id, region: "", lat: 0, lon: 0, elevationM: 0,
  isKnownAnalog: false, category: null, missionRelevance: "", dominantLithology, image: null,
});

const feature = (label: string, closenessPct: number) => ({
  family: "topography" as const, label, targetValue: 1, earthValue: 1, unit: "m", closenessPct,
});

const match: AnalogMatch = {
  rank: 1,
  site: site("earth", "basaltic_volcanic"),
  overallPct: 80,
  aspects: { topography: 0.9, geology: 0.5, mineralogy: 0.8 },
  features: [feature("relief", 98), feature("slope", 60)],
};

const thresholds = { similarFromPct: 85, differentBelowPct: 70, weakAspectBelow: 0.7 };

const { similar, different } = splitHighlights(site("moon", "feldspathic_plutonic"), match, thresholds);
assert.deepEqual(similar.map((h) => h.kind === "feature" && h.feature.label), ["relief"]);
assert.deepEqual(different.map((h) => h.kind), ["lithology", "aspect", "feature"]);

const same = splitHighlights(site("moon", "basaltic_volcanic"), { ...match, aspects: { topography: 1, geology: 1, mineralogy: 1 }, features: [] }, thresholds);
assert.equal(same.different.length, 0);

console.log("split-highlights: ok");
