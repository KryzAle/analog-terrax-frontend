import assert from "node:assert/strict";
import type { AnalogMatch } from "../entities/analog-match";
import { rankDeltas } from "./rank-deltas";

const ranked = (...ids: string[]): AnalogMatch[] =>
  ids.map((id, index) => ({
    rank: index + 1,
    site: {
      id, cellId: id, body: "earth", name: id, region: "", lat: 0, lon: 0, elevationM: 0,
      isKnownAnalog: false, category: null, missionRelevance: "", dominantLithology: null, image: null,
    },
    overallPct: 50,
    aspects: { topography: 0.5, geology: 0.5, mineralogy: 0.5 },
    features: [],
  }));

assert.deepEqual([...rankDeltas(ranked("a", "b", "c"), ranked("c", "a", "d"))], [["c", 2], ["a", -1]]);
assert.equal(rankDeltas([], ranked("a", "b")).size, 0);
assert.equal(rankDeltas(ranked("a", "b"), ranked("a", "b")).size, 0);
console.log("rank-deltas: ok");
