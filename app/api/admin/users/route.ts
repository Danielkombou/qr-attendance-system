import { AttendanceStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { initialsFromName, startOfDay } from "@/lib/format/display";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/roles";
import { badRequest, requireAdminRole, requireContext } from "@/lib/server/api-utils";
import { authErrorResponse } from "@/lib/server/auth-errors";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function parsePositiveInt(value: string | null, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.floor(n);
}

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  const statusFilter = (request.nextUrl.searchParams.get("status") ?? "all").trim();
  const page = parsePositiveInt(request.nextUrl.searchParams.get("page"), 1);
  const limit = Math.min(
    parsePositiveInt(request.nextUrl.searchParams.get("limit"), DEFAULT_LIMIT),
    MAX_LIMIT,
  );

  if (statusFilter !== "all" && statusFilter !== "Present" && statusFilter !== "Absent") {
    return badRequest('status must be "all", "Present", or "Absent"');
  }

  const dayStart = startOfDay();

  const where: Prisma.UserWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          ...(q.toUpperCase() === "ADMIN" || q.toUpperCase() === "USER"
            ? [{ role: q.toUpperCase() as Role }]
            : []),
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      attendance: {
        where: { checkedInAt: { gte: dayStart } },
        orderBy: { checkedInAt: "desc" },
        take: 1,
        select: { status: true },
      },
    },
  });

  const mapped = users.map((user) => {
    const record = user.attendance[0];
    const present = record?.status === AttendanceStatus.CHECKED_IN;
    const status = present ? ("Present" as const) : ("Absent" as const);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      initials: initialsFromName(user.name),
      status,
    };
  });

  const filtered =
    statusFilter === "all" ? mapped : mapped.filter((u) => u.status === statusFilter);

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const usersPage = filtered.slice(start, start + limit);

  const [totalUsers, presentToday] = await Promise.all([
    prisma.user.count(),
    prisma.attendanceRecord.count({
      where: {
        checkedInAt: { gte: dayStart },
        status: AttendanceStatus.CHECKED_IN,
        checkedOutAt: null,
      },
    }),
  ]);

  return NextResponse.json({
    summary: {
      total: totalUsers,
      present: presentToday,
      absent: Math.max(0, totalUsers - presentToday),
    },
    pagination: {
      page: safePage,
      limit,
      total: totalFiltered,
      totalPages,
    },
    users: usersPage,
  });
}

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const role = body?.role === Role.ADMIN ? Role.ADMIN : Role.USER;

  if (!name || !email || !password) {
    return badRequest("name, email, and password are required");
  }

  if (password.length < 8) {
    return badRequest("password must be at least 8 characters");
  }

  try {
    // Omit request headers so the admin session is not replaced by a new signup session.
    await auth.api.signUpEmail({
      body: { name, email, password, rememberMe: false },
    });

    const created = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });

    if (!created) {
      return NextResponse.json({ error: "User created but could not be loaded" }, { status: 500 });
    }

    const user = await prisma.user.update({
      where: { id: created.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err, "Unable to create user");
  }
}
