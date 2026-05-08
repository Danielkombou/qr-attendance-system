import { CalendarDays, Clock3, Medal, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";

const attendanceRows = [
  { date: "May 7, 2026", in: "08:45 AM", out: "05:30 PM", duration: "8h 45m", status: "On Time" },
  { date: "May 6, 2026", in: "08:52 AM", out: "05:45 PM", duration: "8h 53m", status: "On Time" },
  { date: "May 5, 2026", in: "09:15 AM", out: "06:00 PM", duration: "8h 45m", status: "Late" },
];

const achievements = [
  { title: "Perfect Week", desc: "On time every day this week", active: true },
  { title: "100 Days", desc: "Completed 100 days of attendance", active: true },
  { title: "Early Bird", desc: "Check in before 8 AM for 5 days", active: false },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">My Profile</h1>
        <p className="text-muted-foreground">View your attendance history and statistics</p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-[2rem] font-semibold text-primary-foreground">
            AM
          </span>
          <div>
            <p className="text-[2rem] font-semibold">Alex Morgan</p>
            <p className="text-muted-foreground">Senior Developer - Engineering</p>
            <p className="text-sm text-muted-foreground">alex.morgan@company.com · ID: EMP-2024-0142</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Days" value="234" icon={<CalendarDays className="h-5 w-5" />} />
        <MetricCard title="Avg Hours/Day" value="7.8h" icon={<Clock3 className="h-5 w-5" />} />
        <MetricCard title="On-Time Rate" value="96%" icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard title="Current Streak" value="12 days" icon={<Medal className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <PanelCard title="Recent Attendance">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="text-sm text-muted-foreground">
                <tr>
                  <th className="py-2">Date</th>
                  <th className="py-2">Check In</th>
                  <th className="py-2">Check Out</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attendanceRows.map((row) => (
                  <tr key={row.date}>
                    <td className="py-3">{row.date}</td>
                    <td className="py-3">{row.in}</td>
                    <td className="py-3">{row.out}</td>
                    <td className="py-3">{row.duration}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${row.status === "Late" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>

        <PanelCard title="Achievements">
          <div className="space-y-3">
            {achievements.map((item) => (
              <div
                key={item.title}
                className={`rounded-xl border p-4 ${item.active ? "border-emerald-200 bg-emerald-50" : "border-border bg-muted/30"}`}
              >
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </PanelCard>
      </section>
    </div>
  );
}
