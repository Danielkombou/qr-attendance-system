import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { formatWorkHoursTime } from "@/lib/format/attendance-timing";
import { getAttendanceSettings, upsertAttendanceSettings } from "@/lib/server/attendance-settings";
import { badRequest, requireAdminRole, requireContext } from "@/lib/server/api-utils";

export const runtime = "nodejs";

function parseTime(value: unknown): { hour: number; minute: number } | null {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour > 23 || minute > 59) {
    return null;
  }
  return { hour, minute };
}

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const hours = await getAttendanceSettings();
  return NextResponse.json({
    settings: {
      ...hours,
      startTime: formatWorkHoursTime(hours.startHour, hours.startMinute),
      endTime: formatWorkHoursTime(hours.endHour, hours.endMinute),
    },
  });
}

export async function PATCH(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminError = requireAdminRole(context.role);
  if (adminError) return adminError;

  const body = await request.json().catch(() => null);
  const start = parseTime(body?.startTime);
  const end = parseTime(body?.endTime);

  if (!start || !end) {
    return badRequest("startTime and endTime are required in HH:MM format");
  }

  const startMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;
  if (endMinutes <= startMinutes) {
    return badRequest("End time must be after start time");
  }

  const settings = await upsertAttendanceSettings({
    startHour: start.hour,
    startMinute: start.minute,
    endHour: end.hour,
    endMinute: end.minute,
  });

  return NextResponse.json({
    settings: {
      startHour: settings.startHour,
      startMinute: settings.startMinute,
      endHour: settings.endHour,
      endMinute: settings.endMinute,
      startTime: formatWorkHoursTime(settings.startHour, settings.startMinute),
      endTime: formatWorkHoursTime(settings.endHour, settings.endMinute),
      updatedAt: settings.updatedAt,
    },
  });
}
