import { t } from "@/shared/i18n";
import { worldColor } from "@/shared/lib/world-color";
import type { Site, World } from "../../domain/entities";

type TargetHeroViewProps = {
  world: World;
  target: Site | null;
};

export const TargetHeroView = ({ world, target }: TargetHeroViewProps) => {
  const name = target?.name ?? t.app.name;
  return (
    <div
      className="absolute bottom-3 left-3 z-10 max-w-[min(28rem,calc(50%-1rem))] rounded-tile border border-line border-l-4 bg-surface-solid/85 px-3 py-2 backdrop-blur-xl"
      style={{ borderLeftColor: worldColor[world].css }}
    >
      <p className="truncate text-[11px] font-semibold tracking-widest uppercase" style={{ color: worldColor[world].css }}>
        {t.worlds[world]} · {target?.region ?? t.app.tagline}
      </p>
      <h1 title={name} className="truncate text-lg leading-tight font-bold tracking-tight">
        {name}
      </h1>
    </div>
  );
};
