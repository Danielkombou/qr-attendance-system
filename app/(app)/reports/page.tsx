import { CalendarDays, Download, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";
import { pageSubtitleClass, pageTitleClass } from "@/lib/ui/page-styles";

const weeklyBars = [
  { label: "Mon", present: 42, late: 3, absent: 2 },
  { label: "Tue", present: 45, late: 2, absent: 1 },
  { label: "Wed", present: 43, late: 4, absent: 1 },
  { label: "Thu", present: 44, late: 2, absent: 2 },
  { label: "Fri", present: 41, late: 3, absent: 3 },
];

const departments = [
  { name: "Engineering", count: 15, color: "var(--chart-dept-1)" },
  { name: "Design", count: 8, color: "var(--chart-dept-2)" },
  { name: "Marketing", count: 10, color: "var(--chart-dept-3)" },
  { name: "Product", count: 12, color: "var(--chart-dept-4)" },
];

const monthlyTrend = [
  { month: "Jan", hours: 72, onTime: 88 },
  { month: "Feb", hours: 75, onTime: 90 },
  { month: "Mar", hours: 78, onTime: 92 },
  { month: "Apr", hours: 80, onTime: 94 },
];

const topPerformers = [
  { rank: 1, name: "Sarah Johnson", dept: "Engineering", rate: "100%", hours: "8.5h avg" },
  { rank: 2, name: "Alex Turner", dept: "Engineering", rate: "98%", hours: "8.3h avg" },
  { rank: 3, name: "Maya Patel", dept: "Product", rate: "97%", hours: "8.1h avg" },
  { rank: 4, name: "Emily Davis", dept: "Design", rate: "96%", hours: "8h avg" },
  { rank: 5, name: "James Wilson", dept: "Marketing", rate: "95%", hours: "7.9h avg" },
];

const deptTotal = departments.reduce((sum, d) => sum + d.count, 0);

export default function ReportsPage() {
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
          value="94.2%"
          trend="+2.3% from last month"
          trendTone="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Hours/Day"
          value="7.8h"
          trend="+0.2h from last month"
          trendTone="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="On-Time Rate"
          value="96%"
          trend="+3% from last month"
          trendTone="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Late Arrivals"
          value="12"
          trend="-4 from last month"
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
            <div className="grid h-full grid-cols-5 items-end gap-4">
              {weeklyBars.map((day) => {
                const total = day.present + day.late + day.absent;
                const scale = 100 / total;
                return (
                  <div key={day.label} className="flex h-full flex-col justify-end">
                    <div className="flex h-[85%] flex-col justify-end gap-0.5">
                      <div
                        className="rounded-t-sm bg-[var(--chart-bar)]"
                        style={{ height: `${day.present * scale}%` }}
                      />
                    </div>
                    <p className="mt-2 text-center text-sm text-muted-foreground">{day.label}</p>
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

        <PanelCard title="By Department">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div
              className="relative h-36 w-36 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(
                  var(--chart-dept-1) 0 ${(15 / deptTotal) * 100}%,
                  var(--chart-dept-2) ${(15 / deptTotal) * 100}% ${((15 + 8) / deptTotal) * 100}%,
                  var(--chart-dept-3) ${((15 + 8) / deptTotal) * 100}% ${((15 + 8 + 10) / deptTotal) * 100}%,
                  var(--chart-dept-4) ${((15 + 8 + 10) / deptTotal) * 100}% 100%
                )`,
              }}
              aria-hidden
            >
              <div className="absolute inset-[18%] rounded-full bg-card" />
            </div>
            <ul className="w-full space-y-3">
              {departments.map((dept) => (
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
        </PanelCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <PanelCard title="Monthly Trends">
          <div className="h-56 rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="grid h-full grid-cols-4 items-end gap-6">
              {monthlyTrend.map((point) => (
                <div key={point.month} className="flex h-full flex-col justify-end gap-1">
                  <div
                    className="rounded-t-sm bg-[var(--chart-dept-1)]"
                    style={{ height: `${point.hours}%` }}
                  />
                  <div
                    className="rounded-t-sm bg-[var(--chart-dept-4)]"
                    style={{ height: `${point.onTime}%` }}
                  />
                  <p className="mt-2 text-center text-sm text-muted-foreground">{point.month}</p>
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
          <ul className="divide-y divide-border">
            {topPerformers.map((person) => (
              <li key={person.rank} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {person.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{person.name}</p>
                  <p className="text-sm text-muted-foreground">{person.dept}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-foreground">{person.rate}</p>
                  <p className="text-muted-foreground">{person.hours}</p>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>
      </section>
    </div>
  );
}
