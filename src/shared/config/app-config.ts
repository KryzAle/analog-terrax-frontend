import { env } from "@/env";

export const appConfig = {
  apiUrl: env.NEXT_PUBLIC_API_URL,
  demoData: env.NEXT_PUBLIC_DEMO_DATA,
  topN: 5,
  searchLimit: 50,
  weightsDebounceMs: 300,
  highlightThresholds: { similarFromPct: 85, differentBelowPct: 70, weakAspectBelow: 0.7 },
  basemapStyle: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
} as const;
