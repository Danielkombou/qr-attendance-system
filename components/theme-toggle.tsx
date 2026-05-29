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
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  /** Sidebar: labeled row; toolbar: icon only */
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
            ? "inline-flex h-10 w-full items-center justify-start gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            : "inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-accent",
          className,
        )}
        aria-label="Toggle theme"
      >
        {mounted ? (
          <ActiveIcon className="h-4 w-4 shrink-0" />
        ) : (
          <Sun className="h-4 w-4 shrink-0 opacity-50" />
        )}
        {variant === "sidebar" ? <span>Theme</span> : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={variant === "sidebar" ? "start" : "end"} className="min-w-36">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
