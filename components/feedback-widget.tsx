"use client";

import { useEffect, useState } from "react";
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

const BTN = 52;

export function FeedbackWidget({ variant, ctaAnchorRef }: FeedbackWidgetProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [docked, setDocked] = useState(variant === "fixed");
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (variant !== "landing") return;

    const update = () => {
      const scrollDocked = window.scrollY > 160;
      setDocked(scrollDocked);

      if (scrollDocked) {
        setCoords({ x: window.innerWidth - BTN - 20, y: window.innerHeight - BTN - 20 });
        return;
      }

      const anchor = ctaAnchorRef?.current;
      if (anchor) {
        const r = anchor.getBoundingClientRect();
        setCoords({ x: r.right - BTN + 8, y: r.bottom - BTN + 8 });
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

  if (variant === "fixed") {
    return (
      <>
        <div className="fixed bottom-5 right-5 z-50">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex size-[52px] items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105"
            aria-label="Send feedback"
          >
            <MessageCircle className="size-5" aria-hidden />
          </button>
        </div>
        <FeedbackDialog
          open={open}
          message={message}
          submitting={submitting}
          onClose={() => setOpen(false)}
          onChange={setMessage}
          onSubmit={() => void submit()}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        className="fixed z-50"
        animate={{ left: coords.x, top: coords.y, opacity: docked ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex size-[52px] items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105",
            !docked && "pointer-events-none",
          )}
          aria-label="Send feedback"
        >
          <MessageCircle className="size-5" aria-hidden />
        </button>
      </motion.div>
      <FeedbackDialog
        open={open}
        message={message}
        submitting={submitting}
        onClose={() => setOpen(false)}
        onChange={setMessage}
        onSubmit={() => void submit()}
      />
    </>
  );
}

function FeedbackDialog({
  open,
  message,
  submitting,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  message: string;
  submitting: boolean;
  onClose: () => void;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
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
            onClick={onClose}
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
                onClick={onClose}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Share an update, idea, or issue…"
              className="w-full rounded-xl border border-border bg-input-background px-3 py-2 text-sm text-foreground"
            />
            <Button className="mt-3 w-full" disabled={submitting} onClick={onSubmit}>
              {submitting ? "Sending…" : "Submit"}
            </Button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
