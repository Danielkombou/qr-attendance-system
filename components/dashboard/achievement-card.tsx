import { achievementCardClass } from "@/lib/ui/semantic-surfaces";
import { cn } from "@/lib/utils";

export type AchievementIcon = "perfect-week" | "hundred-days" | "early-bird" | "consistency-king";

const iconEmoji: Record<AchievementIcon, string> = {
  "perfect-week": "🎯",
  "hundred-days": "💯",
  "early-bird": "🌅",
  "consistency-king": "👑",
};

type AchievementCardProps = {
  title: string;
  description: string;
  active: boolean;
  icon: AchievementIcon;
  className?: string;
};

export function AchievementCard({ title, description, active, icon, className }: AchievementCardProps) {
  return (
    <article className={achievementCardClass(active, className)}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center text-[1.65rem] leading-none",
            !active && "grayscale opacity-45",
          )}
          aria-hidden
        >
          {iconEmoji[icon]}
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "font-medium",
              active ? "text-[var(--surface-success-fg)]" : "text-muted-foreground",
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "mt-1 text-sm",
              active ? "text-[var(--surface-success-fg)]/85" : "text-muted-foreground/90",
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
