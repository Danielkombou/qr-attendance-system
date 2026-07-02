import { AttendanceStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { classifyCheckOut } from "@/lib/format/attendance-timing";
import { prisma } from "@/lib/prisma";
import { getAttendanceSettings } from "@/lib/server/attendance-settings";
import { badRequest, requireContext } from "@/lib/server/api-utils";

function toFloat(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const body = await request.json().catch(() => null);
  const completedTasks = (body?.completedTasks as string | undefined)?.trim();
  const latitude = toFloat(body?.latitude);
  const longitude = toFloat(body?.longitude);

  if (!completedTasks) {
    return badRequest("completedTasks is required");
  }
  if (latitude === null || longitude === null) {
    return badRequest("latitude and longitude are required");
  }

  const open = await prisma.attendanceRecord.findFirst({
    where: { userId: context.userId, status: AttendanceStatus.CHECKED_IN, checkedOutAt: null },
  });

  if (!open) {
    return NextResponse.json({ error: "No active check-in found" }, { status: 404 });
  }

  const workHours = await getAttendanceSettings();
  const checkedOutAt = new Date();
  const checkOutTiming = classifyCheckOut(checkedOutAt, workHours);
  const workedMinutes = Math.max(
    0,
    Math.floor((checkedOutAt.getTime() - open.checkedInAt.getTime()) / (1000 * 60)),
  );

  const record = await prisma.attendanceRecord.update({
    where: { id: open.id },
    data: {
      status: AttendanceStatus.CHECKED_OUT,
      checkedOutAt,
      workedMinutes,
      checkOutLat: latitude,
      checkOutLng: longitude,
      checkOutTiming,
      completedTasks,
    },
  });

  return NextResponse.json({
    record,
    timing: { checkOut: checkOutTiming },
  });
}
