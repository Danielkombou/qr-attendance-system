"use client";

import { CalendarDays, Clock3, Medal, TrendingUp } from "lucide-react";
import { AchievementCard, type AchievementIcon } from "@/components/dashboard/achievement-card";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PanelCard } from "@/components/dashboard/panel-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/lib/queries/hooks";
import { pageSubtitleClass, pageTitleClass } from "@/lib/ui/page-styles";

export default function ProfilePage() {
  const { data, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className={pageTitleClass}>My Profile</h1>
          <p className={pageSubtitleClass}>View your attendance history and statistics</p>
        </header>
        <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="size-16 rounded-full" />
            <div className="w-full space-y-2">
              <Skeleton className="h-8 w-56 max-w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64 max-w-full" />
            </div>
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[132px] rounded-2xl" />
          ))}
        </section>
        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <Skeleton className="h-[360px] rounded-2xl" />
          <Skeleton className="h-[360px] rounded-2xl" />
        </section>
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-muted-foreground">Profile unavailable.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className={pageTitleClass}>My Profile</h1>
        <p className={pageSubtitleClass}>View your attendance history and statistics</p>
      </header>

      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          <UserAvatar initials={data.user.initials} image={data.user.image} size="lg" />
          <div className="min-w-0">
            <p className="text-[1.75rem] font-semibold leading-tight text-foreground sm:text-[2rem]">
              {data.user.name}
            </p>
            <p className="mt-1 truncate text-sm text-muted-foreground">{data.user.role}</p>
            <p className="mt-1 truncate text-sm text-muted-foreground">{data.user.email}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">ID: {data.user.employeeId}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Days" value={String(data.stats.totalDays)} icon={<CalendarDays className="h-5 w-5" />} />
        <MetricCard title="Avg Hours/Day" value={data.stats.avgHoursPerDay} icon={<Clock3 className="h-5 w-5" />} />
        <MetricCard title="On-Time Rate" value={data.stats.onTimeRate} icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard title="Current Streak" value={data.stats.currentStreak} icon={<Medal className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <PanelCard title="Recent Attendance">
          {data.recentAttendance.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attendance records yet. Check in to get started.</p>
          ) : (
            <>
              <div className="space-y-3 sm:hidden">
                {data.recentAttendance.map((row) => (
                  <article key={`${row.date}-${row.checkIn}`} className="rounded-xl border border-border/80 p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground">{row.date}</p>
                      <StatusPill variant={row.status === "Late" ? "warning" : "success"}>
                        {row.status}
                      </StatusPill>
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Check In</dt>
                        <dd className="text-foreground">{row.checkIn}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Check Out</dt>
                        <dd className="text-foreground">{row.checkOut}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">Duration</dt>
                        <dd className="text-foreground">{row.duration}</dd>
                      </div>
                      {row.checkoutNote ? (
                        <div className="col-span-2">
                          <dt className="text-muted-foreground">Note</dt>
                          <dd className="text-foreground">{row.checkoutNote}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Check In</th>
                    <th className="py-2 font-medium">Check Out</th>
                    <th className="py-2 font-medium">Duration</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.recentAttendance.map((row) => (
                    <tr key={`${row.date}-${row.checkIn}`}>
                      <td className="py-3 text-foreground">{row.date}</td>
                      <td className="py-3 text-foreground">{row.checkIn}</td>
                      <td className="py-3 text-foreground">{row.checkOut}</td>
                      <td className="py-3 text-foreground">{row.duration}</td>
                      <td className="py-3">
                        <div className="space-y-1">
                          <StatusPill variant={row.status === "Late" ? "warning" : "success"}>
                            {row.status}
                          </StatusPill>
                          {row.checkoutNote ? (
                            <p className="text-xs text-muted-foreground">{row.checkoutNote}</p>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </>
          )}
        </PanelCard>

        <PanelCard title="Achievements">
          <div className="space-y-3">
            {data.achievements.map((item) => (
              <AchievementCard
                key={item.id}
                icon={item.id as AchievementIcon}
                title={item.title}
                description={item.description}
                active={item.active}
              />
            ))}
          </div>
        </PanelCard>
      </section>
    </div>
  );
}
