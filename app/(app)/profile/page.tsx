"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Clock3, Medal, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { AchievementCard, type AchievementIcon } from "@/components/dashboard/achievement-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";
import { StatusPill } from "@/components/dashboard/status-pill";

type ProfileResponse = {
  user: {
    name: string;
    email: string;
    role: string;
    initials: string;
    employeeId: string;
  };
  stats: {
    totalDays: number;
    avgHoursPerDay: string;
    onTimeRate: string;
    currentStreak: string;
  };
  recentAttendance: Array<{
    date: string;
    checkIn: string;
    checkOut: string;
    duration: string;
    status: "On Time" | "Late";
  }>;
  achievements: Array<{
    id: AchievementIcon;
    title: string;
    description: string;
    active: boolean;
  }>;
};

export default function ProfilePage() {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: payload } = await axios.get<ProfileResponse>("/api/profile");
      setData(payload);
    } catch {
      setData(null);
      toast.error("Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>;
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">Profile unavailable.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em] text-foreground">My Profile</h1>
        <p className="text-muted-foreground">View your attendance history and statistics</p>
      </header>

      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
            {data.user.initials}
          </span>
          <div>
            <p className="text-[1.75rem] font-semibold leading-tight text-foreground sm:text-[2rem]">
              {data.user.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{data.user.role}</p>
            <p className="mt-1 text-sm text-muted-foreground">{data.user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">ID: {data.user.employeeId}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Days" value={String(data.stats.totalDays)} icon={<CalendarDays className="h-5 w-5" />} />
        <MetricCard title="Avg Hours/Day" value={data.stats.avgHoursPerDay} icon={<Clock3 className="h-5 w-5" />} />
        <MetricCard title="On-Time Rate" value={data.stats.onTimeRate} icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard title="Current Streak" value={data.stats.currentStreak} icon={<Medal className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <PanelCard title="Recent Attendance">
          {data.recentAttendance.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attendance records yet. Check in to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Check In</th>
                    <th className="py-2 font-medium">Check Out</th>
                    <th className="py-2 font-medium">Duration</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.recentAttendance.map((row) => (
                    <tr key={`${row.date}-${row.checkIn}`}>
                      <td className="py-3 text-foreground">{row.date}</td>
                      <td className="py-3 text-foreground">{row.checkIn}</td>
                      <td className="py-3 text-foreground">{row.checkOut}</td>
                      <td className="py-3 text-foreground">{row.duration}</td>
                      <td className="py-3">
                        <StatusPill variant={row.status === "Late" ? "warning" : "success"}>
                          {row.status}
                        </StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelCard>

        <PanelCard title="Achievements">
          <div className="space-y-3">
            {data.achievements.map((item) => (
              <AchievementCard
                key={item.id}
                icon={item.id}
                title={item.title}
                description={item.description}
                active={item.active}
              />
            ))}
          </div>
        </PanelCard>
      </section>
    </div>
  );
}
