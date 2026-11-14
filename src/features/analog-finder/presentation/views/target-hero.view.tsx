import { t } from "@/shared/i18n";
import { worldColor } from "@/shared/lib/world-color";
import type { Site, World } from "../../domain/entities";

type TargetHeroViewProps = {
  world: World;
  target: Site | null;
};

export const TargetHeroView = ({ world, target }: TargetHeroViewProps) => (
  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-space via-space/70 to-transparent p-6 pt-24">
    <div
      className="absolute -bottom-24 -left-16 size-80 rounded-full opacity-35 blur-[80px]"
      style={{ backgroundColor: worldColor[world].css }}
      aria-hidden
    />
    <p className="relative text-xs font-semibold uppercase tracking-widest" style={{ color: worldColor[world].css }}>
      {t.worlds[world]} · {target?.region ?? t.app.tagline}
    </p>
    <h1 className="relative max-w-3xl text-5xl leading-[0.9] font-extrabold tracking-[-0.04em] text-balance 2xl:text-7xl">
      {target?.name ?? t.app.name}
    </h1>
  </div>
);
