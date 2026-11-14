import { scoreTone, toneColor } from "@/shared/lib/score-tone";
import { cn } from "@/shared/lib/cn";

type ScorePillProps = {
  label: string;
  pct: number;
  size?: "md" | "lg";
};

export const ScorePill = ({ label, pct, size = "md" }: ScorePillProps) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised p-1 pr-3">
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-space"
      style={{ backgroundColor: toneColor[scoreTone(pct)] }}
    >
      {label}
    </span>
    <span className={cn("font-semibold tabular-nums", size === "lg" ? "text-3xl" : "text-lg")}>{pct}%</span>
  </span>
);
