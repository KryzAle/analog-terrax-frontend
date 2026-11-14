import { t } from "@/shared/i18n";
import { formatNumber } from "@/shared/lib/format";
import type { LaserComparison, ProfileSeries } from "../../domain/entities";

type LaserProfileViewProps = {
  comparison: LaserComparison;
  targetColor: string;
  earthColor: string;
};

const WIDTH = 480;
const HEIGHT = 160;
const PAD = 12;

const toPolyline = (series: ProfileSeries, minY: number, rangeY: number): string => {
  const maxDistance = Math.max(series.points.at(-1)?.distanceKm ?? 1, 0.001);
  return series.points
    .map((point) => {
      const x = PAD + (point.distanceKm / maxDistance) * (WIDTH - PAD * 2);
      const y = HEIGHT - PAD - ((point.relativeElevationM - minY) / rangeY) * (HEIGHT - PAD * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-line p-2.5">
    <span className="block text-[11px] text-text-muted">{label}</span>
    <span className="font-semibold tabular-nums">{value}</span>
  </div>
);

export const LaserProfileView = ({ comparison, targetColor, earthColor }: LaserProfileViewProps) => {
  const elevations = [comparison.target, comparison.earth].flatMap((series) =>
    series.points.map((point) => point.relativeElevationM),
  );
  const minY = Math.min(...elevations, -10);
  const rangeY = Math.max(Math.max(...elevations, 10) - minY, 1);
  const legend = [
    { series: comparison.target, color: targetColor },
    { series: comparison.earth, color: earthColor },
  ];

  return (
    <div className="space-y-3">
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
        {legend.map(({ series, color }) => (
          <li key={series.instrument} className="flex items-center gap-1.5">
            <span className="h-1 w-4 rounded-full" style={{ backgroundColor: color }} aria-hidden />
            <span>
              {series.instrument}
              {series.granuleId.endsWith(".h5") && (
                <span className="ml-1.5 font-mono text-[11px] text-lime">
                  ({series.granuleId}{series.beam ? ` · ${series.beam.toUpperCase()}` : ""})
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full rounded-lg bg-space/60" aria-hidden>
        {legend.map(({ series, color }) => (
          <polyline key={series.instrument} fill="none" stroke={color} strokeWidth={2} points={toPolyline(series, minY, rangeY)} />
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Stat label={`${t.detail.rmsRoughness} · ${t.worlds.earth}`} value={formatNumber(comparison.earth.rmsRoughnessM, "m")} />
        <Stat label={`${t.detail.rmsRoughness} · ${t.stats.target}`} value={formatNumber(comparison.target.rmsRoughnessM, "m")} />
        <Stat label={t.detail.roughnessRatio} value={`${formatNumber(comparison.roughnessRatio)}×`} />
        <Stat label={t.detail.slopeDelta} value={formatNumber(comparison.slopeDeltaDeg, "°")} />
      </div>
    </div>
  );
};
