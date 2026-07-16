import { AttendanceStatus, VerificationLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { classifyCheckIn } from "@/lib/format/attendance-timing";
import { prisma } from "@/lib/prisma";
import { getAttendanceSettings } from "@/lib/server/attendance-settings";
import { badRequest, requireContext } from "@/lib/server/api-utils";
import { haversineDistanceMeters } from "@/lib/server/geofence";

function toFloat(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (!context) return error;

  const body = await request.json().catch(() => null);
  const siteId = (body?.siteId as string | undefined)?.trim();
  const plannedTasks = (body?.plannedTasks as string | undefined)?.trim();
  const latitude = toFloat(body?.latitude);
  const longitude = toFloat(body?.longitude);

  if (!plannedTasks) {
    return badRequest("plannedTasks is required");
  }
  if (latitude === null || longitude === null) {
    return badRequest("latitude and longitude are required");
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

  const site = siteId
    ? await prisma.site.findFirst({ where: { id: siteId, isActive: true } })
    : await prisma.site.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" } });

  const workHours = await getAttendanceSettings();
  const checkedInAt = new Date();
  const checkInTiming = classifyCheckIn(checkedInAt, workHours);

  let insideFence = false;
  let distanceM = 0;
  let allowedRadiusM: number | null = null;

  if (site) {
    distanceM = haversineDistanceMeters(latitude, longitude, site.latitude, site.longitude);
    allowedRadiusM = site.allowedRadiusM;
    insideFence = distanceM <= site.allowedRadiusM;
  }

  const record = await prisma.attendanceRecord.create({
    data: {
      userId: context.userId,
      siteId: site?.id,
      status: AttendanceStatus.CHECKED_IN,
      checkedInAt,
      checkInLat: latitude,
      checkInLng: longitude,
      checkInTiming,
      verificationLevel: insideFence ? VerificationLevel.VERIFIED : VerificationLevel.REVIEW,
      confidenceScore: insideFence ? 95 : 45,
      plannedTasks,
    },
  });

  return NextResponse.json(
    {
      record,
      timing: { checkIn: checkInTiming },
      geofence: site
        ? {
            insideFence,
            distanceM: Math.round(distanceM),
            allowedRadiusM,
          }
        : null,
    },
    { status: 201 },
  );
}
