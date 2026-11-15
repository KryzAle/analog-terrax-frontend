"use client";

import { MapPin } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { t } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { worldColor } from "@/shared/lib/world-color";
import type { Site, World } from "../../domain/entities";
import type { Viewport } from "../view-models/use-hover-preview";

const CARD_WIDTH = 304;
const GAP = 14;
const MARGIN = 8;
const ARROW_HALF = 6;

type SitePreviewCardViewProps = {
  id: string;
  site: Site;
  world: World;
  anchor: DOMRect;
  viewport: Viewport;
  container: HTMLElement;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

type Placement = Readonly<{ left: number; top: number; side: "left" | "right"; arrowTop: number }>;

const placement = (anchor: DOMRect, cardHeight: number, viewport: Viewport): Placement => {
  const fitsRight = anchor.right + GAP + CARD_WIDTH + MARGIN <= viewport.width;
  const left = Math.max(MARGIN, fitsRight ? anchor.right + GAP : anchor.left - GAP - CARD_WIDTH);
  const center = anchor.top + anchor.height / 2;
  const top = Math.min(Math.max(center - cardHeight / 2, MARGIN), viewport.height - cardHeight - MARGIN);
  return { left, top, side: fitsRight ? "right" : "left", arrowTop: center - top - ARROW_HALF };
};

export const SitePreviewCardView = ({
  id,
  site,
  world,
  anchor,
  viewport,
  container,
  onPointerEnter,
  onPointerLeave,
}: SitePreviewCardViewProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(0);

  useLayoutEffect(() => {
    setCardHeight(cardRef.current?.offsetHeight ?? 0);
  }, [site.id]);

  const { left, top, side, arrowTop } = placement(anchor, cardHeight, viewport);

  return createPortal(
    <div
      ref={cardRef}
      id={id}
      role="tooltip"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="fixed z-50 rounded-card border border-line bg-surface-solid p-2 text-text shadow-[0_24px_48px_rgb(0_0_0/0.55)] motion-safe:animate-[preview-in_150ms_ease-out]"
      style={{ left, top, width: CARD_WIDTH, visibility: cardHeight ? "visible" : "hidden" }}
    >
      <span
        aria-hidden
        className={cn(
          "absolute size-3 rotate-45 border-line bg-surface-solid",
          side === "right" ? "-left-1.5 border-b border-l" : "-right-1.5 border-t border-r",
        )}
        style={{ top: arrowTop }}
      />
      <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-tile bg-space">
        <MapPin className="size-5" style={{ color: worldColor[world].css }} strokeWidth={1.5} aria-hidden />
        {site.image && (
          <>
            <img
              src={site.image.previewUrl}
              alt={t.finder.previewAlt(site.name, site.image.widthKm)}
              width={288}
              height={180}
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-md bg-space/80 px-1.5 py-0.5 text-[11px] font-medium">
              {t.finder.previewScale(site.image.widthKm)}
            </span>
            <span className="absolute right-2 bottom-2 rounded-md bg-space/80 px-1.5 py-0.5 text-[11px] text-text-muted">
              {site.image.source}
            </span>
          </>
        )}
      </div>
      <div className="px-2 pt-3 pb-2">
        <p className="text-base leading-snug font-semibold">{site.name}</p>
        <p className="mt-0.5 text-[13px] text-text-muted">{site.region}</p>
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-text/80">{site.missionRelevance}</p>
      </div>
    </div>,
    container,
  );
};
