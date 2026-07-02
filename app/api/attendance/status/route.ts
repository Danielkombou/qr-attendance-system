import { AttendanceStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { formatClockTime } from "@/lib/format/display";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/lib/server/api-utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const open = await prisma.attendanceRecord.findFirst({
    where: {
      userId: context.userId,
      status: AttendanceStatus.CHECKED_IN,
      checkedOutAt: null,
    },
    orderBy: { checkedInAt: "desc" },
    select: {
      id: true,
      checkedInAt: true,
      plannedTasks: true,
      site: { select: { name: true } },
    },
  });

  return NextResponse.json({
    checkedIn: Boolean(open),
    record: open
      ? {
          id: open.id,
          checkedInAt: open.checkedInAt.toISOString(),
          checkInTime: formatClockTime(open.checkedInAt),
          plannedTasks: open.plannedTasks,
          siteName: open.site?.name ?? "Office",
        }
      : null,
  });
}
