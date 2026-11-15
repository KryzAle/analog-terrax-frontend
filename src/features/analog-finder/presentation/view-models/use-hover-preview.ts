"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CLOSE_DELAY_MS = 120;

export type Viewport = Readonly<{ width: number; height: number }>;

type Preview = Readonly<{ id: string; anchor: DOMRect; viewport: Viewport; container: HTMLElement }>;

export const useHoverPreview = () => {
  const [preview, setPreview] = useState<Preview | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cancelClose = useCallback(() => clearTimeout(closeTimer.current), []);

  const close = useCallback(() => {
    cancelClose();
    setPreview(null);
  }, [cancelClose]);

  const open = useCallback(
    (id: string, anchor: Element) => {
      cancelClose();
      const { body, defaultView } = anchor.ownerDocument;
      setPreview({
        id,
        anchor: anchor.getBoundingClientRect(),
        viewport: { width: defaultView?.innerWidth ?? 0, height: defaultView?.innerHeight ?? 0 },
        container: body,
      });
    },
    [cancelClose],
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setPreview(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => {
    if (!preview) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [preview, close]);

  useEffect(() => cancelClose, [cancelClose]);

  return { preview, open, scheduleClose, cancelClose, close };
};
