"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Moon, SunMedium } from "lucide-react";

type ThemePreference = "light" | "dark";

const STORAGE_KEY = "attendx-theme";

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof SunMedium;
}> = [
  { value: "light", label: "Light", icon: SunMedium },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>("light");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const nextTheme: ThemePreference =
      savedTheme === "light" || savedTheme === "dark" ? savedTheme : "light";

    root.dataset.theme = nextTheme;
    root.dataset.themePreference = nextTheme;
    setThemePreference(nextTheme);
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
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.themePreference = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    setThemePreference(theme);
    setOpen(false);
  };

  const ActiveIcon = themePreference === "dark" ? Moon : SunMedium;

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
