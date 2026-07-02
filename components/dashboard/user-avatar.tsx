import { cn } from "@/lib/utils";

type UserAvatarProps = {
  initials: string;
  size?: "sm" | "md";
  className?: string;
};

const sizeClass = {
  sm: "size-9 text-sm",
  md: "size-10 text-base",
} as const;

export function UserAvatar({ initials, size = "md", className }: UserAvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary via-primary/90 to-primary/70 font-semibold text-primary-foreground shadow-sm",
        sizeClass[size],
        className,
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
