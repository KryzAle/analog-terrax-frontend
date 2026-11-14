export type Aspect = "topography" | "geology" | "mineralogy";

export type AspectScores = Readonly<Record<Aspect, number>>;

export type Weights = AspectScores;

export const ASPECTS: readonly Aspect[] = ["topography", "geology", "mineralogy"];
