"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "react-qr-code";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type QrScannerCardProps = {
  value: string;
  label: string;
  scanning: boolean;
  scanSuccess: boolean;
  className?: string;
};

export function QrScannerCard({
  value,
  label,
  scanning,
  scanSuccess,
  className,
}: QrScannerCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const fg = isDark ? "#f8fafc" : "#0f172a";
  const bg = isDark ? "#1e293b" : "#ffffff";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm",
          scanning && "ring-2 ring-[var(--surface-success-fg)]/40",
          scanSuccess && "ring-2 ring-[var(--surface-success-fg)]",
        )}
      >
        {/* Scanner corner brackets */}
        <span className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-[var(--surface-success-fg)]" />
        <span className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-[var(--surface-success-fg)]" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-[var(--surface-success-fg)]" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-[var(--surface-success-fg)]" />

        <div className="relative rounded-xl bg-background p-3">
          {mounted ? (
            <QRCode
              value={value}
              size={176}
              level="M"
              fgColor={fg}
              bgColor={bg}
              className="h-auto max-w-full"
            />
          ) : (
            <div className="size-44 animate-pulse rounded-lg bg-muted" aria-hidden />
          )}

          <AnimatePresence>
            {scanning ? (
              <motion.div
                key="scan-line"
                className="pointer-events-none absolute inset-x-2 h-0.5 rounded-full bg-[var(--surface-success-fg)] shadow-[0_0_12px_var(--surface-success-fg)]"
                initial={{ top: "8%" }}
                animate={{ top: ["8%", "88%", "8%"] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              />
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {scanSuccess ? (
              <motion.div
                key="scan-flash"
                className="pointer-events-none absolute inset-0 rounded-xl bg-[var(--surface-success-fg)]/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.55, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">Your Code</p>
      <p className="font-mono text-lg font-semibold tracking-wide text-foreground">{label}</p>
    </div>
  );
}
