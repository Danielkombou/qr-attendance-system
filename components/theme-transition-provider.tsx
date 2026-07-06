"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

type ThemeTransitionContextValue = {
  run: (applyTheme: () => void) => void;
};

const ThemeTransitionContext = createContext<ThemeTransitionContextValue | null>(null);

const WIPE_MS = 520;

export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  const [wiping, setWiping] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const run = useCallback((apply: () => void) => {
    if (typeof window === "undefined") {
      apply();
      return;
    }
    apply();
    setSize({ w: window.innerWidth, h: window.innerHeight });
    requestAnimationFrame(() => setWiping(true));
  }, []);

  return (
    <ThemeTransitionContext.Provider value={{ run }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence onExitComplete={() => setWiping(false)}>
            {wiping && size.w > 0 ? (
              <motion.div
                key="theme-wipe"
                className="pointer-events-none fixed inset-0 z-[9999] bg-background"
                initial={{
                  clipPath: `polygon(0px ${size.h}px, 0px ${size.h}px, 0px ${size.h}px)`,
                }}
                animate={{
                  clipPath: `polygon(0px ${size.h}px, 0px 0px, ${size.w}px 0px, ${size.w}px ${size.h}px)`,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: WIPE_MS / 1000, ease: [0.32, 0.72, 0, 1] }}
                onAnimationComplete={() => setWiping(false)}
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
    return { run: (fn: () => void) => fn() };
  }
  return ctx;
}
