export const queryKeys = {
  team: {
    members: ["team", "members"] as const,
  },
  admin: {
    users: (params: { q: string; page: number; limit: number; status: string }) =>
      ["admin", "users", params] as const,
    usersRoot: ["admin", "users"] as const,
  },
  attendance: {
    all: ["attendance"] as const,
    status: ["attendance", "status"] as const,
  },
  profile: {
    me: ["profile", "me"] as const,
  },
  settings: {
    workHours: ["settings", "work-hours"] as const,
  },
  sites: {
    list: ["sites", "list"] as const,
  },
  reports: {
    analytics: ["reports", "analytics"] as const,
  },
} as const;
