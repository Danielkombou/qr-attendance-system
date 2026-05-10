import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRequestContext, isAdmin } from "@/lib/server/request-context";

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

export function requireAdminRole(role: Role) {
  return isAdmin(role) ? null : forbidden("Admin role required");
}
