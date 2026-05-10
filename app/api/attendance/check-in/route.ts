import { AttendanceStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, requireContext } from "@/lib/server/api-utils";

function toFloat(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const body = await request.json().catch(() => null);
  const plannedTasks = (body?.plannedTasks as string | undefined)?.trim();
  if (!plannedTasks) {
    return badRequest("plannedTasks is required");
  }

  const open = await prisma.attendanceRecord.findFirst({
    where: { userId: context.userId, status: AttendanceStatus.CHECKED_IN, checkedOutAt: null },
  });

  if (open) {
    return NextResponse.json(
      { error: "You already have an active check-in", activeRecord: open },
      { status: 409 },
    );
  }

  const record = await prisma.attendanceRecord.create({
    data: {
      userId: context.userId,
      status: AttendanceStatus.CHECKED_IN,
      checkedInAt: new Date(),
      checkInLat: toFloat(body?.latitude),
      checkInLng: toFloat(body?.longitude),
      plannedTasks,
    },
  });

  return NextResponse.json({ record }, { status: 201 });
}
