import { cn } from "@/lib/utils";

type UserAvatarProps = {
  initials: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "size-9 text-sm",
  md: "size-10 text-base",
  lg: "size-16 text-xl",
} as const;

export function UserAvatar({ initials, image, size = "md", className }: UserAvatarProps) {
  const base = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold shadow-sm",
    sizeClass[size],
    className,
  );

  if (image) {
    return (
      <span className={base}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="size-full object-cover" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        base,
        "border border-border/80 bg-muted text-foreground",
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
