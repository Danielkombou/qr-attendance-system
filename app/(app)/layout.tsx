import { AppShell } from "@/components/dashboard/app-shell";
import { userNavigation } from "@/components/dashboard/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell items={userNavigation}>{children}</AppShell>;
}
