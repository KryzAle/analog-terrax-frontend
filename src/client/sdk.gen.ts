// This file is auto-generated from analog-terrax-backend/openapi.json
import { apiFetch } from "@/lib/api-client";
import type { SystemGetHealthResponse } from "./types.gen";

/**
 * System health and readiness check
 * Return service health metadata for monitoring and frontend status checks.
 */
export async function systemGetHealth(): Promise<SystemGetHealthResponse> {
  return apiFetch<SystemGetHealthResponse>("/api/v1/health");
}
