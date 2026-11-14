import { AnalogExplorerDashboard } from "@/features/analog-explorer/components/analog-explorer-dashboard";
import { ApiStatusBadge } from "@/features/system-status/components/api-status-badge";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-6 lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">
            NASA Space Apps Challenge 2026 — Permanent Moon Base & Mars Analogs
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
            Multi-Planetary Terrestrial Analog Discovery Dashboard
          </h1>
          <p className="max-w-2xl text-xs leading-relaxed text-slate-400">
            Match candidate Lunar (LRO LOLA) and Martian (MGS MOLA / TES) base
            locations against Earth analog terrains using fixed-scale (500 m GSD,
            25 km window) topography, harmonized lithology matrices, masked
            mineral vectors, and ICESat-2 laser altimetry profiles.
          </p>
        </div>

        <div className="w-full lg:w-96">
          <ApiStatusBadge />
        </div>
      </div>

      <AnalogExplorerDashboard />
    </div>
  );
}
