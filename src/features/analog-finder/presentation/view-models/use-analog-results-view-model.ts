"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { appConfig } from "@/shared/config/app-config";
import { analogSearchRepository } from "../../di";
import type { AnalogMatch, Weights, World } from "../../domain/entities";
import { rankDeltas } from "../../domain/use-cases/rank-deltas";

type ResultsInput = Readonly<{
  world: World;
  targetId: string | null;
  weights: Weights;
  showKnownAnalogs: boolean;
}>;

type RankHistory = Readonly<{
  source: unknown;
  scope: string;
  topMatches: readonly AnalogMatch[];
  deltas: ReadonlyMap<string, number>;
}>;

const NO_DELTAS: ReadonlyMap<string, number> = new Map();

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
  const scope = `${world}:${targetId}`;
  const [history, setHistory] = useState<RankHistory>({ source: data, scope, topMatches, deltas: NO_DELTAS });
  if (history.source !== data) {
    setHistory({
      source: data,
      scope,
      topMatches,
      deltas: history.scope === scope ? rankDeltas(history.topMatches, topMatches) : NO_DELTAS,
    });
  }
  const knownMatches = showKnownAnalogs
    ? matches.slice(appConfig.topN).filter((match) => match.site.isKnownAnalog)
    : [];

  return {
    topMatches,
    knownMatches,
    rankDeltas: history.deltas,
    allMatches: matches,
    isPending: isPending && Boolean(targetId),
    isRefreshing: isFetching && !isPending,
    isError,
    retry: refetch,
  };
};
