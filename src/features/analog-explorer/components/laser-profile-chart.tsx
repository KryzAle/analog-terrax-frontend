"use client";

import type { LaserProfileComparisonResponse } from "@/client";

export function LaserProfileChart({
  comparison,
  targetName,
  earthName,
}: {
  comparison: LaserProfileComparisonResponse;
  targetName: string;
  earthName: string;
}) {
  const targetPts = comparison.target_profile.points;
  const earthPts = comparison.earth_analog_profile.points;

  const width = 640;
  const height = 210;
  const padX = 44;
  const padY = 24;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const allRelElevs = [
    ...targetPts.map((p) => p.relative_elevation_m),
    ...earthPts.map((p) => p.relative_elevation_m),
  ];
  const minY = Math.min(...allRelElevs, -10);
  const maxY = Math.max(...allRelElevs, 10);
  const rangeY = Math.max(maxY - minY, 1);

  const toPolyline = (pts: typeof targetPts) => {
    if (pts.length === 0) return "";
    const maxDist = Math.max(pts[pts.length - 1]?.distance_km || 1, 0.001);
    return pts
      .map((pt, idx) => {
        const xNorm = pts.length > 1 ? pt.distance_km / maxDist || idx / (pts.length - 1) : 0;
        const x = padX + xNorm * plotW;
        const y = padY + plotH - ((pt.relative_elevation_m - minY) / rangeY) * plotH;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  const zeroY = padY + plotH - ((0 - minY) / rangeY) * plotH;

  return (
    <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400">
            Laser-vs-Laser Altimetry Transect Comparison
          </h4>
          <p className="text-xs text-slate-400">
            Relative elevation profile (Δm along ground track)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="inline-block h-2 w-4 rounded bg-amber-400" />
            {comparison.target_profile.instrument}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="inline-block h-2 w-4 rounded bg-emerald-400" />
            {comparison.earth_analog_profile.instrument}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible rounded-lg bg-slate-900/60"
      >
        <line
          x1={padX}
          y1={zeroY}
          x2={width - padX}
          y2={zeroY}
          stroke="#334155"
          strokeDasharray="4 4"
          strokeWidth="1"
        />
        <text x={8} y={padY + 8} className="fill-slate-500 text-[10px]">
          +{Math.round(maxY)}m
        </text>
        <text x={8} y={height - padY} className="fill-slate-500 text-[10px]">
          {Math.round(minY)}m
        </text>

        <polyline
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.2"
          points={toPolyline(targetPts)}
        />
        <polyline
          fill="none"
          stroke="#34d399"
          strokeWidth="2.2"
          points={toPolyline(earthPts)}
        />
      </svg>

      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-2.5">
          <span className="block text-[11px] text-slate-400">Target RMS Roughness</span>
          <span className="font-mono text-sm font-semibold text-amber-300">
            {comparison.target_profile.stats.rms_roughness_m} m
          </span>
          <span className="block truncate text-[10px] text-slate-500">{targetName}</span>
        </div>
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-2.5">
          <span className="block text-[11px] text-slate-400">Earth RMS Roughness</span>
          <span className="font-mono text-sm font-semibold text-emerald-300">
            {comparison.earth_analog_profile.stats.rms_roughness_m} m
          </span>
          <span className="block truncate text-[10px] text-slate-500">{earthName}</span>
        </div>
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-2.5">
          <span className="block text-[11px] text-slate-400">Roughness Ratio</span>
          <span className="font-mono text-sm font-semibold text-slate-100">
            {comparison.roughness_ratio}×
          </span>
          <span className="block text-[10px] text-slate-500">1.0× = identical scale</span>
        </div>
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-2.5">
          <span className="block text-[11px] text-slate-400">Transect Slope Δ</span>
          <span className="font-mono text-sm font-semibold text-slate-100">
            {comparison.slope_delta_deg}°
          </span>
          <span className="block truncate text-[10px] text-slate-500">
            Granule: {comparison.earth_analog_profile.granule_id}
          </span>
        </div>
      </div>
    </div>
  );
}
