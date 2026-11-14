"use client";

import { useCallback, useState } from "react";
import { appConfig } from "@/shared/config/app-config";
import { useDebouncedValue } from "@/shared/lib/use-debounced-value";
import { activities } from "../../data/activities";
import type { Activity, Aspect, Weights, World } from "../../domain/entities";

const DEFAULT_ACTIVITY = activities[0];

export const useSelectionViewModel = () => {
  const [world, setWorld] = useState<World>("moon");
  const [targetId, setTargetId] = useState<string | null>(null);
  const [activity, setActivity] = useState<Activity>(DEFAULT_ACTIVITY);
  const [weights, setWeights] = useState<Weights>(DEFAULT_ACTIVITY.weights);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [showKnownAnalogs, setShowKnownAnalogs] = useState(true);
  const searchWeights = useDebouncedValue(weights, appConfig.weightsDebounceMs);

  const selectWorld = (next: World) => {
    setWorld(next);
    setTargetId(null);
    setSelectedSiteId(null);
  };

  const selectTarget = (id: string) => {
    setTargetId(id);
    setSelectedSiteId(null);
  };

  const selectActivity = (id: string) => {
    const next = activities.find((item) => item.id === id) ?? DEFAULT_ACTIVITY;
    setActivity(next);
    setWeights(next.weights);
  };

  const closeSite = useCallback(() => setSelectedSiteId(null), []);

  const setWeight = (aspect: Aspect, value: number) =>
    setWeights((current) => ({ ...current, [aspect]: value }));

  return {
    world,
    targetId,
    activity,
    activities,
    weights,
    searchWeights,
    isCustomWeights: weights !== activity.weights,
    selectedSiteId,
    showKnownAnalogs,
    selectWorld,
    selectTarget,
    selectActivity,
    setWeight,
    resetWeights: () => setWeights(activity.weights),
    openSite: setSelectedSiteId,
    closeSite,
    toggleKnownAnalogs: () => setShowKnownAnalogs((current) => !current),
  };
};

export type SelectionViewModel = ReturnType<typeof useSelectionViewModel>;
