import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string;
  trend?: string;
  icon?: ReactNode;
  className?: string;
};

export function MetricCard({ title, value, trend, icon, className }: MetricCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-foreground [&_svg]:size-5">
          {icon}
        </span>
        {trend ? <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{trend}</span> : null}
      </div>
      <p className="mt-4 text-[2rem] font-semibold leading-none text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{title}</p>
    </article>
  );
}
