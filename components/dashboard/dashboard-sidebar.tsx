"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { QrCode } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { UserAccountMenu } from "@/components/dashboard/user-account-menu";
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
  homeHref?: string;
};

function SidebarBrand({ homeHref = "/dashboard" }: { homeHref?: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  if (collapsed) {
    return (
      <Link
        href={homeHref}
        className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"
        aria-label="AttendX home"
      >
        <QrCode className="size-4" strokeWidth={2.2} aria-hidden />
      </Link>
    );
  }

  return <BrandLogo href={homeHref} size="sm" className="px-1" />;
}

export function DashboardSidebar({ items, homeHref = "/dashboard" }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  function closeMobileSidebar() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/80 p-4 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
        <SidebarBrand homeHref={homeHref} />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5 group-data-[collapsible=icon]:items-center">
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <SidebarMenuItem
                    key={item.href}
                    className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.label}
                      className={cn(
                        "h-11 rounded-xl px-3 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
                        active &&
                          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground",
                      )}
                      render={<Link href={item.href} />}
                      onClick={closeMobileSidebar}
                    >
                      <Icon className="size-[1.125rem] shrink-0" aria-hidden />
                      <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/80 p-3 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
        <UserAccountMenu placement="sidebar" className="group-data-[collapsible=icon]:w-auto" />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
