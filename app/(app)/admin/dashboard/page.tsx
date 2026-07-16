"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PanelCard } from "@/components/dashboard/panel-card";
import { StatSummaryCard } from "@/components/dashboard/stat-summary-card";
import { Skeleton } from "@/components/ui/skeleton";
import { pageSubtitleClass, pageTitleClass } from "@/lib/ui/page-styles";

type Metrics = { totalUsers: number; activeNow: number; todayCheckIns: number };

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await axios.get<{ metrics: Metrics }>("/api/dashboard/admin");
        if (!cancelled) {
          setMetrics(data.metrics);
        }
      } catch {
        if (!cancelled) {
          setMetrics(null);
          toast.error("Could not load dashboard metrics.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className={pageTitleClass}>Admin Dashboard</h1>
        <p className={pageSubtitleClass}>Organization overview for today</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <>
            <Skeleton className="h-[132px] rounded-2xl" />
            <Skeleton className="h-[132px] rounded-2xl" />
            <Skeleton className="h-[132px] rounded-2xl sm:col-span-2 xl:col-span-1" />
          </>
        ) : (
          <>
            <StatSummaryCard label="Total Users" value={metrics?.totalUsers ?? "—"} />
            <StatSummaryCard label="Checked in now" value={metrics?.activeNow ?? "—"} tone="success" />
            <StatSummaryCard
              label="Check-ins today"
              value={metrics?.todayCheckIns ?? "—"}
              tone="warning"
              className="sm:col-span-2 xl:col-span-1"
            />
          </>
        )}
      </section>

      <PanelCard title="User management">
        <p className="mb-4 text-sm text-muted-foreground">
          Search users, change roles, add accounts, and export daily attendance from the Users page.
        </p>
        <Link
          href="/admin/users"
          className={buttonVariants({ className: "inline-flex w-full rounded-xl sm:w-auto" })}
        >
          <Users className="h-4 w-4" aria-hidden />
          Open Users
        </Link>
      </PanelCard>
    </div>
  );
}
