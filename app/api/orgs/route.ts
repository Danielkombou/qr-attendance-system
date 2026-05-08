import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MembershipRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { badRequest, requireContext } from "@/lib/server/api-utils";

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const organizations = await prisma.organizationMembership.findMany({
    where: { userId: context.userId, isActive: true },
    include: { organization: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    organizations: organizations.map((item) => ({
      id: item.organization.id,
      name: item.organization.name,
      role: item.role,
      timezone: item.organization.timezone,
    })),
  });
}

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const body = await request.json().catch(() => null);
  if (!body?.name) {
    return badRequest("Organization name is required");
  }

  const organization = await prisma.organization.create({
    data: {
      name: body.name,
      slug: `${slugify(body.name)}-${Math.floor(Math.random() * 99999)}`,
      timezone: body.timezone ?? "UTC",
      memberships: {
        create: {
          userId: context.userId,
          role: MembershipRole.OWNER,
        },
      },
    },
  });

  return NextResponse.json({ organization }, { status: 201 });
}
