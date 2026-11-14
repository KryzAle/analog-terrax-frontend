import type { LaserProfileComparisonResponse, SingleLaserProfile } from "@/client";
import type { LaserComparison, ProfileSeries } from "../../domain/entities";

const toSeries = (dto: SingleLaserProfile): ProfileSeries => ({
  instrument: dto.instrument,
  granuleId: dto.granule_id,
  points: dto.points.map((point) => ({
    distanceKm: point.distance_km,
    relativeElevationM: point.relative_elevation_m,
  })),
  rmsRoughnessM: dto.stats.rms_roughness_m,
});

export const toLaserComparison = (dto: LaserProfileComparisonResponse): LaserComparison => ({
  target: toSeries(dto.target_profile),
  earth: toSeries(dto.earth_analog_profile),
  roughnessRatio: dto.roughness_ratio,
  slopeDeltaDeg: dto.slope_delta_deg,
});
