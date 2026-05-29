import { cn } from "@/lib/utils";

type StatSummaryCardProps = {
  label: string;
  value: string | number;
  tone?: "neutral" | "success" | "warning";
  className?: string;
};

const toneStyles = {
  neutral: "border-border/80 bg-card text-foreground shadow-sm",
  success:
    "border-emerald-200/90 bg-emerald-50 text-emerald-900 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200",
  warning:
    "border-amber-200/90 bg-amber-50 text-amber-900 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200",
} as const;

export function StatSummaryCard({ label, value, tone = "neutral", className }: StatSummaryCardProps) {
  return (
    <div className={cn("rounded-2xl border p-5", toneStyles[tone], className)}>
      <p
        className={cn(
          "text-sm font-medium",
          tone === "neutral" ? "text-muted-foreground" : "opacity-90",
        )}
      >
        {label}
      </p>
      <p className="mt-2 text-[2.2rem] font-semibold leading-none">{value}</p>
    </div>
  );
}
