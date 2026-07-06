import type { CheckInTiming } from "@prisma/client";
import { classifyCheckIn, isOnTimeCheckIn, type WorkHours } from "@/lib/format/attendance-timing";
import { dayKey, startOfDay } from "@/lib/format/display";
import { prisma } from "@/lib/prisma";

const CHART_COLORS = [
  "var(--chart-dept-1)",
  "var(--chart-dept-2)",
  "var(--chart-dept-3)",
  "var(--chart-dept-4)",
];

function isOnTime(timing: CheckInTiming | null, checkedInAt: Date, workHours: WorkHours) {
  if (timing) return timing === "ON_TIME" || timing === "EARLY";
  return isOnTimeCheckIn(checkedInAt, workHours);
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function buildReportsAnalytics(workHours: WorkHours) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = new Date(todayStart);
  const day = weekStart.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + diff);

  const monthStarts = [0, 1, 2, 3].map((i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { start: d, label: d.toLocaleDateString("en-US", { month: "short" }) };
  }).reverse();

  const rangeStart = monthStarts[0]!.start;
  const totalUsers = await prisma.user.count();

  const records = await prisma.attendanceRecord.findMany({
    where: { checkedInAt: { gte: rangeStart } },
    select: {
      userId: true,
      checkedInAt: true,
      workedMinutes: true,
      checkInTiming: true,
      user: { select: { name: true, role: true } },
    },
  });

  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = monthStarts[monthStarts.length - 1]!.start;
  const thisMonthStart = monthStarts[monthStarts.length - 1]!.start;

  const thisMonth = records.filter((r) => r.checkedInAt >= thisMonthStart);
  const prevMonth = records.filter(
    (r) => r.checkedInAt >= prevMonthStart && r.checkedInAt < thisMonthStart,
  );

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const weeklyBars = weekDays.map((d) => {
    const key = dayKey(d);
    const dayRecords = records.filter((r) => dayKey(r.checkedInAt) === key);
    const userIds = new Set(dayRecords.map((r) => r.userId));
    const late = dayRecords.filter(
      (r) => (r.checkInTiming ?? classifyCheckIn(r.checkedInAt, workHours)) === "LATE",
    ).length;
    const present = userIds.size;
    const absent = Math.max(0, totalUsers - present);
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      present,
      late,
      absent,
    };
  });

  const roleCounts = { USER: 0, ADMIN: 0 };
  for (const r of records.filter((rec) => rec.checkedInAt >= todayStart)) {
    roleCounts[r.user.role] += 1;
  }
  const byRole = (["USER", "ADMIN"] as const)
    .map((role, i) => ({
      name: role,
      count: roleCounts[role],
      color: CHART_COLORS[i] ?? CHART_COLORS[0]!,
    }))
    .filter((r) => r.count > 0);

  const monthlyTrend = monthStarts.map(({ start, label }) => {
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const monthRecords = records.filter((r) => r.checkedInAt >= start && r.checkedInAt < end);
    const completed = monthRecords.filter((r) => r.workedMinutes != null);
    const avgHours =
      completed.length > 0
        ? completed.reduce((s, r) => s + (r.workedMinutes ?? 0), 0) / completed.length / 60
        : 0;
    const onTimeCount = monthRecords.filter((r) =>
      isOnTime(r.checkInTiming, r.checkedInAt, workHours),
    ).length;
    const onTime = monthRecords.length > 0 ? (onTimeCount / monthRecords.length) * 100 : 0;
    return {
      month: label,
      hours: Math.round(Math.min(100, (avgHours / 10) * 100)),
      onTime: Math.round(onTime),
    };
  });

  const userStats = new Map<
    string,
    { name: string; role: string; total: number; onTime: number; minutes: number }
  >();
  for (const r of thisMonth) {
    const cur = userStats.get(r.userId) ?? {
      name: r.user.name,
      role: r.user.role,
      total: 0,
      onTime: 0,
      minutes: 0,
    };
    cur.total += 1;
    if (isOnTime(r.checkInTiming, r.checkedInAt, workHours)) cur.onTime += 1;
    cur.minutes += r.workedMinutes ?? 0;
    userStats.set(r.userId, cur);
  }

  const topPerformers = [...userStats.values()]
    .map((u) => ({
      name: u.name,
      role: u.role,
      rate: u.total > 0 ? `${Math.round((u.onTime / u.total) * 100)}%` : "—",
      hours: u.total > 0 ? `${(u.minutes / u.total / 60).toFixed(1)}h avg` : "—",
      score: u.total > 0 ? u.onTime / u.total : 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((p, i) => ({ rank: i + 1, name: p.name, role: p.role, rate: p.rate, hours: p.hours }));

  const workdaysThisMonth = new Set(thisMonth.map((r) => dayKey(r.checkedInAt))).size;
  const attendanceRate =
    totalUsers > 0 && workdaysThisMonth > 0
      ? Math.round((thisMonth.length / (totalUsers * workdaysThisMonth)) * 100)
      : 0;

  const completedThis = thisMonth.filter((r) => r.workedMinutes != null);
  const avgHoursThis =
    completedThis.length > 0
      ? completedThis.reduce((s, r) => s + (r.workedMinutes ?? 0), 0) / completedThis.length / 60
      : 0;

  const onTimeThis = thisMonth.filter((r) => isOnTime(r.checkInTiming, r.checkedInAt, workHours)).length;
  const onTimeRate = thisMonth.length > 0 ? Math.round((onTimeThis / thisMonth.length) * 100) : 0;
  const lateArrivals = thisMonth.filter(
    (r) => (r.checkInTiming ?? classifyCheckIn(r.checkedInAt, workHours)) === "LATE",
  ).length;

  const prevOnTime = prevMonth.filter((r) => isOnTime(r.checkInTiming, r.checkedInAt, workHours)).length;
  const prevOnTimeRate = prevMonth.length > 0 ? Math.round((prevOnTime / prevMonth.length) * 100) : 0;
  const prevLate = prevMonth.filter(
    (r) => (r.checkInTiming ?? classifyCheckIn(r.checkedInAt, workHours)) === "LATE",
  ).length;
  const prevCompleted = prevMonth.filter((r) => r.workedMinutes != null);
  const prevAvgHours =
    prevCompleted.length > 0
      ? prevCompleted.reduce((s, r) => s + (r.workedMinutes ?? 0), 0) / prevCompleted.length / 60
      : 0;

  const prevDays = new Set(prevMonth.map((r) => dayKey(r.checkedInAt))).size;
  const prevAttendanceRate =
    totalUsers > 0 && prevDays > 0
      ? Math.round((prevMonth.length / (totalUsers * prevDays)) * 100)
      : 0;

  return {
    kpis: {
      avgAttendance: `${attendanceRate}%`,
      avgAttendanceTrend: `${attendanceRate - prevAttendanceRate >= 0 ? "+" : ""}${attendanceRate - prevAttendanceRate}% from last month`,
      avgHoursPerDay: `${avgHoursThis.toFixed(1)}h`,
      avgHoursTrend: `${avgHoursThis - prevAvgHours >= 0 ? "+" : ""}${(avgHoursThis - prevAvgHours).toFixed(1)}h from last month`,
      onTimeRate: `${onTimeRate}%`,
      onTimeTrend: `${onTimeRate - prevOnTimeRate >= 0 ? "+" : ""}${onTimeRate - prevOnTimeRate}% from last month`,
      lateArrivals: String(lateArrivals),
      lateTrend: `${lateArrivals - prevLate <= 0 ? "" : "+"}${lateArrivals - prevLate} from last month`,
    },
    weeklyBars,
    byRole,
    monthlyTrend,
    topPerformers,
  };
}
