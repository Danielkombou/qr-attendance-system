import Link from "next/link";
import { QrCode } from "lucide-react";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "md";
  className?: string;
};

const sizeStyles = {
  sm: {
    wrapper: "gap-3",
    mark: "h-10 w-10 rounded-xl",
    icon: "h-5 w-5",
    title: "text-[1.25rem] sm:text-[1.75rem]",
    tagline: "text-[0.7rem] sm:text-xs",
  },
  md: {
    wrapper: "gap-4",
    mark: "h-14 w-14 rounded-2xl",
    icon: "h-7 w-7",
    title: "text-[2rem]",
    tagline: "text-xs",
  },
} as const;

export function BrandLogo({
  href = "/",
  size = "sm",
  className = "",
}: BrandLogoProps) {
  const styles = sizeStyles[size];

  return (
    <Link
      href={href}
      className={`inline-flex items-center ${styles.wrapper} ${className}`}
      aria-label="AttendX home"
    >
      <span
        className={`inline-flex items-center justify-center bg-[var(--brand-ink)] text-[var(--button-foreground)] shadow-[0_10px_30px_-18px_rgba(10,14,38,0.95)] ${styles.mark}`}
      >
        <QrCode className={styles.icon} strokeWidth={2.2} />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={`truncate font-semibold tracking-[-0.04em] text-[var(--brand-ink)] ${styles.title}`}
        >
          AttendX
        </span>
        <span
          className={`mt-0.5 truncate font-medium tracking-[0.16em] text-[var(--muted-ink)] uppercase ${styles.tagline}`}
        >
          Smart Attendance
        </span>
      </span>
    </Link>
  );
}
