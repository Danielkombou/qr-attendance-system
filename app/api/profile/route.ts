import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  dayKey,
  employeeId,
  formatClockTime,
  formatDurationMinutes,
  formatShortDate,
  initialsFromName,
  isOnTimeCheckIn,
  roleLabel,
  startOfDay,
} from "@/lib/format/display";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/lib/server/api-utils";

export const runtime = "nodejs";

function computeStreak(dayKeys: Set<string>): number {
  let streak = 0;
  const cursor = startOfDay();

  while (dayKeys.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
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
    },
  });

  const dayKeys = new Set(records.map((r) => dayKey(r.checkedInAt)));
  const totalDays = dayKeys.size;

  const completed = records.filter((r) => r.workedMinutes != null);
  const totalWorkedMinutes = completed.reduce((sum, r) => sum + (r.workedMinutes ?? 0), 0);
  const avgHoursPerDay =
    completed.length > 0 ? (totalWorkedMinutes / completed.length / 60).toFixed(1) : "0.0";

  const onTimeCount = records.filter((r) => isOnTimeCheckIn(r.checkedInAt)).length;
  const onTimeRate = records.length > 0 ? Math.round((onTimeCount / records.length) * 100) : 0;
  const streak = computeStreak(dayKeys);

  const recentAttendance = records.slice(0, 7).map((record) => ({
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
    status: isOnTimeCheckIn(record.checkedInAt) ? ("On Time" as const) : ("Late" as const),
  }));

  const achievements = [
    {
      title: "Perfect Week",
      description: "On time every day this week",
      active: streak >= 5 && onTimeRate >= 90,
    },
    {
      title: "100 Days",
      description: "Completed 100 days of attendance",
      active: totalDays >= 100,
    },
    {
      title: "Early Bird",
      description: "Check in before 8 AM for 5 days",
      active: records.filter((r) => r.checkedInAt.getHours() < 8).length >= 5,
    },
  ];

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleLabel(user.role),
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
}
