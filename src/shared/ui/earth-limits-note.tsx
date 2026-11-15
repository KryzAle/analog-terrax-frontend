import { Info } from "lucide-react";
import { t } from "@/shared/i18n";

export const EarthLimitsNote = () => (
  <aside className="flex gap-3 rounded-tile border border-line bg-glass p-3.5 text-xs backdrop-blur-xl leading-relaxed text-text-muted">
    <Info className="mt-0.5 size-4 shrink-0 text-lime" strokeWidth={1.5} aria-hidden />
    <p>
      <strong className="font-semibold text-text">{t.honesty.earthLimitsTitle}. </strong>
      {t.honesty.earthLimits}
    </p>
  </aside>
);
