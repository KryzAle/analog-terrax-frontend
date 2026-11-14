"use client";

import { Check, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Basemap, BasemapId } from "@/shared/config/basemaps";
import { t } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

type MapLayerSwitcherViewProps = {
  basemaps: readonly Basemap[];
  selectedId: BasemapId;
  onSelect: (id: BasemapId) => void;
};

const PANEL_ID = "map-layers-panel";

export const MapLayerSwitcherView = ({ basemaps, selectedId, onSelect }: MapLayerSwitcherViewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutside);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-11 items-center gap-2 rounded-tile border border-line bg-surface-solid/85 px-3 text-sm font-medium backdrop-blur-xl transition-colors hover:bg-surface-solid"
      >
        <Layers className="size-4 text-lime" aria-hidden />
        {t.map.layers}
      </button>
      {isOpen && (
        <fieldset
          id={PANEL_ID}
          className="absolute top-full left-0 mt-2 w-72 max-w-[calc(100vw-3rem)] rounded-card border border-line bg-surface-solid/95 p-3 shadow-[0_16px_40px_rgb(0_0_0/0.5)] backdrop-blur-xl"
        >
          <legend className="sr-only">{t.map.layersTitle}</legend>
          <p aria-hidden className="mb-2 text-xs font-semibold tracking-widest text-text-muted uppercase">
            {t.map.layersTitle}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {basemaps.map((basemap) => {
              const isSelected = basemap.id === selectedId;
              return (
                <label
                  key={basemap.id}
                  className={cn(
                    "relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-tile border border-line bg-space transition-shadow has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lime",
                    isSelected ? "ring-2 ring-lime" : "hover:ring-1 hover:ring-text-muted",
                  )}
                >
                  <input
                    type="radio"
                    name="basemap"
                    value={basemap.id}
                    checked={isSelected}
                    onChange={() => onSelect(basemap.id)}
                    className="sr-only"
                  />
                  {basemap.thumbnails.map((thumbnail) => (
                    <span
                      key={thumbnail.url}
                      aria-hidden
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${thumbnail.url})`, opacity: thumbnail.opacity }}
                    />
                  ))}
                  <span className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1 rounded-md bg-space/85 px-2 py-1 text-xs font-medium">
                    {t.map.basemaps[basemap.id]}
                    {isSelected && <Check className="size-3.5 text-lime" aria-hidden />}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
};
