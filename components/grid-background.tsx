import { cn } from "@/lib/utils";

type GridBackgroundProps = {
  className?: string;
};

export function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 h-full w-full",
        "bg-[#e9ecf2]/90",
        "bg-[linear-gradient(to_right,rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.14)_1px,transparent_1px)]",
        "bg-size-[6rem_4rem]",
        "dark:bg-background/92 dark:bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_45%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_45%,transparent)_1px,transparent_1px)]",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_130%_55%_at_50%_-15%,rgba(148,163,184,0.38),transparent_62%)] dark:bg-[radial-gradient(ellipse_130%_55%_at_50%_-15%,rgba(71,85,105,0.42),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_720px_at_100%_0%,rgba(148,163,184,0.22),transparent_58%)] dark:bg-[radial-gradient(circle_720px_at_100%_0%,rgba(71,85,105,0.28),transparent_58%)]" />
    </div>
  );
}
