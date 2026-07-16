import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminContext } from "@/lib/server/api-utils";

export async function GET(request: NextRequest) {
  const { error, context } = await requireAdminContext(request);
  if (error || !context) return error;

  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (!q) {
    return NextResponse.json({ users: [] });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 20,
    orderBy: { email: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ users });
}
