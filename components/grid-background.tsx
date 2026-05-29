import { cn } from "@/lib/utils";

type GridBackgroundProps = {
  className?: string;
};

export function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 h-full w-full",
        "bg-[#f6f7fb] bg-[linear-gradient(to_right,#e4e7ee_1px,transparent_1px),linear-gradient(to_bottom,#e4e7ee_1px,transparent_1px)] bg-[size:6rem_4rem]",
        "dark:bg-background dark:bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_80%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_80%,transparent)_1px,transparent_1px)]",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_900px_at_100%_0%,rgba(148,163,184,0.14),transparent_55%)] dark:bg-[radial-gradient(circle_900px_at_100%_0%,rgba(71,85,105,0.22),transparent_55%)]" />
    </div>
  );
}
