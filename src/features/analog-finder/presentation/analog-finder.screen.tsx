"use client";

import dynamic from "next/dynamic";
import { DemoBanner } from "@/shared/ui/demo-banner";
import { EarthLimitsNote } from "@/shared/ui/earth-limits-note";
import { ApiStatusBadge } from "@/features/system-status/components/api-status-badge";
import { useAnalogDetailViewModel } from "./view-models/use-analog-detail-view-model";
import { useAnalogResultsViewModel } from "./view-models/use-analog-results-view-model";
import { useSelectionViewModel } from "./view-models/use-selection-view-model";
import { useTargetsViewModel } from "./view-models/use-targets-view-model";
import { ActivityPickerView } from "./views/activity-picker.view";
import { AnalogDetailDrawerView } from "./views/analog-detail-drawer.view";
import { AnalogListView } from "./views/analog-list.view";
import { MapLayerSwitcherView } from "./views/map-layer-switcher.view";
import { MapLegendView } from "./views/map-legend.view";
import { TargetHeroView } from "./views/target-hero.view";
import { TargetListView } from "./views/target-list.view";
import { WeightsPanelView } from "./views/weights-panel.view";
import { WorldRailView } from "./views/world-rail.view";

const AnalogMapView = dynamic(() => import("./views/analog-map.view").then((module) => module.AnalogMapView), {
  ssr: false,
});

export const AnalogFinderScreen = () => {
  const selection = useSelectionViewModel();
  const targets = useTargetsViewModel(selection.world, selection.targetId);
  const results = useAnalogResultsViewModel({
    world: selection.world,
    targetId: targets.target?.id ?? null,
    weights: selection.searchWeights,
    showKnownAnalogs: selection.showKnownAnalogs,
  });
  const selectedMatch = results.allMatches.find((match) => match.site.id === selection.selectedSiteId) ?? null;
  const detail = useAnalogDetailViewModel({ target: targets.target, match: selectedMatch, activity: selection.activity });

  return (
    <div className="flex min-h-screen flex-col xl:h-screen">
      <DemoBanner />
      <div className="grid flex-1 gap-4 p-4 xl:min-h-0 xl:grid-cols-[84px_320px_minmax(0,1fr)_360px] xl:grid-rows-[minmax(0,1fr)]">
        <WorldRailView
          world={selection.world}
          showKnownAnalogs={selection.showKnownAnalogs}
          onSelectWorld={selection.selectWorld}
          onToggleKnownAnalogs={selection.toggleKnownAnalogs}
        />

        <div className="flex min-h-0 flex-col gap-4">
          <TargetListView
            world={selection.world}
            targets={targets.targets}
            selectedId={targets.target?.id ?? null}
            isPending={targets.isPending}
            isError={targets.isError}
            onSelect={selection.selectTarget}
            onRetry={targets.retry}
          />
          <ActivityPickerView
            activities={selection.activities}
            selectedId={selection.activity.id}
            onSelect={selection.selectActivity}
          />
        </div>

        <main className="flex min-h-0 flex-col gap-4">
          <section className="relative min-h-[420px] flex-1 overflow-hidden rounded-frame border border-line bg-surface">
            <AnalogMapView
              style={selection.basemap.style}
              topMatches={results.topMatches}
              knownMatches={results.knownMatches}
              selectedId={selection.selectedSiteId}
              onSelect={selection.openSite}
            >
              <MapLayerSwitcherView
                basemaps={selection.basemaps}
                selectedId={selection.basemap.id}
                onSelect={selection.selectBasemap}
              />
              <MapLegendView />
            </AnalogMapView>
            <TargetHeroView world={selection.world} target={targets.target} />
          </section>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <EarthLimitsNote />
            <ApiStatusBadge />
          </div>
        </main>

        <div className="flex min-h-0 flex-col gap-4">
          <AnalogListView
            matches={results.topMatches}
            selectedId={selection.selectedSiteId}
            isPending={results.isPending}
            isRefreshing={results.isRefreshing}
            isError={results.isError}
            onSelect={selection.openSite}
            onRetry={results.retry}
          />
          <WeightsPanelView
            weights={selection.weights}
            isCustom={selection.isCustomWeights}
            onChange={selection.setWeight}
            onReset={selection.resetWeights}
          />
        </div>
      </div>

      {detail.isOpen && <AnalogDetailDrawerView {...detail} onClose={selection.closeSite} />}
    </div>
  );
};
