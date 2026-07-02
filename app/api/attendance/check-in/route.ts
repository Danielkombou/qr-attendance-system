import { AttendanceStatus, VerificationLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, requireContext } from "@/lib/server/api-utils";
import { getClientIp } from "@/lib/server/client-ip";
import { verifyOfficeNetwork } from "@/lib/server/network-gate";

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const body = await request.json().catch(() => null);
  const siteId = (body?.siteId as string | undefined)?.trim();
  const plannedTasks = (body?.plannedTasks as string | undefined)?.trim();

  if (!plannedTasks) {
    return badRequest("plannedTasks is required");
  }

  const network = verifyOfficeNetwork(getClientIp(request));
  if (!network.allowed) {
    return NextResponse.json({ error: network.reason, clientIp: network.clientIp }, { status: 403 });
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

  if (!site) {
    return NextResponse.json({ error: "No active office site configured" }, { status: 404 });
  }

  const record = await prisma.attendanceRecord.create({
    data: {
      userId: context.userId,
      siteId: site.id,
      status: AttendanceStatus.CHECKED_IN,
      checkedInAt: new Date(),
      verificationLevel: VerificationLevel.VERIFIED,
      confidenceScore: 95,
      plannedTasks,
    },
  });

  return NextResponse.json(
    {
      record,
      network: {
        verified: true,
        clientIp: network.clientIp,
        siteName: site.name,
      },
    },
    { status: 201 },
  );
}
