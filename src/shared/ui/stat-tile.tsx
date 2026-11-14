import type { LucideIcon } from "lucide-react";

type StatTileProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  tint: string;
};

export const StatTile = ({ icon: Icon, label, value, tint }: StatTileProps) => (
  <div
    className="flex min-w-0 flex-col gap-3 rounded-tile border border-line p-4 backdrop-blur-xl"
    style={{ backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${tint} 16%, transparent), rgb(255 255 255 / 0.03))` }}
  >
    <div className="flex items-center gap-2.5">
      <span
        className="grid size-8 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `color-mix(in srgb, ${tint} 22%, transparent)`, color: tint }}
      >
        <Icon className="size-4" strokeWidth={1.5} aria-hidden />
      </span>
      <span className="truncate text-xs font-medium text-text-muted">{label}</span>
    </div>
    <span className="truncate text-2xl font-semibold tabular-nums">{value}</span>
  </div>
);
