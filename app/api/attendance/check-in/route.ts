import { AttendanceStatus, VerificationLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, requireContext } from "@/lib/server/api-utils";
import { haversineDistanceMeters } from "@/lib/server/geofence";

function toFloat(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const body = await request.json().catch(() => null);
  const siteId = (body?.siteId as string | undefined)?.trim();
  const plannedTasks = (body?.plannedTasks as string | undefined)?.trim();
  const latitude = toFloat(body?.latitude);
  const longitude = toFloat(body?.longitude);

  if (!siteId || !plannedTasks) {
    return badRequest("siteId, latitude, longitude, and plannedTasks are required");
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

  const site = await prisma.site.findFirst({ where: { id: siteId, isActive: true } });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const distanceM = haversineDistanceMeters(latitude, longitude, site.latitude, site.longitude);
  const insideFence = distanceM <= site.allowedRadiusM;

  const record = await prisma.attendanceRecord.create({
    data: {
      userId: context.userId,
      siteId,
      status: AttendanceStatus.CHECKED_IN,
      checkedInAt: new Date(),
      checkInLat: latitude,
      checkInLng: longitude,
      verificationLevel: insideFence ? VerificationLevel.VERIFIED : VerificationLevel.REVIEW,
      confidenceScore: insideFence ? 95 : 45,
      plannedTasks,
    },
  });

  return NextResponse.json(
    {
      record,
      geofence: {
        insideFence,
        distanceM: Math.round(distanceM),
        allowedRadiusM: site.allowedRadiusM,
      },
    },
    { status: 201 },
  );
}
