"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { QrCode } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ShellActions } from "@/components/dashboard/shell-actions";
import type { DashboardNavItem } from "@/components/dashboard/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  items: DashboardNavItem[];
};

function SidebarBrand() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  if (collapsed) {
    return (
      <Link
        href="/dashboard"
        className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
        aria-label="AttendX home"
      >
        <QrCode className="size-4" strokeWidth={2.2} aria-hidden />
      </Link>
    );
  }

  return <BrandLogo href="/dashboard" size="sm" className="px-1" />;
}

export function DashboardSidebar({ items }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/80 p-3">
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.label}
                      size="lg"
                      className={cn(
                        active &&
                          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground",
                      )}
                      render={<Link href={item.href} />}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/80 p-2">
        <ShellActions layout="sidebar" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
