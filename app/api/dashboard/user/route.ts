import { VerificationLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/lib/server/api-utils";
import { withCache } from "@/lib/server/cache";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const payload = await withCache(
    `dashboard:user:${context.organizationId}:${context.userId}`,
    15_000,
    async () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const [today, recent] = await Promise.all([
        prisma.attendanceRecord.findMany({
          where: {
            organizationId: context.organizationId,
            userId: context.userId,
            checkedInAt: { gte: startOfDay },
          },
          orderBy: { checkedInAt: "desc" },
          take: 1,
        }),
        prisma.attendanceRecord.findMany({
          where: {
            organizationId: context.organizationId,
            userId: context.userId,
          },
          orderBy: { checkedInAt: "desc" },
          take: 7,
        }),
      ]);

      const latest = today[0] ?? null;
      const totalWorkedMinutes = recent.reduce((acc, row) => acc + (row.workedMinutes ?? 0), 0);
      const onTimeRate =
        recent.length === 0
          ? 0
          : Math.round(
              (recent.filter((row) => row.verificationLevel !== VerificationLevel.REVIEW).length /
                recent.length) *
                100,
            );

      return { latest, totalWorkedMinutes, onTimeRate, recent };
    },
  );

  return NextResponse.json(payload);
}
