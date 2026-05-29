import { Role } from "@/lib/roles";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdminRole, requireContext } from "@/lib/server/api-utils";

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

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
