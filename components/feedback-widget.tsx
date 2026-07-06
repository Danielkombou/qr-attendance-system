"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeedbackWidgetProps = {
  variant: "landing" | "fixed";
  ctaAnchorRef?: React.RefObject<HTMLElement | null>;
};

export function FeedbackWidget({ variant, ctaAnchorRef }: FeedbackWidgetProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [docked, setDocked] = useState(variant === "fixed");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const btnSize = 52;

  useEffect(() => {
    if (variant !== "landing") return;

    const update = () => {
      const scrollDocked = window.scrollY > 160;
      setDocked(scrollDocked);

      if (scrollDocked) {
        setCoords({
          x: window.innerWidth - btnSize - 20,
          y: window.innerHeight - btnSize - 20,
        });
        return;
      }

      const anchor = ctaAnchorRef?.current;
      if (anchor) {
        const r = anchor.getBoundingClientRect();
        setCoords({ x: r.right - btnSize + 8, y: r.bottom - btnSize + 8 });
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [variant, ctaAnchorRef]);

  async function submit() {
    const text = message.trim();
    if (text.length < 3) {
      toast.warning("Please enter at least a few words.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("/api/feedback", { message: text });
      toast.success("Thanks for your feedback!");
      setMessage("");
      setOpen(false);
    } catch {
      toast.error("Could not send feedback.");
    } finally {
      setSubmitting(false);
    }
  }

  const fixedStyle =
    variant === "fixed"
      ? { right: 20, bottom: 20 }
      : { left: coords.x, top: coords.y };

  return (
    <>
      <motion.div
        className="fixed z-50"
        style={variant === "fixed" ? undefined : { left: coords.x, top: coords.y }}
        animate={
          variant === "fixed"
            ? { right: 20, bottom: 20, opacity: 1 }
            : { left: coords.x, top: coords.y, opacity: docked ? 1 : 0 }
        }
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex size-[52px] items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105",
            variant === "landing" && !docked && "pointer-events-none",
          )}
          aria-label="Send feedback"
        >
          <MessageCircle className="size-5" aria-hidden />
        </button>
      </motion.div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close feedback"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-title"
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 id="feedback-title" className="text-lg font-semibold text-foreground">
                  Send feedback
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share an update, idea, or issue…"
                className="w-full rounded-xl border border-border bg-input-background px-3 py-2 text-sm text-foreground"
              />
              <Button className="mt-3 w-full" disabled={submitting} onClick={() => void submit()}>
                {submitting ? "Sending…" : "Submit"}
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
