import { Role, type Role as AppRole } from "@/lib/roles";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestContext, isAdmin, type RequestContext } from "@/lib/server/request-context";

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function badRequest(message = "Bad Request") {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function requireContext(request: NextRequest) {
  const context = getRequestContext(request);
  if (!context.userId) {
    return { error: unauthorized("Sign in required"), context: null };
  }
  return { error: null, context };
}

export function requireAdminRole(role: AppRole) {
  return isAdmin(role) ? null : forbidden("Admin role required");
}

/**
 * Auth + live DB role check (cookie can be stale after promote/demote).
 * Prefer this for admin APIs over cookie-only requireAdminRole.
 */
export async function requireAdminContext(request: NextRequest): Promise<{
  error: NextResponse | null;
  context: RequestContext | null;
}> {
  const { error, context } = requireContext(request);
  if (error || !context) return { error, context: null };

  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: { role: true },
  });

  if (!user || user.role !== Role.ADMIN) {
    return { error: forbidden("Admin role required"), context: null };
  }

  return {
    error: null,
    context: { userId: context.userId, role: Role.ADMIN },
  };
}
