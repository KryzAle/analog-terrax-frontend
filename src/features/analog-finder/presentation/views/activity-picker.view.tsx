import { t } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { GlassCard } from "@/shared/ui/glass-card";
import type { Activity } from "../../domain/entities";
import { activityIcon } from "./activity-icons";

type ActivityPickerViewProps = {
  activities: readonly Activity[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export const ActivityPickerView = ({ activities, selectedId, onSelect }: ActivityPickerViewProps) => (
  <GlassCard aria-labelledby="activity-title" className="space-y-3">
    <h2 id="activity-title" className="text-sm font-semibold">
      {t.finder.activityTitle}
    </h2>
    <div role="radiogroup" aria-labelledby="activity-title" className="grid grid-cols-2 gap-2">
      {activities.map((activity) => {
        const Icon = activityIcon(activity.icon);
        const isSelected = activity.id === selectedId;
        const isNotCustomized = activity.id === "not-customized";
        return (
          <button
            key={activity.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(activity.id)}
            className={cn(
              "flex rounded-tile border p-3 text-left text-xs leading-snug transition duration-200 ease-out",
              isNotCustomized ? "col-span-2 flex-row items-center gap-3" : "flex-col items-start gap-2",
              isSelected
                ? "border-lime/60 bg-lime/10 text-text shadow-[0_0_24px_rgb(217_242_74/0.15)]"
                : "border-line text-text-muted hover:bg-surface-raised hover:text-text",
            )}
          >
            <Icon className={cn("size-5 shrink-0", isSelected && "text-lime")} strokeWidth={1.5} aria-hidden />
            <span>{activity.name}</span>
          </button>
        );
      })}
    </div>
  </GlassCard>
);
