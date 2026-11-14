export type ColorToken = Readonly<{ css: string; hex: string }>;

export const worldColor: Readonly<Record<"moon" | "mars" | "earth", ColorToken>> = {
  moon: { css: "var(--color-moon)", hex: "#b8bec8" },
  mars: { css: "var(--color-mars)", hex: "#eb6834" },
  earth: { css: "var(--color-earth)", hex: "#2a78d6" },
};
