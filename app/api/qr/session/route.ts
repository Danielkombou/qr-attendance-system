import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminContext } from "@/lib/server/api-utils";
import { createQRToken } from "@/lib/server/qr-token";

export async function POST(request: NextRequest) {
  const { error, context } = await requireAdminContext(request);
  if (!context) return error;

  const body = await request.json().catch(() => null);
  const ttlSeconds = Math.max(15, Math.min(300, Number(body?.ttlSeconds ?? 45)));

  const { token, tokenHash, nonce, issuedAt, expiresAt } = createQRToken(ttlSeconds);

  await prisma.dynamicQRSession.create({
    data: {
      createdById: context.userId,
      tokenHash,
      nonce,
      issuedAt: new Date(issuedAt),
      expiresAt: new Date(expiresAt),
    },
  });

  return NextResponse.json({ token, expiresAt });
}
