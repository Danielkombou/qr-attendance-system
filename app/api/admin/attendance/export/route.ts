import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { formatCheckInTimingLabel } from "@/lib/format/attendance-timing";
import { formatClockTime, formatDurationMinutes, startOfDay } from "@/lib/format/display";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdminContext } from "@/lib/server/api-utils";

export const runtime = "nodejs";

function escapeCsv(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function parseExportDate(raw: string | null): Date | null {
  if (!raw) return startOfDay();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return startOfDay(date);
}

function toDateParam(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const dayStart = parseExportDate(request.nextUrl.searchParams.get("date"));
  if (!dayStart) {
    return badRequest("date must be YYYY-MM-DD");
  }

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      name: true,
      email: true,
      attendance: {
        where: {
          checkedInAt: { gte: dayStart, lt: dayEnd },
        },
        orderBy: { checkedInAt: "asc" },
        take: 1,
        select: {
          checkedInAt: true,
          checkedOutAt: true,
          plannedTasks: true,
          completedTasks: true,
          workedMinutes: true,
          checkInTiming: true,
          checkOutTiming: true,
        },
      },
    },
  });

  const headers = [
    "Name",
    "Email",
    "Check In",
    "Check Out",
    "Planned Tasks",
    "Completed Tasks",
    "Worked Minutes",
    "Check In Timing",
    "Check Out Timing",
  ];

  const rows = users.map((user) => {
    const record = user.attendance[0];
    const cells = [
      user.name,
      user.email,
      record ? formatClockTime(record.checkedInAt) : "",
      record?.checkedOutAt ? formatClockTime(record.checkedOutAt) : "",
      record?.plannedTasks ?? "",
      record?.completedTasks ?? "",
      record?.workedMinutes != null
        ? `${record.workedMinutes} (${formatDurationMinutes(record.workedMinutes)})`
        : "",
      record?.checkInTiming ? formatCheckInTimingLabel(record.checkInTiming) : "",
      record?.checkOutTiming === "AFTER_HOURS"
        ? "After Hours"
        : record?.checkOutTiming
          ? "On Time"
          : "",
    ];
    return cells.map(escapeCsv).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const filename = `attendance-${toDateParam(dayStart)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
