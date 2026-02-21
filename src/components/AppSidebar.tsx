"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  User,
  Bell,
  LogOut,
  MoreVertical,
  ChevronRight,
} from "react-feather";
import { logout } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

const profileSubItems = [
  { title: "Rolle & Standort", anchor: "rolle-standort" },
  { title: "Branche & Unternehmen", anchor: "branche-unternehmen" },
  { title: "Erweitert", anchor: "erweitert" },
];

function NavMain() {
  const pathname = usePathname();
  const isProfileActive = pathname === "/profile" || pathname.startsWith("/profile/");

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* Jobs */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Jobs"
              isActive={pathname === "/dashboard" || pathname.startsWith("/dashboard/")}
            >
              <Link href="/dashboard">
                <Briefcase />
                <span>Jobs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Profile with collapsible sub-items */}
          <Collapsible asChild defaultOpen={isProfileActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Profile" isActive={isProfileActive}>
                  <User />
                  <span>Profile</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {profileSubItems.map((item) => (
                    <SidebarMenuSubItem key={item.anchor}>
                      <SidebarMenuSubButton asChild>
                        <a
                          href={`/profile#${item.anchor}`}
                          onClick={(e) => {
                            if (pathname === "/profile") {
                              e.preventDefault();
                              document
                                .getElementById(item.anchor)
                                ?.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {/* Settings */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              isActive={pathname === "/settings" || pathname.startsWith("/settings/")}
            >
              <Link href="/settings">
                <Bell />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function NavUser() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Account</span>
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <form action={logout}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <span className="font-semibold tracking-tight text-foreground text-lg">
                  Jobfishing
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
