import { statusPillClass } from "@/lib/ui/semantic-surfaces";
import { cn } from "@/lib/utils";

type StatusPillProps = {
  children: React.ReactNode;
  variant: "success" | "warning";
  className?: string;
};

export function StatusPill({ children, variant, className }: StatusPillProps) {
  return <span className={cn(statusPillClass(variant), className)}>{children}</span>;
}
