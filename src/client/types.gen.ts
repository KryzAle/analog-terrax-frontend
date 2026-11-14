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

export type EarthdataGranuleSummary = {
  dataset?: string;
  granule_id: string;
  concept_id: string;
  time_start: string;
  size_mb: number;
  https_url: string;
  beam_id: string;
  photon_sample_count: number;
  segment_count: number;
  along_track_relief_m: number;
  along_track_mean_elevation_m: number;
};

export type Earth2dDemProvenance = {
  source_tile_url: string;
  window_size_km: number;
  resampled_grid_shape: number[];
  resampled_gsd_m: number;
  mean_elevation_m: number;
  min_elevation_m: number;
  max_elevation_m: number;
  relief_m: number;
  slope_mean_deg: number;
  slope_p90_deg: number;
  ruggedness_tri_m: number;
  roughness_rms_m: number;
  hypsometric_integral: number;
};

export type MacrostratMappedUnit = {
  map_id?: number | null;
  source_id?: number | null;
  unit_name: string;
  age: string;
  lithology: string;
  description?: string;
};

export type MacrostratGeologyProvenance = {
  api_endpoint: string;
  units_count: number;
  mapped_units: MacrostratMappedUnit[];
};

export type EmitMineralRecord = {
  mineral_id: number;
  mineral_name: string;
  pixel_count: number;
  mean_band_depth: number;
};

export type EmitStreamedMineralogy = {
  granule_id: string;
  concept_id: string;
  https_url: string;
  window_shape: number[];
  group_1_mean_band_depth: number;
  group_2_mean_band_depth: number;
  top_group_1_minerals: EmitMineralRecord[];
  top_group_2_minerals: EmitMineralRecord[];
};

export type CmrGranuleRef = {
  short_name: string;
  concept_id: string;
  granule_id: string;
  time_start: string;
  https_url: string;
};

export type EarthdataSatellitesBundle = {
  dem_granule?: CmrGranuleRef | null;
  modis_ndvi_granule?: CmrGranuleRef | null;
  modis_cryosphere_granule?: CmrGranuleRef | null;
  emit_mineralogy_granule?: CmrGranuleRef | null;
  emit_streamed_mineralogy?: EmitStreamedMineralogy | null;
};

export type EarthMultiSourceProvenance = {
  topography_2d_dem: Earth2dDemProvenance;
  geology_macrostrat: MacrostratGeologyProvenance;
  earthdata_satellites: EarthdataSatellitesBundle;
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
  earthdata_granule?: EarthdataGranuleSummary | null;
  earth_provenance?: EarthMultiSourceProvenance | null;
};

export type Atl03GranuleMetadata = {
  granule_id: string;
  concept_id: string;
  version: string;
  time_start: string;
  time_end: string;
  size_mb: number;
  https_url: string;
};

export type Atl03OrbitInfo = {
  orbit_number: number[];
  rgt: number[];
  cycle_number: number[];
  sc_orient: number[];
};

export type Atl03SampledBeam = {
  beam_id: string;
  matched_query_bbox: boolean;
  window_segments_evaluated: number;
  total_segments_in_beam: number;
};

export type Atl03ComputedTopography = {
  relief_m: number;
  slope_mean_deg: number;
  slope_p90_deg: number;
  ruggedness_tri_m: number;
  roughness_rms_m: number;
  hypsometric_integral: number;
  mean_elevation_m: number;
};

export type Atl03GeolocationSegment = {
  segment_offset: number;
  reference_lat: number;
  reference_lon: number;
  dem_height_m?: number | null;
  solar_elevation_deg?: number | null;
  photon_count_in_segment: number;
};

export type Atl03PhotonSample = {
  photon_index: number;
  lat: number;
  lon: number;
  height_wgs84_m: number;
  land_signal_confidence: number;
  quality_flag: number;
  delta_time_s: number;
};

export type EarthdataAtl03Record = {
  site_id: string;
  cell_id: string;
  site_name: string;
  query_bbox: number[];
  dataset: string;
  granule: Atl03GranuleMetadata;
  orbit_info: Atl03OrbitInfo;
  sampled_beam: Atl03SampledBeam;
  computed_topography: Atl03ComputedTopography;
  geolocation_segments: Atl03GeolocationSegment[];
  photons: Atl03PhotonSample[];
  earth_provenance?: EarthMultiSourceProvenance | null;
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
  concept_id?: string | null;
  beam?: string | null;
  time_start?: string | null;
  https_url?: string | null;
  photon_sample_count?: number | null;
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
