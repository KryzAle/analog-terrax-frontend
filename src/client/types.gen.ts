// This file is auto-generated from analog-terrax-backend/openapi.json

export type HealthCheckResponse = {
  /**
   * Service health state
   */
  status?: "ok" | "degraded";
  /**
   * Service name
   */
  service: string;
  /**
   * Deployed semantic version
   */
  version: string;
  /**
   * Runtime environment name
   */
  environment: string;
  /**
   * UTC server timestamp
   */
  timestamp: string;
};

export type SystemGetHealthResponse = HealthCheckResponse;
