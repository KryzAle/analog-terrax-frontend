export type ProfilePoint = Readonly<{
  distanceKm: number;
  elevationM: number;
  relativeElevationM: number;
  lat: number;
  lon: number;
}>;

export type ProfileSeries = Readonly<{
  instrument: string;
  granuleId: string;
  conceptId: string | null;
  beam: string | null;
  timeStart: string | null;
  httpsUrl: string | null;
  photonSampleCount: number | null;
  points: readonly ProfilePoint[];
  rmsRoughnessM: number;
  reliefM: number;
  meanSlopeDeg: number;
}>;

export type LaserComparison = Readonly<{
  target: ProfileSeries;
  earth: ProfileSeries;
  roughnessRatio: number;
  slopeDeltaDeg: number;
}>;
