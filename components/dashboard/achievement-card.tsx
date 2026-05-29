import { Award, Crown, Sunrise, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { achievementCardClass } from "@/lib/ui/semantic-surfaces";
import { cn } from "@/lib/utils";

export type AchievementIcon = "perfect-week" | "hundred-days" | "early-bird" | "consistency-king";

const iconMap: Record<AchievementIcon, LucideIcon> = {
  "perfect-week": Target,
  "hundred-days": Award,
  "early-bird": Sunrise,
  "consistency-king": Crown,
};

type AchievementCardProps = {
  title: string;
  description: string;
  active: boolean;
  icon: AchievementIcon;
  className?: string;
};

export function AchievementCard({ title, description, active, icon, className }: AchievementCardProps) {
  const Icon = iconMap[icon];

  return (
    <article className={achievementCardClass(active, className)}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg",
            active
              ? "bg-[var(--surface-success-fg)]/10 text-[var(--surface-success-fg)]"
              : "bg-muted text-muted-foreground",
          )}
          aria-hidden
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="font-medium text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </article>
  );
}
