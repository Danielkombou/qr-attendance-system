"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sidebarActionRowClass } from "@/lib/ui/sidebar-action-styles";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  variant?: "sidebar" | "icon";
};

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeTheme = mounted ? (theme === "system" ? "system" : (resolvedTheme ?? theme)) : "light";
  const ActiveIcon =
    activeTheme === "dark" ? Moon : activeTheme === "system" ? Monitor : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          variant === "sidebar"
            ? cn(
                sidebarActionRowClass,
                "justify-start text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              )
            : "inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        aria-label="Choose color theme"
      >
        {mounted ? (
          <ActiveIcon className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <Sun className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
        )}
        {variant === "sidebar" ? <span>Theme</span> : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={variant === "sidebar" ? "start" : "end"} className="min-w-36">
        <DropdownMenuItem className="items-center gap-2" onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4 shrink-0" aria-hidden />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem className="items-center gap-2" onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 shrink-0" aria-hidden />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem className="items-center gap-2" onClick={() => setTheme("system")}>
          <Monitor className="h-4 w-4 shrink-0" aria-hidden />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
