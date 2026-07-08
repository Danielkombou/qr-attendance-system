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
    image: string | null;
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

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  initials: string;
  status: "Present" | "Absent";
};

type AdminUsersResponse = {
  summary: { total: number; present: number; absent: number };
  pagination: { page: number; limit: number; total: number; totalPages: number };
  users: AdminUserRow[];
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

export function useAdminUsers(params: {
  q: string;
  page: number;
  limit?: number;
  status?: "all" | "Present" | "Absent";
}) {
  const limit = params.limit ?? 10;
  const status = params.status ?? "all";
  return useQuery({
    queryKey: queryKeys.admin.users({ q: params.q, page: params.page, limit, status }),
    queryFn: async () => {
      const { data } = await axios.get<AdminUsersResponse>("/api/admin/users", {
        params: { q: params.q || undefined, page: params.page, limit, status },
      });
      return data;
    },
    placeholderData: (previous) => previous,
  });
}

export function useCreateAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      password: string;
      role?: "USER" | "ADMIN";
    }) => {
      const { data } = await axios.post<{ user: AdminUserRow }>("/api/admin/users", payload);
      return data.user;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.usersRoot });
    },
  });
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { userId: string; role: "USER" | "ADMIN" }) => {
      const { data } = await axios.patch(`/api/admin/users/${payload.userId}/role`, {
        role: payload.role,
      });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.usersRoot });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await axios.delete(`/api/admin/users/${userId}`);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.usersRoot });
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

export function useReports() {
  return useQuery({
    queryKey: queryKeys.reports.analytics,
    queryFn: async () => {
      const { data } = await axios.get<ReportsResponse>("/api/reports/analytics");
      return data;
    },
    staleTime: 60_000,
  });
}

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: string) => {
      const { data } = await axios.patch<{ user: ProfileResponse["user"] }>("/api/profile/avatar", {
        image,
      });
      return data.user;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile.me });
    },
  });
}

type ReportsResponse = {
  kpis: {
    avgAttendance: string;
    avgAttendanceTrend: string;
    avgHoursPerDay: string;
    avgHoursTrend: string;
    onTimeRate: string;
    onTimeTrend: string;
    lateArrivals: string;
    lateTrend: string;
  };
  weeklyBars: Array<{ label: string; present: number; late: number; absent: number }>;
  byRole: Array<{ name: string; count: number; color: string }>;
  monthlyTrend: Array<{ month: string; hours: number; onTime: number }>;
  topPerformers: Array<{ rank: number; name: string; role: string; rate: string; hours: string }>;
};
