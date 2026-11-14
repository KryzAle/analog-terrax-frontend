import { Crosshair, Globe, Trophy } from "lucide-react";
import { t } from "@/shared/i18n";
import { scoreTone, toneColor } from "@/shared/lib/score-tone";
import { worldColor } from "@/shared/lib/world-color";
import { StatTile } from "@/shared/ui/stat-tile";
import type { Activity, World } from "../../domain/entities";
import { activityIcon } from "./activity-icons";

type StatRowViewProps = {
  world: World;
  targetName: string | null;
  activity: Activity;
  topScore: number | null;
  evaluatedCount: number | null;
};

export const StatRowView = ({ world, targetName, activity, topScore, evaluatedCount }: StatRowViewProps) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    <StatTile icon={Crosshair} label={t.stats.target} value={targetName ?? t.stats.none} tint={worldColor[world].css} />
    <StatTile icon={activityIcon(activity.icon)} label={t.stats.activity} value={activity.name} tint="var(--color-link)" />
    <StatTile
      icon={Trophy}
      label={t.stats.topScore}
      value={topScore === null ? t.stats.none : `${topScore}%`}
      tint={topScore === null ? "var(--color-text-muted)" : toneColor[scoreTone(topScore)]}
    />
    <StatTile
      icon={Globe}
      label={t.stats.evaluated}
      value={evaluatedCount === null ? t.stats.none : String(evaluatedCount)}
      tint={worldColor.earth.css}
    />
  </div>
);
