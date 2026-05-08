import { AppShell } from "@/components/dashboard/app-shell";
import { adminNavigation } from "@/components/dashboard/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AppShell items={adminNavigation}>{children}</AppShell>;
}
