import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelCardProps = {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PanelCard({ title, subtitle, rightSlot, children, className }: PanelCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 text-card-foreground shadow-sm",
        className,
      )}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[1.9rem] font-semibold tracking-[-0.02em] text-foreground">{title}</h3>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {rightSlot}
      </header>
      {children}
    </section>
  );
}
