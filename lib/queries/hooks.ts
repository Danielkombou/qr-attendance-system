import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";

export type TeamMemberRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  status: "Present" | "Absent";
  online: boolean;
  checkInTime: string | null;
  duration: string | null;
  location: string | null;
  checkInNote: string | null;
};

type MembersResponse = {
  summary: { total: number; present: number; absent: number };
  members: TeamMemberRow[];
};

type AttendanceStatusResponse = {
  checkedIn: boolean;
  record: {
    id: string;
    checkInTime: string;
    plannedTasks: string | null;
    location: string;
    checkInNote: string | null;
    siteName: string | null;
  } | null;
};

type ProfileResponse = {
  user: {
    name: string;
    email: string;
    role: string;
    initials: string;
    employeeId: string;
  };
  stats: {
    totalDays: number;
    avgHoursPerDay: string;
    onTimeRate: string;
    currentStreak: string;
  };
  recentAttendance: Array<{
    date: string;
    checkIn: string;
    checkOut: string;
    duration: string;
    status: string;
    checkoutNote: string | null;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    active: boolean;
  }>;
};

type SiteOption = { id: string; name: string; allowedRadiusM: number };

type WorkHoursResponse = {
  settings: {
    startTime: string;
    endTime: string;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
  };
};

export function useTeamMembers() {
  return useQuery({
    queryKey: queryKeys.team.members,
    queryFn: async () => {
      const { data } = await axios.get<MembersResponse>("/api/team/members");
      return data;
    },
  });
}

export function useAttendanceStatus() {
  return useQuery({
    queryKey: queryKeys.attendance.status,
    queryFn: async () => {
      const { data } = await axios.get<AttendanceStatusResponse>("/api/attendance/status");
      return data;
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: async () => {
      const { data } = await axios.get<ProfileResponse>("/api/profile");
      return data;
    },
  });
}

export function useSites() {
  return useQuery({
    queryKey: queryKeys.sites.list,
    queryFn: async () => {
      const { data } = await axios.get<{ sites: SiteOption[] }>("/api/sites");
      return data.sites ?? [];
    },
    staleTime: 5 * 60_000,
  });
}

export function useWorkHours() {
  return useQuery({
    queryKey: queryKeys.settings.workHours,
    queryFn: async () => {
      const { data } = await axios.get<WorkHoursResponse>("/api/admin/attendance-settings");
      return data.settings;
    },
    staleTime: 60_000,
  });
}

type CheckInPayload = {
  plannedTasks: string;
  siteId?: string;
  latitude: number;
  longitude: number;
};

type CheckOutPayload = {
  completedTasks: string;
  latitude: number;
  longitude: number;
};

export function useCheckInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CheckInPayload) => {
      const { data } = await axios.post("/api/attendance/check-in", payload);
      return data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.team.members }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.me }),
      ]);
    },
  });
}

export function useCheckOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CheckOutPayload) => {
      const { data } = await axios.post("/api/attendance/check-out", payload);
      return data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.team.members }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.me }),
      ]);
    },
  });
}

export function useUpdateWorkHoursMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { startTime: string; endTime: string }) => {
      const { data } = await axios.patch("/api/admin/attendance-settings", payload);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.settings.workHours });
    },
  });
}
