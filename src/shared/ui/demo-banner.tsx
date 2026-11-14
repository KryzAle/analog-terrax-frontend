import { TriangleAlert } from "lucide-react";
import { appConfig } from "@/shared/config/app-config";
import { t } from "@/shared/i18n";

export const DemoBanner = () =>
  appConfig.demoData ? (
    <p
      role="status"
      className="flex items-center justify-center gap-2 border-b border-warning/30 bg-warning/10 px-4 py-1.5 text-xs font-medium text-warning"
    >
      <TriangleAlert className="size-3.5" strokeWidth={1.5} aria-hidden />
      {t.honesty.demoBanner}
    </p>
  ) : null;
