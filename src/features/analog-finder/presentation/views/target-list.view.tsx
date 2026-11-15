"use client";

import { MapPin } from "lucide-react";
import type { FocusEvent, PointerEvent } from "react";
import { t } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { worldColor } from "@/shared/lib/world-color";
import { GlassCard } from "@/shared/ui/glass-card";
import type { Site, World } from "../../domain/entities";
import { useHoverPreview } from "../view-models/use-hover-preview";
import { SitePreviewCardView } from "./site-preview-card.view";

const PREVIEW_ID = "target-site-preview";
const THUMBNAIL_SELECTOR = "[data-site-thumbnail]";

type TargetListViewProps = {
  world: World;
  targets: readonly Site[];
  selectedId: string | null;
  isPending: boolean;
  isError: boolean;
  onSelect: (id: string) => void;
  onRetry: () => void;
};

type SiteThumbnailProps = {
  site: Site;
  world: World;
  onPointerEnter: (event: PointerEvent<HTMLSpanElement>) => void;
  onPointerLeave: () => void;
};

const SiteThumbnail = ({ site, world, onPointerEnter, onPointerLeave }: SiteThumbnailProps) => (
  <span
    data-site-thumbnail
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-line bg-space"
  >
    <MapPin className="size-4" style={{ color: worldColor[world].css }} strokeWidth={1.5} aria-hidden />
    {site.image && (
      <img
        src={site.image.thumbnailUrl}
        alt=""
        width={56}
        height={56}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
    )}
  </span>
);

export const TargetListView = ({ world, targets, selectedId, isPending, isError, onSelect, onRetry }: TargetListViewProps) => {
  const { preview, open, scheduleClose, cancelClose, close } = useHoverPreview();
  const previewSite = targets.find((site) => site.id === preview?.id);

  const openOnHover = (siteId: string) => (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "touch") open(siteId, event.currentTarget);
  };

  const openOnKeyboardFocus = (siteId: string) => (event: FocusEvent<HTMLButtonElement>) => {
    if (event.currentTarget.matches(":focus-visible")) {
      open(siteId, event.currentTarget.querySelector(THUMBNAIL_SELECTOR) ?? event.currentTarget);
    }
  };

  return (
    <GlassCard aria-labelledby="targets-title" className="flex min-h-0 flex-col gap-3">
      <h2 id="targets-title" className="text-sm font-semibold">
        {t.finder.targetsTitle} <span className="text-text-muted">· {t.worlds[world]}</span>
      </h2>
      {isError ? (
        <button type="button" onClick={onRetry} className="text-left text-xs text-danger">
          {t.errors.loadFailed} {t.status.retry}
        </button>
      ) : isPending ? (
        <p className="text-xs text-text-muted">{t.finder.targetsLoading}</p>
      ) : (
        <ul role="radiogroup" aria-labelledby="targets-title" className="-mr-2 flex min-h-0 flex-col gap-1.5 overflow-y-auto pr-2">
          {targets.map((site) => {
            const isSelected = site.id === selectedId;
            return (
              <li key={site.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-describedby={preview?.id === site.id ? PREVIEW_ID : undefined}
                  onClick={() => onSelect(site.id)}
                  onFocus={openOnKeyboardFocus(site.id)}
                  onBlur={close}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-tile border p-2 text-left transition duration-200 ease-out",
                    isSelected ? "border-transparent bg-surface-raised" : "border-transparent hover:bg-surface",
                  )}
                  style={isSelected ? { boxShadow: `inset 0 0 0 1px ${worldColor[world].css}, 0 0 24px color-mix(in srgb, ${worldColor[world].css} 25%, transparent)` } : undefined}
                >
                  <SiteThumbnail site={site} world={world} onPointerEnter={openOnHover(site.id)} onPointerLeave={scheduleClose} />
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-medium leading-snug">{site.name}</span>
                    <span className="block truncate text-xs text-text-muted">{site.region}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {preview && previewSite && (
        <SitePreviewCardView
          id={PREVIEW_ID}
          site={previewSite}
          world={world}
          anchor={preview.anchor}
          viewport={preview.viewport}
          container={preview.container}
          onPointerEnter={cancelClose}
          onPointerLeave={scheduleClose}
        />
      )}
    </GlassCard>
  );
};
