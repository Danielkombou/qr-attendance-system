"use client";

import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { PanelCard } from "@/components/dashboard/panel-card";
import { Button } from "@/components/ui/button";

type WorkHoursResponse = {
  settings: {
    startTime: string;
    endTime: string;
  };
};

function toInputTime(display: string): string {
  const match = display.match(/(\d{1,2}):(\d{2})/);
  if (!match) return "09:00";
  const hour = Number(match[1]);
  const minute = match[2];
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export default function SettingsPage() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("19:00");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<WorkHoursResponse>("/api/admin/attendance-settings");
      setStartTime(toInputTime(data.settings.startTime));
      setEndTime(toInputTime(data.settings.endTime));
    } catch {
      toast.error("Could not load working hours.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveWorkHours() {
    setSaving(true);
    try {
      await axios.patch("/api/admin/attendance-settings", { startTime, endTime });
      toast.success("Working hours updated.");
      await load();
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Update failed."
          : "Update failed.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em] text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and organization hours</p>
      </header>

      <PanelCard title="General Settings">
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Timezone</span>
            <select className="h-11 rounded-lg border border-border bg-input-background px-3 text-foreground">
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC+1 (West Africa Time)</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Date Format</span>
            <select className="h-11 rounded-lg border border-border bg-input-background px-3 text-foreground">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
            </select>
          </label>
        </div>
      </PanelCard>

      <PanelCard title="Working Hours">
        <p className="mb-4 text-sm text-muted-foreground">
          Default is 9:00 AM – 7:00 PM. Early check-ins earn bonus credit; late check-ins and after-hours
          check-outs are recorded.
        </p>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Start Time</span>
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="h-11 rounded-lg border border-border bg-input-background px-3 text-foreground"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">End Time</span>
              <input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="h-11 rounded-lg border border-border bg-input-background px-3 text-foreground"
              />
            </label>
          </div>
        )}
        <Button className="mt-4" disabled={saving || loading} onClick={() => void saveWorkHours()}>
          {saving ? "Saving…" : "Save Working Hours"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">Admin role required to save changes.</p>
      </PanelCard>
    </div>
  );
}
