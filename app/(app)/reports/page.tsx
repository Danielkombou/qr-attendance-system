"use client";

import { useState } from "react";
import { CalendarDays, Download, TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts";
import { toast } from "sonner";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { downloadAttendanceCsv } from "@/lib/client/download-attendance-csv";
import { pageSubtitleClass, pageTitleClass } from "@/lib/ui/page-styles";
import { useReports } from "@/lib/queries/hooks";

function todayInputValue() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
      toast.error(err instanceof Error ? err.message : "Export failed.");
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

  const weeklyChartData = data.weeklyBars.map((day) => ({
    day: day.label,
    present: day.present,
    late: day.late,
    absent: day.absent,
  }));
  const byRoleChartData = data.byRole.map((item) => ({
    role: item.name,
    count: item.count,
    fill: item.color,
  }));
  const monthlyChartData = data.monthlyTrend.map((point) => ({
    month: point.month,
    avgHours: point.hours,
    onTimeRate: point.onTime,
  }));

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

  const weeklyConfig = {
    present: { label: "Present", color: "var(--chart-dept-4)" },
    late: { label: "Late", color: "var(--surface-warning-fg)" },
    absent: { label: "Absent", color: "var(--chart-bar)" },
  } satisfies ChartConfig;

  const monthlyConfig = {
    avgHours: { label: "Avg Hours", color: "var(--chart-dept-1)" },
    onTimeRate: { label: "On-Time %", color: "var(--chart-dept-4)" },
  } satisfies ChartConfig;

  const roleConfig = {
    count: { label: "Check-ins", color: "var(--chart-dept-1)" },
  } satisfies ChartConfig;

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
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.12 }}
            className="rounded-xl border border-border/80 bg-muted/30 p-2"
          >
            <ChartContainer config={weeklyConfig} className="h-64 w-full">
              <BarChart accessibilityLayer data={weeklyChartData} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="present" stackId="attendance" fill="var(--color-present)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="late" stackId="attendance" fill="var(--color-late)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="absent" stackId="attendance" fill="var(--color-absent)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </motion.div>
        </PanelCard>

        <PanelCard title="By Role">
          {data.byRole.length === 0 ? (
            <p className="text-sm text-muted-foreground">No check-ins today yet.</p>
          ) : (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...transition, delay: reduceMotion ? 0 : 0.18 }}
              className="rounded-xl border border-border/80 bg-muted/30 p-2"
            >
              <ChartContainer config={roleConfig} className="h-64 w-full">
                <PieChart accessibilityLayer>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, _name, item) => [value, item.payload.role as string]}
                      />
                    }
                  />
                  <Pie data={byRoleChartData} dataKey="count" nameKey="role" innerRadius={54} outerRadius={86}>
                    {byRoleChartData.map((entry) => (
                      <Cell key={entry.role} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="role" />} />
                </PieChart>
              </ChartContainer>
            </motion.div>
          )}
        </PanelCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <PanelCard title="Monthly Trends">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.2 }}
            className="rounded-xl border border-border/80 bg-muted/30 p-2"
          >
            <ChartContainer config={monthlyConfig} className="h-56 w-full">
              <BarChart accessibilityLayer data={monthlyChartData} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="avgHours" fill="var(--color-avgHours)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="onTimeRate" fill="var(--color-onTimeRate)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </motion.div>
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
