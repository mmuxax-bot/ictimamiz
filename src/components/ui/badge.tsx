import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "present" | "excused" | "absent" | "accent";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-elevated text-muted border-border",
  present: "bg-present/15 text-present border-present/30",
  excused: "bg-excused/15 text-excused border-excused/30",
  absent: "bg-absent/15 text-absent border-absent/30",
  accent: "bg-accent/15 text-accent border-accent/30",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
