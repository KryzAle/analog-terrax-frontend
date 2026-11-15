"use client";

import { useLayoutEffect, useRef } from "react";

const DURATION_MS = 400;
const EASING = "cubic-bezier(0.2, 0, 0, 1)";
const ENTER_FRAMES: Keyframe[] = [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }];

const itemsOf = (list: HTMLElement) =>
  Array.from(list.querySelectorAll<HTMLElement>(":scope > [data-flip-key]"));

const keyOf = (item: HTMLElement) => item.dataset.flipKey ?? "";

const framesFor = (previousTop: number | undefined, top: number): Keyframe[] | null => {
  if (previousTop === undefined) return ENTER_FRAMES;
  if (previousTop === top) return null;
  return [{ transform: `translateY(${previousTop - top}px)` }, { transform: "none" }];
};

// ponytail: an interrupted glide restarts from the card's resting position; track visual rects if that ever shows
export const useFlipReorder = <T extends HTMLElement>(keys: readonly string[]) => {
  const listRef = useRef<T>(null);
  const topsRef = useRef<ReadonlyMap<string, number>>(new Map());
  const order = keys.join("|");

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = itemsOf(list);
    const previousTops = topsRef.current;
    topsRef.current = new Map(items.map((item) => [keyOf(item), item.offsetTop]));
    if (previousTops.size === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    items.forEach((item) => {
      item.getAnimations().forEach((animation) => animation.cancel());
      const frames = framesFor(previousTops.get(keyOf(item)), item.offsetTop);
      if (frames) item.animate(frames, { duration: DURATION_MS, easing: EASING });
    });
  }, [order]);

  return listRef;
};
