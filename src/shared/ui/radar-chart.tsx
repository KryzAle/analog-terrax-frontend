"use client";

import { Chart as ChartJS, Filler, LineElement, PointElement, RadialLinearScale, Tooltip } from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

type RadarChartProps = {
  labels: readonly string[];
  values: readonly number[];
  hexColor: string;
  ariaLabel: string;
};

const GRID = "rgba(255,255,255,0.08)";
const MUTED = "#9aa3b2";

export const RadarChart = ({ labels, values, hexColor, ariaLabel }: RadarChartProps) => (
  <div className="mx-auto aspect-square w-full max-w-64" role="img" aria-label={ariaLabel}>
    <Radar
      data={{
        labels: [...labels],
        datasets: [
          {
            data: [...values],
            borderColor: hexColor,
            backgroundColor: `${hexColor}4d`,
            pointBackgroundColor: hexColor,
            borderWidth: 2,
            fill: true,
          },
        ],
      }}
      options={{
        animation: { duration: 250 },
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false, stepSize: 25 },
            grid: { color: GRID },
            angleLines: { color: GRID },
            pointLabels: { color: MUTED, font: { size: 11 } },
          },
        },
      }}
    />
  </div>
);
