"use client";

import { useQuery } from "@tanstack/react-query";
import { siteRepository } from "../../di";
import type { World } from "../../domain/entities";

export const useTargetsViewModel = (world: World, targetId: string | null) => {
  const { data: targets = [], isPending, isError, refetch } = useQuery({
    queryKey: ["sites", world],
    queryFn: () => siteRepository.listByWorld(world),
    staleTime: Infinity,
  });

  const target = targets.find((site) => site.id === targetId) ?? targets[0] ?? null;

  return { targets, target, isPending, isError, retry: refetch };
};
