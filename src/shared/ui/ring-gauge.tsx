import { scoreTone, toneColor } from "@/shared/lib/score-tone";

type RingGaugeProps = {
  pct: number;
  label: string;
  size?: number;
};

const STROKE = 6;

export const RingGauge = ({ pct, label, size = 76 }: RingGaugeProps) => {
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(pct, 0), 100) / 100);

  return (
    <figure className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-line)" strokeWidth={STROKE} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={toneColor[scoreTone(pct)]}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-300 ease-out"
        />
      </svg>
      <figcaption className="absolute inset-0 grid place-content-center text-center leading-tight">
        <span className="text-base font-semibold tabular-nums">{pct}%</span>
        <span className="text-[10px] text-text-muted">{label}</span>
      </figcaption>
    </figure>
  );
};
