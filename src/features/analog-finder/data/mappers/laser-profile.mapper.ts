import type { LaserProfileComparisonResponse, SingleLaserProfile } from "@/client";
import type { LaserComparison, ProfileSeries } from "../../domain/entities";

const toSeries = (dto: SingleLaserProfile): ProfileSeries => ({
  instrument: dto.instrument,
  granuleId: dto.granule_id,
  conceptId: dto.concept_id ?? null,
  beam: dto.beam ?? null,
  timeStart: dto.time_start ?? null,
  httpsUrl: dto.https_url ?? null,
  photonSampleCount: dto.photon_sample_count ?? null,
  points: dto.points.map((point) => ({
    distanceKm: point.distance_km,
    elevationM: point.elevation_m,
    relativeElevationM: point.relative_elevation_m,
    lat: point.lat,
    lon: point.lon,
  })),
  rmsRoughnessM: dto.stats.rms_roughness_m,
  reliefM: dto.stats.relief_m,
  meanSlopeDeg: dto.stats.mean_slope_deg,
});

export const toLaserComparison = (dto: LaserProfileComparisonResponse): LaserComparison => ({
  target: toSeries(dto.target_profile),
  earth: toSeries(dto.earth_analog_profile),
  roughnessRatio: dto.roughness_ratio,
  slopeDeltaDeg: dto.slope_delta_deg,
});
