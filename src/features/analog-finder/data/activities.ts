import type { Activity } from "../domain/entities";

export const activities: readonly Activity[] = [
  {
    id: "rover",
    name: "Rover mobility and navigation",
    icon: "rover",
    weights: { topography: 0.6, geology: 0.3, mineralogy: 0.1 },
    testIdeas: ["Traverse slopes and boulder fields", "Measure wheel slip on loose regolith-like soil", "Validate autonomous path planning"],
  },
  {
    id: "drilling",
    name: "Drilling and sampling",
    icon: "drilling",
    weights: { topography: 0.1, geology: 0.4, mineralogy: 0.5 },
    testIdeas: ["Drill layered or ice-cemented deposits", "Rehearse sample caching", "Measure drill wear in abrasive rock"],
  },
  {
    id: "construction",
    name: "Construction and regolith handling",
    icon: "construction",
    weights: { topography: 0.3, geology: 0.4, mineralogy: 0.3 },
    testIdeas: ["Excavate and move loose material", "Test sintering or compaction", "Build berms and landing pads"],
  },
  {
    id: "eva",
    name: "Spacesuit / EVA field operations",
    icon: "eva",
    weights: { topography: 0.5, geology: 0.3, mineralogy: 0.2 },
    testIdeas: ["Rehearse geology traverses on foot", "Test suit mobility on rough terrain", "Practice sample selection protocols"],
  },
  {
    id: "instruments",
    name: "Instrument testing",
    icon: "instruments",
    weights: { topography: 0.1, geology: 0.3, mineralogy: 0.6 },
    testIdeas: ["Calibrate spectrometers on known minerals", "Compare orbital and ground spectra", "Test cameras under high-contrast light"],
  },
  {
    id: "landing",
    name: "Landing site and hazard assessment",
    icon: "landing",
    weights: { topography: 0.7, geology: 0.2, mineralogy: 0.1 },
    testIdeas: ["Map hazards from drone imagery", "Validate slope and roughness maps", "Test terrain-relative navigation"],
  },
];
