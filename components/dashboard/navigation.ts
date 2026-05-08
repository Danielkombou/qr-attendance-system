import {
  BarChart3,
  Gauge,
  QrCode,
  Settings,
  Shield,
  Users,
  UserRound,
} from "lucide-react";
import type { ComponentType } from "react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export const userNavigation: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Check In", href: "/check-in", icon: QrCode },
  { label: "My Profile", href: "/profile", icon: UserRound },
  { label: "Team", href: "/team", icon: Users },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const adminNavigation: DashboardNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Gauge },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Admin", href: "/admin/dashboard", icon: Shield },
];
