import type { CSSProperties } from "react";
import { cn } from "@/shared/lib/cn";
import { scoreTone, toneColor } from "@/shared/lib/score-tone";

type ScorePillProps = {
  label: string;
  pct: number;
  size?: "md" | "lg";
};

export const ScorePill = ({ label, pct, size = "md" }: ScorePillProps) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised p-1 pr-3">
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-space transition-colors duration-500"
      style={{ backgroundColor: toneColor[scoreTone(pct)] }}
    >
      {label}
    </span>
    <span
      role="img"
      aria-label={`${pct}%`}
      className={cn("score-count font-semibold tabular-nums", size === "lg" ? "text-3xl" : "text-lg")}
      style={{ "--score": pct } as CSSProperties}
    />
  </span>
);
