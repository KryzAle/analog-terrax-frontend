export type World = "moon" | "mars";

export type Body = World | "earth";

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
}>;
