import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  const baseClassName =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200";

  const variantClassName =
    variant === "primary"
      ? "bg-[var(--brand-ink)] text-[var(--button-foreground)] shadow-[0_18px_40px_-24px_rgba(10,14,38,0.8)] hover:-translate-y-0.5 hover:bg-[var(--brand-ink-soft)]"
      : "text-[var(--brand-ink)] hover:bg-[var(--brand-surface-strong)]";

  return (
    <Link
      href={href}
      className={`${baseClassName} ${variantClassName} ${className}`}
    >
      {children}
    </Link>
  );
}
