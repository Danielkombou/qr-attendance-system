"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { CalendarDays, Download, TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";
import { Button } from "@/components/ui/button";
import { pageSubtitleClass, pageTitleClass } from "@/lib/ui/page-styles";
import { useReports } from "@/lib/queries/hooks";

function todayInputValue() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function downloadAttendanceCsv(date: string) {
  const response = await axios.get("/api/admin/attendance/export", {
    params: { date },
    responseType: "blob",
  });
  const contentType = String(response.headers["content-type"] ?? "");
  if (contentType.includes("application/json")) {
    const text = await (response.data as Blob).text();
    const parsed = JSON.parse(text) as { error?: string };
    throw new Error(parsed.error ?? "Export failed.");
  }
  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `attendance-${date}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { data, isLoading, isError } = useReports();
  const reduceMotion = useReducedMotion();
  const [exportDate, setExportDate] = useState(todayInputValue);
  const [exporting, setExporting] = useState(false);

  async function onExport() {
    setExporting(true);
    try {
      await downloadAttendanceCsv(exportDate);
      toast.success("Attendance CSV downloaded.");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ??
            (err.response?.status === 403
              ? "Admin role required to export."
              : "Export failed.")
          : err instanceof Error
            ? err.message
            : "Export failed.";
      toast.error(message);
    } finally {
      setExporting(false);
    }
  }

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

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <span>
          <h1 className={pageTitleClass}>Reports & Analytics</h1>
          <p className={pageSubtitleClass}>Attendance insights and trends</p>
        </span>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <input
            type="date"
            value={exportDate}
            onChange={(event) => setExportDate(event.target.value)}
            className="h-10 rounded-xl border border-border bg-input-background px-3 text-sm text-foreground"
            aria-label="Export date"
          />
          <Button
            type="button"
            className="h-10 rounded-xl px-4"
            disabled={exporting}
            onClick={() => void onExport()}
          >
            <Download className="h-4 w-4" aria-hidden />
            {exporting ? "Exporting…" : "Export CSV"}
          </Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Avg Attendance",
            value: data.kpis.avgAttendance,
            trend: data.kpis.avgAttendanceTrend,
          },
          {
            title: "Avg Hours/Day",
            value: data.kpis.avgHoursPerDay,
            trend: data.kpis.avgHoursTrend,
          },
          {
            title: "On-Time Rate",
            value: data.kpis.onTimeRate,
            trend: data.kpis.onTimeTrend,
          },
          {
            title: "Late Arrivals",
            value: data.kpis.lateArrivals,
            trend: data.kpis.lateTrend,
          },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : index * 0.07 }}
          >
            <MetricCard
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              trendTone="positive"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </motion.div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <PanelCard
          title="Weekly Attendance"
          rightSlot={<CalendarDays className="h-5 w-5 text-muted-foreground" aria-hidden />}
        >
          <div className="h-64 rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="grid h-full grid-cols-5 items-end gap-2 sm:gap-4">
              {data.weeklyBars.map((day, index) => {
                const total = Math.max(1, day.present + day.late + day.absent);
                const scale = 100 / total;
                return (
                  <div key={day.label} className="flex h-full flex-col justify-end">
                    <div className="flex h-[85%] flex-col justify-end gap-0.5">
                      {(
                        [
                          { key: "present", height: day.present * scale, className: "bg-[var(--chart-dept-4)]" },
                          {
                            key: "late",
                            height: day.late * scale,
                            className: "bg-[var(--surface-warning-fg)]",
                          },
                          { key: "absent", height: day.absent * scale, className: "bg-[var(--chart-bar)]" },
                        ] as const
                      ).map((segment) => (
                        <motion.div
                          key={segment.key}
                          className={`rounded-t-sm ${segment.className}`}
                          initial={reduceMotion ? false : { height: 0 }}
                          animate={{ height: `${segment.height}%` }}
                          transition={{
                            ...transition,
                            delay: reduceMotion ? 0 : 0.15 + index * 0.08,
                          }}
                        />
                      ))}
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
              <motion.div
                className="relative h-36 w-36 shrink-0 rounded-full"
                style={{ background: `conic-gradient(${roleGradient})` }}
                aria-hidden
                initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...transition, delay: reduceMotion ? 0 : 0.2 }}
              >
                <div className="absolute inset-[18%] rounded-full bg-card" />
              </motion.div>
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
              {data.monthlyTrend.map((point, index) => (
                <div key={point.month} className="flex h-full flex-col justify-end gap-1">
                  <motion.div
                    className="rounded-t-sm bg-[var(--chart-dept-1)]"
                    initial={reduceMotion ? false : { height: 0 }}
                    animate={{ height: `${point.hours}%` }}
                    transition={{
                      ...transition,
                      delay: reduceMotion ? 0 : 0.18 + index * 0.08,
                    }}
                  />
                  <motion.div
                    className="rounded-t-sm bg-[var(--chart-dept-4)]"
                    initial={reduceMotion ? false : { height: 0 }}
                    animate={{ height: `${point.onTime}%` }}
                    transition={{
                      ...transition,
                      delay: reduceMotion ? 0 : 0.26 + index * 0.08,
                    }}
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
              {data.topPerformers.map((person, index) => (
                <motion.li
                  key={person.rank}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...transition, delay: reduceMotion ? 0 : 0.2 + index * 0.06 }}
                >
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
                </motion.li>
              ))}
            </ul>
          )}
        </PanelCard>
      </section>
    </div>
  );
}
