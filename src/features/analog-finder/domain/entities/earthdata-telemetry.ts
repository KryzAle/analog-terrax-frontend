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
}>;
