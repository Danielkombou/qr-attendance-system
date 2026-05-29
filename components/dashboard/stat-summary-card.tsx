import { semanticSurfaces, type SemanticTone } from "@/lib/ui/semantic-surfaces";
import { cn } from "@/lib/utils";

type StatSummaryCardProps = {
  label: string;
  value: string | number;
  tone?: SemanticTone;
  className?: string;
};

export function StatSummaryCard({ label, value, tone = "neutral", className }: StatSummaryCardProps) {
  return (
    <div className={cn("rounded-2xl border p-5 shadow-sm", semanticSurfaces[tone], className)}>
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
