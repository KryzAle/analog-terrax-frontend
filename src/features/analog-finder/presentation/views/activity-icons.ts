import {
  Car,
  CircleDot,
  Compass,
  Drill,
  type LucideIcon,
  PersonStanding,
  PlaneLanding,
  ScanLine,
  Shovel,
  SlidersHorizontal,
} from "lucide-react";

const icons: Readonly<Record<string, LucideIcon>> = {
  "not-customized": SlidersHorizontal,
  general: Compass,
  rover: Car,
  drilling: Drill,
  construction: Shovel,
  eva: PersonStanding,
  instruments: ScanLine,
  landing: PlaneLanding,
};

export const activityIcon = (key: string): LucideIcon => icons[key] ?? CircleDot;
