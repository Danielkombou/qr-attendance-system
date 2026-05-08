import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JoinRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdminRole, requireContext } from "@/lib/server/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const { orgId } = await params;
  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const requests = await prisma.organizationJoinRequest.findMany({
    where: { organizationId: orgId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const { orgId } = await params;
  const body = await request.json().catch(() => null);
  if (typeof body?.message !== "string" || body.message.trim().length === 0) {
    return badRequest("message is required");
  }

  const joinRequest = await prisma.organizationJoinRequest.create({
    data: {
      organizationId: orgId,
      userId: context.userId,
      message: body.message ?? "",
      status: JoinRequestStatus.PENDING,
    },
  });

  return NextResponse.json({ joinRequest }, { status: 201 });
}
