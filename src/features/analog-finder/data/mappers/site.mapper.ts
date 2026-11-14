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
});
