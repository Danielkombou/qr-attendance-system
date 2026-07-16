import { cookies } from "next/headers";
import { AppShell } from "@/components/dashboard/app-shell";
import { Role } from "@/lib/roles";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const role = jar.get("attendx_role")?.value;
  const variant = role === Role.ADMIN ? "admin" : "user";

  return <AppShell variant={variant}>{children}</AppShell>;
}
