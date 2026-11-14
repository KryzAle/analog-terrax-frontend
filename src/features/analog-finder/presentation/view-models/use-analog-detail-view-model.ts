"use client";

import { useQuery } from "@tanstack/react-query";
import { appConfig } from "@/shared/config/app-config";
import { dataSources } from "@/shared/config/sources";
import { t } from "@/shared/i18n";
import { formatNumber, humanize } from "@/shared/lib/format";
import { toPct } from "@/shared/lib/score-tone";
import { profileRepository } from "../../di";
import type { Activity, AnalogMatch, Highlight, Site } from "../../domain/entities";
import { splitHighlights } from "../../domain/use-cases/split-highlights";

const describe = (highlight: Highlight): string => {
  switch (highlight.kind) {
    case "feature":
      return t.detail.feature(
        highlight.feature.label,
        formatNumber(highlight.feature.targetValue, highlight.feature.unit),
        formatNumber(highlight.feature.earthValue, highlight.feature.unit),
        Math.round(highlight.feature.closenessPct),
      );
    case "aspect":
      return t.detail.aspect(t.aspects[highlight.aspect], toPct(highlight.score));
    case "lithology":
      return t.detail.lithology(humanize(highlight.targetLithology), humanize(highlight.earthLithology));
  }
};

type DetailInput = Readonly<{
  target: Site | null;
  match: AnalogMatch | null;
  activity: Activity;
}>;

export const useAnalogDetailViewModel = ({ target, match, activity }: DetailInput) => {
  const profile = useQuery({
    queryKey: ["analogs", "profile", match?.site.cellId, target?.id],
    queryFn: () => profileRepository.compare(match?.site.cellId ?? "", target?.id ?? ""),
    enabled: Boolean(match && target),
    staleTime: Infinity,
  });

  const earthdata = useQuery({
    queryKey: ["analogs", "earthdata", match?.site.id],
    queryFn: () => profileRepository.getEarthdataTelemetry(match?.site.id ?? ""),
    enabled: Boolean(match?.site.id),
    staleTime: Infinity,
  });

  const highlights =
    target && match ? splitHighlights(target, match, appConfig.highlightThresholds) : { similar: [], different: [] };

  const sources = [...(target && target.body !== "earth" ? dataSources[target.body] : []), ...dataSources.earth];

  return {
    isOpen: Boolean(target && match),
    target,
    match,
    similar: highlights.similar.map(describe),
    different: highlights.different.map(describe),
    testIdeas: activity.testIdeas,
    activityName: activity.name,
    sources,
    profile: profile.data ?? null,
    isProfileLoading: profile.isPending && profile.fetchStatus !== "idle",
    isProfileError: profile.isError,
    earthdata: earthdata.data ?? null,
    isEarthdataLoading: earthdata.isPending && earthdata.fetchStatus !== "idle",
  };
};

export type AnalogDetailViewModel = ReturnType<typeof useAnalogDetailViewModel>;
