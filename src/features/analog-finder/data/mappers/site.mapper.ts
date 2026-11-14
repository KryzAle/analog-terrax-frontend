import type { PlanetarySite } from "@/client";
import type { Site } from "../../domain/entities";

const dominantKey = (fractions: Record<string, number>): string | null =>
  Object.entries(fractions).reduce<[string | null, number]>(
    (best, [key, value]) => (value > best[1] ? [key, value] : best),
    [null, 0],
  )[0];

export const toSite = (dto: PlanetarySite): Site => ({
  id: dto.site_id,
  cellId: dto.cell_id,
  body: dto.body,
  name: dto.name,
  region: dto.region,
  lat: dto.lat,
  lon: dto.lon,
  elevationM: dto.elevation_m,
  isKnownAnalog: dto.is_known_analog ?? false,
  category: dto.analog_category ?? null,
  missionRelevance: dto.mission_relevance,
  dominantLithology: dominantKey(dto.geology_fractions),
  earthdataGranule: dto.earthdata_granule
    ? {
        dataset:
          dto.earthdata_granule.dataset ??
          "ATLAS/ICESat-2 L2A Global Geolocated Photon Data (ATL03)",
        granuleId: dto.earthdata_granule.granule_id,
        conceptId: dto.earthdata_granule.concept_id,
        timeStart: dto.earthdata_granule.time_start,
        sizeMb: dto.earthdata_granule.size_mb,
        httpsUrl: dto.earthdata_granule.https_url,
        beamId: dto.earthdata_granule.beam_id,
        photonSampleCount: dto.earthdata_granule.photon_sample_count,
        segmentCount: dto.earthdata_granule.segment_count,
        alongTrackReliefM: dto.earthdata_granule.along_track_relief_m,
        alongTrackMeanElevationM: dto.earthdata_granule.along_track_mean_elevation_m,
      }
    : null,
});
