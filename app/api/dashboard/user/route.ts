import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/lib/server/api-utils";
import { withCache } from "@/lib/server/cache";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (!context) return error;

  const payload = await withCache(`dashboard:user:${context.userId}`, 15_000, async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [today, recent] = await Promise.all([
      prisma.attendanceRecord.findFirst({
        where: { userId: context.userId, checkedInAt: { gte: startOfDay } },
        orderBy: { checkedInAt: "desc" },
      }),
      prisma.attendanceRecord.findMany({
        where: { userId: context.userId },
        orderBy: { checkedInAt: "desc" },
        take: 7,
      }),
    ]);

    const totalWorkedMinutes = recent.reduce((acc, row) => acc + (row.workedMinutes ?? 0), 0);
    return { latest: today, totalWorkedMinutes, recent };
  });

  return NextResponse.json(payload);
}
