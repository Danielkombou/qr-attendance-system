"use client";

import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { CircleCheckBig, Clock3, QrCode, Wifi } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/dashboard/panel-card";
import { PresenceDot } from "@/components/dashboard/presence-dot";

function nowClock() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

type AttendanceStatusResponse = {
  checkedIn: boolean;
  record: {
    checkInTime: string;
    plannedTasks: string | null;
    siteName: string;
  } | null;
};

export default function CheckInPage() {
  const [plannedTasks, setPlannedTasks] = useState("");
  const [completedTasks, setCompletedTasks] = useState("");
  const [submittingIn, setSubmittingIn] = useState(false);
  const [submittingOut, setSubmittingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => nowClock());
  const [status, setStatus] = useState<AttendanceStatusResponse | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      const { data } = await axios.get<AttendanceStatusResponse>("/api/attendance/status");
      setStatus(data);
    } catch {
      setStatus(null);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(nowClock()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function handleCheckIn() {
    if (!plannedTasks.trim()) {
      toast.warning("Add your plan for today before checking in.");
      return;
    }

    setSubmittingIn(true);
    const toastId = toast.loading("Verifying office network and checking you in…");
    try {
      await axios.post("/api/attendance/check-in", {
        plannedTasks: plannedTasks.trim(),
      });
      toast.success("Checked in successfully.", { id: toastId });
      setPlannedTasks("");
      await loadStatus();
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Check-in failed"
          : err instanceof Error
            ? err.message
            : "Check-in failed";
      toast.error("Check-in failed", { id: toastId, description: message });
    } finally {
      setSubmittingIn(false);
    }
  }

  async function handleCheckOut() {
    if (!completedTasks.trim()) {
      toast.warning("List what you completed before checking out.");
      return;
    }

    setSubmittingOut(true);
    const toastId = toast.loading("Checking you out…");
    try {
      await axios.post("/api/attendance/check-out", {
        completedTasks: completedTasks.trim(),
      });
      toast.success("Checked out successfully.", { id: toastId });
      setCompletedTasks("");
      await loadStatus();
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Check-out failed"
          : err instanceof Error
            ? err.message
            : "Check-out failed";
      toast.error("Check-out failed", { id: toastId, description: message });
    } finally {
      setSubmittingOut(false);
    }
  }

  const checkedIn = status?.checkedIn ?? false;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em] text-foreground">Check In/Out</h1>
        <p className="text-muted-foreground">
          Check-in is verified when you are on the company office network. GPS is not used.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <PanelCard title="QR Code" rightSlot={<QrCode className="h-5 w-5 text-muted-foreground" />}>
          <div className="flex flex-col items-center">
            <div className="rounded-2xl border border-border/80 bg-card p-8 shadow-sm">
              <div className="h-44 w-44 rounded-md bg-[linear-gradient(90deg,#000_50%,transparent_50%),linear-gradient(#000_50%,transparent_50%)] bg-size-[24px_24px] bg-repeat opacity-90" />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Display only — no scan required</p>
            <p className="text-[2rem] font-semibold tracking-[0.04em] text-foreground">USER-12345</p>
          </div>
        </PanelCard>

        <div className="space-y-4">
          <PanelCard title="Current Status">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <PresenceDot online={checkedIn} size="md" />
                <div>
                  <p className="font-medium text-foreground">
                    {checkedIn ? "Checked in" : "Not checked in"}
                  </p>
                  {checkedIn && status?.record ? (
                    <p className="text-sm text-muted-foreground">
                      Since {status.record.checkInTime} · {status.record.siteName}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Gray dot = off-site or not checked in</p>
                  )}
                </div>
              </div>

              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4" aria-hidden /> Current Time
              </p>
              <p className="text-[1.9rem] font-semibold text-foreground">{currentTime}</p>

              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <Wifi className="h-4 w-4" aria-hidden /> Presence proof
              </p>
              <p className="text-base font-medium text-foreground">Company office Wi‑Fi / router</p>
              {/* GPS tracking disabled — office network is used instead.
              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> Location
              </p>
              <p className="text-[1.5rem] font-medium">Auto-detected via device GPS</p>
              */}
            </div>
          </PanelCard>

          <PanelCard title="Quick Actions">
            <label className="mb-3 block space-y-1.5">
              <span className="text-sm font-medium">What are you planning to work on today? *</span>
              <textarea
                rows={3}
                value={plannedTasks}
                onChange={(event) => setPlannedTasks(event.target.value)}
                className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
                placeholder="Planned tasks for today..."
                disabled={checkedIn}
              />
            </label>
            <Button
              className="h-12 w-full gap-2 text-base"
              disabled={submittingIn || checkedIn}
              onClick={() => void handleCheckIn()}
            >
              <CircleCheckBig className="h-4 w-4" aria-hidden />
              {submittingIn ? "Checking In..." : checkedIn ? "Already Checked In" : "Check In Now"}
            </Button>

            <label className="mb-3 mt-4 block space-y-1.5">
              <span className="text-sm font-medium">What did you complete before check-out?</span>
              <textarea
                rows={3}
                value={completedTasks}
                onChange={(event) => setCompletedTasks(event.target.value)}
                className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
                placeholder="Completed tasks..."
                disabled={!checkedIn}
              />
            </label>
            <Button
              variant="outline"
              className="h-12 w-full gap-2 text-base"
              disabled={submittingOut || !checkedIn}
              onClick={() => void handleCheckOut()}
            >
              {submittingOut ? "Checking Out..." : "Check Out Now"}
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              You must be connected to the office router to check in. A daily plan is required.
            </p>
          </PanelCard>
        </div>
      </section>
    </div>
  );
}
