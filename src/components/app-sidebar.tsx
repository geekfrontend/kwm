"use client";

import * as React from "react";
import {
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconSettings,
  IconUsers,
  IconBuildingCommunity,
  IconChecklist
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/providers/auth-provider";
import Image from "next/image";
import { Icon } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    ...(user?.role === "ADMIN"
      ? [
          {
            title: "Users",
            url: "/users",
            icon: IconUsers,
          },
          {
            title: "Divisi",
            url: "/divisions",
            icon: IconBuildingCommunity,
          },
          {
            title: "Attendance",
            url: "/attendance",
            icon: IconChecklist,
          },
        ]
      : []),
  ];

  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar variant="inset" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                {/* <IconInnerShadowTop className="!size-5" /> */}
                <Image src="/img/LogoApk.png" alt="logo" width={32} height={32} />
                <span className="text-base font-semibold">PT. KWM</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
