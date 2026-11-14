import { RotateCcw } from "lucide-react";
import { t } from "@/shared/i18n";
import { toPct } from "@/shared/lib/score-tone";
import { GlassCard } from "@/shared/ui/glass-card";
import { ASPECTS, type Aspect, type Weights } from "../../domain/entities";

type WeightsPanelViewProps = {
  weights: Weights;
  isCustom: boolean;
  onChange: (aspect: Aspect, value: number) => void;
  onReset: () => void;
};

export const WeightsPanelView = ({ weights, isCustom, onChange, onReset }: WeightsPanelViewProps) => (
  <GlassCard aria-labelledby="weights-title" className="space-y-3">
    <div className="flex items-center justify-between gap-2">
      <h2 id="weights-title" className="text-sm font-semibold">
        {t.weights.title}
      </h2>
      <button
        type="button"
        onClick={onReset}
        disabled={!isCustom}
        aria-label={t.weights.reset}
        title={t.weights.reset}
        className="grid size-8 place-items-center rounded-full text-text-muted transition hover:bg-surface-raised hover:text-text disabled:opacity-30"
      >
        <RotateCcw className="size-4" strokeWidth={1.5} aria-hidden />
      </button>
    </div>
    {ASPECTS.map((aspect) => (
      <label key={aspect} className="grid gap-1.5 text-xs">
        <span className="flex justify-between text-text-muted">
          {t.aspects[aspect]}
          <span className="tabular-nums text-text">{toPct(weights[aspect])}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={weights[aspect]}
          onChange={(event) => onChange(aspect, Number(event.target.value))}
          className="accent-lime"
        />
      </label>
    ))}
    <p className="text-[11px] text-text-muted">{t.weights.hint}</p>
  </GlassCard>
);
