import { cn } from "@/lib/utils";

/** Shared surface styles driven by theme.css tokens (neutral light, no pink tint). */
export const semanticSurfaces = {
  success:
    "border-[color:var(--surface-success-border)] bg-[var(--surface-success-bg)] text-[var(--surface-success-fg)]",
  warning:
    "border-[color:var(--surface-warning-border)] bg-[var(--surface-warning-bg)] text-[var(--surface-warning-fg)]",
  neutral: "border-border/80 bg-card text-foreground",
  muted: "border-border/80 bg-muted/40 text-muted-foreground",
} as const;

export type SemanticTone = keyof typeof semanticSurfaces;

export function surfaceClass(tone: SemanticTone, className?: string) {
  return cn("rounded-2xl border shadow-sm", semanticSurfaces[tone], className);
}

export function achievementCardClass(active: boolean, className?: string) {
  return cn(
    "rounded-xl border p-4 shadow-sm transition-colors",
    active
      ? semanticSurfaces.success
      : "border-border/70 bg-muted/35 text-muted-foreground",
    className,
  );
}

export function statusPillClass(variant: "success" | "warning") {
  return cn(
    "rounded-full px-3 py-1 text-xs font-medium",
    variant === "warning"
      ? "bg-[var(--surface-warning-bg)] text-[var(--surface-warning-fg)]"
      : "bg-[var(--surface-success-bg)] text-[var(--surface-success-fg)]",
  );
}
