import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/lib/server/api-utils";

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const sites = await prisma.site.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, allowedRadiusM: true },
  });

  return NextResponse.json({ sites });
}
