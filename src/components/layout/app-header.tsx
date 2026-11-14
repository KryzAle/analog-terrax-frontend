import { Orbit } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <Orbit className="h-6 w-6 text-sky-400" />
          <span className="text-lg font-bold tracking-tight text-slate-100">
            ANALOG TERRAX
          </span>
        </div>
        <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400">
          NASA Space Apps 2026 Infrastructure
        </span>
      </div>
    </header>
  );
}
