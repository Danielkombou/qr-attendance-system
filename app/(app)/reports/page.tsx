import { Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <span>
          <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">Reports & Analytics</h1>
          <p className="text-muted-foreground">Attendance insights and trends</p>
        </span>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Avg Attendance" value="94.2%" trend="+2.3%" icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard title="Avg Hours/Day" value="7.8h" trend="+0.2h" icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard title="On-Time Rate" value="96%" trend="+3%" icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard title="Late Arrivals" value="12" trend="-4" icon={<TrendingUp className="h-5 w-5" />} />
      </section>

      <PanelCard title="Weekly Attendance">
        <div className="h-72 rounded-xl border border-border bg-background p-4">
          <div className="grid h-full grid-cols-5 items-end gap-6">
            {[42, 45, 43, 44, 41].map((value, index) => (
              <div key={value + index} className="flex h-full flex-col justify-end">
                <div className="rounded-md bg-primary/80" style={{ height: `${value}%` }} />
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
