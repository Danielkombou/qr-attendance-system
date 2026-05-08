import { AttendanceStatus, VerificationLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, requireContext } from "@/lib/server/api-utils";
import { haversineDistanceMeters } from "@/lib/server/geofence";

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const body = await request.json().catch(() => null);
  const siteId = body?.siteId as string | undefined;
  const latitude = Number(body?.latitude);
  const longitude = Number(body?.longitude);

  if (!siteId || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return badRequest("siteId, latitude, and longitude are required");
  }

  const activeSession = await prisma.attendanceRecord.findFirst({
    where: {
      userId: context.userId,
      organizationId: context.organizationId,
      status: AttendanceStatus.CHECKED_IN,
      checkedOutAt: null,
    },
  });

  if (activeSession) {
    return NextResponse.json(
      { error: "User already has an active check-in", activeSession },
      { status: 409 },
    );
  }

  const site = await prisma.site.findFirst({
    where: { id: siteId, organizationId: context.organizationId, isActive: true },
  });

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const distanceM = haversineDistanceMeters(latitude, longitude, site.latitude, site.longitude);
  const insideFence = distanceM <= site.allowedRadiusM;

  const record = await prisma.attendanceRecord.create({
    data: {
      userId: context.userId,
      organizationId: context.organizationId,
      siteId,
      status: AttendanceStatus.CHECKED_IN,
      checkedInAt: new Date(),
      checkInLat: latitude,
      checkInLng: longitude,
      verificationLevel: insideFence ? VerificationLevel.VERIFIED : VerificationLevel.REVIEW,
      confidenceScore: insideFence ? 95 : 45,
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
