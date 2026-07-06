"use client";

import { useRef } from "react";
import { CalendarDays, Download, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";
import { pageSubtitleClass, pageTitleClass } from "@/lib/ui/page-styles";
import { useReports } from "@/lib/queries/hooks";

export default function ReportsPage() {
  const { data, isLoading, isError } = useReports();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading reports…</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-muted-foreground">Reports unavailable.</p>;
  }

  const deptTotal = data.byRole.reduce((sum, d) => sum + d.count, 0) || 1;
  const roleGradient =
    data.byRole.length > 0
      ? data.byRole
          .reduce<{ parts: string[]; cursor: number }>(
            (acc, dept) => {
              const pct = (dept.count / deptTotal) * 100;
              const next = acc.cursor + pct;
              acc.parts.push(`${dept.color} ${acc.cursor}% ${next}%`);
              acc.cursor = next;
              return acc;
            },
            { parts: [], cursor: 0 },
          )
          .parts.join(", ")
      : "var(--chart-dept-1) 0% 100%";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <span>
          <h1 className={pageTitleClass}>Reports & Analytics</h1>
          <p className={pageSubtitleClass}>Attendance insights and trends</p>
        </span>
        <button
          type="button"
          className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm sm:w-auto"
        >
          <Download className="h-4 w-4" aria-hidden />
          Export Report
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Avg Attendance"
          value={data.kpis.avgAttendance}
          trend={data.kpis.avgAttendanceTrend}
          trendTone="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Hours/Day"
          value={data.kpis.avgHoursPerDay}
          trend={data.kpis.avgHoursTrend}
          trendTone="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="On-Time Rate"
          value={data.kpis.onTimeRate}
          trend={data.kpis.onTimeTrend}
          trendTone="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Late Arrivals"
          value={data.kpis.lateArrivals}
          trend={data.kpis.lateTrend}
          trendTone="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <PanelCard
          title="Weekly Attendance"
          rightSlot={<CalendarDays className="h-5 w-5 text-muted-foreground" aria-hidden />}
        >
          <div className="h-64 rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="grid h-full grid-cols-5 items-end gap-2 sm:gap-4">
              {data.weeklyBars.map((day) => {
                const total = Math.max(1, day.present + day.late + day.absent);
                const scale = 100 / total;
                return (
                  <div key={day.label} className="flex h-full flex-col justify-end">
                    <div className="flex h-[85%] flex-col justify-end gap-0.5">
                      <div
                        className="rounded-t-sm bg-[var(--chart-dept-4)]"
                        style={{ height: `${day.present * scale}%` }}
                      />
                      <div
                        className="rounded-t-sm bg-[var(--surface-warning-fg)]"
                        style={{ height: `${day.late * scale}%` }}
                      />
                      <div
                        className="rounded-t-sm bg-[var(--chart-bar)]"
                        style={{ height: `${day.absent * scale}%` }}
                      />
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground sm:text-sm">{day.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-dept-4)]" />
              Present
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-warning-fg)]" />
              Late
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-bar)]" />
              Absent
            </span>
          </div>
        </PanelCard>

        <PanelCard title="By Role">
          {data.byRole.length === 0 ? (
            <p className="text-sm text-muted-foreground">No check-ins today yet.</p>
          ) : (
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div
                className="relative h-36 w-36 shrink-0 rounded-full"
                style={{ background: `conic-gradient(${roleGradient})` }}
                aria-hidden
              >
                <div className="absolute inset-[18%] rounded-full bg-card" />
              </div>
              <ul className="w-full space-y-3">
                {data.byRole.map((dept) => (
                  <li key={dept.name} className="flex items-center justify-between gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 text-foreground">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      {dept.name}
                    </span>
                    <span className="font-medium text-foreground">{dept.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </PanelCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <PanelCard title="Monthly Trends">
          <div className="h-56 rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="grid h-full grid-cols-4 items-end gap-3 sm:gap-6">
              {data.monthlyTrend.map((point) => (
                <div key={point.month} className="flex h-full flex-col justify-end gap-1">
                  <div
                    className="rounded-t-sm bg-[var(--chart-dept-1)]"
                    style={{ height: `${point.hours}%` }}
                  />
                  <div
                    className="rounded-t-sm bg-[var(--chart-dept-4)]"
                    style={{ height: `${point.onTime}%` }}
                  />
                  <p className="mt-2 text-center text-xs text-muted-foreground sm:text-sm">{point.month}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-dept-1)]" />
              Avg Hours
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-dept-4)]" />
              On-Time %
            </span>
          </div>
        </PanelCard>

        <PanelCard title="Top Performers">
          {data.topPerformers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No performance data this month.</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.topPerformers.map((person) => (
                <li key={person.rank} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {person.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.role}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-foreground">{person.rate}</p>
                    <p className="text-muted-foreground">{person.hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
      </section>
    </div>
  );
}
