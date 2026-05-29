/** App-level user roles (matches prisma `Role` enum). Kept here so builds don't depend on generated Prisma types. */
export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export function isAdminRole(role: string | null | undefined): role is typeof Role.ADMIN {
  return role === Role.ADMIN;
}
