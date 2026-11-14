import { MapPin } from "lucide-react";
import { t } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { worldColor } from "@/shared/lib/world-color";
import { GlassCard } from "@/shared/ui/glass-card";
import type { Site, World } from "../../domain/entities";

type TargetListViewProps = {
  world: World;
  targets: readonly Site[];
  selectedId: string | null;
  isPending: boolean;
  isError: boolean;
  onSelect: (id: string) => void;
  onRetry: () => void;
};

export const TargetListView = ({ world, targets, selectedId, isPending, isError, onSelect, onRetry }: TargetListViewProps) => (
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
                onClick={() => onSelect(site.id)}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-tile border px-3 py-2.5 text-left transition duration-200 ease-out",
                  isSelected ? "border-transparent bg-surface-raised" : "border-transparent hover:bg-surface",
                )}
                style={isSelected ? { boxShadow: `inset 0 0 0 1px ${worldColor[world].css}, 0 0 24px color-mix(in srgb, ${worldColor[world].css} 25%, transparent)` } : undefined}
              >
                <MapPin className="mt-0.5 size-4 shrink-0" style={{ color: worldColor[world].css }} strokeWidth={1.5} aria-hidden />
                <span className="min-w-0">
                  <span className="block text-sm font-medium leading-snug">{site.name}</span>
                  <span className="block truncate text-xs text-text-muted">{site.region}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    )}
  </GlassCard>
);
