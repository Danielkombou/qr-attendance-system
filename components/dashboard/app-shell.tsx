"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShellActions } from "@/components/dashboard/shell-actions";
import { Sidebar } from "@/components/dashboard/sidebar";
import {
  adminNavigation,
  userNavigation,
  type DashboardNavItem,
} from "@/components/dashboard/navigation";
import { useScrollHeaderVisible } from "@/hooks/use-scroll-header-visible";
import { cn } from "@/lib/utils";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerVisible = useScrollHeaderVisible();

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} />
      <div className="flex min-h-screen flex-1 flex-col">
        <header
          className={cn(
            "sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md transition-transform duration-300 ease-out lg:hidden",
            headerVisible ? "translate-y-0" : "-translate-y-full",
          )}
        >
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileOpen((value) => !value)}
                className="gap-2"
                aria-expanded={mobileOpen}
                aria-controls="mobile-dashboard-nav"
              >
                <Menu className="h-4 w-4" aria-hidden />
                Menu
              </Button>
              <ShellActions layout="toolbar" />
            </div>
            {mobileOpen ? (
              <nav id="mobile-dashboard-nav" className="mt-3 grid gap-2" aria-label="Main">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm leading-none text-foreground"
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            ) : null}
          </div>
        </header>
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
