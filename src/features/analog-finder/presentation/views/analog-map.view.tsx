"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import * as maplibregl from "maplibre-gl";
import { type RefObject, useEffect, useRef } from "react";
import type { Basemap } from "@/shared/config/basemaps";
import { t } from "@/shared/i18n";
import { scoreTone, toneColor } from "@/shared/lib/score-tone";
import type { AnalogMatch } from "../../domain/entities";

// ponytail: bundlers rewrite maplibre's self-relative worker URL, so load the matching worker from the CDN; self-host it if the map must work offline
maplibregl.setWorkerUrl(`https://unpkg.com/maplibre-gl@${maplibregl.getVersion()}/dist/maplibre-gl-worker.mjs`);

type AnalogMapViewProps = {
  style: Basemap["style"];
  topMatches: readonly AnalogMatch[];
  knownMatches: readonly AnalogMatch[];
  selectedId: string | null;
  onSelect: (siteId: string) => void;
  safeAreaRef: RefObject<HTMLElement | null>;
};

type Insets = Readonly<{ top: number; right: number; bottom: number; left: number }>;

const NO_INSETS: Insets = { top: 0, right: 0, bottom: 0, left: 0 };
const FIT_MARGIN = 72;
const SITE_ZOOM = 7;
const MAX_CENTER_LAT = 80;

// The default constrain keeps the world as tall as the canvas, which stops worldwide matches fitting the centre window
const latitudeOnlyConstrain: maplibregl.TransformConstrainFunction = (lngLat, zoom) => ({
  center: new maplibregl.LngLat(lngLat.lng, Math.max(-MAX_CENTER_LAT, Math.min(MAX_CENTER_LAT, lngLat.lat))),
  zoom,
});

const safeInsets = (frame: DOMRect, safe: DOMRect): Insets => ({
  top: Math.max(0, safe.top - frame.top),
  right: Math.max(0, frame.right - safe.right),
  bottom: Math.max(0, frame.bottom - safe.bottom),
  left: Math.max(0, safe.left - frame.left),
});

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
  const anchor = document.createElement("div");
  anchor.append(button);
  return anchor;
};

export const AnalogMapView = ({ style, topMatches, knownMatches, selectedId, onSelect, safeAreaRef }: AnalogMapViewProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const appliedStyleRef = useRef(style);
  const insetsRef = useRef<Insets>(NO_INSETS);
  const isFocusedRef = useRef(false);
  const focus = [...topMatches, ...knownMatches].find((match) => match.site.id === selectedId)?.site;
  const focusLon = focus?.lon;
  const focusLat = focus?.lat;

  useEffect(() => {
    const frame = frameRef.current;
    const safeArea = safeAreaRef.current;
    if (!frame || !safeArea) return;
    const update = () => {
      insetsRef.current = safeInsets(frame.getBoundingClientRect(), safeArea.getBoundingClientRect());
      Object.entries(insetsRef.current).forEach(([side, px]) => frame.style.setProperty(`--map-safe-${side}`, `${px}px`));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    observer.observe(safeArea);
    return () => observer.disconnect();
  }, [safeAreaRef]);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: appliedStyleRef.current,
      center: [0, 15],
      zoom: 1,
      attributionControl: { compact: true },
      transformConstrain: latitudeOnlyConstrain,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.FullscreenControl({ container: safeAreaRef.current ?? undefined }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");
    mapRef.current = map;
    return () => map.remove();
  }, [safeAreaRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || appliedStyleRef.current === style) return;
    appliedStyleRef.current = style;
    map.setStyle(style, { diff: false });
  }, [style]);

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
    isFocusedRef.current = focusLon !== undefined && focusLat !== undefined;
    if (!map || focusLon === undefined || focusLat === undefined) return;
    const insets = insetsRef.current;
    map.flyTo({
      center: [focusLon, focusLat],
      zoom: Math.max(map.getZoom(), SITE_ZOOM),
      offset: [(insets.left - insets.right) / 2, (insets.top - insets.bottom) / 2],
      duration: 1200,
    });
  }, [focusLon, focusLat]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || topMatches.length === 0 || isFocusedRef.current) return;
    const bounds = topMatches.reduce(
      (box, match) => box.extend([match.site.lon, match.site.lat]),
      new maplibregl.LngLatBounds(),
    );
    const insets = insetsRef.current;
    map.fitBounds(bounds, {
      padding: {
        top: insets.top + FIT_MARGIN,
        right: insets.right + FIT_MARGIN,
        bottom: insets.bottom + FIT_MARGIN,
        left: insets.left + FIT_MARGIN,
      },
      maxZoom: 4,
      duration: 600,
    });
  }, [topMatches]);

  return (
    <div ref={frameRef} className="pointer-events-auto absolute inset-0 -z-10 bg-space">
      <div ref={containerRef} role="region" aria-label={t.finder.mapLabel} className="size-full" />
    </div>
  );
};
