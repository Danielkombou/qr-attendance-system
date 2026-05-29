"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowUpRight, Clock3, TrendingUp, Users } from "lucide-react";
import { ActivityList } from "@/components/dashboard/activity-list";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";
import { StatusPill } from "@/components/dashboard/status-pill";

type MemberRow = {
  id: string;
  name: string;
  initials: string;
  status: "Present" | "Absent";
  checkInTime: string | null;
  duration: string | null;
};

type MembersResponse = {
  summary: { total: number; present: number; absent: number };
  members: MemberRow[];
};

export default function UserDashboardPage() {
  const [data, setData] = useState<MembersResponse | null>(null);

  const load = useCallback(async () => {
    try {
      const { data: payload } = await axios.get<MembersResponse>("/api/team/members");
      setData(payload);
    } catch {
      setData(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const presentMembers = useMemo(
    () => (data?.members ?? []).filter((m) => m.status === "Present"),
    [data?.members],
  );

  const recentActivity = useMemo(
    () =>
      presentMembers.slice(0, 3).map((member, index) => ({
        id: member.id,
        initials: member.initials,
        name: member.name,
        action: "Checked In",
        time: member.checkInTime ?? "—",
        dotClassName:
          index % 2 === 0 ? "bg-[var(--surface-success-fg)]" : "bg-[var(--surface-warning-fg)]",
      })),
    [presentMembers],
  );

  const avgHours = useMemo(() => {
    if (presentMembers.length === 0) return "—";
    const totalMinutes = presentMembers.reduce((sum, member) => {
      if (!member.duration) return sum;
      const match = member.duration.match(/(\d+)h?\s*(\d+)?m?/);
      if (!match) return sum;
      const hours = match[1] ? Number.parseInt(match[1], 10) : 0;
      const mins = match[2] ? Number.parseInt(match[2], 10) : 0;
      return sum + hours * 60 + mins;
    }, 0);
    return `${(totalMinutes / presentMembers.length / 60).toFixed(1)}h`;
  }, [presentMembers]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em] text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Your attendance at a glance</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Present Today" value={String(data?.summary.present ?? "—")} icon={<Users className="h-5 w-5" />} />
        <MetricCard title="Average Hours" value={avgHours} icon={<Clock3 className="h-5 w-5" />} />
        <MetricCard title="Team Size" value={String(data?.summary.total ?? "—")} icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard title="Absent Today" value={String(data?.summary.absent ?? "—")} icon={<ArrowUpRight className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <PanelCard
          title="Recent Check-ins"
          rightSlot={
            <StatusPill variant="success" className="text-sm">
              {presentMembers.length} Active
            </StatusPill>
          }
        >
          {presentMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No one is checked in right now.</p>
          ) : (
            <ul className="divide-y divide-border">
              {presentMembers.slice(0, 5).map((entry) => (
                <li key={entry.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {entry.initials}
                    </span>
                    <span className="block font-medium text-foreground">{entry.name}</span>
                  </div>
                  <span className="text-right text-sm">
                    <span className="block font-medium text-foreground">{entry.duration ?? "—"}</span>
                    <span className="text-muted-foreground">{entry.checkInTime ?? "—"}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>

        <PanelCard title="Recent Activity">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <ActivityList items={recentActivity} />
          )}
        </PanelCard>
      </section>
    </div>
  );
}
