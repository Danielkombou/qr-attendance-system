import { AttendanceStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { formatAttendanceLocation, formatCheckInTimingLabel } from "@/lib/format/attendance-timing";
import {
  formatClockTime,
  formatDurationMinutes,
  initialsFromName,
  minutesSince,
  startOfDay,
} from "@/lib/format/display";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/lib/server/api-utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const dayStart = startOfDay();
  const now = new Date();

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      attendance: {
        where: { checkedInAt: { gte: dayStart } },
        orderBy: { checkedInAt: "desc" },
        take: 1,
        select: {
          status: true,
          checkedInAt: true,
          workedMinutes: true,
          checkInLat: true,
          checkInLng: true,
          checkInTiming: true,
          site: { select: { name: true } },
        },
      },
    },
  });

  const members = users.map((user) => {
    const record = user.attendance[0];
    const present = record?.status === AttendanceStatus.CHECKED_IN;

    let checkInTime: string | null = null;
    let duration: string | null = null;
    let location: string | null = null;
    let checkInNote: string | null = null;

    if (record && present) {
      checkInTime = formatClockTime(record.checkedInAt);
      duration = formatDurationMinutes(minutesSince(record.checkedInAt, now));
      location = formatAttendanceLocation({
        checkInLat: record.checkInLat,
        checkInLng: record.checkInLng,
        siteName: record.site?.name,
      });
      checkInNote = record.checkInTiming ? formatCheckInTimingLabel(record.checkInTiming) : null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      initials: initialsFromName(user.name),
      status: present ? ("Present" as const) : ("Absent" as const),
      online: present,
      checkInTime,
      duration,
      location,
      checkInNote,
    };
  });

  const present = members.filter((m) => m.status === "Present").length;

  return NextResponse.json({
    summary: {
      total: members.length,
      present,
      absent: members.length - present,
    },
    members,
  });
}
