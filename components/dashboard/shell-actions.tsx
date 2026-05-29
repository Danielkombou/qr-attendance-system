"use client";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type ShellActionsProps = {
  layout: "sidebar" | "toolbar";
  className?: string;
};

export function ShellActions({ layout, className }: ShellActionsProps) {
  if (layout === "toolbar") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <ThemeToggle variant="icon" />
        <LogoutButton variant="icon" />
      </div>
    );
  }

  return (
    <div className={cn("grid gap-1", className)}>
      <ThemeToggle variant="sidebar" />
      <LogoutButton variant="sidebar" />
    </div>
  );
}
