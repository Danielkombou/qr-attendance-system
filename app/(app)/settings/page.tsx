"use client";

import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { PanelCard } from "@/components/dashboard/panel-card";
import { Button } from "@/components/ui/button";
import { resizeImageToDataUrl } from "@/lib/client/resize-image";
import { pageSubtitleClass, pageTitleClass } from "@/lib/ui/page-styles";
import { useProfile, useUpdateWorkHoursMutation, useUploadAvatarMutation, useWorkHours } from "@/lib/queries/hooks";
import { isAdminRole } from "@/lib/roles";

function toInputTime(display: string): string {
  const match = display.match(/(\d{1,2}):(\d{2})/);
  if (!match) return "09:00";
  const hour = Number(match[1]);
  const minute = match[2];
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export default function SettingsPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: workHours, isLoading: hoursLoading } = useWorkHours();
  const updateWorkHours = useUpdateWorkHoursMutation();
  const uploadAvatar = useUploadAvatarMutation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("19:00");

  const isAdmin = isAdminRole(profile?.user.role);
  const canEditHours = isAdmin;

  useEffect(() => {
    if (workHours) {
      setStartTime(toInputTime(workHours.startTime));
      setEndTime(toInputTime(workHours.endTime));
    }
  }, [workHours]);

  async function saveWorkHours() {
    if (!canEditHours) {
      toast.error("Admin role required to save working hours.");
      return;
    }
    try {
      await updateWorkHours.mutateAsync({ startTime, endTime });
      toast.success("Organization working hours updated.");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Update failed."
          : "Update failed.";
      toast.error(message);
    }
  }

  async function onAvatarPick(file: File | undefined) {
    if (!file) return;
    try {
      const image = await resizeImageToDataUrl(file);
      await uploadAvatar.mutateAsync(image);
      toast.success("Profile photo updated.");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Upload failed."
          : "Upload failed.";
      toast.error(message);
    }
  }

  const user = profile?.user;

  return (
    <div className="space-y-6">
      <header>
        <h1 className={pageTitleClass}>Settings</h1>
        <p className={pageSubtitleClass}>Your account and organization preferences</p>
      </header>

      <section className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-6">
        {profileLoading || !user ? (
          <div className="h-20 animate-pulse rounded-xl bg-muted/50" aria-hidden />
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Upload profile photo"
            >
              <UserAvatar
                initials={user.initials}
                image={user.image}
                size="lg"
                className="size-16 text-xl"
              />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-5 text-white" aria-hidden />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => void onAvatarPick(e.target.files?.[0])}
            />
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold text-foreground sm:text-2xl">{user.name}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{user.role}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">ID: {user.employeeId}</p>
            </div>
          </div>
        )}
      </section>

      <PanelCard title="Organization Working Hours">
        <p className="mb-4 text-sm text-muted-foreground">
          {canEditHours
            ? "Set the org-wide work window used for early, on-time, late, and after-hours classification. Default is 9:00 AM – 7:00 PM."
            : "These hours are set by admins and apply to early, on-time, late, and after-hours check classification."}
        </p>
        {hoursLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Start Time</span>
              <input
                type="time"
                value={startTime}
                disabled={!canEditHours}
                onChange={(event) => setStartTime(event.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-input-background px-3 text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">End Time</span>
              <input
                type="time"
                value={endTime}
                disabled={!canEditHours}
                onChange={(event) => setEndTime(event.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-input-background px-3 text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>
        )}
        {canEditHours ? (
          <Button
            className="mt-4"
            disabled={updateWorkHours.isPending || hoursLoading}
            onClick={() => void saveWorkHours()}
          >
            {updateWorkHours.isPending ? "Saving…" : "Save Working Hours"}
          </Button>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            Only admins can update organization working hours.
          </p>
        )}
      </PanelCard>
    </div>
  );
}
