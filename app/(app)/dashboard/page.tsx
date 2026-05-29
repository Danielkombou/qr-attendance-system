import { ArrowUpRight, Clock3, TrendingUp, Users } from "lucide-react";
import { ActivityList } from "@/components/dashboard/activity-list";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";

const recentCheckIns = [
  { initials: "SJ", name: "Sarah Johnson", duration: "3h 25m", time: "08:45 AM" },
  { initials: "ED", name: "Emily Davis", duration: "3h 08m", time: "09:02 AM" },
  { initials: "JW", name: "James Wilson", duration: "3h 40m", time: "08:30 AM" },
];

const recentActivity = [
  { id: "sj-in", initials: "SJ", name: "Sarah Johnson", action: "Checked In", time: "08:45 AM", dotClassName: "bg-emerald-500" },
  { id: "mc-out", initials: "MC", name: "Mike Chen", action: "Checked Out", time: "05:30 PM", dotClassName: "bg-amber-500" },
  { id: "ed-in", initials: "ED", name: "Emily Davis", action: "Checked In", time: "09:02 AM", dotClassName: "bg-emerald-500" },
];

export default function UserDashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">Dashboard</h1>
        <p className="text-muted-foreground">Your attendance at a glance</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Present Today" value="42" trend="+5%" icon={<Users className="h-5 w-5" />} />
        <MetricCard title="Average Hours" value="7.2h" trend="+0.3h" icon={<Clock3 className="h-5 w-5" />} />
        <MetricCard title="On Time Rate" value="94%" trend="+2%" icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard title="Late Today" value="3" trend="-1" icon={<ArrowUpRight className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <PanelCard
          title="Recent Check-ins"
          rightSlot={
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              5 Active
            </span>
          }
        >
          <ul className="divide-y divide-border">
            {recentCheckIns.map((entry) => (
              <li key={entry.name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {entry.initials}
                  </span>
                  <span className="block font-medium text-foreground">{entry.name}</span>
                </div>
                <span className="text-right text-sm">
                  <span className="block font-medium">{entry.duration}</span>
                  <span className="text-muted-foreground">{entry.time}</span>
                </span>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Recent Activity">
          <ActivityList items={recentActivity} />
        </PanelCard>
      </section>
    </div>
  );
}
