import type { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string;
  trend?: string;
  icon?: ReactNode;
};

export function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-foreground">
          {icon}
        </span>
        {trend ? <span className="text-sm font-medium text-emerald-600">{trend}</span> : null}
      </div>
      <p className="mt-4 text-[2rem] font-semibold leading-none">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{title}</p>
    </article>
  );
}
