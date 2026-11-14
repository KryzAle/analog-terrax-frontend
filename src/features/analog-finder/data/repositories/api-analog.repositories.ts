import {
  analogsGetLaserProfileComparison,
  analogsSearchEarthAnalogs,
  planetaryGetEarthdataAtl03Record,
  planetaryListBodySites,
} from "@/client";
import type {
  AnalogSearchRepository,
  ProfileRepository,
  SiteRepository,
} from "../../domain/repositories/analog-repositories";
import { toSearchResult } from "../mappers/analog-match.mapper";
import { toEarthdataTelemetry } from "../mappers/earthdata.mapper";
import { toLaserComparison } from "../mappers/laser-profile.mapper";
import { toSite } from "../mappers/site.mapper";

export const apiSiteRepository: SiteRepository = {
  listByWorld: async (world) => (await planetaryListBodySites(world)).map(toSite),
};

export const apiAnalogSearchRepository: AnalogSearchRepository = {
  search: async ({ world, targetId, weights, limit }) =>
    toSearchResult(
      await analogsSearchEarthAnalogs({
        target_body: world,
        target_site_id: targetId,
        weights,
        filters: { curated_only: true, exclude_vegetated: true, max_ndvi: 0.3 },
        k: limit,
      }),
    ),
};

export const apiProfileRepository: ProfileRepository = {
  compare: async (earthCellId, targetId) =>
    toLaserComparison(await analogsGetLaserProfileComparison(earthCellId, targetId)),
  getEarthdataTelemetry: async (siteOrCellId) =>
    toEarthdataTelemetry(await planetaryGetEarthdataAtl03Record(siteOrCellId)),
};
