import Image from "next/image";
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
        <Image src={image} alt="" width={64} height={64} className="size-full object-cover" unoptimized />
      </span>
    );
  }

  return (
    <span
      className={cn(
        base,
        "bg-linear-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground",
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
