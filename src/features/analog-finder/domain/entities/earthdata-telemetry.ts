export type Atl03Segment = Readonly<{
  segmentOffset: number;
  lat: number;
  lon: number;
  demHeightM: number | null;
  solarElevationDeg: number | null;
  photonCount: number;
}>;

export type Atl03Photon = Readonly<{
  photonIndex: number;
  lat: number;
  lon: number;
  heightWgs84M: number;
  landSignalConfidence: number;
  qualityFlag: number;
  deltaTimeS: number;
}>;

export type Earth2dDemInfo = Readonly<{
  source: string;
  windowKm: number;
  gsdM: number;
  meanElevationM: number;
  reliefM: number;
  slopeMeanDeg: number;
  ruggednessTriM: number;
  roughnessRmsM: number;
}>;

export type MacrostratUnitInfo = Readonly<{
  name: string;
  stratName: string;
  lith: string;
  age: string;
}>;

export type EmitMineralInfo = Readonly<{
  mineralName: string;
  pixelCount: number;
  meanBandDepth: number;
}>;

export type EmitProvenanceInfo = Readonly<{
  granuleId: string;
  httpsUrl: string | null;
  topGroup1Minerals: readonly EmitMineralInfo[];
  topGroup2Minerals: readonly EmitMineralInfo[];
}>;

export type SatelliteGranuleBadge = Readonly<{
  key: string;
  shortName: string;
  granuleId: string;
  httpsUrl: string | null;
}>;

export type EarthdataTelemetry = Readonly<{
  siteId: string;
  cellId: string;
  siteName: string;
  dataset: string;
  granuleId: string;
  conceptId: string;
  version: string;
  timeStart: string;
  timeEnd: string;
  sizeMb: number;
  httpsUrl: string;
  orbitNumber: number | null;
  rgt: number | null;
  cycleNumber: number | null;
  beamId: string;
  windowSegmentsEvaluated: number;
  totalSegmentsInBeam: number;
  alongTrackReliefM: number;
  alongTrackSlopeMeanDeg: number;
  alongTrackRoughnessRmsM: number;
  alongTrackMeanElevationM: number;
  segments: readonly Atl03Segment[];
  photons: readonly Atl03Photon[];
  dem2d: Earth2dDemInfo | null;
  macrostratUnits: readonly MacrostratUnitInfo[];
  emitMineralogy: EmitProvenanceInfo | null;
  satelliteGranules: readonly SatelliteGranuleBadge[];
}>;
