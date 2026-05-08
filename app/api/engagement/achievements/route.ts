import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/lib/server/api-utils";

function computeStreak(days: string[]): number {
  const unique = Array.from(new Set(days)).sort().reverse();
  if (unique.length === 0) return 0;

  let streak = 0;
  const current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const day of unique) {
    const candidate = new Date(day);
    candidate.setHours(0, 0, 0, 0);
    const diff = Math.floor((current.getTime() - candidate.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === streak) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const recent = await prisma.attendanceRecord.findMany({
    where: {
      userId: context.userId,
      organizationId: context.organizationId,
    },
    orderBy: { checkedInAt: "desc" },
    take: 45,
  });

  const attendanceDays = recent.map((record) => record.checkedInAt.toISOString().slice(0, 10));
  const streak = computeStreak(attendanceDays);
  const totalDays = new Set(attendanceDays).size;

  const achievements = [
    {
      id: "perfect-week",
      title: "Perfect Week",
      unlocked: streak >= 5,
      description: "Checked in for five consecutive days.",
    },
    {
      id: "hundred-days",
      title: "100 Days",
      unlocked: totalDays >= 100,
      description: "Completed 100 attendance days.",
    },
    {
      id: "consistency-king",
      title: "Consistency King",
      unlocked: streak >= 30,
      description: "Maintained a 30-day streak.",
    },
  ];

  return NextResponse.json({
    streak,
    totalDays,
    achievements,
  });
}
