import { AttendanceStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminContext } from "@/lib/server/api-utils";
import { withCache } from "@/lib/server/cache";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error, context } = await requireAdminContext(request);
  if (error || !context) return error;

  const payload = await withCache("dashboard:admin", 15_000, async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalUsers, activeNow, todayCheckIns] = await Promise.all([
      prisma.user.count(),
      prisma.attendanceRecord.count({
        where: { status: AttendanceStatus.CHECKED_IN, checkedOutAt: null },
      }),
      prisma.attendanceRecord.count({
        where: { checkedInAt: { gte: startOfDay } },
      }),
    ]);

    return { metrics: { totalUsers, activeNow, todayCheckIns } };
  });

  return NextResponse.json(payload);
}
