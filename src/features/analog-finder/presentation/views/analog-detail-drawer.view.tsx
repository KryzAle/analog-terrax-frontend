"use client";

import { CircleCheck, CircleMinus, FlaskConical, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { t } from "@/shared/i18n";
import { formatCoordinates, formatNumber } from "@/shared/lib/format";
import { toPct } from "@/shared/lib/score-tone";
import { worldColor } from "@/shared/lib/world-color";
import { EarthLimitsNote } from "@/shared/ui/earth-limits-note";
import { RingGauge } from "@/shared/ui/ring-gauge";
import { ScorePill } from "@/shared/ui/score-pill";
import { SourceList } from "@/shared/ui/source-list";
import { ASPECTS } from "../../domain/entities";
import type { AnalogDetailViewModel } from "../view-models/use-analog-detail-view-model";
import { HighlightListView } from "./highlight-list.view";
import { LaserProfileView } from "./laser-profile.view";

const RadarChart = dynamic(() => import("@/shared/ui/radar-chart").then((module) => module.RadarChart), {
  ssr: false,
  loading: () => <div className="mx-auto aspect-square w-full max-w-64" />,
});

type AnalogDetailDrawerViewProps = AnalogDetailViewModel & { onClose: () => void };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2.5">
    <h3 className="text-xs font-semibold text-text-muted">{title}</h3>
    {children}
  </section>
);

export const AnalogDetailDrawerView = ({
  target,
  match,
  similar,
  different,
  testIdeas,
  activityName,
  sources,
  profile,
  isProfileLoading,
  isProfileError,
  onClose,
}: AnalogDetailDrawerViewProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [onClose]);

  if (!target || !match) return null;
  const targetColor = target.body === "earth" ? worldColor.earth : worldColor[target.body];

  return (
    <dialog
      open
      aria-labelledby="detail-title"
      className="fixed inset-y-0 right-0 left-auto z-30 m-0 flex h-full max-h-none w-full max-w-[560px] flex-col text-text border-l border-line bg-surface-solid/95 shadow-[-24px_0_48px_rgb(0_0_0/0.5)] backdrop-blur-xl motion-safe:animate-[drawer-in_220ms_ease-out]"
    >
      <header className="flex items-start justify-between gap-4 border-b border-line bg-gradient-to-br from-navy to-transparent p-6">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold text-lime">{t.honesty.candidateLabel}</p>
          <h2 id="detail-title" className="text-2xl font-bold leading-tight">
            {match.site.name}
          </h2>
          <p className="text-xs text-text-muted">
            {match.site.region} · {t.detail.coordinates} {formatCoordinates(match.site.lat, match.site.lon)} ·{" "}
            {t.detail.elevation} {formatNumber(match.site.elevationM, "m")}
          </p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.detail.close}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-text-muted transition hover:bg-surface-raised hover:text-text"
        >
          <X className="size-4" strokeWidth={1.5} aria-hidden />
        </button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ScorePill label={t.detail.overall} pct={Math.round(match.overallPct)} size="lg" />
          <div className="flex gap-2">
            {ASPECTS.map((aspect) => (
              <RingGauge key={aspect} pct={toPct(match.aspects[aspect])} label={t.aspects[aspect]} />
            ))}
          </div>
        </div>

        <RadarChart
          labels={ASPECTS.map((aspect) => t.aspects[aspect])}
          values={ASPECTS.map((aspect) => toPct(match.aspects[aspect]))}
          hexColor={targetColor.hex}
          ariaLabel={ASPECTS.map((aspect) => `${t.aspects[aspect]} ${toPct(match.aspects[aspect])}%`).join(", ")}
        />

        <p className="text-sm leading-relaxed text-text-muted">{match.site.missionRelevance}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <HighlightListView
            title={t.detail.similarTitle}
            items={similar}
            emptyText={t.detail.noSimilarities}
            icon={CircleCheck}
            color="var(--color-success)"
          />
          <HighlightListView
            title={t.detail.differentTitle}
            items={different}
            emptyText={t.detail.noDifferences}
            icon={CircleMinus}
            color="var(--color-warning)"
          />
        </div>

        <Section title={`${t.detail.testTitle} · ${activityName}`}>
          <ul className="space-y-1.5 text-sm">
            {testIdeas.map((idea) => (
              <li key={idea} className="flex gap-2">
                <FlaskConical className="mt-0.5 size-4 shrink-0 text-lime" strokeWidth={1.5} aria-hidden />
                {idea}
              </li>
            ))}
          </ul>
        </Section>

        <Section title={`${t.detail.profileTitle} · ${t.detail.profileHint}`}>
          {profile ? (
            <LaserProfileView comparison={profile} targetColor={targetColor.css} earthColor="var(--color-earth-text)" />
          ) : (
            <p className="text-xs text-text-muted">
              {isProfileError ? t.detail.profileError : isProfileLoading ? t.detail.profileLoading : null}
            </p>
          )}
        </Section>

        <SourceList title={t.detail.sourcesTitle} sources={sources} />
        <EarthLimitsNote />
      </div>
    </dialog>
  );
};
