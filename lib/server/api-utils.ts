import { MembershipRole } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRequestContext, hasAdminAccess } from "@/lib/server/request-context";

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
  if (!context.userId || !context.organizationId) {
    return { error: unauthorized("Missing user/org context"), context: null };
  }
  return { error: null, context };
}

export function requireAdminRole(role: MembershipRole) {
  if (!hasAdminAccess(role)) {
    return forbidden("Admin role required");
  }
  return null;
}
