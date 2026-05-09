"use client";

import { useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { CircleCheckBig, Clock3, MapPin, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/dashboard/panel-card";

export default function CheckInPage() {
  const [plannedTasks, setPlannedTasks] = useState("");
  const [completedTasks, setCompletedTasks] = useState("");
  const [siteId, setSiteId] = useState("");
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [submittingCheckOut, setSubmittingCheckOut] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const currentTime = useMemo(
    () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [],
  );

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

  async function handleCheckIn() {
    setError("");
    setMessage("");
    setSubmittingCheckIn(true);

    try {
      const { latitude, longitude } = await getCoordinates();
      await axios.post("/api/attendance/check-in", {
        siteId: siteId.trim(),
        latitude,
        longitude,
        plannedTasks: plannedTasks.trim(),
      });
      setMessage("Checked in successfully.");
    } catch (err) {
      if (err instanceof AxiosError) {
        setError((err.response?.data as { error?: string } | undefined)?.error ?? "Check-in failed.");
      } else {
        setError(err instanceof Error ? err.message : "Check-in failed.");
      }
    } finally {
      setSubmittingCheckIn(false);
    }
  }

  async function handleCheckOut() {
    setError("");
    setMessage("");
    setSubmittingCheckOut(true);

    try {
      const { latitude, longitude } = await getCoordinates();
      await axios.post("/api/attendance/check-out", {
        latitude,
        longitude,
        completedTasks: completedTasks.trim(),
      });
      setMessage("Checked out successfully.");
    } catch (err) {
      if (err instanceof AxiosError) {
        setError((err.response?.data as { error?: string } | undefined)?.error ?? "Check-out failed.");
      } else {
        setError(err instanceof Error ? err.message : "Check-out failed.");
      }
    } finally {
      setSubmittingCheckOut(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">Check In/Out</h1>
        <p className="text-muted-foreground">Scan QR code or use quick check-in</p>
      </header>
      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <PanelCard title="QR Code" rightSlot={<QrCode className="h-5 w-5 text-muted-foreground" />}>
          <div className="flex flex-col items-center">
            <div className="rounded-2xl border border-border bg-background p-8">
              <div className="h-44 w-44 rounded-md bg-[linear-gradient(90deg,#000_50%,transparent_50%),linear-gradient(#000_50%,transparent_50%)] bg-size-[24px_24px] bg-repeat opacity-90" />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Your Code</p>
            <p className="text-[2rem] font-semibold tracking-[0.04em]">USER-12345</p>
          </div>
        </PanelCard>
        <div className="space-y-4">
          <PanelCard title="Current Status">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4" /> Current Time
              </p>
              <p className="text-[1.9rem] font-semibold">{currentTime}</p>
              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> Location
              </p>
              <p className="text-[1.5rem] font-medium">Auto-detected via device GPS</p>
            </div>
          </PanelCard>
          <PanelCard title="Quick Actions">
            <label className="mb-3 block space-y-1.5">
              <span className="text-sm font-medium">Site ID</span>
              <input
                value={siteId}
                onChange={(event) => setSiteId(event.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-input-background px-3"
                placeholder="Paste your site ID"
              />
            </label>
            <label className="mb-3 block space-y-1.5">
              <span className="text-sm font-medium">What are you planning to work on today?</span>
              <textarea
                rows={3}
                value={plannedTasks}
                onChange={(event) => setPlannedTasks(event.target.value)}
                className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
                placeholder="Planned tasks for today..."
              />
            </label>
            <Button
              className="h-12 w-full gap-2 text-base"
              disabled={submittingCheckIn || !siteId.trim() || !plannedTasks.trim()}
              onClick={handleCheckIn}
            >
              <CircleCheckBig className="h-4 w-4" />
              {submittingCheckIn ? "Checking In..." : "Check In Now"}
            </Button>
            <label className="mb-3 mt-4 block space-y-1.5">
              <span className="text-sm font-medium">What did you complete before check-out?</span>
              <textarea
                rows={3}
                value={completedTasks}
                onChange={(event) => setCompletedTasks(event.target.value)}
                className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
                placeholder="Completed tasks..."
              />
            </label>
            <Button
              variant="outline"
              className="h-12 w-full gap-2 text-base"
              disabled={submittingCheckOut || !completedTasks.trim()}
              onClick={handleCheckOut}
            >
              {submittingCheckOut ? "Checking Out..." : "Check Out Now"}
            </Button>
            {error ? <p className="mt-3 text-center text-sm text-red-600">{error}</p> : null}
            {message ? <p className="mt-3 text-center text-sm text-emerald-600">{message}</p> : null}
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Submit your planned tasks at check-in and completed tasks at check-out.
            </p>
          </PanelCard>
        </div>
      </section>
    </div>
  );
}
