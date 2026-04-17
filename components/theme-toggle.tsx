"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Laptop, Moon, SunMedium } from "lucide-react";

type ThemePreference = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "attendx-theme";

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof Laptop;
}> = [
  { value: "system", label: "System", icon: Laptop },
  { value: "light", label: "Light", icon: SunMedium },
  { value: "dark", label: "Dark", icon: Moon },
];

function resolveTheme(theme: ThemePreference): ResolvedTheme {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme;
}

export function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const nextTheme: ThemePreference =
      savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
        ? savedTheme
        : "system";

    const applyTheme = (theme: ThemePreference) => {
      const nextResolvedTheme = resolveTheme(theme);
      root.dataset.theme = nextResolvedTheme;
      root.dataset.themePreference = theme;
      setThemePreference(theme);
      setResolvedTheme(nextResolvedTheme);
    };

    applyTheme(nextTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if ((root.dataset.themePreference as ThemePreference | undefined) === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const setTheme = (theme: ThemePreference) => {
    const nextResolvedTheme = resolveTheme(theme);
    document.documentElement.dataset.theme = nextResolvedTheme;
    document.documentElement.dataset.themePreference = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    setThemePreference(theme);
    setResolvedTheme(nextResolvedTheme);
    setOpen(false);
  };

  const ActiveIcon = resolvedTheme === "dark" ? Moon : SunMedium;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Choose theme"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-ink)] shadow-[0_12px_30px_-24px_rgba(10,14,38,0.5)] transition hover:bg-[var(--brand-surface-strong)]"
      >
        <ActiveIcon className="h-[18px] w-[18px]" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-30 min-w-44 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-2 shadow-[0_24px_50px_-30px_rgba(10,14,38,0.45)] backdrop-blur"
        >
          {themeOptions.map((option) => {
            const OptionIcon = option.icon;
            const isActive = themePreference === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => setTheme(option.value)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--brand-ink)] transition hover:bg-[var(--brand-surface-strong)]"
              >
                <span className="flex items-center gap-3">
                  <OptionIcon className="h-4 w-4 text-[var(--muted-ink)]" />
                  {option.label}
                </span>
                {isActive ? <Check className="h-4 w-4 text-[var(--brand-accent)]" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
