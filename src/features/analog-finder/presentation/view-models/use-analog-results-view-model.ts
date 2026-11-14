"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { appConfig } from "@/shared/config/app-config";
import { analogSearchRepository } from "../../di";
import type { Weights, World } from "../../domain/entities";

type ResultsInput = Readonly<{
  world: World;
  targetId: string | null;
  weights: Weights;
  showKnownAnalogs: boolean;
}>;

export const useAnalogResultsViewModel = ({ world, targetId, weights, showKnownAnalogs }: ResultsInput) => {
  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: ["analogs", "search", world, targetId, weights],
    queryFn: () =>
      analogSearchRepository.search({ world, targetId: targetId ?? "", weights, limit: appConfig.searchLimit }),
    enabled: Boolean(targetId),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const matches = data?.matches ?? [];
  const topMatches = matches.slice(0, appConfig.topN);
  const knownMatches = showKnownAnalogs
    ? matches.slice(appConfig.topN).filter((match) => match.site.isKnownAnalog)
    : [];

  return {
    topMatches,
    knownMatches,
    allMatches: matches,
    evaluatedCount: data?.evaluatedCount ?? null,
    topScore: topMatches[0]?.overallPct ?? null,
    isPending: isPending && Boolean(targetId),
    isRefreshing: isFetching && !isPending,
    isError,
    retry: refetch,
  };
};
