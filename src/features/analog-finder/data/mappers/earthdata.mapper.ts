import type { EarthdataAtl03Record } from "@/client";
import type {
  EarthdataTelemetry,
  EmitProvenanceInfo,
  SatelliteGranuleBadge,
} from "../../domain/entities";

export const toEarthdataTelemetry = (dto: EarthdataAtl03Record): EarthdataTelemetry => {
  const prov = dto.earth_provenance;
  const emitStreamed = prov?.earthdata_satellites?.emit_streamed_mineralogy;

  const emitMineralogy: EmitProvenanceInfo | null = emitStreamed
    ? {
        granuleId: emitStreamed.granule_id,
        httpsUrl: emitStreamed.https_url || null,
        topGroup1Minerals: (emitStreamed.top_group_1_minerals ?? []).slice(0, 3).map((m) => ({
          mineralName: m.mineral_name,
          pixelCount: m.pixel_count,
          meanBandDepth: m.mean_band_depth,
        })),
        topGroup2Minerals: (emitStreamed.top_group_2_minerals ?? []).slice(0, 3).map((m) => ({
          mineralName: m.mineral_name,
          pixelCount: m.pixel_count,
          meanBandDepth: m.mean_band_depth,
        })),
      }
    : null;

  const satelliteGranules: SatelliteGranuleBadge[] = [];
  const sats = prov?.earthdata_satellites;
  if (sats) {
    const entries = [
      ["dem_granule", sats.dem_granule],
      ["emit_mineralogy_granule", sats.emit_mineralogy_granule],
      ["modis_ndvi_granule", sats.modis_ndvi_granule],
      ["modis_cryosphere_granule", sats.modis_cryosphere_granule],
    ] as const;
    for (const [key, sat] of entries) {
      if (sat && sat.granule_id && sat.short_name) {
        satelliteGranules.push({
          key,
          shortName: sat.short_name,
          granuleId: sat.granule_id,
          httpsUrl: sat.https_url || null,
        });
      }
    }
  }

  return {
    siteId: dto.site_id,
    cellId: dto.cell_id,
    siteName: dto.site_name,
    dataset: dto.dataset,
    granuleId: dto.granule.granule_id,
    conceptId: dto.granule.concept_id,
    version: dto.granule.version,
    timeStart: dto.granule.time_start,
    timeEnd: dto.granule.time_end,
    sizeMb: dto.granule.size_mb,
    httpsUrl: dto.granule.https_url,
    orbitNumber: dto.orbit_info.orbit_number[0] ?? null,
    rgt: dto.orbit_info.rgt[0] ?? null,
    cycleNumber: dto.orbit_info.cycle_number[0] ?? null,
    beamId: dto.sampled_beam.beam_id,
    windowSegmentsEvaluated: dto.sampled_beam.window_segments_evaluated,
    totalSegmentsInBeam: dto.sampled_beam.total_segments_in_beam,
    alongTrackReliefM: dto.computed_topography.relief_m,
    alongTrackSlopeMeanDeg: dto.computed_topography.slope_mean_deg,
    alongTrackRoughnessRmsM: dto.computed_topography.roughness_rms_m,
    alongTrackMeanElevationM: dto.computed_topography.mean_elevation_m,
    segments: dto.geolocation_segments.map((seg) => ({
      segmentOffset: seg.segment_offset,
      lat: seg.reference_lat,
      lon: seg.reference_lon,
      demHeightM: seg.dem_height_m ?? null,
      solarElevationDeg: seg.solar_elevation_deg ?? null,
      photonCount: seg.photon_count_in_segment,
    })),
    photons: dto.photons.map((ph) => ({
      photonIndex: ph.photon_index,
      lat: ph.lat,
      lon: ph.lon,
      heightWgs84M: ph.height_wgs84_m,
      landSignalConfidence: ph.land_signal_confidence,
      qualityFlag: ph.quality_flag,
      deltaTimeS: ph.delta_time_s,
    })),
    dem2d: prov?.topography_2d_dem
      ? {
          source: prov.topography_2d_dem.source_tile_url,
          windowKm: prov.topography_2d_dem.window_size_km,
          gsdM: prov.topography_2d_dem.resampled_gsd_m,
          meanElevationM: prov.topography_2d_dem.mean_elevation_m,
          reliefM: prov.topography_2d_dem.relief_m,
          slopeMeanDeg: prov.topography_2d_dem.slope_mean_deg,
          ruggednessTriM: prov.topography_2d_dem.ruggedness_tri_m,
          roughnessRmsM: prov.topography_2d_dem.roughness_rms_m,
        }
      : null,
    macrostratUnits: (prov?.geology_macrostrat?.mapped_units ?? []).slice(0, 3).map((u) => ({
      name: u.unit_name || "Mapped unit",
      stratName: u.unit_name || "",
      lith: u.lithology || u.description || "",
      age: u.age || "",
    })),
    emitMineralogy,
    satelliteGranules,
  };
};
