"use client";

import { useQuery } from "@tanstack/react-query";
import { systemGetHealth } from "@/client";

export function useHealthCheck() {
  return useQuery({
    queryKey: ["system", "health"],
    queryFn: () => systemGetHealth(),
    refetchInterval: 30_000,
  });
}
