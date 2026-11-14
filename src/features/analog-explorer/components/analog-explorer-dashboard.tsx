"use client";

import {
  Compass,
  Filter,
  Globe2,
  Layers,
  MapPin,
  Mountain,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { AnalogMatchResult, SimilarityWeights } from "@/client";
import {
  useAnalogSearch,
  useBodySites,
  useLaserProfileComparison,
  useTaxonomy,
} from "../hooks/use-analog-explorer";
import { LaserProfileChart } from "./laser-profile-chart";

const WEIGHT_PRESETS: Array<{
  label: string;
  weights: SimilarityWeights;
  requireIce?: boolean;
  requireVolcanic?: boolean;
  requireImpact?: boolean;
}> = [
  {
    label: "Balanced Multi-Criteria",
    weights: { topography: 0.45, geology: 0.35, mineralogy: 0.2 },
  },
  {
    label: "Rover & Habitat Terrain",
    weights: { topography: 0.7, geology: 0.2, mineralogy: 0.1 },
  },
  {
    label: "ISRU & Polar Ice",
    weights: { topography: 0.3, geology: 0.3, mineralogy: 0.4 },
    requireIce: true,
  },
  {
    label: "Lava Tube / Volcanic",
    weights: { topography: 0.35, geology: 0.5, mineralogy: 0.15 },
    requireVolcanic: true,
  },
];

export function AnalogExplorerDashboard() {
  const [targetBody, setTargetBody] = useState<"moon" | "mars">("moon");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("moon_shackleton_rim");
  const [weights, setWeights] = useState<SimilarityWeights>({
    topography: 0.45,
    geology: 0.35,
    mineralogy: 0.2,
  });
  const [excludeVegetated, setExcludeVegetated] = useState<boolean>(true);
  const [requireImpact, setRequireImpact] = useState<boolean>(false);
  const [requireIce, setRequireIce] = useState<boolean>(false);
  const [requireVolcanic, setRequireVolcanic] = useState<boolean>(false);
  const [selectedMatchCell, setSelectedMatchCell] = useState<string | null>(null);

  const { data: taxonomy } = useTaxonomy();
  const { data: targetSites, isLoading: isLoadingSites } = useBodySites(targetBody);

  // Switch default site when planetary body toggles
  const handleBodyChange = (body: "moon" | "mars") => {
    setTargetBody(body);
    setSelectedSiteId(body === "moon" ? "moon_shackleton_rim" : "mars_jezero_crater");
    setSelectedMatchCell(null);
  };

  const searchQuery = useAnalogSearch({
    target_body: targetBody,
    target_site_id: selectedSiteId,
    weights,
    filters: {
      curated_only: true,
      exclude_vegetated: excludeVegetated,
      max_ndvi: 0.3,
      require_impact: requireImpact,
      require_ice: requireIce,
      require_volcanic: requireVolcanic,
    },
    k: 8,
  });

  const matches = searchQuery.data?.matches ?? [];
  const activeMatch: AnalogMatchResult | undefined =
    matches.find((m) => m.site.cell_id === selectedMatchCell) ?? matches[0];

  useEffect(() => {
    if (matches.length > 0 && !selectedMatchCell) {
      setSelectedMatchCell(matches[0].site.cell_id);
    }
  }, [matches, selectedMatchCell]);

  const profileQuery = useLaserProfileComparison(
    activeMatch?.site.cell_id,
    searchQuery.data?.target.site_id ?? selectedSiteId,
  );

  const lithologyLabels: Record<string, string> = {};
  taxonomy?.lithology_classes.forEach((c) => {
    lithologyLabels[c.id] = c.label;
  });

  const mineralLabels: Record<string, string> = {};
  taxonomy?.mineral_dimensions.forEach((m) => {
    mineralLabels[m.id] = m.label;
  });

  const activeTarget = searchQuery.data?.target;

  return (
    <div className="space-y-6">
      {/* Top Control Grid: Target Selection + Multi-Criteria Weights */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Target Body & Base Site Picker (7 cols) */}
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-sky-400" />
              <h2 className="text-base font-semibold text-slate-100">
                1. Select Target Planetary Base Location
              </h2>
            </div>

            <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => handleBodyChange("moon")}
                className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                  targetBody === "moon"
                    ? "bg-sky-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Moon Base Sites (LRO)
              </button>
              <button
                type="button"
                onClick={() => handleBodyChange("mars")}
                className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                  targetBody === "mars"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Mars Base Sites (MRO/MGS)
              </button>
            </div>
          </div>

          {isLoadingSites ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg border border-slate-800 bg-slate-950/60"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {targetSites?.map((site) => {
                const isSelected = site.site_id === selectedSiteId;
                return (
                  <button
                    key={site.site_id}
                    type="button"
                    onClick={() => {
                      setSelectedSiteId(site.site_id);
                      setSelectedMatchCell(null);
                    }}
                    className={`flex flex-col justify-between rounded-lg border p-3 text-left transition ${
                      isSelected
                        ? "border-sky-500 bg-sky-950/30 ring-1 ring-sky-500/50"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-100">
                          {site.name}
                        </span>
                        <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                          {site.lat.toFixed(1)}°, {site.lon.toFixed(1)}°
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400">{site.region}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-300">
                      <span className="rounded bg-slate-900 px-1.5 py-0.5">
                        Relief: {site.topography.relief_m}m
                      </span>
                      <span className="rounded bg-slate-900 px-1.5 py-0.5">
                        Slope: {site.topography.slope_mean_deg}°
                      </span>
                      <span className="rounded bg-slate-900 px-1.5 py-0.5">
                        RMS: {site.topography.roughness_rms_m}m
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTarget && (
            <div className="rounded-lg border border-slate-800/90 bg-slate-950/90 p-3.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-sky-300">
                  Target Mission Briefing — {activeTarget.name}
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Window: {taxonomy?.window_size_km ?? 25} km @ {taxonomy?.resampled_gsd_m ?? 500} m GSD
                </span>
              </div>
              <p className="mt-1 leading-relaxed text-slate-300">
                {activeTarget.mission_relevance}
              </p>
            </div>
          )}
        </div>

        {/* Right: Similarity Weights & Hard Filters (5 cols) */}
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-5">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-sky-400" />
            <h2 className="text-base font-semibold text-slate-100">
              2. Similarity Weights & Constraints
            </h2>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
            {WEIGHT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setWeights(preset.weights);
                  setRequireIce(Boolean(preset.requireIce));
                  setRequireVolcanic(Boolean(preset.requireVolcanic));
                  setRequireImpact(Boolean(preset.requireImpact));
                }}
                className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-sky-500/60 hover:text-sky-300"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300">
                <span>Topography (Relief, Slope, TRI, RMS Roughness)</span>
                <span className="font-mono text-sky-400">
                  {Math.round((weights.topography ?? 0.45) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weights.topography ?? 0.45}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, topography: Number(e.target.value) }))
                }
                className="mt-1 w-full accent-sky-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>Geology (Harmonized 7-Class Lithology Matrix)</span>
                <span className="font-mono text-amber-400">
                  {Math.round((weights.geology ?? 0.35) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weights.geology ?? 0.35}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, geology: Number(e.target.value) }))
                }
                className="mt-1 w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>Mineralogy (Shared Masked Mineral Abundance Indicator)</span>
                <span className="font-mono text-emerald-400">
                  {Math.round((weights.mineralogy ?? 0.2) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weights.mineralogy ?? 0.2}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, mineralogy: Number(e.target.value) }))
                }
                className="mt-1 w-full accent-emerald-400"
              />
            </div>
          </div>

          {/* Toggleable Hard Filters */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              Environmental Filters
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <label className="flex cursor-pointer items-center gap-2 rounded border border-slate-800 bg-slate-950/60 px-2.5 py-1.5">
                <input
                  type="checkbox"
                  checked={excludeVegetated}
                  onChange={(e) => setExcludeVegetated(e.target.checked)}
                  className="accent-sky-400"
                />
                <span>Barren Only (NDVI ≤ 0.3)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded border border-slate-800 bg-slate-950/60 px-2.5 py-1.5">
                <input
                  type="checkbox"
                  checked={requireIce}
                  onChange={(e) => setRequireIce(e.target.checked)}
                  className="accent-sky-400"
                />
                <span>Require Ice / Permafrost</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded border border-slate-800 bg-slate-950/60 px-2.5 py-1.5">
                <input
                  type="checkbox"
                  checked={requireVolcanic}
                  onChange={(e) => setRequireVolcanic(e.target.checked)}
                  className="accent-sky-400"
                />
                <span>Require Volcanic Terrain</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded border border-slate-800 bg-slate-950/60 px-2.5 py-1.5">
                <input
                  type="checkbox"
                  checked={requireImpact}
                  onChange={(e) => setRequireImpact(e.target.checked)}
                  className="accent-sky-400"
                />
                <span>Require Impact Structure</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Ranked Earth Analogs (5 cols) + Deep-Dive Inspector (7 cols) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Ranked Earth Analog Matches List */}
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-semibold text-slate-100">
                3. Top Matched Earth Analogs
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {matches.length} matches ranked
            </span>
          </div>

          {searchQuery.isLoading ? (
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg border border-slate-800 bg-slate-950/60"
                />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-6 text-center text-xs text-slate-400">
              No Earth analogs match all active hard filters. Try unchecking one of the environmental filters above.
            </div>
          ) : (
            <div className="space-y-2.5">
              {matches.map((match) => {
                const isSelected = activeMatch?.site.cell_id === match.site.cell_id;
                return (
                  <button
                    key={match.site.site_id}
                    type="button"
                    onClick={() => setSelectedMatchCell(match.site.cell_id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/40"
                        : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 font-mono text-[11px] font-bold text-slate-200">
                            {match.rank}
                          </span>
                          <span className="text-sm font-semibold text-slate-100">
                            {match.site.name}
                          </span>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          {match.site.region} ({match.site.lat.toFixed(2)}°,{" "}
                          {match.site.lon.toFixed(2)}°)
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-lg font-bold text-emerald-400">
                          {match.scores.overall_pct}%
                        </span>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                          Match
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium ${
                          match.site.is_known_analog
                            ? "bg-sky-950/80 text-sky-300 border border-sky-800/60"
                            : "bg-purple-950/80 text-purple-300 border border-purple-800/60"
                        }`}
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        {match.site.is_known_analog
                          ? "Benchmark Analog"
                          : "Newly Surfaced Candidate"}
                      </span>

                      <div className="flex gap-2 font-mono text-[11px]">
                        <span className="text-sky-300">
                          Topo {Math.round(match.scores.topography_score * 100)}%
                        </span>
                        <span className="text-amber-300">
                          Geo {Math.round(match.scores.geology_score * 100)}%
                        </span>
                        <span className="text-emerald-300">
                          Min {Math.round(match.scores.mineralogy_score * 100)}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Deep-Dive Comparison & Laser Altimetry Inspector */}
        <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-7">
          {activeMatch && activeTarget ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Selected Terrestrial Analog (#{activeMatch.rank})
                  </span>
                  <h3 className="mt-0.5 text-xl font-bold text-slate-100">
                    {activeMatch.site.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeMatch.site.region} • Elevation {activeMatch.site.elevation_m}m •{" "}
                    {activeMatch.site.analog_category}
                  </p>
                </div>

                <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-center">
                  <div>
                    <span className="block font-mono text-lg font-bold text-emerald-400">
                      {activeMatch.scores.overall_pct}%
                    </span>
                    <span className="text-[10px] text-slate-400">Overall</span>
                  </div>
                  <div className="border-l border-slate-800 pl-3">
                    <span className="block font-mono text-sm font-semibold text-sky-400">
                      {Math.round(activeMatch.scores.topography_score * 100)}%
                    </span>
                    <span className="text-[10px] text-slate-400">Topography</span>
                  </div>
                  <div className="border-l border-slate-800 pl-3">
                    <span className="block font-mono text-sm font-semibold text-amber-400">
                      {Math.round(activeMatch.scores.geology_score * 100)}%
                    </span>
                    <span className="text-[10px] text-slate-400">Geology</span>
                  </div>
                  <div className="border-l border-slate-800 pl-3">
                    <span className="block font-mono text-sm font-semibold text-emerald-300">
                      {Math.round(activeMatch.scores.mineralogy_score * 100)}%
                    </span>
                    <span className="text-[10px] text-slate-400">Mineralogy</span>
                  </div>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-300">
                {activeMatch.site.mission_relevance}
              </p>

              {/* Explainability: Top Contributing Features */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <Mountain className="h-4 w-4 text-sky-400" />
                  Why This Site Matches ({activeTarget.name} ↔ {activeMatch.site.name})
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {activeMatch.top_contributing_features.map((feat) => (
                    <div
                      key={`${feat.family}-${feat.feature_id}`}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs"
                    >
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-slate-400">
                          {feat.family}
                        </span>
                        <span className="block font-medium text-slate-200">
                          {feat.label}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          Target: {feat.target_value} {feat.unit} • Earth:{" "}
                          {feat.earth_value} {feat.unit}
                        </span>
                      </div>
                      <span className="rounded bg-emerald-950/90 px-2 py-1 font-mono text-xs font-semibold text-emerald-300">
                        {feat.closeness_pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geology & Mineralogy Side-by-Side Breakdown */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Lithology Fractions */}
                <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs">
                  <h4 className="flex items-center gap-1.5 font-semibold text-amber-300">
                    <Layers className="h-3.5 w-3.5" />
                    Harmonized Lithology Fractions
                  </h4>
                  <div className="space-y-1.5">
                    {Object.entries(activeTarget.geology_fractions)
                      .filter(
                        ([k, v]) =>
                          v > 0.01 || (activeMatch.site.geology_fractions[k] ?? 0) > 0.01,
                      )
                      .map(([lithId, targetFrac]) => {
                        const earthFrac = activeMatch.site.geology_fractions[lithId] ?? 0;
                        return (
                          <div key={lithId} className="space-y-0.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="truncate text-slate-300">
                                {lithologyLabels[lithId] ?? lithId}
                              </span>
                              <span className="font-mono text-slate-400">
                                T:{Math.round(targetFrac * 100)}% / E:
                                {Math.round(earthFrac * 100)}%
                              </span>
                            </div>
                            <div className="flex h-1.5 gap-1 overflow-hidden rounded bg-slate-900">
                              <div
                                className="bg-amber-400"
                                style={{ width: `${Math.round(targetFrac * 100)}%` }}
                              />
                              <div
                                className="bg-emerald-400"
                                style={{ width: `${Math.round(earthFrac * 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Shared Mineralogy Indicator */}
                <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-emerald-300">
                      Shared Mineral Abundance (Masked)
                    </h4>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                      Indicator
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {activeMatch.scores.compared_mineral_dimensions.map((minId) => {
                      const tVal = activeTarget.mineralogy[minId] ?? 0;
                      const eVal = activeMatch.site.mineralogy[minId] ?? 0;
                      return (
                        <div key={minId} className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="truncate text-slate-300">
                              {mineralLabels[minId] ?? minId}
                            </span>
                            <span className="font-mono text-slate-400">
                              T:{Math.round(tVal * 100)}% / E:{Math.round(eVal * 100)}%
                            </span>
                          </div>
                          <div className="flex h-1.5 gap-1 overflow-hidden rounded bg-slate-900">
                            <div
                              className="bg-amber-400"
                              style={{ width: `${Math.round(tVal * 100)}%` }}
                            />
                            <div
                              className="bg-emerald-400"
                              style={{ width: `${Math.round(eVal * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Laser-vs-Laser Altimetry Transect Comparison */}
              {profileQuery.data && (
                <LaserProfileChart
                  comparison={profileQuery.data}
                  targetName={activeTarget.name}
                  earthName={activeMatch.site.name}
                />
              )}
            </>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">
              Select a target site to inspect its Earth analog matches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
