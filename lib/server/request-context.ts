import { Role } from "@prisma/client";
import type { NextRequest } from "next/server";

export type RequestContext = {
  userId: string;
  role: Role;
};

export function getRequestContext(request: NextRequest): RequestContext {
  const userId =
    request.headers.get("x-user-id") ??
    request.cookies.get("attendx_user_id")?.value ??
    "";
  const roleValue =
    request.headers.get("x-role") ??
    request.cookies.get("attendx_role")?.value ??
    Role.USER;

  const role = roleValue === Role.ADMIN ? Role.ADMIN : Role.USER;
  return { userId, role };
}

export function isAdmin(role: Role): boolean {
  return role === Role.ADMIN;
}
