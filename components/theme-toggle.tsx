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
import { useThemeTransition } from "@/components/theme-transition-provider";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { run } = useThemeTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function pick(next: string) {
    if (next === theme) return;
    run(() => setTheme(next));
  }

  const active = mounted ? (theme === "system" ? "system" : (resolvedTheme ?? theme)) : "light";
  const ActiveIcon = active === "dark" ? Moon : active === "system" ? Monitor : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        aria-label="Choose theme"
        disabled={!mounted}
      >
        {mounted ? <ActiveIcon className="size-4" aria-hidden /> : <Sun className="size-4 opacity-50" aria-hidden />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {options.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} className="gap-2" onClick={() => pick(value)}>
            <Icon className="size-4" aria-hidden />
            {label}
            {theme === value ? <span className="ml-auto text-xs text-muted-foreground">✓</span> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
