import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JoinRequestStatus, MembershipRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdminRole, requireContext } from "@/lib/server/api-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; requestId: string }> },
) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const { orgId, requestId } = await params;
  const body = await request.json().catch(() => null);

  const status = body?.status as JoinRequestStatus | undefined;
  if (!status || !Object.values(JoinRequestStatus).includes(status)) {
    return badRequest("Invalid join request status");
  }

  const requestRecord = await prisma.organizationJoinRequest.update({
    where: { id: requestId },
    data: {
      status,
      reviewedById: context.userId,
      reviewedAt: new Date(),
    },
  });

  if (status === JoinRequestStatus.APPROVED) {
    await prisma.organizationMembership.upsert({
      where: {
        userId_organizationId: {
          userId: requestRecord.userId,
          organizationId: orgId,
        },
      },
      update: { isActive: true },
      create: {
        userId: requestRecord.userId,
        organizationId: orgId,
        role: MembershipRole.EMPLOYEE,
      },
    });
  }

  return NextResponse.json({ request: requestRecord });
}
