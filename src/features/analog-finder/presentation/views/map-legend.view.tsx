import { t } from "@/shared/i18n";
import { toneColor } from "@/shared/lib/score-tone";

const legendItems = [
  { key: "high", color: toneColor.high },
  { key: "medium", color: toneColor.medium },
  { key: "low", color: toneColor.low },
  { key: "known", color: "var(--color-known)" },
] as const;

export const MapLegendView = () => (
  <ul
    aria-label={t.map.legendTitle}
    className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 rounded-tile border border-line bg-surface-solid/85 px-3 py-2 text-xs text-text-muted backdrop-blur-xl"
  >
    {legendItems.map((item) => (
      <li key={item.key} className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full border border-white" style={{ backgroundColor: item.color }} aria-hidden />
        {t.map.legend[item.key]}
      </li>
    ))}
  </ul>
);
