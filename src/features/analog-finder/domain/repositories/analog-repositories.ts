import type {
  AnalogSearchResult,
  EarthdataTelemetry,
  LaserComparison,
  Site,
  Weights,
  World,
} from "../entities";

export type AnalogQuery = Readonly<{ world: World; targetId: string; weights: Weights; limit: number }>;

export interface SiteRepository {
  listByWorld(world: World): Promise<readonly Site[]>;
}

export interface AnalogSearchRepository {
  search(query: AnalogQuery): Promise<AnalogSearchResult>;
}

export interface ProfileRepository {
  compare(earthCellId: string, targetId: string): Promise<LaserComparison>;
  getEarthdataTelemetry(siteOrCellId: string): Promise<EarthdataTelemetry>;
}
