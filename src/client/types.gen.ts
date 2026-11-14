// This file is auto-generated from analog-terrax-backend/openapi.json

export type CelestialBody = "moon" | "mars" | "earth";

export type HealthCheckResponse = {
  status?: "ok" | "degraded";
  service: string;
  version: string;
  environment: string;
  timestamp: string;
};

export type TopographyFingerprint = {
  relief_m: number;
  slope_mean_deg: number;
  slope_p90_deg: number;
  ruggedness_tri_m: number;
  roughness_rms_m: number;
  hypsometric_integral: number;
};

export type EnvironmentalFlags = {
  ndvi?: number;
  is_impact?: boolean;
  has_ice?: boolean;
  is_volcanic?: boolean;
};

export type PlanetarySite = {
  site_id: string;
  cell_id: string;
  body: CelestialBody;
  name: string;
  region: string;
  lat: number;
  lon: number;
  elevation_m: number;
  is_curated_site?: boolean;
  is_known_analog?: boolean;
  analog_category?: string | null;
  mission_relevance: string;
  topography: TopographyFingerprint;
  geology_fractions: Record<string, number>;
  mineralogy: Record<string, number | null>;
  flags: EnvironmentalFlags;
};

export type LithologyClassSpec = {
  id: string;
  label: string;
  earth_source: string;
  moon_source: string;
  mars_source: string;
};

export type DimensionSpec = {
  id: string;
  label: string;
  unit?: string | null;
  median?: number | null;
  iqr?: number | null;
};

export type TaxonomyResponse = {
  window_size_km: number;
  resampled_gsd_m: number;
  topography_features: DimensionSpec[];
  lithology_classes: LithologyClassSpec[];
  lithology_similarity_matrix: number[][];
  mineral_dimensions: DimensionSpec[];
};

export type SimilarityWeights = {
  topography?: number;
  geology?: number;
  mineralogy?: number;
};

export type AnalogSearchFilters = {
  curated_only?: boolean;
  exclude_vegetated?: boolean;
  max_ndvi?: number;
  require_impact?: boolean;
  require_ice?: boolean;
  require_volcanic?: boolean;
};

export type AnalogSearchRequest = {
  target_body?: "moon" | "mars";
  target_site_id?: string | null;
  target_lat?: number | null;
  target_lon?: number | null;
  weights?: SimilarityWeights;
  filters?: AnalogSearchFilters;
  k?: number;
};

export type ScoreBreakdown = {
  overall_score: number;
  overall_pct: number;
  topography_score: number;
  geology_score: number;
  mineralogy_score: number;
  compared_mineral_dimensions: string[];
};

export type FeatureContribution = {
  family: "topography" | "geology" | "mineralogy";
  feature_id: string;
  label: string;
  target_value: number;
  earth_value: number;
  unit: string;
  closeness_pct: number;
};

export type AnalogMatchResult = {
  rank: number;
  site: PlanetarySite;
  scores: ScoreBreakdown;
  top_contributing_features: FeatureContribution[];
};

export type AnalogSearchResponse = {
  target: PlanetarySite;
  normalized_weights: SimilarityWeights;
  total_candidates_evaluated: number;
  matches: AnalogMatchResult[];
};

export type HeatmapCellScore = {
  cell_id: string;
  site_id: string;
  name: string;
  lat: number;
  lon: number;
  is_curated_site: boolean;
  score_uint8: number;
  topography_uint8: number;
  geology_uint8: number;
  mineralogy_uint8: number;
};

export type AnalogHeatmapResponse = {
  target_site_id: string;
  target_name: string;
  target_body: "moon" | "mars";
  cells: HeatmapCellScore[];
};

export type LaserProfilePoint = {
  distance_km: number;
  elevation_m: number;
  relative_elevation_m: number;
  lat: number;
  lon: number;
};

export type LaserProfileStats = {
  relief_m: number;
  mean_slope_deg: number;
  rms_roughness_m: number;
};

export type SingleLaserProfile = {
  cell_id: string;
  site_id: string;
  body: CelestialBody;
  instrument: string;
  granule_id: string;
  points: LaserProfilePoint[];
  stats: LaserProfileStats;
};

export type LaserProfileComparisonResponse = {
  target_profile: SingleLaserProfile;
  earth_analog_profile: SingleLaserProfile;
  roughness_ratio: number;
  slope_delta_deg: number;
};

export type SystemGetHealthResponse = HealthCheckResponse;
