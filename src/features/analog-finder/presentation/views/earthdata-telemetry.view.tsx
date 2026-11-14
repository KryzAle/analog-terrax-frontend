import { ExternalLink, Satellite } from "lucide-react";
import { t } from "@/shared/i18n";
import { formatNumber } from "@/shared/lib/format";
import type { EarthdataTelemetry } from "../../domain/entities";

type EarthdataTelemetryViewProps = {
  telemetry: EarthdataTelemetry;
};

const WIDTH = 480;
const HEIGHT = 110;
const PAD = 14;

export const EarthdataTelemetryView = ({ telemetry }: EarthdataTelemetryViewProps) => {
  const photons = telemetry.photons;
  const heights = photons.map((p) => p.heightWgs84M);
  const minH = heights.length > 0 ? Math.min(...heights) : 0;
  const maxH = heights.length > 0 ? Math.max(...heights) : 1;
  const rangeH = Math.max(maxH - minH, 0.5);
  const highConfCount = photons.filter((p) => p.landSignalConfidence >= 3).length;

  return (
    <div className="space-y-3 rounded-tile border border-line bg-space/50 p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-lime">
            <Satellite className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            <span className="truncate font-mono">{telemetry.granuleId}</span>
          </div>
          <p className="text-[11px] text-text-muted">
            {telemetry.conceptId} · v{telemetry.version} · {telemetry.timeStart.slice(0, 10)}
          </p>
        </div>
        {telemetry.httpsUrl && (
          <a
            href={telemetry.httpsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-text-muted transition hover:border-lime/50 hover:text-text"
          >
            {t.detail.openNsidcGranule}
            <ExternalLink className="size-3" strokeWidth={1.5} aria-hidden />
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div className="rounded-lg border border-line/80 bg-surface/50 p-2">
          <span className="block text-[10px] text-text-muted">{t.detail.beamOrbit}</span>
          <span className="font-mono font-semibold uppercase tabular-nums">
            {telemetry.beamId} · #{telemetry.orbitNumber ?? "—"} / RGT {telemetry.rgt ?? "—"}
          </span>
        </div>
        <div className="rounded-lg border border-line/80 bg-surface/50 p-2">
          <span className="block text-[10px] text-text-muted">{t.detail.granuleSize}</span>
          <span className="font-semibold tabular-nums">{formatNumber(telemetry.sizeMb, "MB")}</span>
        </div>
        <div className="rounded-lg border border-line/80 bg-surface/50 p-2">
          <span className="block text-[10px] text-text-muted">{t.detail.alongTrackRelief}</span>
          <span className="font-semibold tabular-nums">
            {formatNumber(telemetry.alongTrackReliefM, "m")}
          </span>
        </div>
        <div className="rounded-lg border border-line/80 bg-surface/50 p-2">
          <span className="block text-[10px] text-text-muted">{t.detail.alongTrackElev}</span>
          <span className="font-semibold tabular-nums">
            {formatNumber(telemetry.alongTrackMeanElevationM, "m")}
          </span>
        </div>
      </div>

      {photons.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span>{t.detail.photonCloudTitle}</span>
            <span className="tabular-nums">
              {t.detail.highConfidencePhotons}: {highConfCount}/{photons.length}
            </span>
          </div>
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full rounded-lg border border-line/60 bg-space/80"
            aria-label={t.detail.photonCloudTitle}
          >
            {photons.map((ph, idx) => {
              const x =
                PAD + (idx / Math.max(photons.length - 1, 1)) * (WIDTH - PAD * 2);
              const y =
                HEIGHT - PAD - ((ph.heightWgs84M - minH) / rangeH) * (HEIGHT - PAD * 2);
              const isHighConf = ph.landSignalConfidence >= 3;
              return (
                <circle
                  key={`${ph.photonIndex}-${idx}`}
                  cx={x.toFixed(1)}
                  cy={y.toFixed(1)}
                  r={isHighConf ? 3.2 : 2.2}
                  fill={isHighConf ? "var(--color-lime)" : "var(--color-text-muted)"}
                  fillOpacity={isHighConf ? 0.9 : 0.55}
                >
                  <title>
                    {`Photon #${ph.photonIndex}: ${ph.heightWgs84M.toFixed(2)} m WGS84 (conf=${ph.landSignalConfidence})`}
                  </title>
                </circle>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};
