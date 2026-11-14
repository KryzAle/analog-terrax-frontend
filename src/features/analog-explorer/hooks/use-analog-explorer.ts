"use client";

import { useQuery } from "@tanstack/react-query";
import {
  type AnalogSearchRequest,
  analogsGetLaserProfileComparison,
  analogsSearchEarthAnalogs,
  type CelestialBody,
  planetaryGetTaxonomy,
  planetaryListBodySites,
} from "@/client";

export function useTaxonomy() {
  return useQuery({
    queryKey: ["planetary", "taxonomy"],
    queryFn: () => planetaryGetTaxonomy(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBodySites(body: CelestialBody) {
  return useQuery({
    queryKey: ["planetary", "sites", body],
    queryFn: () => planetaryListBodySites(body),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalogSearch(payload: AnalogSearchRequest) {
  return useQuery({
    queryKey: ["analogs", "search", payload],
    queryFn: () => analogsSearchEarthAnalogs(payload),
    enabled: Boolean(payload.target_site_id || (payload.target_lat !== null && payload.target_lon !== null)),
  });
}

export function useLaserProfileComparison(
  earthCell: string | null | undefined,
  targetSiteId: string | null | undefined,
) {
  return useQuery({
    queryKey: ["analogs", "profile", earthCell, targetSiteId],
    queryFn: () =>
      analogsGetLaserProfileComparison(
        earthCell ?? "earth_c001",
        targetSiteId ?? "moon_shackleton_rim",
      ),
    enabled: Boolean(earthCell && targetSiteId),
  });
}
