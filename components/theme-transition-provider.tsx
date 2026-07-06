"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type ThemeTransitionContextValue = {
  run: (applyTheme: () => void, incomingDark: boolean) => void;
};

const ThemeTransitionContext = createContext<ThemeTransitionContextValue | null>(null);

const WIPE_MS = 520;

export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  const [wiping, setWiping] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [incomingDark, setIncomingDark] = useState(false);
  const [pending, setPending] = useState<(() => void) | null>(null);

  const run = useCallback((apply: () => void, dark: boolean) => {
    if (typeof window === "undefined") {
      apply();
      return;
    }
    setIncomingDark(dark);
    setPending(() => apply);
    setSize({ w: window.innerWidth, h: window.innerHeight });
    setWiping(true);
  }, []);

  const finish = useCallback(() => {
    pending?.();
    setPending(null);
    setWiping(false);
  }, [pending]);

  return (
    <ThemeTransitionContext.Provider value={{ run }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {wiping && size.w > 0 ? (
              <motion.div
                key="theme-wipe"
                className={cn(
                  "pointer-events-none fixed inset-0 z-9999",
                  incomingDark ? "bg-[#0b1220]" : "bg-[#f8fafc]",
                )}
                initial={{
                  clipPath: `polygon(0px ${size.h}px, 0px ${size.h}px, 0px ${size.h}px)`,
                }}
                animate={{
                  clipPath: `polygon(0px ${size.h}px, 0px 0px, ${size.w}px 0px, ${size.w}px ${size.h}px)`,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: WIPE_MS / 1000, ease: [0.32, 0.72, 0, 1] }}
                onAnimationComplete={finish}
              />
            ) : null}
          </AnimatePresence>,
          document.body,
        )}
    </ThemeTransitionContext.Provider>
  );
}

export function useThemeTransition() {
  const ctx = useContext(ThemeTransitionContext);
  if (!ctx) {
    return { run: (fn: () => void, _dark?: boolean) => fn() };
  }
  return ctx;
}
