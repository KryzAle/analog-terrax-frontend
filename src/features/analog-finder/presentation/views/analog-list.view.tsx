import { t } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { scoreTone, toneColor, toPct } from "@/shared/lib/score-tone";
import { GlassCard } from "@/shared/ui/glass-card";
import { ScorePill } from "@/shared/ui/score-pill";
import { ASPECTS, type AnalogMatch } from "../../domain/entities";

type AnalogListViewProps = {
  matches: readonly AnalogMatch[];
  selectedId: string | null;
  isPending: boolean;
  isRefreshing: boolean;
  isError: boolean;
  onSelect: (siteId: string) => void;
  onRetry: () => void;
};

const AspectBar = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
    <span className="w-3 font-semibold">{label}</span>
    <span className="h-1 flex-1 overflow-hidden rounded-full bg-line">
      <span
        className="block h-full rounded-full"
        style={{ width: `${toPct(value)}%`, backgroundColor: toneColor[scoreTone(toPct(value))] }}
      />
    </span>
    <span className="w-8 text-right tabular-nums text-text">{toPct(value)}</span>
  </div>
);

export const AnalogListView = ({ matches, selectedId, isPending, isRefreshing, isError, onSelect, onRetry }: AnalogListViewProps) => (
  <GlassCard aria-labelledby="results-title" aria-busy={isPending || isRefreshing} className="flex min-h-0 flex-col gap-3">
    <h2 id="results-title" className="text-sm font-semibold">
      {t.finder.resultsTitle}
    </h2>
    {isError ? (
      <button type="button" onClick={onRetry} className="text-left text-xs text-danger">
        {t.errors.loadFailed} {t.status.retry}
      </button>
    ) : isPending ? (
      <p className="text-xs text-text-muted">{t.finder.resultsLoading}</p>
    ) : matches.length === 0 ? (
      <p className="text-xs text-text-muted">{t.finder.resultsEmpty}</p>
    ) : (
      <ol className={cn("-mr-2 flex min-h-0 flex-col gap-2 overflow-y-auto pr-2 transition-opacity", isRefreshing && "opacity-60")}>
        {matches.map((match) => (
          <li key={match.site.id}>
            <button
              type="button"
              onClick={() => onSelect(match.site.id)}
              aria-label={t.finder.openDetail(match.site.name)}
              className={cn(
                "w-full space-y-2.5 rounded-tile border p-3 text-left transition duration-200 ease-out",
                match.site.id === selectedId
                  ? "border-lime/70 bg-surface-raised shadow-[0_0_24px_rgb(217_242_74/0.15)]"
                  : "border-line hover:bg-surface-raised",
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="min-w-0">
                  <span className="text-xs font-semibold text-text-muted">{t.finder.rank(match.rank)}</span>
                  <span className="block text-sm font-semibold leading-snug">{match.site.name}</span>
                  <span className="block truncate text-xs text-text-muted">
                    {match.site.region}
                    {match.site.isKnownAnalog && ` · ${t.finder.knownAnalogBadge}`}
                  </span>
                </span>
                <ScorePill label={t.finder.match} pct={Math.round(match.overallPct)} />
              </span>
              <span className="grid gap-1">
                {ASPECTS.map((aspect) => (
                  <AspectBar key={aspect} label={t.aspects.short[aspect]} value={match.aspects[aspect]} />
                ))}
              </span>
            </button>
          </li>
        ))}
      </ol>
    )}
  </GlassCard>
);
