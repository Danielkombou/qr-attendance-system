import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, requireContext } from "@/lib/server/api-utils";
import { hashToken, verifyQRToken } from "@/lib/server/qr-token";

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const body = await request.json().catch(() => null);
  const token = body?.token as string | undefined;

  if (!token) return badRequest("token is required");

  const payload = verifyQRToken(token);
  if (!payload) {
    return NextResponse.json({ valid: false, reason: "invalid_or_expired" }, { status: 400 });
  }

  if (payload.organizationId !== context.organizationId) {
    return NextResponse.json({ valid: false, reason: "organization_mismatch" }, { status: 403 });
  }

  const tokenHash = hashToken(token);
  const session = await prisma.dynamicQRSession.findUnique({ where: { tokenHash } });

  if (!session) {
    return NextResponse.json({ valid: false, reason: "session_not_found" }, { status: 404 });
  }

  if (session.usedAt) {
    return NextResponse.json({ valid: false, reason: "already_used" }, { status: 409 });
  }

  await prisma.dynamicQRSession.update({
    where: { id: session.id },
    data: { usedAt: new Date() },
  });

  return NextResponse.json({
    valid: true,
    siteId: payload.siteId,
    organizationId: payload.organizationId,
    expiresAt: payload.expiresAt,
  });
}
