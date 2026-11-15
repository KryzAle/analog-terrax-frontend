"use client";

import { RefreshCw } from "lucide-react";
import { t } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { useHealthCheck } from "../hooks/use-health-check";

export const ApiStatusBadge = () => {
  const { data, isPending, isError, refetch, isFetching } = useHealthCheck();
  const tone = isPending ? "bg-warning" : isError ? "bg-danger" : "bg-success";
  const label = isPending
    ? t.status.connecting
    : isError || !data
      ? t.status.offline
      : t.status.online(data.service, data.version);

  return (
    <div role="status" className="flex items-center gap-3 rounded-tile border border-line bg-glass px-3.5 py-2.5 text-xs backdrop-blur-xl">
      <span className={cn("size-2 rounded-full", tone, isFetching && "animate-pulse")} aria-hidden />
      <span className="text-text-muted">{label}</span>
      <button
        type="button"
        onClick={() => refetch()}
        disabled={isFetching}
        aria-label={t.status.retry}
        title={t.status.retry}
        className="grid size-7 place-items-center rounded-full text-text-muted transition hover:bg-surface-raised hover:text-text disabled:opacity-40"
      >
        <RefreshCw className={cn("size-3.5", isFetching && "animate-spin")} strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
};
