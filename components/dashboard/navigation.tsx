"use client";

import {
  BarChart3,
  Gauge,
  QrCode,
  Settings,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const userNavigation: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Check In", href: "/check-in", icon: QrCode },
  { label: "My Profile", href: "/profile", icon: UserRound },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const adminNavigation: DashboardNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Gauge },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];
