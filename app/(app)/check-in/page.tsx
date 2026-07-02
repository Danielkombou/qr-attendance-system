"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { CircleCheckBig, Clock3, MapPin, QrCode } from "lucide-react";
import { toast } from "sonner";
import { QrScannerCard } from "@/components/check-in/qr-scanner-card";
import { PanelCard } from "@/components/dashboard/panel-card";
import { PresenceDot } from "@/components/dashboard/presence-dot";
import { Button } from "@/components/ui/button";
import {
  useAttendanceStatus,
  useCheckInMutation,
  useCheckOutMutation,
  useProfile,
  useSites,
} from "@/lib/queries/hooks";
import { useCheckInStore } from "@/lib/stores/check-in-store";

function nowClock() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

async function getCoordinates() {
  return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => reject(new Error("Unable to fetch your current location")),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function CheckInPage() {
  const { data: status } = useAttendanceStatus();
  const { data: profile } = useProfile();
  const { data: sites = [] } = useSites();
  const checkInMutation = useCheckInMutation();
  const checkOutMutation = useCheckOutMutation();

  const plannedTasksDraft = useCheckInStore((s) => s.plannedTasksDraft);
  const setPlannedTasksDraft = useCheckInStore((s) => s.setPlannedTasksDraft);
  const clearPlannedTasksDraft = useCheckInStore((s) => s.clearPlannedTasksDraft);

  const [completedTasks, setCompletedTasks] = useState("");
  const [siteId, setSiteId] = useState("");
  const [currentTime, setCurrentTime] = useState(() => nowClock());
  const [coordsPreview, setCoordsPreview] = useState("Waiting for GPS…");
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(nowClock()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (sites.length > 0 && !siteId) {
      setSiteId(sites[0]!.id);
    }
  }, [sites, siteId]);

  useEffect(() => {
    getCoordinates()
      .then(({ latitude, longitude }) => {
        setCoordsPreview(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      })
      .catch(() => setCoordsPreview("GPS unavailable"));
  }, []);

  const checkedIn = status?.checkedIn ?? false;
  const employeeId = profile?.user.employeeId ?? "attendx:guest";
  const qrValue = `attendx://checkin/${employeeId}`;

  async function playScanAnimation() {
    setScanning(true);
    setScanSuccess(false);
    await wait(1400);
    setScanSuccess(true);
    await wait(450);
    setScanning(false);
    setScanSuccess(false);
  }

  async function handleCheckIn() {
    if (!plannedTasksDraft.trim()) {
      toast.warning("Add your plan for today before checking in.");
      return;
    }

    try {
      await playScanAnimation();
      const { latitude, longitude } = await getCoordinates();
      setCoordsPreview(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      await checkInMutation.mutateAsync({
        plannedTasks: plannedTasksDraft.trim(),
        siteId: siteId.trim() || undefined,
        latitude,
        longitude,
      });
      toast.success("Checked in successfully.");
      clearPlannedTasksDraft();
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Check-in failed"
          : err instanceof Error
            ? err.message
            : "Check-in failed";
      toast.error("Check-in failed", { description: message });
    }
  }

  async function handleCheckOut() {
    if (!completedTasks.trim()) {
      toast.warning("List what you completed before checking out.");
      return;
    }

    try {
      const { latitude, longitude } = await getCoordinates();
      setCoordsPreview(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      await checkOutMutation.mutateAsync({
        completedTasks: completedTasks.trim(),
        latitude,
        longitude,
      });
      toast.success("Checked out successfully.");
      setCompletedTasks("");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Check-out failed"
          : err instanceof Error
            ? err.message
            : "Check-out failed";
      toast.error("Check-out failed", { description: message });
    }
  }

  const submittingIn = checkInMutation.isPending || scanning;
  const submittingOut = checkOutMutation.isPending;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em] text-foreground">Check In/Out</h1>
        <p className="text-muted-foreground">
          Your location is recorded with each check-in. Early arrivals earn bonus credit; late arrivals are noted.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <PanelCard title="QR Code" rightSlot={<QrCode className="h-5 w-5 text-muted-foreground" />}>
          <QrScannerCard
            value={qrValue}
            label={employeeId}
            scanning={scanning}
            scanSuccess={scanSuccess}
          />
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
                      Since {status.record.checkInTime}
                      {status.record.checkInNote ? ` · ${status.record.checkInNote}` : ""}
                      {status.record.location ? ` · ${status.record.location}` : ""}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Gray dot = not checked in</p>
                  )}
                </div>
              </div>

              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4" aria-hidden /> Current Time
              </p>
              <p className="text-[1.9rem] font-semibold text-foreground">{currentTime}</p>

              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden /> Location
              </p>
              <p className="text-base font-medium text-foreground">{coordsPreview}</p>
            </div>
          </PanelCard>

          <PanelCard title="Quick Actions">
            {sites.length > 0 ? (
              <label className="mb-3 block space-y-1.5">
                <span className="text-sm font-medium">Site (optional)</span>
                <select
                  value={siteId}
                  onChange={(event) => setSiteId(event.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-input-background px-3 text-foreground"
                  disabled={checkedIn}
                >
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="mb-3 block space-y-1.5">
              <span className="text-sm font-medium">What are you planning to work on today? *</span>
              <textarea
                rows={3}
                value={plannedTasksDraft}
                onChange={(event) => setPlannedTasksDraft(event.target.value)}
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
              GPS permission is required. Check-out after closing time is recorded for review.
            </p>
          </PanelCard>
        </div>
      </section>
    </div>
  );
}
