export const en = {
  app: {
    name: "AnalogTerraX",
    tagline: "Earth analogs for the Moon base and Mars sites",
    event: "NASA Space Apps Challenge 2026",
    description:
      "Pick a Moon or Mars location and an activity to find the Earth sites where it can be tested, compared by topography, geology and mineralogy.",
  },
  honesty: {
    candidateLabel: "Candidate analog to evaluate",
    demoBanner: "Demo data — not real results",
    earthLimitsTitle: "Earth limits",
    earthLimits:
      "Earth cannot reproduce reduced gravity, the lunar vacuum, the thin Martian atmosphere or space radiation.",
  },
  worlds: {
    moon: "Moon",
    mars: "Mars",
  },
  aspects: {
    topography: "Topography",
    geology: "Geology",
    mineralogy: "Mineralogy",
  },
  confidence: {
    high: "High",
    medium: "Medium",
    low: "Low",
  },
  errors: {
    title: "Something went wrong",
    retry: "Try again",
    criticalTitle: "The application failed to load",
    reload: "Reload application",
    notFoundTitle: "Page not found",
    notFoundBody: "The page you are looking for does not exist.",
    backHome: "Back to the dashboard",
  },
};

export type Messages = typeof en;
