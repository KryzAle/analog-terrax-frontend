import type { AnalogMatch } from "../entities/analog-match";

export const rankDeltas = (
  previous: readonly AnalogMatch[],
  current: readonly AnalogMatch[],
): ReadonlyMap<string, number> => {
  const previousRanks = new Map(previous.map((match) => [match.site.id, match.rank]));
  return new Map(
    current
      .map((match) => [match.site.id, (previousRanks.get(match.site.id) ?? match.rank) - match.rank] as const)
      .filter(([, delta]) => delta !== 0),
  );
};
