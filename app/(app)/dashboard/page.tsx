"use client";

import { useMemo } from "react";
import { ArrowUpRight, Clock3, TrendingUp, Users } from "lucide-react";
import { ActivityList } from "@/components/dashboard/activity-list";
import { AvatarWithPresence } from "@/components/dashboard/presence-dot";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { useTeamMembers } from "@/lib/queries/hooks";
import { pageSubtitleClass, pageTitleClass } from "@/lib/ui/page-styles";

export default function UserDashboardPage() {
  const { data, isLoading } = useTeamMembers();

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
        action: member.location ? `Checked in · ${member.location}` : "Checked in",
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
        <h1 className={pageTitleClass}>Dashboard</h1>
        <p className={pageSubtitleClass}>Your attendance at a glance</p>
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
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading check-ins…</p>
          ) : presentMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No one is checked in right now.</p>
          ) : (
            <ul className="divide-y divide-border">
              {presentMembers.slice(0, 5).map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <AvatarWithPresence initials={entry.initials} online />
                    <div className="min-w-0">
                      <span className="block truncate font-medium text-foreground">{entry.name}</span>
                      {entry.location ? (
                        <span className="block truncate text-sm text-muted-foreground">{entry.location}</span>
                      ) : null}
                    </div>
                  </div>
                  <span className="text-sm sm:text-right">
                    <span className="block font-medium text-foreground">{entry.duration ?? "—"}</span>
                    <span className="text-muted-foreground">
                      {entry.checkInTime ?? "—"}
                      {entry.checkInNote ? ` · ${entry.checkInNote}` : ""}
                    </span>
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
