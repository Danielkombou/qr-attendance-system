import type { ReactNode } from "react";

type PanelCardProps = {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export function PanelCard({ title, subtitle, rightSlot, children }: PanelCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[1.9rem] font-semibold tracking-[-0.02em]">{title}</h3>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {rightSlot}
      </header>
      {children}
    </section>
  );
}
