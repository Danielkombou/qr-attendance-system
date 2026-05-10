"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { CircleCheckBig, Clock3, MapPin, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/dashboard/panel-card";

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

type SiteOption = { id: string; name: string; allowedRadiusM: number };

export default function CheckInPage() {
  const [plannedTasks, setPlannedTasks] = useState("");
  const [completedTasks, setCompletedTasks] = useState("");
  const [siteId, setSiteId] = useState("");
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [submittingIn, setSubmittingIn] = useState(false);
  const [submittingOut, setSubmittingOut] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(() => nowClock());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(nowClock()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    axios
      .get<{ sites: SiteOption[] }>("/api/sites")
      .then((res) => {
        const list = res.data.sites ?? [];
        setSites(list);
        if (list.length > 0) {
          setSiteId((current) => (current ? current : list[0].id));
        }
      })
      .catch(() => {
        /* unauthenticated or network — leave sites empty */
      });
  }, []);

  async function submit(path: "/api/attendance/check-in" | "/api/attendance/check-out", payload: Record<string, unknown>) {
    setError("");
    setMessage("");
    try {
      const { latitude, longitude } = await getCoordinates();
      await axios.post(path, { latitude, longitude, ...payload });
      setMessage(path.endsWith("check-in") ? "Checked in successfully." : "Checked out successfully.");
    } catch (err) {
      if (err instanceof AxiosError) {
        setError((err.response?.data as { error?: string } | undefined)?.error ?? "Request failed.");
      } else {
        setError(err instanceof Error ? err.message : "Request failed.");
      }
    }
  }

  async function handleCheckIn() {
    setSubmittingIn(true);
    await submit("/api/attendance/check-in", {
      siteId: siteId.trim(),
      plannedTasks: plannedTasks.trim(),
    });
    setSubmittingIn(false);
  }

  async function handleCheckOut() {
    setSubmittingOut(true);
    await submit("/api/attendance/check-out", { completedTasks: completedTasks.trim() });
    setSubmittingOut(false);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">Check In/Out</h1>
        <p className="text-muted-foreground">Check-in is validated against the site geofence using your GPS</p>
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
              <span className="text-sm font-medium">Site</span>
              {sites.length > 0 ? (
                <select
                  value={siteId}
                  onChange={(event) => setSiteId(event.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-input-background px-3"
                >
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name} ({site.allowedRadiusM}m radius)
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={siteId}
                  onChange={(event) => setSiteId(event.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-input-background px-3"
                  placeholder="Site ID (from your admin)"
                />
              )}
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
              disabled={submittingIn || !siteId.trim() || !plannedTasks.trim()}
              onClick={handleCheckIn}
            >
              <CircleCheckBig className="h-4 w-4" />
              {submittingIn ? "Checking In..." : "Check In Now"}
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
              disabled={submittingOut || !completedTasks.trim()}
              onClick={handleCheckOut}
            >
              {submittingOut ? "Checking Out..." : "Check Out Now"}
            </Button>
            {error ? <p className="mt-3 text-center text-sm text-red-600">{error}</p> : null}
            {message ? <p className="mt-3 text-center text-sm text-emerald-600">{message}</p> : null}
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Check-in must be within the site radius. GPS permission is required.
            </p>
          </PanelCard>
        </div>
      </section>
    </div>
  );
}
