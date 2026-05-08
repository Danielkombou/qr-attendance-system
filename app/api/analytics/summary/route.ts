import { AttendanceStatus, VerificationLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole, requireContext } from "@/lib/server/api-utils";
import { withCache } from "@/lib/server/cache";

export const runtime = "nodejs";

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const payload = await withCache(`analytics:summary:${context.organizationId}`, 30_000, async () => {
    const now = new Date();
    const last7 = new Date(now);
    last7.setDate(now.getDate() - 6);

    const records = await prisma.attendanceRecord.findMany({
      where: {
        organizationId: context.organizationId,
        checkedInAt: { gte: last7 },
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    const byDayMap = new Map<string, { present: number; review: number; rejected: number }>();
    const byUserMap = new Map<string, { name: string; totalMinutes: number; verifiedCount: number }>();

    for (const record of records) {
      const key = getDateKey(record.checkedInAt);
      const existingDay = byDayMap.get(key) ?? { present: 0, review: 0, rejected: 0 };
      existingDay.present += 1;
      if (record.verificationLevel === VerificationLevel.REVIEW) existingDay.review += 1;
      if (record.verificationLevel === VerificationLevel.REJECTED) existingDay.rejected += 1;
      byDayMap.set(key, existingDay);

      const existingUser = byUserMap.get(record.userId) ?? {
        name: record.user.name,
        totalMinutes: 0,
        verifiedCount: 0,
      };
      existingUser.totalMinutes += record.workedMinutes ?? 0;
      if (record.status === AttendanceStatus.CHECKED_OUT) {
        existingUser.verifiedCount += 1;
      }
      byUserMap.set(record.userId, existingUser);
    }

    const byDay = Array.from(byDayMap.entries()).map(([date, stats]) => ({ date, ...stats }));
    const topPerformers = Array.from(byUserMap.entries())
      .map(([userId, value]) => ({
        userId,
        name: value.name,
        avgHours: Number((value.totalMinutes / 60 / Math.max(1, value.verifiedCount)).toFixed(1)),
        sessions: value.verifiedCount,
      }))
      .sort((a, b) => b.avgHours - a.avgHours)
      .slice(0, 5);

    return { byDay, topPerformers };
  });

  return NextResponse.json(payload);
}
