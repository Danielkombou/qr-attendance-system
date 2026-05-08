import { AttendanceStatus, JoinRequestStatus, VerificationLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole, requireContext } from "@/lib/server/api-utils";
import { withCache } from "@/lib/server/cache";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const payload = await withCache(`dashboard:admin:${context.organizationId}`, 15_000, async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalUsers, activeUsers, todayCheckIns, lateCount, recentJoinRequests] =
      await Promise.all([
        prisma.organizationMembership.count({
          where: { organizationId: context.organizationId, isActive: true },
        }),
        prisma.attendanceRecord.count({
          where: {
            organizationId: context.organizationId,
            status: AttendanceStatus.CHECKED_IN,
            checkedOutAt: null,
          },
        }),
        prisma.attendanceRecord.count({
          where: {
            organizationId: context.organizationId,
            checkedInAt: { gte: startOfDay },
          },
        }),
        prisma.attendanceRecord.count({
          where: {
            organizationId: context.organizationId,
            verificationLevel: VerificationLevel.REVIEW,
            checkedInAt: { gte: startOfDay },
          },
        }),
        prisma.organizationJoinRequest.findMany({
          where: { organizationId: context.organizationId, status: JoinRequestStatus.PENDING },
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

    return {
      metrics: {
        totalUsers,
        activeUsers,
        todayCheckIns,
        flaggedForReview: lateCount,
      },
      recentJoinRequests,
    };
  });

  return NextResponse.json(payload);
}
