import { Eye, Moon, Orbit } from "lucide-react";
import { t } from "@/shared/i18n";
import { RailButton } from "@/shared/ui/rail-button";
import type { World } from "../../domain/entities";

type WorldRailViewProps = {
  world: World;
  showKnownAnalogs: boolean;
  onSelectWorld: (world: World) => void;
  onToggleKnownAnalogs: () => void;
  onOpenAbout: () => void;
};

export const WorldRailView = ({
  world,
  showKnownAnalogs,
  onSelectWorld,
  onToggleKnownAnalogs,
  onOpenAbout,
}: WorldRailViewProps) => (
  <nav className="pointer-events-auto flex items-center gap-2 rounded-card border border-line bg-glass p-2 backdrop-blur-xl xl:flex-col xl:py-4">
    <button
      type="button"
      aria-label={t.intro.open}
      title={t.intro.open}
      aria-haspopup="dialog"
      onClick={onOpenAbout}
      className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lime text-space transition duration-200 ease-out hover:shadow-[0_0_24px_rgb(217_242_74/0.45)]"
    >
      <Orbit className="size-6" strokeWidth={1.75} aria-hidden />
    </button>
    <div role="radiogroup" aria-label={t.worlds.label} className="flex gap-1 xl:mt-4 xl:w-full xl:flex-col">
      <RailButton icon={Moon} label={t.worlds.moon} isActive={world === "moon"} onClick={() => onSelectWorld("moon")} />
      <RailButton icon={Orbit} label={t.worlds.mars} isActive={world === "mars"} onClick={() => onSelectWorld("mars")} />
    </div>
    <div className="ml-auto xl:mt-auto xl:ml-0 xl:w-full">
      <RailButton
        icon={Eye}
        role="switch"
        label={t.finder.knownAnalogs}
        isActive={showKnownAnalogs}
        onClick={onToggleKnownAnalogs}
      />
    </div>
  </nav>
);
