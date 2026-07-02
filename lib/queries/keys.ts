export const queryKeys = {
  team: {
    members: ["team", "members"] as const,
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
} as const;
