// This file is auto-generated from analog-terrax-backend/openapi.json
import { apiFetch } from "@/lib/api-client";
import type {
  AnalogHeatmapResponse,
  AnalogSearchRequest,
  AnalogSearchResponse,
  CelestialBody,
  LaserProfileComparisonResponse,
  PlanetarySite,
  SystemGetHealthResponse,
  TaxonomyResponse,
} from "./types.gen";

/**
 * System health and readiness check
 */
export async function systemGetHealth(): Promise<SystemGetHealthResponse> {
  return apiFetch<SystemGetHealthResponse>("/api/v1/health");
}

/**
 * Get harmonized cross-planet taxonomy and feature normalization stats
 */
export async function planetaryGetTaxonomy(): Promise<TaxonomyResponse> {
  return apiFetch<TaxonomyResponse>("/api/v1/taxonomy");
}

/**
 * List curated reference sites for Moon, Mars, or Earth
 */
export async function planetaryListBodySites(
  body: CelestialBody,
): Promise<PlanetarySite[]> {
  return apiFetch<PlanetarySite[]>(`/api/v1/bodies/${body}/sites`);
}

/**
 * Get fingerprint for a specific site or cell ID
 */
export async function planetaryGetBodySite(
  body: CelestialBody,
  siteId: string,
): Promise<PlanetarySite> {
  return apiFetch<PlanetarySite>(`/api/v1/bodies/${body}/sites/${siteId}`);
}

/**
 * Snap latitude/longitude coordinates to the nearest indexed cell
 */
export async function planetarySnapBodyCell(
  body: CelestialBody,
  lat: number,
  lon: number,
): Promise<PlanetarySite> {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon) });
  return apiFetch<PlanetarySite>(`/api/v1/bodies/${body}/cells?${params.toString()}`);
}

/**
 * Find top-K similar Earth analog locations for a Moon or Mars site
 */
export async function analogsSearchEarthAnalogs(
  payload: AnalogSearchRequest,
): Promise<AnalogSearchResponse> {
  return apiFetch<AnalogSearchResponse>("/api/v1/analogs/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Get quantized similarity scores across all Earth cells for global heatmap rendering
 */
export async function analogsGetEarthAnalogHeatmap(params: {
  target_body?: "moon" | "mars";
  target_site_id?: string;
  w_topo?: number;
  w_geo?: number;
  w_min?: number;
}): Promise<AnalogHeatmapResponse> {
  const query = new URLSearchParams();
  if (params.target_body) query.set("target_body", params.target_body);
  if (params.target_site_id) query.set("target_site_id", params.target_site_id);
  if (params.w_topo !== undefined) query.set("w_topo", String(params.w_topo));
  if (params.w_geo !== undefined) query.set("w_geo", String(params.w_geo));
  if (params.w_min !== undefined) query.set("w_min", String(params.w_min));
  return apiFetch<AnalogHeatmapResponse>(`/api/v1/analogs/heatmap?${query.toString()}`);
}

/**
 * Compare laser altimeter elevation profiles (ICESat-2 vs LOLA / MOLA)
 */
export async function analogsGetLaserProfileComparison(
  earthCell: string,
  target: string,
): Promise<LaserProfileComparisonResponse> {
  const query = new URLSearchParams({ target });
  return apiFetch<LaserProfileComparisonResponse>(
    `/api/v1/analogs/${earthCell}/profile?${query.toString()}`,
  );
}
