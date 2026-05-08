import type { MembershipRole } from "@prisma/client";
import { NextResponse } from "next/server";

type SessionCookieInput = {
  userId: string;
  organizationId: string;
  role: MembershipRole;
};

export function applyAttendxSessionCookies(
  response: NextResponse,
  input: SessionCookieInput,
) {
  const baseOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  response.cookies.set("attendx_user_id", input.userId, baseOptions);
  response.cookies.set("attendx_org_id", input.organizationId, baseOptions);
  response.cookies.set("attendx_role", input.role, baseOptions);
}

export function clearAttendxSessionCookies(response: NextResponse) {
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
  response.cookies.set("attendx_user_id", "", options);
  response.cookies.set("attendx_org_id", "", options);
  response.cookies.set("attendx_role", "", options);
}
