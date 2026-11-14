import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";

type RailButtonProps = {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  role?: "radio" | "switch";
};

export const RailButton = ({ icon: Icon, label, isActive, onClick, role = "radio" }: RailButtonProps) => (
  <button
    type="button"
    role={role}
    aria-checked={isActive}
    onClick={onClick}
    className={cn(
      "flex w-full flex-col items-center gap-1 rounded-2xl px-1 py-2.5 text-[11px] font-medium transition duration-200 ease-out",
      isActive
        ? "bg-lime/15 text-lime shadow-[0_0_24px_rgb(217_242_74/0.25)]"
        : "text-text-muted hover:bg-surface-raised hover:text-text",
    )}
  >
    <Icon className="size-5" strokeWidth={1.5} aria-hidden />
    {label}
  </button>
);
