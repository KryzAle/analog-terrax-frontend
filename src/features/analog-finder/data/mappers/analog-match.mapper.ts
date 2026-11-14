import type { AnalogMatchResult, AnalogSearchResponse, FeatureContribution } from "@/client";
import type { AnalogMatch, AnalogSearchResult, FeatureComparison } from "../../domain/entities";
import { toSite } from "./site.mapper";

const toFeature = (dto: FeatureContribution): FeatureComparison => ({
  family: dto.family,
  label: dto.label,
  targetValue: dto.target_value,
  earthValue: dto.earth_value,
  unit: dto.unit,
  closenessPct: dto.closeness_pct,
});

const toMatch = (dto: AnalogMatchResult): AnalogMatch => ({
  rank: dto.rank,
  site: toSite(dto.site),
  overallPct: dto.scores.overall_pct,
  aspects: {
    topography: dto.scores.topography_score,
    geology: dto.scores.geology_score,
    mineralogy: dto.scores.mineralogy_score,
  },
  features: dto.top_contributing_features.map(toFeature),
});

export const toSearchResult = (dto: AnalogSearchResponse): AnalogSearchResult => ({
  target: toSite(dto.target),
  matches: dto.matches.map(toMatch),
  evaluatedCount: dto.total_candidates_evaluated,
});
