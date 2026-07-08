import { achievementCardClass } from "@/lib/ui/semantic-surfaces";
import { cn } from "@/lib/utils";

export type AchievementIcon = "perfect-week" | "hundred-days" | "early-bird" | "consistency-king";

const iconEmoji: Record<AchievementIcon, string> = {
  "perfect-week": "🎯",
  "hundred-days": "💯",
  "early-bird": "🌅",
  "consistency-king": "👑",
};

const iconShellClass: Record<AchievementIcon, string> = {
  "perfect-week": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  "hundred-days": "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  "early-bird": "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  "consistency-king": "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
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
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[1.35rem] leading-none",
            iconShellClass[icon],
            !active && "opacity-70",
          )}
          aria-hidden
        >
          {iconEmoji[icon]}
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "font-medium",
              active ? "text-(--surface-success-fg)" : "text-muted-foreground",
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "mt-1 text-sm",
              active ? "text-(--surface-success-fg)/85" : "text-muted-foreground/90",
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
