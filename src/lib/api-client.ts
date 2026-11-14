import { env } from "@/env";
import type { HealthCheckResponse } from "@/client";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly requestId?: string | null,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const requestId = response.headers.get("X-Request-ID");
    throw new ApiClientError(
      `API request failed with HTTP ${response.status}`,
      response.status,
      requestId,
    );
  }

  return (await response.json()) as T;
}

export async function fetchSystemHealth(): Promise<HealthCheckResponse> {
  return apiFetch<HealthCheckResponse>("/api/v1/health");
}
