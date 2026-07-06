"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function toggle() {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const apply = () => setTheme(next);

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      document.documentElement.dataset.themeTransition = "active";
      (
        document as Document & { startViewTransition: (cb: () => void) => void }
      ).startViewTransition(() => {
        apply();
        queueMicrotask(() => {
          delete document.documentElement.dataset.themeTransition;
        });
      });
      return;
    }

    apply();
  }

  const dark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("size-9 shrink-0 text-foreground", className)}
      onClick={toggle}
      disabled={!mounted}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </Button>
  );
}
