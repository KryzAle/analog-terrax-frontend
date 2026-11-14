"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import * as maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import { appConfig } from "@/shared/config/app-config";
import { t } from "@/shared/i18n";
import { scoreTone, toneColor } from "@/shared/lib/score-tone";
import type { AnalogMatch } from "../../domain/entities";

// ponytail: bundlers rewrite maplibre's self-relative worker URL, so load the matching worker from the CDN; self-host it if the map must work offline
maplibregl.setWorkerUrl(`https://unpkg.com/maplibre-gl@${maplibregl.getVersion()}/dist/maplibre-gl-worker.mjs`);

type AnalogMapViewProps = {
  topMatches: readonly AnalogMatch[];
  knownMatches: readonly AnalogMatch[];
  selectedId: string | null;
  onSelect: (siteId: string) => void;
};

const markerElement = (match: AnalogMatch, isKnown: boolean, isSelected: boolean, onSelect: (id: string) => void) => {
  const score = Math.round(match.overallPct);
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = isKnown ? "" : String(score);
  button.setAttribute("aria-label", t.finder.markerLabel(match.site.name, score));
  button.title = t.finder.markerLabel(match.site.name, score);
  button.className = [
    "grid place-items-center rounded-full border-2 border-white font-semibold text-[11px] text-space transition-transform duration-200 hover:scale-110 focus-visible:scale-110",
    isKnown ? "size-3.5 opacity-90" : "size-8 shadow-[0_0_18px_rgb(0_0_0/0.6)]",
    isSelected ? "ring-4 ring-lime" : "",
  ].join(" ");
  button.style.backgroundColor = isKnown ? "var(--color-known)" : toneColor[scoreTone(score)];
  button.addEventListener("click", () => onSelect(match.site.id));
  return button;
};

export const AnalogMapView = ({ topMatches, knownMatches, selectedId, onSelect }: AnalogMapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: appConfig.basemapStyle,
      center: [0, 15],
      zoom: 1,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = [
      ...knownMatches.map((match) => ({ match, isKnown: true })),
      ...topMatches.map((match) => ({ match, isKnown: false })),
    ].map(({ match, isKnown }) =>
      new maplibregl.Marker({ element: markerElement(match, isKnown, match.site.id === selectedId, onSelect) })
        .setLngLat([match.site.lon, match.site.lat])
        .addTo(map),
    );
    return () => markers.forEach((marker) => marker.remove());
  }, [topMatches, knownMatches, selectedId, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || topMatches.length === 0) return;
    const bounds = topMatches.reduce(
      (box, match) => box.extend([match.site.lon, match.site.lat]),
      new maplibregl.LngLatBounds(),
    );
    map.fitBounds(bounds, { padding: 80, maxZoom: 4, duration: 600 });
  }, [topMatches]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} role="region" aria-label={t.finder.mapLabel} className="size-full" />
    </div>
  );
};
