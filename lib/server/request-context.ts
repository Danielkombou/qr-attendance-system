import { MembershipRole } from "@prisma/client";
import type { NextRequest } from "next/server";

export type RequestContext = {
  userId: string;
  organizationId: string;
  role: MembershipRole;
};

export function getRequestContext(request: NextRequest): RequestContext {
  const userId =
    request.headers.get("x-user-id") ??
    request.cookies.get("attendx_user_id")?.value ??
    "";
  const organizationId =
    request.headers.get("x-org-id") ??
    request.cookies.get("attendx_org_id")?.value ??
    "";
  const roleValue =
    request.headers.get("x-role") ??
    request.cookies.get("attendx_role")?.value ??
    MembershipRole.EMPLOYEE;

  const role = Object.values(MembershipRole).includes(roleValue as MembershipRole)
    ? (roleValue as MembershipRole)
    : MembershipRole.EMPLOYEE;

  return { userId, organizationId, role };
}

export function hasAdminAccess(role: MembershipRole): boolean {
  return role === MembershipRole.ADMIN || role === MembershipRole.OWNER;
}
