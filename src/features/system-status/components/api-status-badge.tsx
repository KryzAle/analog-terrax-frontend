"use client";

import { Activity, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useHealthCheck } from "../hooks/use-health-check";

export function ApiStatusBadge() {
  const { data, isLoading, isError, refetch, isFetching } = useHealthCheck();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Activity className="h-5 w-5 animate-pulse text-sky-400" />
          ) : isError ? (
            <AlertCircle className="h-5 w-5 text-rose-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          )}
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Backend Telemetry Link
            </h2>
            <p className="text-xs text-slate-400">
              {isLoading
                ? "Connecting to FastAPI backend..."
                : isError
                  ? "Backend unreachable — verify NEXT_PUBLIC_API_URL"
                  : `${data?.service} v${data?.version} (${data?.environment})`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Ping
        </button>
      </div>
    </div>
  );
}
