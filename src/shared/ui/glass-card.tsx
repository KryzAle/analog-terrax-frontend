import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

type GlassCardProps = ComponentPropsWithoutRef<"section">;

export const GlassCard = ({ className, ...props }: GlassCardProps) => (
  <section
    className={cn("rounded-card border border-line bg-surface p-5 backdrop-blur-xl", className)}
    {...props}
  />
);
