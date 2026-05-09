import { AttendanceStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, requireContext } from "@/lib/server/api-utils";

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const body = await request.json().catch(() => null);
  const completedTasks = body?.completedTasks as string | undefined;
  const latitude = Number(body?.latitude);
  const longitude = Number(body?.longitude);

  if (Number.isNaN(latitude) || Number.isNaN(longitude) || !completedTasks?.trim()) {
    return badRequest("latitude, longitude, and completedTasks are required");
  }

  const activeSession = await prisma.attendanceRecord.findFirst({
    where: {
      userId: context.userId,
      organizationId: context.organizationId,
      status: AttendanceStatus.CHECKED_IN,
      checkedOutAt: null,
    },
  });

  if (!activeSession) {
    return NextResponse.json({ error: "No active check-in found" }, { status: 404 });
  }

  const checkedOutAt = new Date();
  const workedMinutes = Math.max(
    0,
    Math.floor((checkedOutAt.getTime() - activeSession.checkedInAt.getTime()) / (1000 * 60)),
  );

  const record = await prisma.attendanceRecord.update({
    where: { id: activeSession.id },
    data: {
      status: AttendanceStatus.CHECKED_OUT,
      checkedOutAt,
      checkOutLat: latitude,
      checkOutLng: longitude,
      workedMinutes,
      completedTasks: completedTasks.trim(),
    },
  });

  return NextResponse.json({ record });
}
