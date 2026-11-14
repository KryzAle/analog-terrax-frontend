export type ProfilePoint = Readonly<{ distanceKm: number; relativeElevationM: number }>;

export type ProfileSeries = Readonly<{
  instrument: string;
  granuleId: string;
  points: readonly ProfilePoint[];
  rmsRoughnessM: number;
}>;

export type LaserComparison = Readonly<{
  target: ProfileSeries;
  earth: ProfileSeries;
  roughnessRatio: number;
  slopeDeltaDeg: number;
}>;
