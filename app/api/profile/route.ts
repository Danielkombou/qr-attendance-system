import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  classifyCheckIn,
  formatCheckInTimingLabel,
  formatCheckOutTimingNote,
} from "@/lib/format/attendance-timing";
import {
  computeAttendanceStreak,
  computeOnTimeStreak,
  dayKey,
  employeeId,
  formatClockTime,
  formatDurationMinutes,
  formatShortDate,
  initialsFromName,
  isOnTimeCheckIn,
} from "@/lib/format/display";
import { prisma } from "@/lib/prisma";
import { getAttendanceSettings } from "@/lib/server/attendance-settings";
import { requireContext } from "@/lib/server/api-utils";
import { applyAttendxSessionCookies } from "@/lib/server/session-cookies";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const workHours = await getAttendanceSettings();

  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const records = await prisma.attendanceRecord.findMany({
    where: { userId: context.userId },
    orderBy: { checkedInAt: "desc" },
    take: 50,
    select: {
      checkedInAt: true,
      checkedOutAt: true,
      workedMinutes: true,
      checkInTiming: true,
      checkOutTiming: true,
    },
  });

  const dayKeys = new Set(records.map((r) => dayKey(r.checkedInAt)));
  const totalDays = dayKeys.size;

  const completed = records.filter((r) => r.workedMinutes != null);
  const totalWorkedMinutes = completed.reduce((sum, r) => sum + (r.workedMinutes ?? 0), 0);
  const avgHoursPerDay =
    completed.length > 0 ? (totalWorkedMinutes / completed.length / 60).toFixed(1) : "0.0";

  const onTimeCount = records.filter((r) =>
    r.checkInTiming
      ? r.checkInTiming === "ON_TIME" || r.checkInTiming === "EARLY"
      : isOnTimeCheckIn(r.checkedInAt, workHours),
  ).length;
  const onTimeRate = records.length > 0 ? Math.round((onTimeCount / records.length) * 100) : 0;
  const streak = computeAttendanceStreak(dayKeys);
  const onTimeStreak = computeOnTimeStreak(records, (date) => isOnTimeCheckIn(date, workHours));
  const earlyBirdDays = records.filter((r) =>
    r.checkInTiming ? r.checkInTiming === "EARLY" : classifyCheckIn(r.checkedInAt, workHours) === "EARLY",
  ).length;

  const recentAttendance = records.slice(0, 7).map((record) => {
    const timing =
      record.checkInTiming ?? classifyCheckIn(record.checkedInAt, workHours);
    const checkoutNote = record.checkOutTiming
      ? formatCheckOutTimingNote(record.checkOutTiming)
      : null;

    return {
      date: formatShortDate(record.checkedInAt),
      checkIn: formatClockTime(record.checkedInAt),
      checkOut: record.checkedOutAt ? formatClockTime(record.checkedOutAt) : "—",
      duration:
        record.workedMinutes != null
          ? formatDurationMinutes(record.workedMinutes)
          : record.checkedOutAt
            ? formatDurationMinutes(
                Math.floor(
                  (record.checkedOutAt.getTime() - record.checkedInAt.getTime()) / 60_000,
                ),
              )
            : "—",
      status: formatCheckInTimingLabel(timing),
      checkoutNote,
    };
  });

  const achievements = [
    {
      id: "perfect-week" as const,
      title: "Perfect Week",
      description: "On time every day this week",
      active: streak >= 5 && onTimeRate >= 90,
    },
    {
      id: "hundred-days" as const,
      title: "100 Days",
      description: "Completed 100 days of attendance",
      active: totalDays >= 100,
    },
    {
      id: "early-bird" as const,
      title: "Early Bird",
      description: "Check in before start time for 5 days",
      active: earlyBirdDays >= 5,
    },
    {
      id: "consistency-king" as const,
      title: "Consistency King",
      description: "30-day streak of on-time arrivals",
      active: onTimeStreak >= 30,
    },
  ];

  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      initials: initialsFromName(user.name),
      employeeId: employeeId(user.id, user.createdAt),
    },
    stats: {
      totalDays,
      avgHoursPerDay: `${avgHoursPerDay}h`,
      onTimeRate: `${onTimeRate}%`,
      currentStreak: `${streak} day${streak === 1 ? "" : "s"}`,
    },
    recentAttendance,
    achievements,
  });

  // Heal stale attendx_role cookies after promote/demote without requiring a full re-login.
  if (context.role !== user.role) {
    applyAttendxSessionCookies(response, { userId: user.id, role: user.role });
  }

  return response;
}
