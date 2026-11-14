import type { Weights } from "./aspect";

export type Activity = Readonly<{
  id: string;
  name: string;
  icon: string;
  weights: Weights;
  testIdeas: readonly string[];
}>;
