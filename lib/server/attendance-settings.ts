import type { WorkHours } from "@/lib/format/attendance-timing";
import { DEFAULT_WORK_HOURS } from "@/lib/format/attendance-timing";
import { prisma } from "@/lib/prisma";

export async function getAttendanceSettings(): Promise<WorkHours> {
  try {
    const settings = await prisma.attendanceSettings.findUnique({
      where: { id: "default" },
      select: {
        startHour: true,
        startMinute: true,
        endHour: true,
        endMinute: true,
      },
    });

    if (!settings) return DEFAULT_WORK_HOURS;

    return {
      startHour: settings.startHour,
      startMinute: settings.startMinute,
      endHour: settings.endHour,
      endMinute: settings.endMinute,
    };
  } catch {
    return DEFAULT_WORK_HOURS;
  }
}

export async function upsertAttendanceSettings(hours: WorkHours) {
  return prisma.attendanceSettings.upsert({
    where: { id: "default" },
    update: hours,
    create: { id: "default", ...hours },
    select: {
      startHour: true,
      startMinute: true,
      endHour: true,
      endMinute: true,
      updatedAt: true,
    },
  });
}
