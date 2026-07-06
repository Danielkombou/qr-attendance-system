"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { UserAccountMenu } from "@/components/dashboard/user-account-menu";
import {
  adminNavigation,
  userNavigation,
  type DashboardNavItem,
} from "@/components/dashboard/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type AppShellVariant = "user" | "admin";

const navigationByVariant: Record<AppShellVariant, DashboardNavItem[]> = {
  user: userNavigation,
  admin: adminNavigation,
};

type AppShellProps = {
  variant: AppShellVariant;
  children: React.ReactNode;
};

export function AppShell({ variant, children }: AppShellProps) {
  const items = navigationByVariant[variant];

  return (
    <SidebarProvider defaultOpen>
      <DashboardSidebar items={items} />
      <SidebarInset className="min-h-svh bg-transparent">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/80 bg-card/85 px-3 backdrop-blur-md supports-backdrop-filter:bg-card/70 sm:gap-3 sm:px-6">
          <SidebarTrigger className="-ml-1 shrink-0 text-foreground" />
          <Separator orientation="vertical" className="hidden h-4 md:block" />
          <div className="flex min-w-0 flex-1 items-center">
            <p className="truncate text-sm font-medium text-muted-foreground md:hidden">AttendX</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ThemeToggle />
            <UserAccountMenu placement="header" className="md:hidden" />
          </div>
        </header>
        <div id="main-content" className="flex-1 px-3 py-5 sm:px-6 sm:py-6 lg:px-8" tabIndex={-1}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
