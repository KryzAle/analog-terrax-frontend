export type World = "moon" | "mars";

export type Body = World | "earth";

export type EarthdataGranule = Readonly<{
  dataset: string;
  granuleId: string;
  conceptId: string;
  timeStart: string;
  sizeMb: number;
  httpsUrl: string;
  beamId: string;
  photonSampleCount: number;
  segmentCount: number;
  alongTrackReliefM: number;
  alongTrackMeanElevationM: number;
}>;

export type Site = Readonly<{
  id: string;
  cellId: string;
  body: Body;
  name: string;
  region: string;
  lat: number;
  lon: number;
  elevationM: number;
  isKnownAnalog: boolean;
  category: string | null;
  missionRelevance: string;
  dominantLithology: string | null;
  imageUrl: string | null;
  earthdataGranule?: EarthdataGranule | null;
}>;
