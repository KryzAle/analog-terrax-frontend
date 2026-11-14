import { Car, CircleDot, Drill, type LucideIcon, PersonStanding, PlaneLanding, ScanLine, Shovel } from "lucide-react";

const icons: Readonly<Record<string, LucideIcon>> = {
  rover: Car,
  drilling: Drill,
  construction: Shovel,
  eva: PersonStanding,
  instruments: ScanLine,
  landing: PlaneLanding,
};

export const activityIcon = (key: string): LucideIcon => icons[key] ?? CircleDot;
