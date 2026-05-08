import { ArrowUpRight, Clock3, TrendingUp, Users } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";

const presentUsers = [
  { initials: "SJ", name: "Sarah Johnson", team: "Engineering", duration: "3h 25m", time: "08:45 AM" },
  { initials: "ED", name: "Emily Davis", team: "Design", duration: "3h 08m", time: "09:02 AM" },
  { initials: "JW", name: "James Wilson", team: "Marketing", duration: "3h 40m", time: "08:30 AM" },
];

const recentActivity = [
  { initials: "SJ", name: "Sarah Johnson", action: "Checked In", time: "08:45 AM", dot: "bg-emerald-500" },
  { initials: "MC", name: "Mike Chen", action: "Checked Out", time: "05:30 PM", dot: "bg-amber-500" },
  { initials: "ED", name: "Emily Davis", action: "Checked In", time: "09:02 AM", dot: "bg-emerald-500" },
];

export default function UserDashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">Dashboard</h1>
        <p className="text-muted-foreground">Thursday, May 7, 2026</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Present Today" value="42" trend="+5%" icon={<Users className="h-5 w-5" />} />
        <MetricCard title="Average Hours" value="7.2h" trend="+0.3h" icon={<Clock3 className="h-5 w-5" />} />
        <MetricCard title="On Time Rate" value="94%" trend="+2%" icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard title="Late Today" value="3" trend="-1" icon={<ArrowUpRight className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <PanelCard title="Currently Present" rightSlot={<span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">5 Active</span>}>
          <ul className="divide-y divide-border">
            {presentUsers.map((user) => (
              <li key={user.name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {user.initials}
                  </span>
                  <span>
                    <span className="block font-medium">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.team}</span>
                  </span>
                </div>
                <span className="text-right text-sm">
                  <span className="block font-medium">{user.duration}</span>
                  <span className="text-muted-foreground">{user.time}</span>
                </span>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Recent Activity">
          <ul className="divide-y divide-border">
            {recentActivity.map((entry) => (
              <li key={`${entry.name}-${entry.action}`} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {entry.initials}
                  </span>
                  <span>
                    <span className="block font-medium">{entry.name}</span>
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      {entry.action}
                      <span className={`h-2 w-2 rounded-full ${entry.dot}`} />
                    </span>
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{entry.time}</span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </section>
    </div>
  );
}
