import { cn } from "@/lib/utils";

type PresenceDotProps = {
  online: boolean;
  className?: string;
  size?: "sm" | "md";
};

const sizeClass = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
} as const;

export function PresenceDot({ online, className, size = "sm" }: PresenceDotProps) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full ring-2 ring-card",
        sizeClass[size],
        online ? "bg-[var(--surface-success-fg)]" : "bg-muted-foreground/45",
        className,
      )}
      aria-hidden
    />
  );
}

type AvatarWithPresenceProps = {
  initials: string;
  online: boolean;
  className?: string;
};

export function AvatarWithPresence({ initials, online, className }: AvatarWithPresenceProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {initials}
      </span>
      <PresenceDot
        online={online}
        className="absolute -bottom-0.5 -right-0.5"
        size="sm"
      />
    </span>
  );
}
